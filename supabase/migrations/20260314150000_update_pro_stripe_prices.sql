-- Update Pro plan with Stripe Price IDs created on 2025-03-14
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1TAl9jKBacEv0jAi9dqst7BV',
  stripe_price_id_yearly = 'price_1TAl9jKBacEv0jAi1KYc8hQ3',
  updated_at = NOW()
WHERE slug = 'pro';
