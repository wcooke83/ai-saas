-- Remove trial days from Pro plan (trials managed via /admin/trials page)
UPDATE subscription_plans 
SET 
  trial_days = 0,
  updated_at = NOW()
WHERE slug = 'pro';
