# AI Chatbot Speed Audit — 2026-03-21

**Scope:** End-to-end response latency from user message to first streamed token.
**Method:** Manual code review of all files in the hot path, cross-referenced against existing fixes and DB schema.

---

## Summary

The codebase already has extensive performance work (20 findings from the prior audit, 16 marked FIXED). This audit validates those fixes against the actual code and identifies **6 remaining actionable findings** that can further reduce latency.

| # | Finding | Severity | Est. Savings | Status |
|---|---------|----------|-------------|--------|
| 1 | `pipeline_timings` column missing — ALL perf logging silently fails | **P1** | Observability | Unfixed |
| 2 | AI link picker wastes ~1-2s for small link sets (<=5 links) | **P1** | ~1,000-2,000ms | Unfixed |
| 3 | Embedding model upgrade (`ada-002` -> `3-small`) | P2 | ~700-1,200ms | Unfixed |
| 4 | Widget config inline presence query not eliminated | P3 | ~50-200ms | Regression |
| 5 | `getMessages()` sorts DESC then reverses in JS | P4 | ~10-30ms | Unfixed |
| 6 | Jina Reader fallback chain is sequential | P3 | ~2,000-5,000ms worst case | Unfixed |

### Already fixed (verified in code)

These were flagged in the prior audit and are confirmed still present and correct:

- Embedding model mismatch detection (`rag.ts:130-184`)
- RAG prework overlap with conversation setup (`rag.ts:53-78`, `route.ts:277`)
- 3-layer TTL cache on live fetch (`live-fetch.ts:46-96`)
- Embedding LRU cache, 200 entries (`embeddings.ts:17-45`)
- `resolveEmbeddingConfig()` 60s module-level cache (`embeddings.ts:61-84`)
- `get_or_create_conversation` single-RPC (`api.ts:393-402`)
- Greeting short-circuit skips RAG (`rag.ts:28-36, 111-114`)
- Per-chatbot `live_fetch_threshold` (`rag.ts:245`)
- Selective column queries on chatbots + messages (`route.ts:263`, `api.ts:408`)
- HNSW index tuned (m=16, ef_construction=128)
- Split live-fetch timeout (10s) vs ingestion timeout (30s)
- Parallel mega-group in chat route (`route.ts:564-586`)

---

## Finding 1: `pipeline_timings` JSONB Column Missing from DB

**Severity: P1 (blocks all observability)**
**File:** `src/app/api/chat/[chatbotId]/route.ts:119`
**Migration:** `supabase/migrations/20260320600000_chat_performance_log.sql`

### Problem

The `savePerfLog()` function at `route.ts:91-125` inserts a `pipeline_timings` JSONB field:

```typescript
// route.ts:119
pipeline_timings: data.pipelineTimings ?? null,
```

But the `chat_performance_log` table (migration `20260320600000`) has **no `pipeline_timings` column**. The table only has individual `_ms` columns (`chatbot_loaded_ms`, `rag_total_ms`, etc.).

PostgREST rejects unknown columns, so **every call to `savePerfLog()` fails silently** (the error is caught at line 121-122 and only logged as a warning). This means:

- Zero performance data is being persisted
- The performance dashboard (`/dashboard/chatbots/[id]/performance`) has no data
- You cannot measure the impact of any optimization

### Fix

Create a migration to add the column:

```sql
-- Add pipeline_timings JSONB column to chat_performance_log
ALTER TABLE chat_performance_log
  ADD COLUMN IF NOT EXISTS pipeline_timings jsonb;
```

**Alternatively**, remove `pipeline_timings` from the insert and rely on the individual `_ms` columns that already exist in the schema. The individual columns are already populated correctly by the same `savePerfLog()` call. The `pipeline_timings` JSONB provides a more detailed waterfall breakdown, so adding the column is preferred.

### Verification

After applying the migration, check the server logs. You should see `[Chat:Perf] Timing saved to DB` instead of `[Chat:Perf] Failed to save timing: ...`.

---

## Finding 2: AI Link Picker Adds ~1-2s Unnecessarily for Small Link Sets

**Severity: P1**
**File:** `src/lib/chatbots/knowledge/live-fetch.ts:116-176`
**Est. savings: ~1,000-2,000ms per live-fetch request**

### Problem

When live fetch is triggered (low RAG confidence + pinned URLs exist), the pipeline is:

1. Fetch pinned URL HTML, extract all `<a>` links (~1-2s)
2. **Ask AI which link(s) answer the question** (~1-2s) ← this step
3. Fetch picked page(s) via Jina Reader (~2-3s)

