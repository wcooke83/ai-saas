# AI Chatbot Performance Audit

**Date:** 2026-03-21
**Auditor:** RAG Performance Tuner
**Scope:** Full request pipeline from widget click to stream completion

---

## Executive Summary

**Baseline total request time: ~16,700ms. Target: under 4,000ms.**

The system suffers from a critical embedding model mismatch bug that causes 100% of similarity searches to return 0.00 confidence, triggering expensive live URL fetches on every request. This single bug accounts for ~7,500ms (45%) of total latency.

Several fixes have already been implemented in the current working tree (marked below). After applying all pending changes, the remaining optimization opportunities could bring total time down to ~2,500-3,500ms.

### Current Status of Fixes

| # | Finding | Status | Implementation |
|---|---------|--------|----------------|
| 1 | Embedding model mismatch (P0) | **FIXED** | `rag.ts` reads `embedding_provider/model` from `knowledge_sources`, queries with matching model |
| 2 | Double `resolveEmbeddingConfig()` (P2) | **FIXED** | Resolved once at top of `getRAGContext()`, passed through |
| 3 | Priority chunks unfiltered (P1) | **FIXED** | New `match_priority_knowledge_chunks` RPC with similarity threshold |
| 4 | Live fetch no caching (P1) | **FIXED** | 3-layer TTL cache: links (10min), AI pick (5min), content (30min) |
| 5 | Live fetch timeout too high (P2) | **FIXED** | Split to `LIVE_FETCH_TIMEOUT=10s` vs `DEFAULT_FETCH_TIMEOUT=30s` |
| 6 | Missing composite index (P4) | **FIXED** | Migration adds `(chatbot_id, source_id)` B-tree + tuned HNSW |
| 7 | `getOrCreateConversation` 2 round trips (P3) | **FIXED** | New `get_or_create_conversation` PL/pgSQL RPC |
| 8 | Language detection overhead (P4) | **OK** | Confirmed lightweight regex, no fix needed |
| 9 | Chat route `SELECT *` (P3) | **FIXED** | Explicit column list in chat route |
| 10 | Widget config inline presence (P4) | **FIXED** | Returns `'check'` flag, widget polls `/agent-heartbeat` |
| 11 | Error handler extra DB query (P4) | **FIXED** | `chatbotUserId` captured in closure before try block |
| 12 | No embedding cache (P2) | **FIXED** | LRU in-memory cache (200 entries) in `embeddings.ts` |
| 13 | Messages `SELECT *` (P3) | **FIXED** | `getMessages()` now uses configurable column list |
| 14 | `resolveEmbeddingConfig()` uncached DB calls (P2) | **FIXED** | 60s TTL module-level cache wrapping the resolver |
| 15 | Serial RAG pre-work (P2) | **FIXED** | `startRAGPrework()` overlaps config+source queries with conversation setup |
| 17 | No greeting short-circuit (P3) | **FIXED** | Regex pre-filter skips RAG for greetings/small talk |
| 18 | Parallel group bottleneck (Informational) | **N/A** | Analysis only — addressed by other fixes |
| 19 | Hardcoded confidence threshold (P3) | **FIXED** | Per-chatbot `live_fetch_threshold` column (default 0.80), configurable in settings UI |
| 20 | Widget init waterfall (P3) | **FIXED** | Agent presence check inlined in config endpoint, eliminates extra round trip |

---

## Performance Waterfall (baseline)

```
Load Chatbot         ████  265ms
Get Conversation     ████████  489ms
  Get History        ████████  484ms
  Save Message       █████  269ms
  Check Handoff      ██████  369ms
Process Attachments  ▏  8ms
RAG: Embedding       ██████████████████████████  1,401ms
RAG: Similarity      ████████  468ms
RAG: Live Fetch      ████████████████████████████████████████████████████████████████████████████  7,503ms
RAG: Formatting      ▏  8ms
Lead Lookup          ██████  376ms
Memory Fetch         ████████  482ms
Build Prompts        ▏  1ms
First Token (TTFT)   ██████████████████████████████████████████████████  2,945ms
Stream Complete      ████████████████████████████████████████████████████████████████████████  4,175ms
─────────────────────────────────────────────────────────────
TOTAL                                                           16,686ms
```

**Key numbers:** RAG = 9,366ms (56% of total). Live Fetch alone = 7,503ms (45%). TTFT = 12,170ms.

