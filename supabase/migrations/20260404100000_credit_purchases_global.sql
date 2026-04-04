-- Allow credit_purchases.chatbot_id to be NULL for global (user-level) top-up purchases.
-- Also add a purchase_type index for webhook lookups.

ALTER TABLE credit_purchases ALTER COLUMN chatbot_id DROP NOT NULL;

-- Index to look up purchases by payment intent (webhook handler)
CREATE INDEX IF NOT EXISTS idx_credit_purchases_stripe_payment_intent_id
  ON credit_purchases (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Index for user-level purchase history
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id_purchase_type
  ON credit_purchases (user_id, purchase_type);
