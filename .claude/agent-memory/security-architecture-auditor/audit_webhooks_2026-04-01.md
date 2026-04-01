---
name: Webhook/Zapier Integration Security Audit
description: Findings from auditing webhook delivery, Zapier subscribe/unsubscribe, and chatbot webhook CRUD endpoints (2 critical, 3 high, 4 medium)
type: project
---

## Webhook System Audit - 2026-04-01

### Architecture
- Webhook types/delivery: `src/lib/webhooks/{types,deliver,emit}.ts`
- Zapier endpoints: `src/app/api/zapier/{subscribe,unsubscribe,perform-list}/`
- Chatbot webhook CRUD: `src/app/api/chatbots/[id]/webhooks/`
- Legacy webhook utility also exists: `src/lib/sdk/webhook.ts` (different headers, different event names)
- All webhook DB queries use admin client (service role), bypassing RLS
- Webhook secrets stored plaintext in `webhooks.secret` column

### Critical Findings
1. **SSRF**: Zapier subscribe accepts any `target_url` with no URL validation (no HTTPS check, no private IP block). Delivery system does `fetch(subscription.url)` to arbitrary URLs. The chatbot CRUD endpoint does enforce HTTPS, but Zapier subscribe does not.
2. **Secret exposure**: Chatbot webhook POST uses `.select()` (all columns) returning secret in response. Also accepts caller-provided `secret` via request body, allowing weak secrets.

### High Findings
3. **No RLS on webhooks table**: No migration file exists for the webhooks table. If RLS not enabled, anon key could read all webhook records including secrets.
4. **TOCTOU in unsubscribe**: Ownership check uses `user_id` but delete query only filters by `id`.
5. **User-supplied secret**: POST `/api/chatbots/[id]/webhooks` accepts `secret` from request body.

### Key Patterns
- Auth on Zapier endpoints: `authenticateAPIKeyStrict` (API key required, no session fallback)
- Auth on chatbot webhook CRUD: `authenticate` (session or API key) + `checkChatbotOwnership`
- HMAC signing uses `sha256` with `${unixTimestamp}.${body}` format
- Circuit breaker at 10 consecutive failures disables webhook
- Delivery fan-out uses `Promise.allSettled` with exponential backoff retries
- Webhook emissions in execute-chat are fire-and-forget with `.catch(() => {})`
- Event name mismatch: report/route.ts emits `escalation.created` but types define `escalation.requested`

**Why:** Webhook system was added recently (Zapier commit 2207d26) without security hardening.
**How to apply:** These findings should be addressed before production use. SSRF and RLS are blockers.