---

## FINDING 1: CRITICAL BUG -- Embedding Model Mismatch [FIXED]

**Severity: P0 | Estimated savings: ~7,500ms per request**

### Root Cause

Knowledge chunks (117 total) were embedded with **OpenAI `text-embedding-ada-002`** (1536d). The admin later changed `app_settings.embedding_model_id` to a **Gemini Embedding** model. `resolveEmbeddingConfig()` resolved to Gemini for query embeddings, but compared against OpenAI-embedded chunk vectors -- incompatible vector spaces despite same dimensionality.

### Evidence

- 18 requests in last 30 days: **ALL show `rag_confidence = 0.000`**
- ALL 18 triggered live fetch
- Same-model chunk-to-chunk similarity shows scores 0.88-0.90

### The Cascade

1. `match_knowledge_chunks` returns 0 similar chunks (threshold 0.7, all scores ~0.0)
2. `bestSimilarity = 0` in `rag.ts`
3. `0 < LOW_CONFIDENCE_THRESHOLD (0.9)` triggers live fetch
4. Live fetch adds ~7,500ms
5. 30 priority chunks returned unfiltered (see Finding 3)

### Fix Applied

**Migration `20260321200000_add_embedding_model_tracking.sql`:** Added `embedding_provider` and `embedding_model` columns to `knowledge_sources`. Backfilled existing sources with `openai/text-embedding-ada-002`.

**`rag.ts` changes:** Now reads the recorded embedding provider/model from `knowledge_sources` and generates query embeddings using the **same model** that chunks were embedded with, regardless of what `app_settings` says. Falls back gracefully if the recorded provider's API key is missing.

### Remaining Risk

- If a user changes their embedding model in admin settings and does NOT re-process knowledge sources, the safeguard works -- but ideally the UI should warn or auto-trigger re-embedding.
- The mismatch detection logic at `rag.ts:105-110` only warns in logs. Consider surfacing this in the dashboard.

---

## FINDING 2: `resolveEmbeddingConfig()` Called Twice [FIXED]

**Severity: P2 | Estimated savings: ~100-200ms**

### Root Cause

Previously, `getRAGContext()` called `isEmbeddingsAvailable()` (which calls `resolveEmbeddingConfig()`) and then `generateQueryEmbedding()` (which calls `resolveEmbeddingConfig()` again). Each call does:
- `getEmbeddingModel()` -> `getAppSettings()` (cached 60s) -> `getModelById()` (NO cache, DB query)
- Fallback: `getActiveModelAndProvider()` (another DB query)

### Fix Applied

`rag.ts` now calls `resolveEmbeddingConfig()` once at the top of `getRAGContext()` and passes the result to `generateQueryEmbedding()` via the `overrideConfig` parameter.

---

## FINDING 3: Priority Source Chunk Flooding [FIXED]

**Severity: P1 | Estimated savings: ~500ms latency + significant token reduction**

### Root Cause

When a knowledge source had `is_priority = true`, ALL its chunks (up to 30) were fetched via a raw SELECT with no similarity filter:

```sql
SELECT id, content, metadata FROM knowledge_chunks
WHERE chatbot_id = ? AND source_id = ANY(?)
LIMIT 30
```

With 115 chunks in the priority source, 30 arbitrary chunks were included in every response -- many were navigation menus, link lists, and other noise (~12,500 tokens of waste per request).

### Fix Applied

**Migration `20260321200000_add_match_priority_knowledge_chunks_rpc.sql`:** New `match_priority_knowledge_chunks` RPC that applies the same cosine similarity filtering as `match_knowledge_chunks` but scoped to specific source IDs.

**`rag.ts` changes:** Priority chunks now go through similarity search. `bestSimilarity` is now computed from ALL chunks (similarity + priority), not just similarity chunks. This prevents the situation where priority chunks had fake `similarity: 1.0` scores.

---

## FINDING 4: Live Fetch Has No Caching [FIXED]

**Severity: P1 | Estimated savings: ~7,000ms on repeat queries**

### Root Cause

`fetchPinnedUrlContent()` performed 3 expensive sequential operations with zero caching:

