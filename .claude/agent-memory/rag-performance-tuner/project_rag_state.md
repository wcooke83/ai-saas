---
name: RAG Performance Baselines
description: Performance baselines and non-obvious RAG architectural constraints from 2026-03-21 audit
type: project
---

Performance baselines measured during 2026-03-21 audit:
- **Post-optimization baseline (no live fetch):** ~3,000-3,500ms total, ~2,500-3,000ms TTFT
- **With parallelization fixes:** ~2,600-3,100ms total, ~2,200-2,600ms TTFT
- **Cold live fetch path with AI picker bypass:** saves ~1,500ms

Non-obvious constraints:
- `match_knowledge_chunks` RPC was manually created and is not version-controlled in supabase/migrations/
- Embedding mismatch between generation and storage was a P0 issue — verify dimensions match when changing embedding models
- Live fetch AI link picker adds ~1-2s unnecessarily for small link sets (<= 5 links)

**Why:** Baselines enable data-driven comparison for future optimization work. The RPC and embedding constraints aren't obvious from reading the code alone.

**How to apply:** Reference baselines when evaluating new optimizations. Check migration coverage of the RPC function before modifying it.
