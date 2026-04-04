-- Migration: Create user_credit_top_ups and processed_payment_intents tables.
-- user_credit_top_ups: ledger of every credit purchase (manual, auto, gifted, admin).
-- processed_payment_intents: idempotency guard for Stripe webhook handlers.

-- ── user_credit_top_ups ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_credit_top_ups (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id                  uuid        REFERENCES credit_top_up_packs(id),
  credits_purchased        int         NOT NULL,
  bonus_credits            int         NOT NULL DEFAULT 0,
  price_paid_cents         int         NOT NULL,
  stripe_payment_intent_id text,
  stripe_invoice_id        text,
  type                     text        NOT NULL DEFAULT 'manual'
    CHECK (type IN ('manual', 'auto_topup', 'gifted', 'admin')),
  status                   text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uctu_user_id ON user_credit_top_ups (user_id);
CREATE INDEX IF NOT EXISTS idx_uctu_status  ON user_credit_top_ups (status);

-- Ensure each payment intent maps to exactly one top-up row
CREATE UNIQUE INDEX IF NOT EXISTS idx_uctu_pi_unique ON user_credit_top_ups (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

ALTER TABLE user_credit_top_ups ENABLE ROW LEVEL SECURITY;

-- Users can read their own top-up history
CREATE POLICY uctu_user_read ON user_credit_top_ups
  FOR SELECT USING (user_id = auth.uid());

-- ── processed_payment_intents ──────────────────────────────────────────────────
-- Idempotency store: webhook handlers insert here before processing.
-- A duplicate INSERT (on conflict) means the event was already handled.
CREATE TABLE IF NOT EXISTS processed_payment_intents (
  stripe_payment_intent_id text        PRIMARY KEY,
  user_id                  uuid,
  processed_at             timestamptz NOT NULL DEFAULT now(),
  event_type               text
);

CREATE INDEX IF NOT EXISTS idx_ppi_user ON processed_payment_intents (user_id);