1. **HTML fetch + link extraction** (~1-2s): Fetch pinned URL, parse with cheerio, extract all `<a>` links
2. **AI link picker** (~2-3s): Full AI roundtrip via `generate()` to pick which link(s) answer the query
3. **Jina Reader fetch** (~2-3s per URL, max 2): Fetch picked URLs through `r.jina.ai/`

None were cached. The same pinned URL's link list was re-fetched on every request. The same page content was re-fetched via Jina on every request.

### Fix Applied

Three-layer in-memory TTL cache:

| Cache | TTL | Key | Rationale |
|-------|-----|-----|-----------|
| Links | 10 min | pinned URL | Site navigation changes rarely |
| AI pick | 5 min | `hash(query):hash(urls)` | Same question picks same links |
| Content | 30 min | fetched URL | Page content is stable for minutes |

Cache implementation uses a custom `TtlCache<T>` class with lazy cleanup when size > 500. Configuration is runtime-adjustable via `configureLiveFetchCache()`.

### Remaining Optimization Opportunities

- **Cache warming:** When a chatbot is loaded, pre-warm the links cache for its pinned URLs in the background.
- **Content hash:** Add content hashing to detect when cached content is stale even within TTL.
- **Persistent cache:** The in-memory caches are lost on serverless cold starts. For high-traffic chatbots, consider Redis or Supabase-backed caching.

---

## FINDING 5: Live Fetch URL Timeout Too High [FIXED]

**Severity: P2 | Estimated savings: prevents 30s tail latency**

### Root Cause

Single `FETCH_TIMEOUT = 30000` used for both knowledge ingestion (async, can be slow) and live chat queries (user is waiting).

### Fix Applied

Split into two constants in `src/lib/chatbots/knowledge/extractors/url.ts`:
- `DEFAULT_FETCH_TIMEOUT = 30000` (30s) for knowledge ingestion
- `LIVE_FETCH_TIMEOUT = 10000` (10s) for real-time chat queries

`extractURL()` now accepts a `timeoutMs` parameter. Live fetch callers pass `LIVE_FETCH_TIMEOUT`.

---

## FINDING 6: Missing Composite Database Index [FIXED]

**Severity: P4 | Estimated savings: ~50-200ms at scale**

### Root Cause

Previous indexes:
- `idx_knowledge_chunks_embedding` -- HNSW on `(embedding vector_cosine_ops)` with DEFAULT params (m=16, ef_construction=64)
- `idx_knowledge_chunks_chatbot` -- B-tree on `(chatbot_id)` only

The `match_knowledge_chunks` and `match_priority_knowledge_chunks` functions filter by `chatbot_id` and `source_id`, but only `chatbot_id` was indexed. At 117 chunks this is negligible, but will matter at scale.

### Fix Applied

**Migration `20260321500000_improve_knowledge_chunks_hnsw_index.sql`:**
1. Recreated HNSW index with tuned params: `ef_construction=128` (from 64) for better recall
2. Replaced single-column `(chatbot_id)` B-tree with composite `(chatbot_id, source_id)` B-tree
3. `m=16` kept (appropriate for datasets under ~1M vectors)

### Note on HNSW vs IVFFlat

At 117 vectors, any index type works. HNSW is the right choice: better recall, no training step needed, and the memory overhead is trivial at this scale. If the dataset grows past ~1M vectors, revisit IVFFlat with `lists = sqrt(n)`.

---

## FINDING 7: `getOrCreateConversation` Two Round Trips [FIXED]

**Severity: P3 | Estimated savings: ~200ms**

### Root Cause

Previously did a SELECT to find existing conversation, then an INSERT if not found -- 2 sequential DB round trips.

### Fix Applied

**Migration `20260321400000_add_get_or_create_conversation_rpc.sql`:** PL/pgSQL function that does SELECT + conditional INSERT in a single database call. Also added a **partial unique index** on `(chatbot_id, session_id) WHERE status = 'active'` via migration `20260321300000` to prevent duplicate active conversations.

---

## FINDING 8: Language Detection Overhead [NO FIX NEEDED]

**Severity: P4**

`detectLanguageSwitch()` in `src/lib/chatbots/translations.ts` is pure regex matching against a static pattern list. Negligible cost (<1ms).

---

## FINDING 9: Chat Route `SELECT *` on Chatbots [FIXED]

**Severity: P3 | Estimated savings: ~50ms**

### Root Cause

