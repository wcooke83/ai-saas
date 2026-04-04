-- Add slack_enabled column to subscription_plans (missed from initial plan_feature_gates migration).

ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS slack_enabled boolean NOT NULL DEFAULT false;

-- free: no Slack
UPDATE subscription_plans SET slack_enabled = false WHERE slug = 'free';

-- base: Slack enabled (same as telegram per original CHATBOT_PLAN_LIMITS)
UPDATE subscription_plans SET slack_enabled = true WHERE slug = 'base';

-- pro, enterprise, agency: Slack enabled
UPDATE subscription_plans SET slack_enabled = true WHERE slug IN ('pro', 'enterprise', 'agency');

-- lifetime: Slack enabled
UPDATE subscription_plans SET slack_enabled = true WHERE slug LIKE 'lifetime%';
