---
name: Usage tracking, feature gating, and subscription enforcement full audit (2026-04-04)
description: Comprehensive audit of all usage tracking, credit enforcement, feature gates, and AI consumption points. Key finding — two independent credit systems with no cross-linkage, multiple unmetered AI call points, and client-only enforcement for branding.
type: project
---

## Two Independent Credit/Quota Systems

1. **Chatbot-level quota** (primary, actually enforced):
   - Tables: `chatbots.messages_this_month`, `chatbots.purchased_credits_remaining`, `chatbots.monthly_message_limit`
   - RPC: `increment_chatbot_messages` (atomic, row-locked with SELECT ... FOR UPDATE)
   - Enforced in: `executeChat()` via `checkAndIncrementQuota()` in `src/lib/chatbots/execute-chat.ts:475-516`
   - Plan limits: `CHATBOT_PLAN_LIMITS` in `src/lib/chatbots/types.ts:1210-1250` (free=100msg, pro=10k, agency=unlimited)

2. **User-level credits** (exists but almost entirely unused):
   - Tables: `usage.credits_used`, `usage.credits_limit`, `user_credits.purchased_credits`
   - Functions: `incrementUsage`, `deductCredits`, `checkUsageLimit`, `checkUsageAndRateLimit` in `src/lib/usage/tracker.ts`
   - Limits: `PLAN_LIMITS` (base/free=500k credits, pro=3M, enterprise=unlimited)
   - **Only import in the app**: `getCreditBalance` in `src/app/api/credit-alerts/check/route.ts` -- no actual enforcement anywhere

**Why this matters:** The usage tracker system has sophisticated credit deduction, rate limiting, and auto-topup logic, but it's dead code. All actual enforcement goes through the chatbot message counter only.

## Feature Gates (what IS enforced)

| Gate | Where Enforced | Enforcement Type |
|------|---------------|-----------------|
| Chatbot count limit | `checkChatbotLimit()` in POST `/api/chatbots` | Server-side |
| Knowledge source limit | `checkKnowledgeSourceLimit()` in POST `/api/chatbots/[id]/knowledge` | Server-side |
| Chat message quota | `checkAndIncrementQuota()` in `executeChat()` | Server-side, atomic |
| Tool access (chatbots feature) | `requireToolAccess()` in GET/POST `/api/chatbots` | Server-side |
| Integration plan gates | Setup routes for Telegram, Discord, Teams | Server-side at setup time only |
| Branding removal | Customize page `isFreePlan` check | CLIENT-SIDE ONLY |

## Feature Gates (what is NOT enforced)

| Gate | Status | Impact |
|------|--------|--------|
| Branding (showBranding) | Client-only via `isFreePlan` state; PATCH `/api/chatbots/[id]` accepts `widget_config.showBranding=false` without plan check; widget config endpoint returns whatever is stored | CRITICAL: free users can hide branding via API |
| API key count limit | `api_keys_limit` exists in subscription_plans schema but `createAPIKey()` in `src/lib/auth/api-keys.ts` has no limit check | WARNING: unlimited API key creation regardless of plan |
| WhatsApp setup plan gate | Missing from `/api/whatsapp/setup` | CRITICAL (from prior audit) |
| Runtime integration downgrade | Integrations only checked at setup, not at message-receipt time | WARNING: downgraded users keep integrations |
| File size per plan | `maxFileSize` defined in CHATBOT_PLAN_LIMITS but not enforced in knowledge upload route | WARNING |

## All AI Consumption Points

| Action | File | Model | User-level credits charged? | Chatbot-level quota charged? |
|--------|------|-------|---------------------------|----------------------------|
| Chat message response | `execute-chat.ts` | Per-chatbot configurable | NO | YES (increment_chatbot_messages RPC) |
| Sentiment analysis | `sentiment.ts` | Admin-configurable sentimentModel | NO | NO |
| Memory extraction | `memory.ts` | Default model | NO | NO |
| Live URL fetch (AI link picker) | `knowledge/live-fetch.ts` | Default model | NO | NO |
| Article generation | `articles.ts` | Admin-configurable articleModel | NO | NO |
| Embedding generation | `knowledge/embeddings.ts` | OpenAI/Gemini | NO | NO |
| Translation | `chatbots/[id]/translate/route.ts` | fast model | NO | NO |
| Knowledge reprocessing | `knowledge/processor.ts` via reembed-all | Embedding provider | NO | NO |

**How to apply:** Only chat messages consume any quota. All other AI operations (sentiment, memory extraction, live-fetch link-picking, article generation, translations, embeddings) run completely unmetered. This is the single largest revenue leak in the system.

## Subscription Enforcement

- `checkSubscriptionStatus()` in `src/lib/usage/tracker.ts:212-238` blocks `canceled`/`unpaid` statuses but is NEVER CALLED from any application code (it's only used by `checkUsageLimit()` which itself is never called).
- Grace period: `handleInvoicePaymentFailed()` sets `payment_failed_at` + 7-day `grace_period_ends_at`, `handleInvoicePaid()` clears them. But no code checks `grace_period_ends_at` before allowing access.
- Trial: `trial_days` and `trial_credits` exist in subscription_plans schema. No code enforces trial expiration or limit.