`chatbots` table includes large JSONB columns (`widget_config`, `proactive_messages_config`, `post_chat_survey_config`, etc.) never used by the chat API endpoint.

### Fix Applied

Chat route now uses explicit column list:
```typescript
.select('id, user_id, is_published, status, monthly_message_limit, messages_this_month, language, file_upload_config, memory_enabled, memory_days, model, temperature, max_tokens, system_prompt, enable_prompt_protection')
```

---

## FINDING 10: Widget Config Inline Agent Presence [FIXED]

**Severity: P4 | Architectural improvement**

### Root Cause

The `/api/widget/[chatbotId]/config` endpoint was making a blocking `agent_presence` query inline, making the response both slow and immediately stale (presence changes every heartbeat).

### Fix Applied

Config endpoint now returns `agentsAvailable: 'check'` for agent-console chatbots, signaling the widget to poll `/api/widget/[chatbotId]/agent-heartbeat` separately. Telegram-backed handoff still returns `true` immediately (Telegram is always-on). The heartbeat endpoint has a short `Cache-Control: public, max-age=15` for CDN caching.

Widget (`ChatWidget.tsx`) now polls agent presence every 30s only when `agentsAvailable === 'check'`.

---

## FINDING 11: Error Handler Extra DB Query [FIXED]

**Severity: P4 | Estimated savings: ~200ms on error paths**

### Root Cause

The catch block re-queried the chatbot via `createAdminClient()` to get `user_id` for error logging.

### Fix Applied

`chatbotUserId` is captured in a closure variable before the try block. `chatbotId` is also extracted before the try block. Error handler uses the captured values directly.

---

## FINDING 12: No Embedding Cache [FIXED]

**Severity: P2 | Estimated savings: ~1,400ms on repeat queries**

### Root Cause

Every query generated a fresh embedding via API call (~1,400ms). Common queries ("what are your hours?", "pricing", "return policy") would benefit from caching.

### Fix Applied

LRU in-memory cache in `src/lib/chatbots/knowledge/embeddings.ts`:
- Max 200 entries (configurable via `EMBEDDING_CACHE_MAX_SIZE` env var)
- Key: `provider:model:normalized_query_text`
- No TTL (embeddings are deterministic -- same text + model = same vector)
- Memory footprint: ~1.2MB at capacity (200 x 1536 floats x 4 bytes)

---

## FINDING 13: Messages `SELECT *` [FIXED]

**Severity: P3 | Estimated savings: ~100ms**

### Root Cause

`getMessages()` used `SELECT *` including `context_chunks`, `metadata`, and `attachments` (all JSONB) never used by the chat route's history display.

### Fix Applied

`getMessages()` now accepts a `columns` parameter defaulting to `'id, role, content, created_at'`. Chat route uses the default. Callers needing full data can pass `'*'`.

---

## NEW FINDINGS (not in previous audit)

### FINDING 14: `resolveEmbeddingConfig()` Still Makes Uncached DB Calls

**Severity: P2 | Estimated savings: ~50-100ms per request**

While Finding 2's fix eliminated the double call, `resolveEmbeddingConfig()` itself still does:
1. `getEmbeddingModel()` -> `getAppSettings()` (cached 60s) -> `getModelById()` (**no cache**, hits DB)
2. If step 1 fails: `getActiveModelAndProvider()` -> `getActiveModel()` (**no cache**, hits DB)

The `getModelById()` function in `src/lib/settings.ts` does a fresh DB query every time. At 60s cache on `getAppSettings()`, this is called once per cold start then once per minute. But combined with the `knowledge_sources` query in `rag.ts:67-73`, there are now 2 DB round trips before embedding even starts.

**Recommendation:** Cache `resolveEmbeddingConfig()` result at module level with a 60s TTL, matching `getAppSettings()` cache behavior. This would eliminate the `getModelById()` call on hot paths.

### FINDING 15: Serial RAG Pre-work Before Parallel Group

**Severity: P2 | Estimated savings: ~200-400ms**

In the chat route (`route.ts`), the current flow is:
1. Load chatbot (sequential) -- 265ms
2. Auth/validation (sequential)
3. Get or create conversation (sequential) -- 489ms
4. **Then** launch the parallel group (RAG + history + save + handoff + lead + memory)

