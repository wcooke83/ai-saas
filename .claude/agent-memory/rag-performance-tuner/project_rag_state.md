---
name: RAG System Current State
description: Comprehensive state of the RAG pipeline as of 2026-03-21 second audit - all prior findings applied, new bottlenecks identified in chat route parallelism, live fetch AI picker, and missing DB schema
type: project
---

## Prior Audit Fixes (in working tree, not yet committed)

All 13 original findings applied:
1. Embedding mismatch detection (P0) -- reads provider/model from knowledge_sources
2. Single resolveEmbeddingConfig() call (P2) -- 60s TTL cache added
3. Priority chunks similarity-filtered RPC (P1)
4. 3-layer TTL cache on live fetch (P1)
5. Split fetch timeout: 10s live, 30s ingestion (P2)
6. Composite B-tree index + tuned HNSW ef_construction=128 (P4)
7. Atomic get_or_create_conversation RPC (P3)
8. Chat route explicit SELECT columns (P3)
9. Widget config agent presence inlined (P4)
10. Error handler captured chatbotUserId (P4)
11. LRU embedding cache 200 entries (P2)
12. Messages getMessages() configurable columns (P3)
13. Greeting short-circuit (P3)
14. resolveEmbeddingConfig 60s cache (P2)
15. RAG pre-work overlaps with conversation setup (P2)
16. Per-chatbot live_fetch_threshold (default 0.80) (P3)

## Second Audit Findings (2026-03-21)

### Critical/High
- **A (P1):** `pipeline_timings` JSONB column missing from `chat_performance_log` table -- perf logging silently fails
- **G (P1):** Live fetch AI picker adds ~1-2s unnecessarily for small link sets (<= 5 links). Should skip AI and fetch all directly.

### Medium
- **B (P2):** `getUserPreferredModel()` blocks critical path serially (before Promise.all) for API-authenticated requests -- ~100-200ms
- **C (P2):** `ragPreworkPromise` awaited outside parallel group, partially negating overlap benefit -- ~50-150ms
- **E (P2):** `match_knowledge_chunks` RPC not in any migration file -- manually created, not version-controlled

### Low
- **D (P3):** `getActiveHandoff()` queries DB on every request even when handoff not configured -- ~30-80ms
- **F (P3):** HNSW `ef_search` not tuned (using default 40) -- matters at >1000 chunks
- **I (P3):** Fetches 50 messages but only uses 10 in prompt -- ~10-30ms wasted transfer
- **K (P3):** Agent presence query inline in widget config -- ~30-80ms on widget init
- **L (P3):** No `stale-while-revalidate` on widget config cache header

## Database State
- **Table:** `knowledge_chunks` -- 117 chunks, 1 chatbot, all 1536-dim OpenAI ada-002 embeddings
- **Pending migrations:** 6 SQL files in supabase/migrations/ (20260321200000 through 20260321600000)
- **Missing:** `pipeline_timings` JSONB column on `chat_performance_log`
- **Missing:** `match_knowledge_chunks` RPC not in migrations

## Key Config Values
- Chunk size: 500 tokens, overlap: 50 tokens
- Similarity threshold: 0.7, live fetch threshold: 0.80 (per-chatbot configurable)
- Embedding cache: 200 entries LRU, no TTL
- Live fetch caches: links 10min, AI pick 5min, content 30min
- HNSW: m=16, ef_construction=128, ef_search=40 (default, not tuned)

## Performance Estimates
- **Post-fix baseline (no live fetch):** ~3,000-3,500ms total, ~2,500-3,000ms TTFT
- **With Findings B+C+D applied:** ~2,600-3,100ms total, ~2,200-2,600ms TTFT
- **With Finding G on cold live fetch path:** saves ~1,500ms
