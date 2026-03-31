# VocUI Integration Audit

**Date:** 2026-03-31
**Scope:** Slack, Telegram, and recommended future integrations

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Slack Integration Audit](#slack-integration-audit)
3. [Telegram Integration Audit](#telegram-integration-audit)
4. [Cross-Integration Architecture Analysis](#cross-integration-architecture-analysis)
5. [Feature Gap Analysis](#feature-gap-analysis)
6. [Recommended Future Integrations](#recommended-future-integrations)
7. [Priority Action Items](#priority-action-items)

---

## Executive Summary

VocUI currently offers two integrations beyond the embeddable widget:

| Integration | Purpose | Maturity | Verdict |
|---|---|---|---|
| **Slack** | AI chatbot responds to messages using RAG knowledge base | Production-ready | Worth keeping and improving |
| **Telegram** | Human agent escalation/handoff notifications | Production-ready | Worth keeping; consider adding bot responses |

**Key findings:**
- Slack integration is well-built and properly reuses the core RAG pipeline. Users can message the bot and get AI-powered responses from the knowledge base. This is a strong feature.
- Telegram integration is **agent-only** - it does NOT respond to Telegram users with AI answers. It only notifies human agents when a widget visitor escalates. This is a deliberate design choice for live handoff, but means there's no Telegram chatbot equivalent to Slack.
- Both integrations have security gaps (missing CSRF on Slack OAuth, plaintext bot tokens for Telegram) that should be addressed.
- Several high-value integrations are missing: WhatsApp, Discord, Microsoft Teams, and Zapier/webhook forwarding.

---

## Slack Integration Audit

### Files Involved

| File | Purpose |
|---|---|
| `src/lib/chatbots/integrations/slack.ts` | Core library (OAuth, event handling, RAG chat) |
| `src/app/api/webhooks/slack/route.ts` | Webhook endpoint for Slack events |
| `src/app/api/chatbots/[id]/integrations/slack/route.ts` | OAuth initiation + status/disconnect API |
| `src/app/api/chatbots/[id]/integrations/slack/callback/route.ts` | OAuth callback handler |
| `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx` | Deploy UI with Slack tab |
| `supabase/migrations/20260331000000_add_slack_integrations.sql` | Database migration |
| `tests/e2e-slack-integration.spec.ts` | 10 E2E tests |

### How It Works

1. **Setup:** User clicks "Connect to Slack" on deploy page, completes OAuth 2.0 flow
2. **Messaging:** Slack users @mention the bot or DM it
3. **Processing:** Bot receives event via webhook, queries RAG knowledge base, generates AI response
4. **Response:** Bot replies in-thread on Slack

### What's Working Well

- **Full RAG reuse** - calls same `getRAGContext()`, `buildSystemPrompt()`, `buildRAGPrompt()`, and `generate()` as the widget
- **Proper OAuth 2.0** with correct scopes (`app_mentions:read`, `channels:history`, `chat:write`, `im:history`, `im:read`, `im:write`, `users:read`)
- **Webhook signature verification** using HMAC-SHA256 with `crypto.timingSafeEqual()` and 5-minute replay attack window
- **Fire-and-forget async processing** - returns 200 to Slack immediately, processes event in background
- **Thread-aware conversations** - session ID format `slack_{channel}_{thread_ts}` preserves context
- **Message splitting** at 3900 chars (under Slack's 4000 limit), splitting at nearest newline/space
- **Bot self-reply prevention** via `bot_user_id` check
- **Atomic quota enforcement** via `increment_chatbot_messages` RPC
- **Plan-gated** - Pro+ only, enforced server-side
- **Workspace exclusivity** - one chatbot per Slack workspace (prevents confusion)
- **Good test coverage** - 10 E2E tests covering OAuth, webhook, message handling

### Is Slack Worth Doing?

**Yes, absolutely.** Slack is where many B2B teams spend their workday. Having a chatbot that answers questions from the knowledge base directly in Slack channels is a high-value feature because:
- Reduces context switching (no need to visit a separate widget)
- Makes the chatbot accessible to the entire team automatically
- Common in competitive products (Intercom, Drift, etc.)
- Natural fit for internal knowledge bots (HR policies, IT help, onboarding docs)

### Issues Found

#### Security

| Severity | Issue | Detail |
|---|---|---|
| Medium | **Missing CSRF on OAuth state** | State parameter is just the chatbot ID, not a signed/encrypted token. An attacker could craft a malicious OAuth URL to link their Slack workspace to a victim's chatbot. |
| Low | **Signature verification disabled in dev** | `process.env.NODE_ENV !== 'production'` skips verification. Fine for dev, but should be documented. |
| Low | **No token rotation** | Bot tokens persist indefinitely. Should consider periodic rotation or at minimum a "Regenerate" button. |

#### Functionality Gaps

| Priority | Gap | Impact |
|---|---|---|
| High | **No visitor memory in Slack** | Widget loads visitor memory facts via `getUserMemory()` and includes them in prompts. Slack handler skips this entirely. Slack users get no personalization across conversations. |
| High | **No performance logging** | Widget logs detailed timing to `chat_performance_log`. Slack has zero observability. Can't compare latency or debug slow responses. |
| Medium | **No streaming** | Widget streams tokens. Slack sends entire response at once. For long responses this means longer perceived wait time. (Slack does support `chat.update` for progressive display.) |
| Medium | **`mention_only` and `channel_ids` not implemented** | Schema has these columns but code ignores them. Users can't restrict bot to specific channels or mention-only mode. |
| Medium | **No RAG prework optimization** | Widget pre-fetches embedding config in parallel with conversation setup. Slack does everything sequentially. |
| Low | **No file/attachment handling** | Widget supports image/PDF/DOCX uploads. Slack messages with files are ignored. |
| Low | **No calendar integration** | Widget supports calendar booking via tool calls. Not available in Slack. |
| Low | **No sentiment analysis** | Widget tracks sentiment. Slack conversations aren't analyzed. |

#### Robustness

| Priority | Issue |
|---|---|
| Medium | Failed AI generation silently drops - no error message sent to Slack user |
| Low | No retry mechanism if Slack API `chat.postMessage` fails |
| Low | No audit logging for integration connect/disconnect events |

---

## Telegram Integration Audit

### Files Involved

| File | Purpose |
|---|---|
| `src/lib/telegram/types.ts` | Type definitions |
| `src/lib/telegram/client.ts` | Telegram Bot API wrapper |
| `src/lib/telegram/commands.ts` | Bot command handling (`/help`, `/resolve`, `/active`) |
| `src/lib/telegram/handoff.ts` | Handoff orchestration |
| `src/app/api/telegram/webhook/route.ts` | Webhook listener |
| `src/app/api/telegram/setup/route.ts` | Webhook setup/teardown |
| `src/app/api/widget/[chatbotId]/handoff/route.ts` | Handoff initiation |
| `src/app/api/widget/[chatbotId]/agent-reply/route.ts` | Agent reply forwarding |
| `src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx` | Settings UI |
| `tests/e2e-telegram-integration.spec.ts` | 18 E2E tests |

### How It Works

**Important: Telegram is NOT a chatbot channel. It is agent escalation only.**

1. **Setup:** User creates a Telegram bot via @BotFather, creates a support group, enters bot token + group chat ID in dashboard
2. **Escalation:** When a widget visitor clicks "Request Human Help", a notification is sent to the Telegram group with conversation context (last 5 messages, visitor info, reason)
3. **Agent Reply:** Support agent replies to the Telegram message thread. Reply is forwarded to the widget visitor.
4. **Resolution:** Agent uses `/resolve` command to close the handoff session.

### What's Working Well

- **Multi-tenant architecture** - each chatbot has its own bot token (not a shared platform bot)
- **Rich escalation context** - notifications include last 5 messages, visitor name/email, page URL, escalation reason
- **Cross-channel agent support** - both Telegram agents and dashboard agents can reply to the same handoff
- **Bot commands** - `/help`, `/resolve <id>`, `/active` for agent convenience
- **Command audit logging** to `telegram_command_log` table
- **Graceful failure** - Telegram send failure doesn't block handoff creation (still visible in dashboard)
- **Message mapping** - `telegram_message_mappings` enables reply-to-thread routing with 4-layer fallback chain
- **Rate limiting** on escalations (5/hour/session)
- **Good test coverage** - 18 E2E tests
- **Optional webhook secret** verification

### Is Telegram Worth Doing?

**Yes for agent escalation. But consider also adding AI bot responses.**

The current agent-only approach is valuable for teams that:
- Already use Telegram for team communication
- Want instant escalation alerts on mobile
- Need lightweight support tooling without a full helpdesk

However, **Telegram has 900M+ monthly active users** and is the dominant messaging platform in several markets (Russia, Iran, Central Asia, parts of SE Asia, Middle East). Not having AI chatbot responses on Telegram means those markets can't use VocUI chatbots natively.

**Recommendation:** Add a "Telegram Bot" mode alongside the existing "Telegram Agent Notifications" mode. When enabled, the chatbot would respond to Telegram users with AI-powered answers from the knowledge base (same as Slack does today). This would reuse the existing bot token + webhook infrastructure.

### Issues Found

#### Security

| Severity | Issue | Detail |
|---|---|---|
| Medium | **Bot tokens stored as plaintext** | `chatbots.telegram_config.bot_token` is a JSON field. While Supabase provides encryption-at-rest, anyone with DB read access sees raw tokens. Consider encrypting at the application layer. |
| Low | **Webhook secret is optional** | Without it, anyone who discovers the webhook URL can send fake Telegram updates. Should be required or auto-generated. |
| Low | **No webhook URL randomization** | Webhook endpoint is `/api/telegram/webhook` (same for all chatbots). Per-chatbot secret URLs would prevent enumeration. |

#### Functionality Gaps

| Priority | Gap | Impact |
|---|---|---|
| High | **No AI chatbot responses** | Telegram can only relay human agent replies. Users who want a Telegram bot that answers questions from the knowledge base cannot do this. Major feature gap vs. competitors. |
| Medium | **No message size limit handling** | Telegram has a 4096-char limit. No splitting logic exists (unlike Slack which splits at 3900). Long agent replies could be silently truncated. |
| Medium | **No retry on send failure** | If `sendMessage` fails, the notification is lost. Agent sees handoff in dashboard but misses the Telegram alert. |
| Low | **`/active` only shows 10 sessions** | No pagination. High-volume support teams would miss older active handoffs. |
| Low | **Webhook deletion doesn't update config** | Calling `DELETE /api/telegram/setup` removes the Telegram webhook but doesn't clear `telegram_config.enabled` in the chatbot record. |

#### Robustness

| Priority | Issue |
|---|---|
| Medium | Widget trusts `handoff_active` flag from server but doesn't enforce AI silence server-side during active handoff |
| Low | No health check pinging to detect if Telegram webhook is still active |

---

## Cross-Integration Architecture Analysis

### How Channels Connect to Core Chat

```
Widget ──────► /api/chat/[chatbotId] ──► Full pipeline (RAG, memory, streaming,
                                          sentiment, calendar, webhooks, perf logging)

Slack ───────► /api/webhooks/slack ────► Partial pipeline (RAG, prompt building,
                                          generate - but NO memory, NO streaming,
                                          NO sentiment, NO calendar, NO webhooks,
                                          NO perf logging)

Telegram ────► /api/telegram/webhook ──► No AI pipeline (agent replies only,
                                          message forwarding, handoff management)
```

### Feature Parity Matrix

| Feature | Widget | Slack | Telegram |
|---|---|---|---|
| AI chatbot responses | Yes | Yes | **No** |
| RAG knowledge search | Yes | Yes | No |
| Streaming responses | Yes | No | N/A |
| Visitor memory | Yes | **No** | N/A |
| File/image uploads | Yes | No | No |
| Calendar booking | Yes | No | No |
| Pre-chat forms | Yes | No | No |
| Sentiment analysis | Yes | No | No |
| Performance logging | Yes | **No** | No |
| Webhook events | Yes | **No** | No |
| Human agent handoff | Yes | No | Yes |
| Agent reply forwarding | Yes (realtime) | No | Yes |
| Bot commands | N/A | No | Yes (`/help`, `/resolve`, `/active`) |
| Message splitting | N/A | Yes (3900) | **No** |

### Core Architecture Issue

The main chat endpoint (`/api/chat/[chatbotId]` - 1,117 lines) contains all the advanced logic (memory, sentiment, calendar, webhooks, performance logging) but the Slack handler (`handleSlackEvent` in `slack.ts`) reimplements a simpler version of the same pipeline. This means every new feature added to the widget must be manually ported to Slack.

**Recommendation:** Extract a shared `executeChat()` function from the chat endpoint that both the widget API and Slack handler can call. This would automatically give Slack parity with widget features.

---

## Feature Gap Analysis

### What Competitors Offer

| Feature | Intercom | Drift | Tidio | Crisp | VocUI |
|---|---|---|---|---|---|
| Web widget | Yes | Yes | Yes | Yes | Yes |
| Slack bot | Yes | Yes | No | No | Yes |
| Telegram bot | Yes | No | No | No | **Agent only** |
| WhatsApp | Yes | Yes | Yes | Yes | **No** |
| Discord | No | No | No | No | **No** |
| MS Teams | Yes | Yes | No | No | **No** |
| Facebook Messenger | Yes | Yes | Yes | Yes | **No** |
| Instagram DMs | Yes | No | Yes | No | **No** |
| Email | Yes | Yes | Yes | Yes | **No** |
| SMS | Yes | Yes | No | No | **No** |
| Zapier/webhooks | Yes | Yes | Yes | Yes | **Partial** (webhooks exist) |
| API | Yes | Yes | Yes | Yes | Yes |

---

## Recommended Future Integrations

### Tier 1: High Impact, Build Next

#### 1. WhatsApp Business API
- **Why:** 2B+ users. Standard expectation for customer support chatbots. Required for e-commerce, healthcare, and SMB markets.
- **Effort:** Medium-High. Requires WhatsApp Business API approval, Meta Business verification, phone number provisioning.
- **Architecture:** Very similar to Slack - webhook receives messages, RAG pipeline generates response, send via WhatsApp Cloud API.
- **Revenue impact:** Unlocks entire SMB market that expects WhatsApp support. Could justify a higher-tier plan.

#### 2. Microsoft Teams
- **Why:** 320M+ monthly active users. Dominant in enterprise. If VocUI targets B2B internal knowledge bots (HR, IT, onboarding), Teams is essential.
- **Effort:** Medium. Teams Bot Framework is well-documented. OAuth flow similar to Slack.
- **Architecture:** Teams Bot Framework webhook + Bot Connector API. Message flow nearly identical to Slack integration.
- **Revenue impact:** Enterprise deal enabler. Many companies won't consider a tool without Teams support.

#### 3. Discord
- **Why:** 200M+ monthly active users. Strong fit for community-driven products, gaming, Web3, developer tools, and education.
- **Effort:** Low-Medium. Discord Bot API is straightforward. Simpler than Slack OAuth.
- **Architecture:** Discord gateway (WebSocket) or webhook for interactions. Slash commands + message responses.
- **Revenue impact:** Niche but growing. Differentiator vs. Intercom/Drift which don't offer Discord.

### Tier 2: Medium Impact, Plan For

#### 4. Zapier / Make.com Integration
- **Why:** Lets users connect VocUI to 5000+ apps without custom code. "When chatbot conversation ends, create a HubSpot deal." "When escalation happens, create a Jira ticket."
- **Effort:** Medium. Zapier app requires triggers (new conversation, new escalation, new message) and actions (send message, create chatbot).
- **Architecture:** VocUI already has a webhook system. Zapier integration would formalize this with Zapier's app framework.
- **Revenue impact:** Massive unlock for non-technical users. Reduces "build vs buy" friction.

#### 5. Facebook Messenger
- **Why:** 1B+ users. Standard for e-commerce customer support. Required for Meta Shops integration.
- **Effort:** Medium-High. Meta's API has strict review requirements and approval process.
- **Architecture:** Messenger Platform webhook + Send API. Similar pattern to Slack/WhatsApp.
- **Revenue impact:** Important for retail/e-commerce segment.

#### 6. Email (Inbound)
- **Why:** Let customers email a support address and get AI-powered responses from the knowledge base. Universal channel that every business uses.
- **Effort:** Medium. Requires inbound email parsing (SendGrid/Postmark inbound webhook) + reply threading.
- **Architecture:** Inbound email webhook → extract text → RAG pipeline → send reply email.
- **Revenue impact:** Differentiator. Few AI chatbot platforms handle email well.

### Tier 3: Consider Later

| Integration | Why | When |
|---|---|---|
| **SMS/MMS** | Useful for appointment reminders, simple Q&A. Twilio makes this easy. | When calendar integration is mature |
| **Instagram DMs** | Required for DTC brands. Uses same Meta API as Messenger. | After Messenger is built |
| **Line** | Dominant in Japan, Thailand, Taiwan. 200M+ users. | When expanding to Asian markets |
| **WeChat** | Required for China market. Complex approval process. | Only if targeting China |
| **Zendesk/Freshdesk** | Agent handoff into existing helpdesk. | When enterprise customers request it |
| **HubSpot** | CRM integration for lead capture from chatbot conversations. | Via Zapier first, then native |
| **Notion/Confluence** | Knowledge source ingestion from team wikis. | When expanding knowledge source types |

---

## Priority Action Items

### Critical (Do Now)

1. **Add signed state to Slack OAuth** - Current state parameter is just the chatbot ID. Use a signed JWT or encrypted token to prevent CSRF.
2. **Encrypt Telegram bot tokens at application layer** - Don't rely solely on Supabase encryption-at-rest. Use AES-256 encryption before storing.
3. **Add message splitting to Telegram** - Telegram has a 4096-char limit. Long messages will be silently truncated. Port the Slack splitting logic.

### High Priority (Next Sprint)

4. **Add visitor memory to Slack handler** - Call `getUserMemory()` and include facts in Slack prompts. Currently Slack users get no personalization.
5. **Add performance logging to Slack** - Log timing to `chat_performance_log` so you can monitor and compare Slack vs widget latency.
6. **Extract shared `executeChat()` function** - Deduplicate the widget and Slack chat pipelines. New features should automatically work on both channels.
7. **Implement `mention_only` and `channel_ids`** - Schema has these fields. Wire them up so users can control where the Slack bot responds.
8. **Make Telegram webhook secret required** (or auto-generate on setup) - Without it, the webhook is open to spoofed messages.

### Medium Priority (Next Quarter)

9. **Add AI chatbot responses to Telegram** - Reuse existing bot token + webhook to serve RAG-powered responses to Telegram users (not just agent handoff).
10. **Build WhatsApp integration** - Highest-impact new channel. Similar architecture to Slack.
11. **Build Microsoft Teams integration** - Required for enterprise customers.
12. **Add streaming to Slack** - Use `chat.update` API to progressively display responses instead of waiting for full generation.
13. **Add webhook event emission to Slack** - Slack conversations should trigger the same webhook events as widget conversations.
14. **Add error messages to Slack users** - When AI generation fails, send a user-friendly error instead of silently dropping.
15. **Add Zapier/Make.com triggers** - Formalize the existing webhook system into a Zapier app.

### Low Priority (Backlog)

16. Build Discord integration
17. Build Facebook Messenger integration
18. Build inbound email channel
19. Add file/attachment handling to Slack
20. Add calendar booking to Slack
21. Add `/active` pagination to Telegram
22. Add audit logging for integration connect/disconnect events
23. Implement token rotation for Slack
24. Add webhook health check pinging for Telegram
25. Sync Telegram config `enabled` flag on webhook deletion

---

## Appendix: Database Tables

### Slack

```sql
slack_integrations (
  id UUID PK,
  chatbot_id UUID FK → chatbots,
  user_id UUID FK → profiles,
  team_id TEXT NOT NULL,
  team_name TEXT,
  bot_token TEXT NOT NULL,
  bot_user_id TEXT,
  channel_ids TEXT[] DEFAULT '{}',  -- NOT IMPLEMENTED
  is_active BOOLEAN DEFAULT true,
  mention_only BOOLEAN DEFAULT false,  -- NOT IMPLEMENTED
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(chatbot_id, team_id)
)
```

### Telegram

```sql
-- Config stored in chatbots.telegram_config JSON:
-- { enabled, bot_token, chat_id, webhook_secret, auto_handoff_on_escalation }

telegram_handoff_sessions (
  id UUID PK,
  chatbot_id UUID FK,
  conversation_id UUID FK (UNIQUE),
  session_id UUID,
  status TEXT,  -- 'pending' | 'active' | 'resolved'
  agent_name TEXT,
  agent_source TEXT,  -- 'telegram' | 'platform'
  agent_telegram_id BIGINT,
  agent_user_id UUID,
  escalation_id UUID FK,
  created_at, updated_at, resolved_at TIMESTAMPTZ
)

telegram_message_mappings (
  id UUID PK,
  chatbot_id UUID FK,
  conversation_id UUID FK (UNIQUE),
  telegram_message_id BIGINT,
  telegram_chat_id BIGINT,
  created_at TIMESTAMPTZ
)

telegram_command_log (
  id UUID PK,
  chatbot_id UUID FK,
  telegram_user_id BIGINT,
  telegram_username TEXT,
  command TEXT,
  arguments TEXT[],
  success BOOLEAN,
  error_message TEXT,
  executed_at TIMESTAMPTZ
)
```
