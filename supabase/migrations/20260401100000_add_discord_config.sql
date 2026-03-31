-- Discord integration config (JSONB, same pattern as telegram_config)
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS discord_config jsonb;
