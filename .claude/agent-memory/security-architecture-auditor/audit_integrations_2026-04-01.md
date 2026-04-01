---
name: Integration Channels Security Audit (2026-04-01)
description: Security audit of WhatsApp, Teams, Discord webhook/setup routes - 2 critical (missing HMAC, SSRF), 5 high, 5 medium, 3 low findings
type: project
---

## Integration Channels Audit - 2026-04-01

Audited WhatsApp, Microsoft Teams, and Discord integration routes added in commits a6ec36e and 2207d26.

### Critical Findings
1. **WhatsApp webhook POST missing X-Hub-Signature-256 HMAC verification** (`src/app/api/whatsapp/webhook/[chatbotId]/route.ts`). GET verification handler checks verify_token correctly, but all POST deliveries are unauthenticated. Any attacker who knows a chatbot ID can forge webhook payloads.
2. **Teams SSRF via unvalidated `activity.serviceUrl`** (`src/lib/teams/chat.ts` + `src/lib/teams/client.ts`). The serviceUrl from the Bot Framework activity body is used directly in outbound HTTP requests. No allowlist validation against Microsoft's documented endpoints.

### High Findings
- Teams JWT claims checked before signature verification (information leakage via error messages)
- Teams webhook uses `SELECT *` leaking full chatbot record into memory
- WhatsApp setup POST returns verify_token in plaintext response
- No UUID validation on chatbotId route params in any webhook handler
- Teams/Discord GET handlers expose infrastructure via unauthenticated status endpoints

### Medium Findings
- In-memory rate limiters don't survive serverless cold starts; no eviction for memory leak
- Teams JWT allows missing `exp` claim (falsy check)
- WhatsApp verify_token stored unencrypted (only access_token is encrypted)
- Discord config decryption is deferred, making pattern fragile
- Webhook URL generation falls back to attacker-controlled Origin header

### Patterns Observed
- All three integrations reuse `src/lib/telegram/crypto.ts` (AES-256-GCM) for token encryption
- All three have per-user in-memory rate limiters (10 msg/60s)
- All three route through shared `executeChat()` pipeline
- Discord has proper Ed25519 signature verification
- Teams has proper JWT/JWKS verification (with ordering issue)
- WhatsApp is the only channel completely lacking POST request authentication

**Why:** These integrations are new (added same sprint) and represent the primary external attack surface for the chatbot platform.
**How to apply:** Prioritize C-1 (WhatsApp HMAC) and C-2 (Teams SSRF) fixes before production deployment. The WhatsApp fix requires either a global META_APP_SECRET env var or per-chatbot app_secret storage.