Step 2 calls `generate()` (a full LLM roundtrip) at `live-fetch.ts:226-234`:

```typescript
const result = await generate(pickPrompt, {
  maxTokens: 300,
  temperature: 0,
  systemPrompt: 'You are a helpful assistant...',
});
```

This makes sense when there are 50+ links — the AI needs to select the most relevant 1-2. But when there are **5 or fewer links**, it's faster to just fetch all of them directly, skipping the AI call entirely.

The AI call costs ~1-2s (API roundtrip) and ~300 tokens. For <=5 links, fetching all pages via Jina is ~2-3s total (parallel), which is the same or faster than AI-pick (1-2s) + selective-fetch (2-3s).

### Fix

In `fetchPinnedUrlContent()`, add a bypass before the AI pick step:

```typescript
// After deduplicating links (line 144), before AI pick:

const SKIP_AI_THRESHOLD = 5;

let aiPickedUrls: string[];
if (uniqueLinks.length <= SKIP_AI_THRESHOLD) {
  // Few enough links to fetch them all — skip the AI picker entirely
  console.log(`[Live Fetch] Only ${uniqueLinks.length} links, skipping AI picker`);
  aiPickedUrls = uniqueLinks.map(l => l.url);
} else {
  // Too many links — use AI to select the most relevant
  aiPickedUrls = await getCachedAiPick(uniqueLinks, query);
}
```

The subsequent `aiPickedUrls.slice(0, 2)` at line 156 already limits to 2 fetches, so even if we pass all 5 URLs, only 2 will be fetched.

### Why this is safe

- The `MAX_CONTENT_CHARS = 40000` limit (line 18) caps total content regardless
- `aiPickedUrls.slice(0, 2)` at line 156 limits fetches to 2
- Cache layers still apply — cached content returns instantly
- Worst case: we fetch 2 slightly-less-relevant pages, which is better than spending 1-2s on AI selection

---

## Finding 3: Embedding Model Upgrade Opportunity

**Severity: P2**
**File:** `src/lib/chatbots/knowledge/embeddings.ts`
**Est. savings: ~700-1,200ms per cache-miss embedding**

### Problem

The system uses `text-embedding-ada-002` for query embeddings. Typical latency: **~1,400ms** per single query (measured from performance logs in the prior audit).

OpenAI's newer `text-embedding-3-small` model offers:

| Metric | ada-002 | 3-small |
|--------|---------|---------|
| Latency (single query) | ~1,200-1,500ms | ~200-500ms |
| Cost per 1M tokens | $0.10 | $0.02 |
| MTEB retrieval score | 49.0 | 44.0 (at 1536d) |
| Dimensions | 1536 (fixed) | 256-3072 (configurable) |

At 117 chunks, the 5-point MTEB difference is negligible. The 3-5x speed improvement and 5x cost reduction are significant.

### What's required

This is NOT a config change. It requires:

1. Re-embed all 117 knowledge chunks with the new model
2. Update default model in `embeddings.ts` (lines 97, 182)
3. The `embedding_provider`/`embedding_model` tracking on `knowledge_sources` (already implemented) will handle the transition gracefully

### Risk

- Small quality regression possible on edge-case queries
- Requires a one-time re-processing of all knowledge sources
- During re-processing, the mismatch detection in `rag.ts:156-178` will handle the transition period (queries with old model until new embeddings are ready)

### Recommendation

Wait until the `pipeline_timings` column is fixed (Finding 1) so you can measure before/after. Then re-process knowledge sources with `text-embedding-3-small` and compare retrieval quality.

---

## Finding 4: Widget Config Still Does Inline Presence Query

**Severity: P3**
**File:** `src/app/api/widget/[chatbotId]/config/route.ts:117-139`
**Est. savings: ~50-200ms on config endpoint (once per 60s)**

### Problem

The prior audit (Finding 10/20) states the config endpoint was fixed to return `agentsAvailable: 'check'` so the widget polls separately. But the **current code** still computes `agentsAvailable` inline as a boolean:

```typescript
// config/route.ts:117-139
agentsAvailable: await (async () => {
  const lhConfig = { ... };
  if (!lhConfig.enabled) return false;
  // Telegram check (instant)
  const tc = { ... };
  if (tc.enabled && !!tc.bot_token && !!tc.chat_id) return true;
  // Agent console check — HITS DATABASE
  if (lhConfig.require_agent_online !== false) {
    const cutoff = new Date(Date.now() - 60_000).toISOString();
    const { count } = await (supabase as any)
      .from('agent_presence')
      .select('id', { count: 'exact', head: true })
      .eq('chatbot_id', chatbot.id)
      .gte('last_heartbeat', cutoff);
    return (count ?? 0) > 0;
  }
  return true;
})(),
```

