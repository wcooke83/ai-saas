-- Migration: Create ltds and ltd_redemptions tables.
-- Also backfills ltd_id FK onto subscriptions now that ltds exists.

-- ── ltds ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ltds (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    text        NOT NULL UNIQUE,
  name                    text        NOT NULL,
  plan_id                 uuid        NOT NULL REFERENCES subscription_plans(id),
  price_cents             int         NOT NULL,
  stripe_product_id       text,
  stripe_price_id         text,
  credits_monthly         int         NOT NULL,
  chatbots_limit          int         NOT NULL DEFAULT 2,
  knowledge_sources_limit int         NOT NULL DEFAULT 5,
  is_active               boolean     NOT NULL DEFAULT true,
  max_redemptions         int,
  redemptions_count       int         NOT NULL DEFAULT 0,
  source                  text        NOT NULL DEFAULT 'direct',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ltds_active ON ltds (is_active);

ALTER TABLE ltds ENABLE ROW LEVEL SECURITY;

-- Public can read active LTD offers (pricing page)
CREATE POLICY ltds_public_read ON ltds
  FOR SELECT USING (is_active = true);

-- ── ltd_redemptions ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ltd_redemptions (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ltd_id                   uuid        NOT NULL REFERENCES ltds(id),
  stripe_payment_intent_id text,
  external_order_id        text,
  redeemed_at              timestamptz NOT NULL DEFAULT now(),
  status                   text        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'refunded', 'revoked')),
  CONSTRAINT ltd_redemptions_user_ltd_unique UNIQUE (user_id, ltd_id)
);

CREATE INDEX IF NOT EXISTS idx_ltd_redemptions_user ON ltd_redemptions (user_id);
CREATE INDEX IF NOT EXISTS idx_ltd_redemptions_ltd  ON ltd_redemptions (ltd_id);
CREATE INDEX IF NOT EXISTS idx_ltd_redemptions_ext  ON ltd_redemptions (external_order_id)
  WHERE external_order_id IS NOT NULL;

ALTER TABLE ltd_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own redemptions
CREATE POLICY ltd_red_user_read ON ltd_redemptions
  FOR SELECT USING (user_id = auth.uid());

-- ── subscriptions.ltd_id (FK now that ltds exists) ────────────────────────────
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS ltd_id uuid REFERENCES ltds(id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_ltd ON subscriptions (ltd_id)
  WHERE ltd_id IS NOT NULL;

-- Mark any existing LTD plans in subscription_plans
UPDATE subscription_plans
  SET is_ltd = true
  WHERE slug LIKE 'ltd%' OR slug LIKE 'appsumo%';
