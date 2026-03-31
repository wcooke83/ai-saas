-- WhatsApp integration config (JSONB, same pattern as telegram_config, discord_config)
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS whatsapp_config jsonb;
