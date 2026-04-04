-- Add onboarding tracking columns to profiles.
-- onboarding_completed_at: set when the user finishes (or skips) the wizard.
-- onboarding_step: mirrors chatbots.onboarding_step for user-level tracking.
-- Existing rows get NULL for both (treated as pre-wizard users who are already active).
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_step         int NOT NULL DEFAULT 1;

COMMENT ON COLUMN profiles.onboarding_completed_at IS
  'Set when the user finishes or explicitly skips the onboarding wizard. NULL = wizard not yet complete.';

COMMENT ON COLUMN profiles.onboarding_step IS
  'Last wizard step reached by this user (1-5). Used for resuming if chatbot record is unavailable.';
