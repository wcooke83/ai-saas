-- Migration: Telegram Live Handoff System
-- Adds per-chatbot Telegram integration for human agent handoff

-- 1. Add telegram_config to chatbots
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS telegram_config jsonb NOT NULL DEFAULT '{"enabled": false}'::jsonb;

-- 2. Telegram message mappings (per-chatbot, maps conversation to Telegram message for threading)
CREATE TABLE IF NOT EXISTS telegram_message_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  telegram_message_id bigint NOT NULL,
  telegram_chat_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(conversation_id),
  UNIQUE(chatbot_id, telegram_message_id)
);

CREATE INDEX IF NOT EXISTS idx_telegram_mappings_conversation
  ON telegram_message_mappings(conversation_id);
CREATE INDEX IF NOT EXISTS idx_telegram_mappings_chatbot_message
  ON telegram_message_mappings(chatbot_id, telegram_message_id);

-- 3. Telegram handoff sessions (tracks active handoff state per conversation)
CREATE TABLE IF NOT EXISTS telegram_handoff_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  session_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'resolved')),
  agent_name text,
  agent_telegram_id bigint,
  escalation_id uuid REFERENCES conversation_escalations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  UNIQUE(conversation_id)
);

CREATE INDEX IF NOT EXISTS idx_handoff_sessions_chatbot_status
  ON telegram_handoff_sessions(chatbot_id, status);
CREATE INDEX IF NOT EXISTS idx_handoff_sessions_conversation
  ON telegram_handoff_sessions(conversation_id);

-- 4. Telegram command log (per-chatbot audit trail)
CREATE TABLE IF NOT EXISTS telegram_command_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  telegram_user_id bigint NOT NULL,
  telegram_username text,
  command text NOT NULL,
  arguments text[],
  success boolean NOT NULL DEFAULT true,
  error_message text,
  executed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_command_log_chatbot
  ON telegram_command_log(chatbot_id, executed_at DESC);

-- 5. Add handoff_active flag to conversations for quick lookup
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS handoff_active boolean NOT NULL DEFAULT false;

-- 6. Auto-update updated_at on handoff sessions
CREATE OR REPLACE FUNCTION update_handoff_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handoff_session_updated_at ON telegram_handoff_sessions;
CREATE TRIGGER handoff_session_updated_at
  BEFORE UPDATE ON telegram_handoff_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_handoff_session_updated_at();

-- 7. When handoff resolved, update conversation flag
CREATE OR REPLACE FUNCTION sync_handoff_to_conversation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE conversations SET handoff_active = true WHERE id = NEW.conversation_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    UPDATE conversations SET handoff_active = false WHERE id = NEW.conversation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE conversations SET handoff_active = false WHERE id = OLD.conversation_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_handoff_status ON telegram_handoff_sessions;
CREATE TRIGGER sync_handoff_status
  AFTER INSERT OR UPDATE OR DELETE ON telegram_handoff_sessions
  FOR EACH ROW
  EXECUTE FUNCTION sync_handoff_to_conversation();

-- 8. RLS policies
ALTER TABLE telegram_message_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_handoff_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_command_log ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access telegram_message_mappings"
  ON telegram_message_mappings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access telegram_handoff_sessions"
  ON telegram_handoff_sessions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access telegram_command_log"
  ON telegram_command_log FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Chatbot owners can view their handoff data
CREATE POLICY "Chatbot owners can manage telegram_message_mappings"
  ON telegram_message_mappings FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()))
  WITH CHECK (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

CREATE POLICY "Chatbot owners can manage telegram_handoff_sessions"
  ON telegram_handoff_sessions FOR ALL
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()))
  WITH CHECK (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));

CREATE POLICY "Chatbot owners can view telegram_command_log"
  ON telegram_command_log FOR SELECT
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));