Steps 1 and 3 are strictly sequential because step 3 needs `chatbotId` and step 4 needs `conversation.id`. However, within `getRAGContext()`, the flow is:

```
resolveEmbeddingConfig()     -- ~50-100ms (DB call)
  |
  v
Query knowledge_sources      -- ~50ms (DB call)
Query priority_sources       -- ~50ms (DB call, parallel with above)
  |
  v
generateQueryEmbedding()     -- ~1,400ms (API call)
  |
  v
match_knowledge_chunks       -- ~468ms (DB call)
match_priority_knowledge_chunks -- parallel with above
  |
  v
Live fetch (if triggered)    -- ~7,500ms
```

The `resolveEmbeddingConfig()` and `knowledge_sources` queries could run in parallel with the conversation + message operations if restructured.

**Recommendation:** Extract the "pre-embedding" work from `getRAGContext()` and start it as soon as `chatbotId` is available, before `getOrCreateConversation()` completes. This overlaps ~200ms of DB queries with the conversation lookup.

### FINDING 16: Embedding Generation Latency (1,400ms)

**Severity: P3 | Estimated savings: ~200-700ms**

The current model `text-embedding-ada-002` takes ~1,400ms per query embedding. OpenAI's newer `text-embedding-3-small` model is:
- **Faster:** Typically 200-500ms for single query embeddings
- **Cheaper:** $0.02/1M tokens vs $0.10/1M tokens (5x cheaper)
- **Comparable quality:** Similar or better on most retrieval benchmarks
- **Dimensionality reduction:** Can be configured for 256, 512, or 1024 dimensions (vs fixed 1536)

**Recommendation:** When re-embedding chunks (which must happen to fix the mismatch), switch to `text-embedding-3-small` with 1536 dimensions (for compatibility) or 512 dimensions (for 3x faster similarity search with minimal quality loss at 117 chunks).

**CAUTION:** Changing embedding model requires re-embedding ALL chunks. This is a one-time migration, not a quick config change.

### FINDING 17: No Short-Circuit for Low-Value Messages

**Severity: P3 | Estimated savings: ~1,800ms for greetings/small talk**

The RAG pipeline runs the full embedding + similarity search + (possibly live fetch) cycle for every message, including greetings like "hi", "hello", "thanks", "bye". These never match knowledge chunks and waste an embedding API call.

The short message enhancement at `route.ts:431-453` already handles short messages differently by prepending the last assistant message. But it still runs the full RAG pipeline.

**Recommendation:** Add a pre-filter that detects greeting/farewell patterns and skips RAG entirely, returning an empty context. The system prompt is sufficient for the LLM to handle "hi" and "thanks" naturally. Threshold: messages under 5 words that match a greeting/farewell pattern.

### FINDING 18: Parallel Group Bottleneck Analysis

**Severity: Informational**

The main parallel group in `route.ts:558-580` runs 7 operations concurrently:

| Operation | Typical Duration | Depends On |
|-----------|-----------------|------------|
| `getMessages()` | ~484ms | `conversation.id` |
| `createMessage()` | ~268ms | `conversation.id` |
| `getActiveHandoff()` | ~369ms | `conversation.id` |
| `getLeadBySession()` | ~376ms | `chatbotId`, `sessionId` |
| `getUserMemory()` | ~482ms | `visitor_id`, `chatbotId` |
| Attachments | ~8ms | input data only |
| **RAG** | **~9,366ms** (or ~1,869ms without live fetch) | `chatbot`, `message` |

RAG dominates by a large margin. Even with all other operations at zero, RAG alone determines the parallel group's wall time. The fix for Finding 1 (embedding mismatch) eliminates live fetch, bringing RAG to ~1,869ms. At that point, the ~484ms memory/history operations would fully overlap with RAG.

**Post-fix parallel group wall time:** ~1,869ms (RAG is still the bottleneck, but now only ~2x longer than the longest DB operation instead of ~20x).

### FINDING 19: `LOW_CONFIDENCE_THRESHOLD` is Hardcoded at 0.9

**Severity: P3 | Estimated savings: variable (avoids unnecessary live fetches)**

```typescript
const LOW_CONFIDENCE_THRESHOLD = 0.9;  // rag.ts line 12
```

This is the threshold below which live fetch is triggered. At 0.9, even reasonably good matches (e.g., 0.85 similarity) trigger live fetch. This is fine as a defensive measure, but should be tunable per chatbot.

