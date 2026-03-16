-- Add lifetime pricing support to subscription_plans
-- This allows plans to have a one-off cost (e.g., for AppSumo/marketplace sales)

ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS price_lifetime_cents INTEGER;

COMMENT ON COLUMN subscription_plans.price_lifetime_cents IS 'One-time price in cents for lifetime plans (e.g., AppSumo deals). NULL for subscription-based plans.';
