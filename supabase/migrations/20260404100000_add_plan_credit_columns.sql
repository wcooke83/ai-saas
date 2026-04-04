-- Migration: Add credit-based billing columns to subscription_plans
-- Adds chatbot/knowledge-source limits, LTD flag, Stripe product ref, and auto-topup flag.

ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS chatbots_limit          int  NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS knowledge_sources_limit int  NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_ltd                  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_product_id       text,
  ADD COLUMN IF NOT EXISTS auto_topup_allowed      boolean NOT NULL DEFAULT true;

-- Backfill from CHATBOT_PLAN_LIMITS constant in src/lib/chatbots/types.ts
UPDATE subscription_plans SET chatbots_limit = 1,  knowledge_sources_limit = 3   WHERE slug = 'free';
UPDATE subscription_plans SET chatbots_limit = 3,  knowledge_sources_limit = 10  WHERE slug = 'base';
UPDATE subscription_plans SET chatbots_limit = 10, knowledge_sources_limit = 50  WHERE slug = 'pro';
UPDATE subscription_plans SET chatbots_limit = -1, knowledge_sources_limit = -1  WHERE slug = 'enterprise';
-- agency slug maps to unlimited as well
UPDATE subscription_plans SET chatbots_limit = -1, knowledge_sources_limit = -1  WHERE slug = 'agency';
