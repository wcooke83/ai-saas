-- Migration: Add per-provider token multipliers
-- Allows different billing multipliers for each AI provider

-- Add new columns for per-provider multipliers
ALTER TABLE app_settings
ADD COLUMN IF NOT EXISTS multiplier_claude DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS multiplier_openai DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS multiplier_local DECIMAL(5,2) DEFAULT 1.0;

-- Migrate existing token_multiplier value to Claude (since that was the primary provider)
UPDATE app_settings
SET multiplier_claude = COALESCE(token_multiplier, 1.0),
    multiplier_openai = COALESCE(token_multiplier, 1.0),
    multiplier_local = COALESCE(token_multiplier, 1.0);

-- Add comment explaining the columns
COMMENT ON COLUMN app_settings.multiplier_claude IS 'Token multiplier for Claude/Anthropic API calls';
COMMENT ON COLUMN app_settings.multiplier_openai IS 'Token multiplier for OpenAI API calls';
COMMENT ON COLUMN app_settings.multiplier_local IS 'Token multiplier for local AI API calls';
