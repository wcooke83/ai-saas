---
name: Channel Webhook Security Audit 2026-04-05
description: Security audit of Messenger, Instagram, SMS, Email inbound/setup routes — findings and fixes applied
type: project
---

Audit of: Messenger, Instagram, SMS (Twilio), Email (Postmark) webhook and setup routes.

**Why:** Focused follow-up on new channel integrations added after the 2026-04-01 audit.

**How to apply:** Use as baseline for future channel audits; these patterns repeat across channels.

## Patterns confirmed safe
- All setup routes (GET/POST/DELETE) use `getAuthenticatedChatbot()` which calls `supabase.auth.getUser()` + ownership check (`eq('user_id', user.id)`) before any admin DB write. Ownership verification is correct.
- All webhook signature libraries (`src/lib/meta/signature.ts`, `src/lib/sms/signature.ts`) use `crypto.timingSafeEqual`. Timing-safe comparison confirmed.
- All channel crypto modules (`messenger/crypto.ts`, `instagram/crypto.ts`, `sms/crypto.ts`) delegate to `telegram/crypto.ts` which uses AES-256-GCM with `enc:` prefix. Encryption before storage confirmed.
- SMS webhook correctly reconstructs URL from `NEXT_PUBLIC_APP_URL` not `request.url` for Twilio HMAC.
- UUID validation present on SMS and WhatsApp POST webhook routes before DB queries.
- Email inbound validates `MailboxHash` as UUID before processing.

## Critical issues fixed (2026-04-05)
- **C1 FIXED** `src/app/api/email/inbound/route.ts`: `POSTMARK_INBOUND_SECRET` check was conditional on env var presence — if unset, entire auth bypassed. Fixed to hard-fail when env var missing.
- **C2 FIXED** `src/app/api/sms/webhook/[chatbotId]/route.ts`: Non-secret `AccountSid` was used as a pre-auth gate before HMAC, creating timing side-channel and exposing chatbotId in warn logs. Removed AccountSid pre-check entirely; HMAC is the sole gate.

## High issues fixed (2026-04-05)
- **H1 FIXED** Messenger and Instagram both read `META_APP_SECRET`. Changed to `META_MESSENGER_APP_SECRET ?? META_APP_SECRET` and `META_INSTAGRAM_APP_SECRET ?? META_APP_SECRET` respectively for per-channel secret isolation.
- **H2 FIXED** Messenger and Instagram webhooks `await Promise.all(messagePromises)` before returning 200 — could exceed Meta's 5s timeout causing retries. Changed to fire-and-forget with `.catch()`.
- **H3 FIXED** `src/lib/email/inbound-handler.ts`: No deduplication — Postmark retries would double-process and double-reply. Added in-memory `seenMessageIds` Map with 5-minute TTL, same pattern as Messenger's `isMessengerMessageDuplicate`.

## Medium issues documented (not fixed)
- **M1**: Confirm `handleMessengerMessage` calls `checkMessengerRateLimit` before async AI call — not verified.
- **M2**: Encryption key derived from `SUPABASE_SERVICE_ROLE_KEY` via SHA-256 — rotating DB key also rotates token key. Should use dedicated `TOKEN_ENCRYPTION_KEY` env var.
- **M3**: `reply_name` in email setup has no length/character validation — could be exploited in email display-name header injection.
- **M4**: WhatsApp `GET` webhook verification handler missing UUID validation on `chatbotId` (POST has it).
- **M5**: Messenger/Instagram webhooks do sequential DB queries per entry inside loop — should batch with `IN` query.

## Low issues documented
- **L1**: `META_MESSENGER_VERIFY_TOKEN` / `META_INSTAGRAM_VERIFY_TOKEN` are global platform secrets, not per-chatbot.
- **L2**: `decryptToken` silently passes through plaintext legacy tokens — no log warning to drive migration.
- **L3**: `chatbot_id` query param in setup routes not validated as UUID format before DB query (ownership check prevents data leakage, but produces Supabase errors on garbage input).

## Pre-existing build failures (unrelated)
Build fails on static generation for `/blog/zendesk-chat-alternatives` and `/chatbot-for-insurance-agents` — missing page modules, pre-dates this audit.
