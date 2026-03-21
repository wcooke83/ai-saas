-- Separate Live Handoff from Escalation Reporting
-- Add live_handoff_config column and agent_presence table

-- 1. Add live_handoff_config to chatbots
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS live_handoff_config jsonb NOT NULL DEFAULT '{"enabled": false}'::jsonb;

-- 2. Migrate: copy handoff settings from escalation_config to live_handoff_config
-- If escalation was enabled, enable live handoff too (preserving existing behavior)
UPDATE chatbots
SET live_handoff_config = jsonb_build_object(
  'enabled', true,
  'handoff_timeout_minutes', COALESCE((escalation_config->>'handoff_timeout_minutes')::int, 5),
  'require_agent_online', true
)
WHERE escalation_config IS NOT NULL
  AND (escalation_config->>'enabled')::boolean = true;

-- 3. Create agent_presence table for heartbeat-based availability tracking
CREATE TABLE IF NOT EXISTS agent_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  agent_name text,
  last_heartbeat timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_presence_chatbot_heartbeat
  ON agent_presence(chatbot_id, last_heartbeat);

-- 4. RLS for agent_presence
ALTER TABLE agent_presence ENABLE ROW LEVEL SECURITY;

-- Chatbot owners can manage agent presence
CREATE POLICY "Chatbot owners can manage agent presence"
  ON agent_presence FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()))
  WITH CHECK (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

-- Service role full access
CREATE POLICY "Service role full access to agent_presence"
  ON agent_presence FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Anon can read agent presence for published chatbots (widget availability check)
CREATE POLICY "Anon can read agent presence for published chatbots"
  ON agent_presence FOR SELECT TO anon
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE is_published = true AND status = 'active'));
