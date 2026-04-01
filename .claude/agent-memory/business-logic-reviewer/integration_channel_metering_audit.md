---
name: Integration channel metering audit (2026-04-01)
description: Audit of usage tracking and plan-limit enforcement across all chat channels (widget, Slack, Telegram, WhatsApp, Discord, Teams, Zapier). Key finding: all channels correctly use executeChat() for quota, but WhatsApp setup lacks plan gate, Zapier send-message doesn't handle QuotaExhaustedError, and webhook subscriptions have no per-plan limit.
type: project
---

## Architecture

Two separate quota/credit systems exist:

1. **Chatbot-level quota** (`chatbots.messages_this_month` + `purchased_credits_remaining`): enforced inside `executeChat()` via `increment_chatbot_messages` RPC (atomic, row-locked). This is the primary metering system for chat messages.

2. **User-level credits** (`usage.credits_used`): tracked in `src/lib/usage/tracker.ts`, used by AI tools (generations), NOT used by the chat pipeline at all.

## What IS tracked and limited

- All 6 integration channels (Telegram, WhatsApp, Discord, Teams, Slack, widget) call `executeChat()` which calls `checkAndIncrementQuota()` -- chatbot message quota IS enforced.
- `CHATBOT_PLAN_LIMITS` in `src/lib/chatbots/types.ts` defines per-plan boolean gates for each integration: `slackIntegration`, `telegramIntegration`, `whatsappIntegration`, `discordIntegration`, `teamsIntegration`, `apiAccess`.
- Telegram setup (`/api/telegram/setup`) enforces plan gate via `checkTelegramPlanGate()`.
- Discord setup (`/api/discord/setup`) enforces plan gate.
- Teams setup (`/api/teams/setup`) enforces plan gate.
- Zapier create-knowledge checks `checkKnowledgeSourceLimit()`.

## What is NOT tracked / enforced

1. **CRITICAL: WhatsApp setup has NO plan gate.** The `/api/whatsapp/setup` POST route does NOT check `CHATBOT_PLAN_LIMITS.whatsappIntegration`. Free-tier users can set up WhatsApp.

2. **WARNING: Zapier send-message doesn't handle QuotaExhaustedError.** The error falls through to a generic catch that returns 500, not a user-friendly 429. Compare with Telegram/Discord/WhatsApp/Teams handlers which all explicitly catch QuotaExhaustedError.

3. **WARNING: Zapier send-message uses channel='api' not 'zapier'.** No way to distinguish Zapier traffic from direct API traffic in analytics.

4. **WARNING: No webhook subscription limit per plan.** Users can create unlimited webhook subscriptions via `/api/zapier/subscribe` or the webhooks UI. Only rate-limiting (1000 req/min) exists.

5. **INFO: Webhook deliveries don't count against any quota.** They are fire-and-forget HTTP calls, not chat messages, so this is likely intentional.

6. **INFO: No runtime plan-gate enforcement at webhook time for integrations.** Plan gates are checked only during setup (configuring the integration). Once configured, if a user downgrades, the integration keeps working because the webhook endpoints don't re-check the plan.

**How to apply:** Fix WhatsApp plan gate first (CRITICAL revenue leakage). Add QuotaExhaustedError handling to Zapier route. Consider runtime plan enforcement on channel webhooks for downgrade scenarios.
