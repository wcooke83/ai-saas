-- Migration: Create credit_top_up_packs table (platform-wide top-up offers).
-- Also backfills auto_topup_pack_id FK onto user_credits now that the table exists.

-- ── credit_top_up_packs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS credit_top_up_packs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        NOT NULL UNIQUE,
  name            text        NOT NULL,
  description     text,
  credits         int         NOT NULL CHECK (credits > 0),
  price_cents     int         NOT NULL CHECK (price_cents > 0),
  stripe_price_id text,
  bonus_pct       numeric(5,2) NOT NULL DEFAULT 0,
  is_active       boolean     NOT NULL DEFAULT true,
  is_featured     boolean     NOT NULL DEFAULT false,
  display_order   int         NOT NULL DEFAULT 0,
  min_plan_slug   text        REFERENCES subscription_plans(slug),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ctup_active_order ON credit_top_up_packs (is_active, display_order);

ALTER TABLE credit_top_up_packs ENABLE ROW LEVEL SECURITY;

-- Public can read active packs (pricing UI + widget)
CREATE POLICY ctup_public_read ON credit_top_up_packs
  FOR SELECT USING (is_active = true);

-- ── Seed the 4 initial packs ───────────────────────────────────────────────────
INSERT INTO credit_top_up_packs (slug, name, description, credits, price_cents, bonus_pct, is_active, is_featured, display_order)
VALUES
  ('starter_100',  'Starter', '100 credits',        100,   500,   0,  true, false, 1),
  ('growth_500',   'Growth',  '500 + 10% bonus',    500,   2000,  10, true, true,  2),
  ('scale_2000',   'Scale',   '2,000 + 20% bonus',  2000,  6000,  20, true, false, 3),
  ('agency_10000', 'Agency',  '10,000 + 25% bonus', 10000, 20000, 25, true, false, 4)
ON CONFLICT (slug) DO NOTHING;

-- ── Add auto_topup_pack_id to user_credits (FK now that table exists) ──────────
ALTER TABLE user_credits
  ADD COLUMN IF NOT EXISTS auto_topup_pack_id uuid REFERENCES credit_top_up_packs(id);
