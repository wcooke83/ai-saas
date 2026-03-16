-- Add email-to-visitor mapping and OTP verification for pre-chat form identity

-- 1. Email-to-visitor mapping for verified pre-chat form users
CREATE TABLE IF NOT EXISTS conversation_memory_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  email text NOT NULL,
  visitor_id text NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, email)
);

CREATE INDEX IF NOT EXISTS idx_conversation_memory_emails_chatbot_email
  ON conversation_memory_emails(chatbot_id, email);

-- 2. OTP verification codes (short-lived)
CREATE TABLE IF NOT EXISTS memory_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memory_verification_codes_lookup
  ON memory_verification_codes(chatbot_id, email, code);

-- Auto-cleanup expired codes (older than 1 hour)
CREATE INDEX IF NOT EXISTS idx_memory_verification_codes_expires
  ON memory_verification_codes(expires_at);

-- RLS policies
ALTER TABLE conversation_memory_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_verification_codes ENABLE ROW LEVEL SECURITY;

-- Chatbot owners can manage email mappings
CREATE POLICY "Chatbot owners can manage memory emails"
  ON conversation_memory_emails
  FOR ALL
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Chatbot owners can manage verification codes
CREATE POLICY "Chatbot owners can manage verification codes"
  ON memory_verification_codes
  FOR ALL
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Service role (admin client) needs full access for widget API operations
-- These are accessed via the admin client which bypasses RLS, so no additional policies needed.
