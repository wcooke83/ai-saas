ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS email_config jsonb
  DEFAULT '{"enabled": false}'::jsonb;

CREATE TABLE IF NOT EXISTS email_threads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id      uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  thread_id       text NOT NULL,   -- normalized root Message-ID (no angle brackets)
  session_id      text NOT NULL,   -- "email_{thread_id}"
  sender_email    text NOT NULL,
  subject         text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, thread_id)
);

CREATE INDEX IF NOT EXISTS email_threads_chatbot_thread
  ON email_threads (chatbot_id, thread_id);

ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
