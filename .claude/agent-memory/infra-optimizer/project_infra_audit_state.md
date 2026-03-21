---
name: infra-audit-2026-03-22
description: Key infrastructure findings from chatbot system audit — connection patterns, vector search config, caching layers, rate limiting gaps, and latency bottlenecks
type: project
---

Infrastructure audit completed 2026-03-22 covering the full chatbot RAG pipeline.

**Why:** Comprehensive audit of database, vector search, API routes, caching, and rate limiting to identify performance bottlenecks and security gaps.

**How to apply:**

Top 3 critical findings:
1. Middleware calls `supabase.auth.getUser()` on ALL API routes including public widget/chat endpoints — wasted 30-80ms per request
2. In-memory rate limiter (30 req/min/IP) in chat route is per-serverless-instance, ineffective under Vercel auto-scaling — needs Upstash Redis
3. Live fetch pipeline can block response for 3-10s with no timeout cap

Key infrastructure facts:
- Supabase clients use REST API (PostgREST), not direct Postgres — pgBouncer not applicable
- Admin client (`createAdminClient()`) instantiated 3-5 times per chat request — should be singleton
- HNSW index: m=16, ef_construction=128, vector_cosine_ops — good config, but ef_search not tuned
- No `vercel.json` exists — no explicit region pinning
- No `export const runtime = 'edge'` on any route
- In-memory caches: embedding (200 LRU), embedding config (60s TTL), model config (30s TTL), live-fetch 3-tier (10min/30min/5min)
- Widget config has `Cache-Control: public, max-age=60`, agent heartbeat has `max-age=15`
- Upstash Redis vars exist in .env.example but are unused in code

Full audit: docs/chatbot-infra-audit.md
