---
name: Infrastructure Constraints
description: Non-obvious infrastructure constraints discovered during 2026-03-22 chatbot system audit
type: project
---

Non-obvious infrastructure constraints:
- Supabase clients use REST API (PostgREST), not direct Postgres — pgBouncer pooling recommendations don't apply
- Upstash Redis env vars exist in .env.example but are unused in code — indicates intent to add Redis-based rate limiting
- In-memory rate limiter (30 req/min/IP) in chat route is per-serverless-instance, ineffective under Vercel auto-scaling

**Why:** These constraints aren't obvious from reading the code and affect infrastructure recommendations significantly. The REST vs direct-Postgres distinction is the most impactful.

**How to apply:** Don't recommend pgBouncer for this project. Reference the unused Redis vars when implementing distributed rate limiting. Full audit details in docs/chatbot-infra-audit.md.
