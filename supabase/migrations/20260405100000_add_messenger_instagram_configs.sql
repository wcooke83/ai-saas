ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS messenger_config jsonb DEFAULT '{"enabled": false}'::jsonb;

ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS instagram_config jsonb DEFAULT '{"enabled": false}'::jsonb;

-- Functional indexes for routing-by-page-id lookups (webhook has no chatbotId in URL)
CREATE INDEX IF NOT EXISTS idx_chatbots_messenger_page_id
  ON chatbots ((messenger_config->>'page_id'))
  WHERE messenger_config->>'page_id' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_chatbots_instagram_id
  ON chatbots ((instagram_config->>'instagram_id'))
  WHERE instagram_config->>'instagram_id' IS NOT NULL;