With the embedding mismatch fixed, typical good matches will score 0.88-0.95. A threshold of 0.9 means about half of good matches will still trigger live fetch unnecessarily.

**Recommendation:**
- Make this configurable per chatbot (add `live_fetch_threshold` column to `chatbots` table)
- Default to 0.80 instead of 0.90 -- only fetch live when chunks are genuinely unhelpful
- Log similarity scores to a histogram to enable data-driven threshold tuning

### FINDING 20: Widget Initialization Waterfall

**Severity: P3 | Estimated savings: ~300-500ms perceived**

The ChatWidget performs sequential initialization:
1. Fetch `/api/widget/[chatbotId]/config` (widget config, cached 60s)
2. If `agentsAvailable === 'check'`, fetch `/api/widget/[chatbotId]/agent-heartbeat`
3. If session exists, load conversation history

Steps 1 and 2 are sequential. The config response tells the widget whether to poll for agent presence. This adds an extra round trip before the widget is interactive.

**Recommendation:** Include the `agentsAvailable` boolean in the initial config response using a lightweight check (count query with 15s cache), and let the widget poll for updates afterward. This eliminates one round trip on first load.

---

## Projected Performance After All Fixes

### Scenario 1: High-confidence match (no live fetch)

```
Load Chatbot               ██  150ms  (SELECT with specific columns)
Get/Create Conversation    ██  200ms  (single RPC call)
  ┌─ parallel group (wall time = RAG) ─────────────────┐
  │ Get History            ██  200ms                    │
  │ Save Message           █  150ms                     │
  │ Check Handoff          ██  200ms                    │
  │ Lead Lookup            ██  200ms                    │
  │ Memory Fetch           ██  250ms                    │
  │ RAG: Embedding         ███████  700ms (cache miss)  │  ← or ~0ms cache hit
  │   Similarity Search    ███  300ms                   │
  │   Formatting           ▏  5ms                       │
  └─────────────────────── total: ~1,005ms ────────────┘
Build Prompts              ▏  1ms
First Token (TTFT)         ████████████  1,500ms
Stream Complete            ████████████████  2,000ms
────────────────────────────────────────────────
TOTAL                                    ~3,356ms
TTFT                                     ~2,856ms
```

### Scenario 2: Repeat query (embedding cache hit)

```
Load Chatbot               ██  150ms
Get/Create Conversation    ██  200ms
  ┌─ parallel group ───────────────────────────────────┐
  │ Get History            ██  200ms                    │
  │ Save Message           █  150ms                     │
  │ Check Handoff          ██  200ms                    │
  │ Lead Lookup            ██  200ms                    │
  │ Memory Fetch           ██  250ms                    │
  │ RAG: Embedding         ▏  1ms (cache hit!)          │
  │   Similarity Search    ███  300ms                   │
  │   Formatting           ▏  5ms                       │
  └─────────────────────── total: ~306ms ──────────────┘
Build Prompts              ▏  1ms
First Token (TTFT)         ████████████  1,500ms
Stream Complete            ████████████████  2,000ms
────────────────────────────────────────────────
TOTAL                                    ~2,657ms
TTFT                                     ~2,157ms
```

### Scenario 3: Low-confidence with live fetch (cached)

```
Same as Scenario 1 but RAG includes:
  RAG: Embedding           ███████  700ms
  RAG: Similarity          ███  300ms
  RAG: Live Fetch          ██████████  ~1,500ms  (cached links + content, only AI pick is ~1s)
  Total RAG:               ~2,500ms

TOTAL                                    ~4,851ms
TTFT                                     ~4,351ms
```

---

## Optimization Priority Matrix (Remaining Work)

All findings marked [FIXED] above are implemented in the working tree but **not yet committed/deployed**. The pending migrations need to be applied.

