-- Add plan feature gate columns to subscription_plans.
-- Columns that did not previously exist: chatbots_limit, knowledge_sources_limit,
-- max_file_size_bytes, telegram_enabled, whatsapp_enabled, discord_enabled,
-- teams_enabled, custom_branding_enabled.

ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS chatbots_limit            integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS knowledge_sources_limit   integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS max_file_size_bytes       bigint  NOT NULL DEFAULT 5242880,  -- 5 MB
  ADD COLUMN IF NOT EXISTS telegram_enabled          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled          boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS discord_enabled           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS teams_enabled             boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_branding_enabled   boolean NOT NULL DEFAULT false;

-- ──────────────────────────────────────────────
-- Backfill from CHATBOT_PLAN_LIMITS constant values
-- ──────────────────────────────────────────────

-- free: 1 chatbot, 3 sources, 5 MB, no integrations
UPDATE subscription_plans SET
  chatbots_limit          = 1,
  knowledge_sources_limit = 3,
  max_file_size_bytes     = 5242880,
  telegram_enabled        = false,
  whatsapp_enabled        = false,
  discord_enabled         = false,
  teams_enabled           = false,
  custom_branding_enabled = false
WHERE slug = 'free';

-- base: 5 chatbots, 10 sources, 10 MB, telegram only
UPDATE subscription_plans SET
  chatbots_limit          = 5,
  knowledge_sources_limit = 10,
  max_file_size_bytes     = 10485760,
  telegram_enabled        = true,
  whatsapp_enabled        = false,
  discord_enabled         = false,
  teams_enabled           = false,
  custom_branding_enabled = false
WHERE slug = 'base';

-- pro: 10 chatbots, 50 sources, 25 MB, all integrations, branding removal
UPDATE subscription_plans SET
  chatbots_limit          = 10,
  knowledge_sources_limit = 50,
  max_file_size_bytes     = 26214400,
  telegram_enabled        = true,
  whatsapp_enabled        = true,
  discord_enabled         = true,
  teams_enabled           = true,
  custom_branding_enabled = true
WHERE slug = 'pro';

-- enterprise: unlimited chatbots/sources, 100 MB, all integrations
UPDATE subscription_plans SET
  chatbots_limit          = -1,
  knowledge_sources_limit = -1,
  max_file_size_bytes     = 104857600,
  telegram_enabled        = true,
  whatsapp_enabled        = true,
  discord_enabled         = true,
  teams_enabled           = true,
  custom_branding_enabled = true
WHERE slug = 'enterprise';

-- agency: unlimited chatbots/sources, 100 MB, all integrations
UPDATE subscription_plans SET
  chatbots_limit          = -1,
  knowledge_sources_limit = -1,
  max_file_size_bytes     = 104857600,
  telegram_enabled        = true,
  whatsapp_enabled        = true,
  discord_enabled         = true,
  teams_enabled           = true,
  custom_branding_enabled = true
WHERE slug = 'agency';

-- lifetime tiers: 10 chatbots, 50 sources, 25 MB, telegram+whatsapp, custom branding
UPDATE subscription_plans SET
  chatbots_limit          = 10,
  knowledge_sources_limit = 50,
  max_file_size_bytes     = 26214400,
  telegram_enabled        = true,
  whatsapp_enabled        = true,
  discord_enabled         = false,
  teams_enabled           = false,
  custom_branding_enabled = true
WHERE slug LIKE 'lifetime%';
