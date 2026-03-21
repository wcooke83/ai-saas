-- Add conversation escalation support

-- 1. Create conversation_escalations table
CREATE TABLE IF NOT EXISTS conversation_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  session_id text,
  message_id uuid,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Check constraints
DO $$ BEGIN
  ALTER TABLE conversation_escalations ADD CONSTRAINT chk_escalation_reason
    CHECK (reason IN ('wrong_answer', 'offensive_content', 'need_human_help', 'other'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE conversation_escalations ADD CONSTRAINT chk_escalation_status
    CHECK (status IN ('open', 'acknowledged', 'resolved'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_escalations_chatbot
  ON conversation_escalations(chatbot_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_escalations_conversation
  ON conversation_escalations(conversation_id);

-- 3. RLS policies
ALTER TABLE conversation_escalations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chatbot owners can manage escalations" ON conversation_escalations;
CREATE POLICY "Chatbot owners can manage escalations"
  ON conversation_escalations
  FOR ALL
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access to conversation_escalations" ON conversation_escalations;
CREATE POLICY "Service role full access to conversation_escalations"
  ON conversation_escalations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Add escalation_config to chatbots
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS escalation_config jsonb NOT NULL DEFAULT '{"enabled": false}'::jsonb;
