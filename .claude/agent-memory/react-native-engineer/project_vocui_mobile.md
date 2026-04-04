---
name: VocUI Mobile App Project Context
description: Core facts about the VocUI Agent Console mobile app project — monorepo location, auth model, DB schema findings
type: project
---

Mobile app lives at `mobile/` inside the existing monorepo at `/home/wcooke/projects/ai-saas`.

Auth: Full Supabase session auth (email + password), same Supabase project as web app. NOT chatbot API key auth. The web agent console supports both session and `cb_` API key modes, but the mobile app uses the user's own Supabase session exclusively.

Key DB tables confirmed:
- `chatbots` — owned by `user_id`, has `live_handoff_config` (Json), `escalation_config` (Json)
- `telegram_handoff_sessions` — `status` in (pending/active/resolved), `chatbot_id`, `conversation_id`, `agent_user_id`
- `conversations` — `chatbot_id`, `handoff_active` bool, `visitor_metadata` Json
- `messages` — `chatbot_id`, `conversation_id`, `role`, `content`, `metadata` Json (metadata.is_human_agent flags agent messages)
- `knowledge_sources` — `chatbot_id`, `type`, `status`, `chunks_count`, `is_priority`
- `profiles` — `full_name`, `email` (no agent role/permission fields)

Critical finding: There is NO existing agent assignment / permission table in the database. The chatbot's `user_id` is the sole owner. Agent Assignment is a v1 requirement that needs a new DB schema (`chatbot_agents` or similar) designed before implementation.

**Why:** Agent Assignment feature requires a new Supabase migration — must coordinate with supabase-schema agent before implementing.
**How to apply:** Do not attempt to query a permissions table that doesn't exist yet. When implementing the app, stub/gate the Agent Assignment screen with a "coming soon" placeholder, or block on DB migration first.
