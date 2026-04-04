ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS sms_config jsonb
  DEFAULT '{"enabled": false}'::jsonb;
