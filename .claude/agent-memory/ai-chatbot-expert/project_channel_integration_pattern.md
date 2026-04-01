---
name: Channel integration architecture pattern
description: How new messaging channels (Slack, Telegram, Discord) integrate with the shared executeChat() pipeline — module structure, session IDs, rate limiting, webhook routes
type: project
---

All messaging channels follow a consistent pattern:

1. **Shared pipeline**: `src/lib/chatbots/execute-chat.ts` — `executeChat()` is channel-agnostic. Accepts a `ChatChannel` union type (widget, api, slack, telegram, whatsapp, discord, teams) and handles RAG, quota, memory, sentiment, webhooks, and message persistence.

2. **Per-channel modules**: Each channel has its own directory (`src/lib/telegram/`, `src/lib/discord/`, etc.) containing:
   - `types.ts` — Config interface + interaction/message types
   - `client.ts` — API wrapper (send messages, verify signatures, register commands)
   - `chat.ts` — Handler that calls `executeChat()` and sends the response
   - `rate-limit.ts` — In-memory sliding window (10 msgs/60s per user)
   - Tests for each module

3. **Session ID format**: `{channel}_{channelOrChatId}_{userId}` (e.g., `slack_C123_U456`, `telegram_123_456`, `discord_channel-42_user-77`)

4. **API routes**: Webhook receiver at `/api/{channel}/webhook/[chatbotId]` and setup at `/api/{channel}/setup`

5. **Config storage**: JSONB column on chatbots table (e.g., `telegram_config`, `discord_config`). Bot tokens encrypted via `src/lib/telegram/crypto.ts` (shared by Discord too).

6. **Plan gating**: `CHATBOT_PLAN_LIMITS` in `src/lib/chatbots/types.ts` controls which plans get which integrations.

**Why:** Understanding this pattern is essential for evaluating new channel additions or debugging existing ones.

**How to apply:** When adding a new channel, replicate this module structure. The `executeChat()` pipeline needs no changes — just add the channel name to the `ChatChannel` type and build the channel-specific adapter.
