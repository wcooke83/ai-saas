-- Add transcript_config to chatbots table
-- Allows chatbot owners to enable/disable email transcript feature
-- email_mode: 'ask' (prompt visitor for email) or 'pre_chat' (use email from pre-chat form/SDK)
ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS transcript_config jsonb NOT NULL DEFAULT '{"enabled": false, "email_mode": "ask"}'::jsonb;
