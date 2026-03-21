-- Migration: Agent Console Support
-- Extends handoff sessions for multi-channel agents (platform + telegram)
-- Enables Supabase Realtime for live agent console updates

-- 1. Extend handoff sessions for multi-channel agents
ALTER TABLE telegram_handoff_sessions
  ADD COLUMN IF NOT EXISTS agent_source text NOT NULL DEFAULT 'telegram'
    CHECK (agent_source IN ('telegram', 'platform')),
  ADD COLUMN IF NOT EXISTS agent_user_id uuid;

-- 2. Enable Supabase Realtime on key tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE telegram_handoff_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
