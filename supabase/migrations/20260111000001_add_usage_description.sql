-- Add usage_description column to subscription_plans table
-- This field stores text like "~50 emails or ~20 proposals" shown on upgrade page

ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS usage_description text;

-- Add comment for documentation
COMMENT ON COLUMN subscription_plans.usage_description IS 'Usage context text shown below credits on upgrade page (e.g., "~50 emails or ~20 proposals")';

-- Set default values for existing plans
UPDATE subscription_plans
SET usage_description = CASE
  WHEN slug = 'free' THEN '~50 emails or ~20 proposals'
  WHEN slug = 'pro' THEN '~500 emails or ~200 proposals'
  WHEN slug = 'enterprise' THEN 'No limits on usage'
  ELSE NULL
END
WHERE usage_description IS NULL;
