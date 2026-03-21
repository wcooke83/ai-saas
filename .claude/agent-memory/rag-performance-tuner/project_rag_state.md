---
name: RAG System Current State
description: Comprehensive state of the RAG pipeline as of 2026-03-21 audit - embedding models, indexes, thresholds, and critical bugs
type: project
---

## Critical Bug: Embedding Model Mismatch (0.00 confidence)
The `app_settings.embedding_model_id` is set to Gemini Embedding 001 (`3ba30c20-236b-4e79-a1ec-2c38e6e544a3`), but chunks were originally embedded with OpenAI `text-embedding-ada-002` (1536d). The `resolveEmbeddingConfig()` in `src/lib/chatbots/knowledge/embeddings.ts` resolves to Gemini for query embeddings, producing incompatible vectors. This causes 100% of queries to return 0.00 similarity, triggering live fetch on every single request.

**Why:** The admin changed the embedding provider after chunks were already ingested, but no re-embedding was triggered. The system has no safeguard against this mismatch.

**How to apply:** Any fix must either (a) re-embed all chunks with the current provider, or (b) track which provider/model was used per-chunk and query with the matching model.

## Database State
- **Table:** `knowledge_chunks` — 117 chunks, 1 chatbot, all have 1536-dim embeddings
- **HNSW index:** `idx_knowledge_chunks_embedding` on `(embedding vector_cosine_ops)` with DEFAULT params (m=16, ef_construction=64) — adequate for 117 vectors
- **Composite index missing:** No composite index on `(chatbot_id, embedding)` — the `match_knowledge_chunks` function filters by `chatbot_id` first

## Embedding Configuration
- Configured embedding model: Gemini Embedding 001 (Google) — outputs 1536d (via `outputDimensionality: 1536` in batchEmbed call)
- OpenAI models available: `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`
- `resolveEmbeddingConfig()` is called 2x per RAG request: once in `isEmbeddingsAvailable()`, once in `generateQueryEmbedding()` — each does a DB call to `app_settings` + `ai_models`
- Settings are cached for 60s via `getAppSettings()`, but `getEmbeddingModel()` also queries `ai_models` (no cache)

## Performance Data (18 requests, last 30 days)
- Avg total: 15,100ms | Avg RAG: 10,602ms | Avg TTFT: 13,787ms
- Avg embedding generation: 1,599ms
- Avg similarity search: 2,088ms
- Avg live fetch: 10,602ms (= RAG total because it dominates)
- Live fetch triggered: 100% of requests (due to 0.00 confidence bug)
- Avg chunks returned: 30 (all priority chunks, since similarity returns nothing)

## Threshold Configuration
- `LOW_CONFIDENCE_THRESHOLD = 0.9` in `src/lib/chatbots/rag.ts` line 12 — hardcoded, not configurable per-chatbot
- `similarityThreshold = 0.7` default param in `getRAGContext()` line 34
- `match_knowledge_chunks` SQL function default: `p_match_threshold = 0.7`

## Live Fetch Architecture (the 7.5s bottleneck)
Three-phase process in `src/lib/chatbots/knowledge/live-fetch.ts`:
1. Fetch pinned URL HTML + extract all links (~1-2s)
2. AI call to pick best link(s) from list (~2-3s) — uses `generate()` with full AI roundtrip
3. Fetch picked URL(s) via Jina Reader (~2-3s per URL, max 2 URLs)
No caching at any layer. Every request re-fetches, re-parses, re-asks AI.

## Chunking Parameters
- `maxTokens: 500`, `overlap: 50`, `preserveHeaders: true` in `src/lib/chatbots/knowledge/processor.ts` line 118-122
- Avg actual token count: ~417 tokens per chunk
