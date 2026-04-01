---
name: Discord integration is 90% implemented
description: Discord channel integration has full backend (client, chat, types, rate-limit, webhook route, setup route, migration, tests) and frontend deploy tab already built. Only missing deploy page URL bug and possibly the PATCH route discord_config handling.
type: project
---

Discord integration for VocUI chatbots is substantially complete as of 2026-04-01. All backend modules exist in `src/lib/discord/` (client.ts, chat.ts, types.ts, rate-limit.ts) with tests. API routes exist at `src/app/api/discord/setup/route.ts` and `src/app/api/discord/webhook/[chatbotId]/route.ts`. The deploy page (`src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`) already has a full Discord tab with connect/disconnect/AI-toggle UI.

**Why:** Someone already built this feature but it's still in untracked files (not yet committed). The migration `20260401100000_add_discord_config.sql` adds a `discord_config` JSONB column to the chatbots table.

**How to apply:** When asked about Discord integration, don't treat it as greenfield work. Review the existing stubs for bugs before writing new code. The deploy page webhook URL shown to users uses a query param pattern (`/api/discord/webhook?chatbot_id=`) that doesn't match the actual route (`/api/discord/webhook/[chatbotId]`).
