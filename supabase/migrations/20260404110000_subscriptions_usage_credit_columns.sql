-- Migration: Add credit rollover banking to subscriptions; deduplicate usage and add unique constraint.
-- Also adds UI snapshot columns to usage for the credit meter.

-- ── subscriptions ──────────────────────────────────────────────────────────────
-- credits_banked: unused plan credits rolled over from prior period
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS credits_banked int NOT NULL DEFAULT 0;

-- Note: ltd_id FK added after ltds table is created in migration 20260404130000.

-- ── usage (dedup + unique constraint) ─────────────────────────────────────────
-- The usage table has no UNIQUE constraint on user_id yet (isOneToOne: false in types).
-- Keep only the most-recently-created row per user, then enforce uniqueness.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'usage_user_id_unique'
      AND conrelid = 'usage'::regclass
  ) THEN
    -- Dedup: delete all but the most recent row per user
    DELETE FROM usage
    WHERE id NOT IN (
      SELECT DISTINCT ON (user_id) id
      FROM usage
      ORDER BY user_id, created_at DESC NULLS LAST
    );

    ALTER TABLE usage ADD CONSTRAINT usage_user_id_unique UNIQUE (user_id);
  END IF;
END;
$$;

-- UI snapshot columns: written by the webhook handler after each credit event
-- so the credit meter can read a single row without joining.
ALTER TABLE usage
  ADD COLUMN IF NOT EXISTS purchased_credits_snapshot int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_available_snapshot   int NOT NULL DEFAULT 0;
