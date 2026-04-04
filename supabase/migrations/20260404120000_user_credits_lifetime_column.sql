-- Migration: Add lifetime_credits tracking to user_credits.
-- auto_topup_pack_id FK is added after credit_top_up_packs is created in migration 20260404130000.

ALTER TABLE user_credits
  ADD COLUMN IF NOT EXISTS lifetime_credits int NOT NULL DEFAULT 0;