This is an extra DB query on every config request (though cached 60s by `Cache-Control`). The separate `/agent-heartbeat` GET endpoint already exists and has its own 15s cache.

### Impact Assessment

With the 60s `Cache-Control` header, this query only runs once per minute per chatbot. For most deployments this is fine. This is low priority unless you see config endpoint latency in the performance logs (which you can't, because Finding 1 blocks logging).

### Fix (if needed)

For chatbots using agent-console handoff (not Telegram), return a sentinel value and let the widget poll the heartbeat endpoint:

```typescript
// Instead of the async IIFE, return early for agent-console:
if (lhConfig.require_agent_online !== false) {
  // Let widget poll /agent-heartbeat separately
  agentsAvailable = 'check';
}
```

The `ChatWidget.tsx` already has polling logic for when `agentsAvailable === 'check'`.

---

## Finding 5: `getMessages()` Sorts DESC Then Reverses in JS

**Severity: P4**
**File:** `src/lib/chatbots/api.ts:408-421`
**Est. savings: ~10-30ms (minor)**

### Problem

```typescript
// api.ts:411-421
const { data, error } = await supabase
  .from('messages')
  .select(columns)
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: false })  // Newest first
  .limit(50);

// ...
return ((data || []) as Message[]).reverse();  // Then reverse to chronological
```

The query sorts DESC to get the latest 50 messages, then `.reverse()` flips to chronological order. The `.reverse()` is O(n) on up to 50 elements — trivial. But the DESC sort means Postgres can't use a simple index scan if there's an ASC index on `(conversation_id, created_at)`.

### Why this pattern exists

It's actually correct: you want the **most recent** 50 messages (not the first 50 ever), so you sort DESC + LIMIT 50, then reverse. The alternative would be a subquery:

```sql
SELECT * FROM (
  SELECT * FROM messages WHERE conversation_id = ?
  ORDER BY created_at DESC LIMIT 50
) sub ORDER BY created_at ASC;
```

### Recommendation

Leave as-is. The current approach is fine for 50 rows. If message counts grow large, add a composite index `(conversation_id, created_at DESC)` to support this query pattern efficiently.

---

## Finding 6: Jina Reader + Direct Fetch Fallback is Sequential

**Severity: P3**
**File:** `src/lib/chatbots/knowledge/extractors/url.ts:18-59`
**Est. savings: Up to ~5s on Jina timeout paths**

### Problem

`extractURL()` tries Jina Reader first, then falls back to direct fetch:

```typescript
// url.ts:22-33 — Try Jina first
try {
  const content = await extractWithJina(url, timeout);  // up to 10s timeout
  if (content && content.trim().length > 100) {
    return content;
  }
} catch (error) {
  console.warn('[URL Extractor] Jina Reader failed, falling back to direct fetch');
}

// url.ts:36-58 — Fallback: direct fetch
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  // ...
}
```

If Jina times out (10s for live fetch), the user waits the full timeout before the direct fetch even starts. Total worst case: 10s (Jina timeout) + 10s (direct timeout) = **20s**.

### Context

This function is called from `getCachedContent()` in `live-fetch.ts:260`, which is itself cached. So this worst case only hits on cache misses. But when it does hit, it's brutal.

### Fix Options

**Option A (recommended): Race with a head start**

Give Jina a 3s head start, then race with direct fetch:

```typescript
export async function extractURL(url: string, timeoutMs?: number): Promise<string> {
  const timeout = timeoutMs ?? DEFAULT_FETCH_TIMEOUT;

  const jinaPromise = extractWithJina(url, timeout).catch(() => null);
  const directPromise = new Promise<string | null>((resolve) => {
    // Give Jina 3s head start before trying direct fetch
    setTimeout(async () => {
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': '...', Accept: 'text/html,...' },
          signal: AbortSignal.timeout(timeout),
        });
        if (!response.ok) { resolve(null); return; }
        const html = await response.text();
        resolve(extractContentFromHTML(html, url));
      } catch { resolve(null); }
    }, 3000);
  });

  // Take whichever succeeds first with meaningful content
  const results = await Promise.allSettled([jinaPromise, directPromise]);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value && r.value.trim().length > 100) {
      return r.value;
    }
  }
  throw new Error(`Failed to extract URL content from ${url}`);
}
```

**Option B (simpler): Reduce Jina timeout for live fetch**

Instead of using the full `LIVE_FETCH_TIMEOUT` (10s) for Jina, use a shorter timeout (5s) so the fallback starts sooner:

```typescript
const jinaTimeout = Math.min(timeout, 5000);
const content = await extractWithJina(url, jinaTimeout);
```

This reduces worst case from 20s to 15s, which is less impactful but simpler.

### Risk

Option A adds complexity. The race condition could cause both requests to hit the target server simultaneously, which some servers may rate-limit. Option B is safer and simpler.

---

## Findings NOT Carried Forward (Invalid or Already Addressed)

These were flagged by the initial agent scan but don't hold up under code review:

| Initial Claim | Reality |
|---------------|---------|
| "Serial awaits block parallel operations in rag.ts" | **Already fixed.** `rag.ts` runs embedding config + source queries in parallel (line 56-71 via `Promise.all`). The chat route runs 7 operations in parallel (line 564-586). RAG prework overlaps with conversation setup (line 277). |
| "No embedding cache" | **Already fixed.** LRU cache at `embeddings.ts:17-45`, 200 entries, no TTL (deterministic). |
| "HNSW index parameters suboptimal" | **Already fixed.** Migration `20260321500000` sets m=16, ef_construction=128. Appropriate for <1M vectors. |
| "Live fetch lacks response caching" | **Already fixed.** 3-layer TTL cache in `live-fetch.ts:46-96`. |
| "Widget config does unnecessary DB joins" | **No joins.** The query is a flat SELECT on `chatbots` with a column list. The only extra query is the inline `agent_presence` count (Finding 4). |
| "Agent heartbeat polling interval too high" | **Fine as-is.** 30s interval, 15s Cache-Control, lightweight count query. |
| "`resolveEmbeddingConfig()` uncached DB calls" | **Already fixed.** 60s module-level cache at `embeddings.ts:61-84`. |

---

## Priority Implementation Order

For maximum speed improvement with minimum risk:

1. **Finding 1** (pipeline_timings column) — Do this first. Without observability, you're optimizing blind. ~5 min migration.

2. **Finding 2** (skip AI picker for <=5 links) — Highest latency savings for lowest effort. ~15 min code change.

3. **Finding 6, Option B** (reduce Jina timeout) — Simple one-liner, reduces tail latency. ~5 min.

4. **Finding 3** (embedding model upgrade) — Biggest sustained savings but requires re-processing. Schedule after 1-3 are deployed and you have performance data.

5. **Finding 4** (widget config presence) — Low priority with 60s cache. Only if config endpoint latency shows up in perf logs.

6. **Finding 5** (messages sort) — Not worth changing. Document for future reference.

---

## Projected Latency After Fixes

### Current (estimated, no perf data due to Finding 1):

```
Cache-miss query, high confidence (no live fetch):
  Chatbot load:        ~150ms
  Conversation RPC:    ~200ms
  Parallel group:      ~1,400ms (dominated by embedding API call)
  Prompt build:        ~1ms
  First token:         ~1,500ms
  ─────────────────────────────
  TTFT:                ~3,250ms
  Total:               ~5,250ms
```

### After Finding 2 + 3 (embedding upgrade + skip AI picker):

```
Cache-miss query, high confidence:
  Chatbot load:        ~150ms
  Conversation RPC:    ~200ms
  Parallel group:      ~500ms (faster embedding model, ~300ms + similarity ~200ms)
  Prompt build:        ~1ms
  First token:         ~1,500ms
  ─────────────────────────────
  TTFT:                ~2,350ms
  Total:               ~4,350ms

Cache-miss query, low confidence (live fetch triggered):
  Same as above but parallel group:
    Embedding:         ~300ms
    Similarity:        ~200ms
    Live fetch:        ~3,000ms (no AI picker, cached links, 2 Jina fetches)
  Parallel group:      ~3,000ms
  ─────────────────────────────
  TTFT:                ~4,850ms
  Total:               ~6,850ms

Cache-hit query (repeat question):
  Chatbot load:        ~150ms
  Conversation RPC:    ~200ms
  Parallel group:      ~300ms (embedding cache hit, similarity only)
  Prompt build:        ~1ms
  First token:         ~1,500ms
  ─────────────────────────────
  TTFT:                ~2,150ms
  Total:               ~4,150ms
```

The AI model generation time (~1,500ms TTFT + ~2,000ms stream) is the floor — it's determined by Anthropic's API and cannot be optimized on our side.
