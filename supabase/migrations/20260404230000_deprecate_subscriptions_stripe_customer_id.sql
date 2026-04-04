-- stripe_customer_id is now authoritative in user_credits.
-- Keeping column for backward compat but it is no longer written to.
-- Safe to drop in a future migration after confirming no reads remain.
COMMENT ON COLUMN subscriptions.stripe_customer_id IS
  'DEPRECATED: Use user_credits.stripe_customer_id. This column is no longer written to as of 2026-04-04.';
