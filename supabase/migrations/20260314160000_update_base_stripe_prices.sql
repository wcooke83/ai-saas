-- Update Base plan with pricing and Stripe Price IDs created on 2025-03-14
UPDATE subscription_plans 
SET 
  price_monthly_cents = 2900,
  price_yearly_cents = 29000,
  stripe_price_id_monthly = 'price_1TAlIYKBacEv0jAieWcmy07o',
  stripe_price_id_yearly = 'price_1TAlIZKBacEv0jAiMX2AEJEK',
  updated_at = NOW()
WHERE slug = 'base';