| Priority | Finding | Status | Estimated Savings | Effort |
|----------|---------|--------|-------------------|--------|
| **P0** | #1: Embedding mismatch | FIXED (deploy pending) | ~7,500ms | -- |
| **P1** | #4: Live fetch caching | FIXED (deploy pending) | ~7,000ms repeat | -- |
| **P1** | #3: Priority chunk flooding | FIXED (deploy pending) | ~500ms + tokens | -- |
| **P2** | #12: Embedding cache | FIXED (deploy pending) | ~1,400ms repeat | -- |
| **P2** | #2: Double resolveConfig | FIXED (deploy pending) | ~100-200ms | -- |
| **P2** | #5: Live fetch timeout | FIXED (deploy pending) | Tail latency | -- |
| **P2** | #14: resolveConfig still makes DB calls | NOT FIXED | ~50-100ms | 30min |
| **P2** | #15: Serial RAG pre-work | NOT FIXED | ~200-400ms | 1hr |
| **P3** | #16: Upgrade to text-embedding-3-small | NOT FIXED | ~200-700ms | 2hr (requires re-embed) |
| **P3** | #17: Short-circuit greetings | NOT FIXED | ~1,800ms for greetings | 30min |
| **P3** | #19: Configurable confidence threshold | NOT FIXED | Variable | 1hr |
| **P3** | #7: getOrCreateConversation RPC | FIXED (deploy pending) | ~200ms | -- |
| **P3** | #9: Chat route SELECT columns | FIXED (deploy pending) | ~50ms | -- |
| **P3** | #13: Messages SELECT columns | FIXED (deploy pending) | ~100ms | -- |
| **P3** | #20: Widget init waterfall | NOT FIXED | ~300-500ms perceived | 30min |
| **P4** | #6: Composite index | FIXED (deploy pending) | Future-proofing | -- |
| **P4** | #10: Widget config presence | FIXED (deploy pending) | Architectural | -- |
| **P4** | #11: Error handler DB query | FIXED (deploy pending) | ~200ms error path | -- |

---

## Deployment Checklist

The following migrations need to be applied (in order):

1. `20260321200000_add_embedding_model_tracking.sql` -- Adds `embedding_provider/model` to `knowledge_sources`
2. `20260321200000_add_match_priority_knowledge_chunks_rpc.sql` -- New similarity-filtered priority RPC
3. `20260321300000_dedup_active_conversations_and_add_unique_index.sql` -- Dedup + unique constraint
4. `20260321400000_add_get_or_create_conversation_rpc.sql` -- Atomic get-or-create RPC
5. `20260321500000_improve_knowledge_chunks_hnsw_index.sql` -- Tuned HNSW + composite B-tree

After migration, **re-process all knowledge sources** to ensure `embedding_provider/model` columns are populated correctly. The backfill in migration #1 handles existing completed sources.

---

## Appendix A: Current System Configuration

| Parameter | Value | Location |
|-----------|-------|----------|
| Embedding model (configured) | Gemini Embedding 001 | `app_settings.embedding_model_id` |
| Embedding model (actual chunks) | OpenAI text-embedding-ada-002 | `knowledge_sources.embedding_model` |
| Embedding dimensions | 1536 | Hardcoded in `embeddings.ts` |
| Chunk size | 500 tokens | `processor.ts:119` |
| Chunk overlap | 50 tokens (10%) | `processor.ts:120` |
| Similarity threshold (RPC) | 0.7 | `rag.ts:34` default param |
| Low confidence threshold | 0.9 | `rag.ts:12` hardcoded |
| Max chunks returned | 5 | `rag.ts:33` default param |
| Live fetch timeout | 10s (was 30s) | `extractors/url.ts:11` |
| Embedding cache size | 200 entries | `embeddings.ts:19` |
| Links cache TTL | 10 min | `live-fetch.ts:33` |
| AI pick cache TTL | 5 min | `live-fetch.ts:35` |
| Content cache TTL | 30 min | `live-fetch.ts:34` |
| HNSW params | m=16, ef_construction=128 | Migration `20260321500000` |
| Knowledge chunks | 117 | 1 chatbot |

## Appendix B: Database Indexes (Post-Migration)

| Index | Type | Columns | Purpose |
|-------|------|---------|---------|
| `idx_knowledge_chunks_embedding` | HNSW (cosine) | `embedding` | Vector similarity search |
| `idx_knowledge_chunks_chatbot_source` | B-tree | `(chatbot_id, source_id)` | Filter chunks by chatbot and source |
| `idx_conversations_active_unique` | B-tree (unique, partial) | `(chatbot_id, session_id) WHERE status='active'` | Prevent duplicate active conversations |
| `idx_chat_perf_chatbot_created` | B-tree | `(chatbot_id, created_at DESC)` | Performance log queries |
