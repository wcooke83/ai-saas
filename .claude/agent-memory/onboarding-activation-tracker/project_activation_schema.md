---
name: Activation milestone schema decisions
description: Which columns were added to chatbots table and how to handle missing generated types
type: project
---

Two columns added to `chatbots` table:
- `widget_reviewed_at timestamptz` — migration `20260330000000_add_chatbot_widget_reviewed.sql`
- `first_conversation_at timestamptz` — migration `20260330000001_add_activation_tracking.sql`

Both fields added to `Chatbot` interface in `src/lib/chatbots/types.ts` as `string | null`.

**Why:** Generated types in `src/types/database.ts` lag behind schema — only updated by running `npm run db:gen-types` after migration. Until then, cast `supabase as any` on the query builder to bypass type errors on new columns.

**How to apply:** When adding new columns to any table, apply the same `(supabase as any).from(...)` pattern in routes until `db:gen-types` is re-run. Also add the field to the manual type in `src/lib/chatbots/types.ts` immediately.
