-- Onboarding activation events table
-- Stores one row per milestone per user (idempotency enforced in application layer)

CREATE TABLE IF NOT EXISTS onboarding_activation_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone    text NOT NULL,
  metadata     jsonb,
  occurred_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_oae_user_milestone ON onboarding_activation_events (user_id, milestone);
CREATE INDEX idx_oae_occurred_at    ON onboarding_activation_events (occurred_at DESC);

ALTER TABLE onboarding_activation_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own events; service role handles all writes
CREATE POLICY oae_user_read ON onboarding_activation_events
  FOR SELECT USING (user_id = auth.uid());

-- Add onboarding columns to profiles (parallel migration may have added these already)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_step         integer DEFAULT 1;
