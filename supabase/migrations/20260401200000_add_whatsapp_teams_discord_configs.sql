-- Migration: Add WhatsApp, Teams, and Discord integration config columns
-- Matches the pattern of telegram_config on the chatbots table

-- WhatsApp Business Cloud API config
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS whatsapp_config jsonb DEFAULT '{"enabled": false}'::jsonb;

-- Microsoft Teams Bot Framework config
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS teams_config jsonb DEFAULT '{"enabled": false}'::jsonb;

-- Discord Interactions config (replace minimal column if it exists without default)
DO $$
BEGIN
  -- If discord_config exists but has no default, set it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chatbots'
      AND column_name = 'discord_config'
  ) THEN
    ALTER TABLE chatbots ALTER COLUMN discord_config SET DEFAULT '{"enabled": false}'::jsonb;
    UPDATE chatbots SET discord_config = '{"enabled": false}'::jsonb WHERE discord_config IS NULL;
  ELSE
    ALTER TABLE chatbots ADD COLUMN discord_config jsonb DEFAULT '{"enabled": false}'::jsonb;
  END IF;
END $$;
