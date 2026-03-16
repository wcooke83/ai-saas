-- Update Pro plan with correct pricing ($149/mo, $1430/yr) and new Stripe Price IDs
UPDATE subscription_plans 
SET 
  price_monthly_cents = 14900,
  price_yearly_cents = 143000,
  stripe_price_id_monthly = 'price_1TAm95KBacEv0jAiDnJJKyk1',
  stripe_price_id_yearly = 'price_1TAm95KBacEv0jAiQkDD4W8S',
  updated_at = NOW()
WHERE slug = 'pro';
