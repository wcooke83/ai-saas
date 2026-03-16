-- Fix Pro plan yearly Stripe Price ID (correcting typo)
UPDATE subscription_plans 
SET 
  stripe_price_id_yearly = 'price_1TAl9jKBacEv0jAi1KYc8hQ3',
  updated_at = NOW()
WHERE slug = 'pro';
