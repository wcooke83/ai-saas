-- Ensure the free plan is visible and ordered first on the pricing page.
-- Addresses: free plan not rendering due to is_hidden=true or display_order placing it
-- in a wrapped row that was clipped by overflow-hidden on the pricing section.

UPDATE subscription_plans
SET
  is_active    = true,
  is_hidden    = false,
  display_order = 0,
  updated_at   = NOW()
WHERE slug = 'free';
