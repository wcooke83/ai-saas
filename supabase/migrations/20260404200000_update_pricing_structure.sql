-- Update pricing structure: new tiers, annual pricing (17% off), and feature gates
-- Pro drops from $149/mo to $79/mo. Annual is "2 months free" framing across all paid tiers.
-- NOTE: Stripe price IDs for new prices must be created in Stripe and updated separately.

-- ─────────────────────────────────────────────────────────────────────────────
-- Free plan
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE subscription_plans
SET
  credits_monthly      = 50,
  features             = jsonb_build_object(
    'chatbots',           1,
    'knowledge_sources',  3,
    'team_seats',         1,
    'widget',             true,
    'slack',              false,
    'telegram',           false,
    'whatsapp',           false,
    'discord',            false,
    'teams',              false,
    'branding_removal',   false,
    'api_access',         false,
    'zapier_webhooks',    false,
    'analytics_export',   false,
    'article_generation', false,
    'human_handoff',      false,
    'credit_rollover',    false,
    'priority_support',   false
  ),
  updated_at           = NOW()
WHERE slug = 'free';

-- ─────────────────────────────────────────────────────────────────────────────
-- Base plan — $29/mo | $24/mo billed annually ($290/yr)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE subscription_plans
SET
  price_monthly_cents  = 2900,
  price_yearly_cents   = 29000,   -- $290/yr = $24.17/mo; update when Stripe prices created
  credits_monthly      = 1000,
  features             = jsonb_build_object(
    'chatbots',           3,
    'knowledge_sources',  10,
    'team_seats',         2,
    'widget',             true,
    'slack',              true,
    'telegram',           true,
    'whatsapp',           false,
    'discord',            false,
    'teams',              false,
    'branding_removal',   false,
    'api_access',         false,
    'zapier_webhooks',    'limited',
    'analytics_export',   false,
    'article_generation', false,
    'human_handoff',      false,
    'credit_rollover',    false,
    'priority_support',   false
  ),
  updated_at           = NOW()
WHERE slug = 'base';

-- ─────────────────────────────────────────────────────────────────────────────
-- Pro plan — $79/mo | $66/mo billed annually ($790/yr)
-- Previously $149/mo | $1,430/yr
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE subscription_plans
SET
  price_monthly_cents  = 7900,
  price_yearly_cents   = 79000,   -- $790/yr = $65.83/mo; update when Stripe prices created
  credits_monthly      = 5000,
  is_featured          = true,
  features             = jsonb_build_object(
    'chatbots',           10,
    'knowledge_sources',  -1,
    'team_seats',         5,
    'widget',             true,
    'slack',              true,
    'telegram',           true,
    'whatsapp',           true,
    'discord',            true,
    'teams',              true,
    'branding_removal',   true,
    'api_access',         true,
    'zapier_webhooks',    true,
    'analytics_export',   true,
    'article_generation', true,
    'human_handoff',      true,
    'credit_rollover',    true,
    'priority_support',   false
  ),
  updated_at           = NOW()
WHERE slug = 'pro';

-- ─────────────────────────────────────────────────────────────────────────────
-- Enterprise plan — $249/mo | $207/mo billed annually ($2,490/yr)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE subscription_plans
SET
  price_monthly_cents  = 24900,
  price_yearly_cents   = 249000,  -- $2,490/yr = $207.50/mo; update when Stripe prices created
  credits_monthly      = 25000,
  features             = jsonb_build_object(
    'chatbots',           -1,
    'knowledge_sources',  -1,
    'team_seats',         15,
    'widget',             true,
    'slack',              true,
    'telegram',           true,
    'whatsapp',           true,
    'discord',            true,
    'teams',              true,
    'branding_removal',   true,
    'api_access',         true,
    'zapier_webhooks',    'unlimited',
    'analytics_export',   true,
    'article_generation', true,
    'human_handoff',      true,
    'credit_rollover',    true,
    'priority_support',   true,
    'sla',                true,
    'dedicated_support',  true
  ),
  updated_at           = NOW()
WHERE slug = 'enterprise';
