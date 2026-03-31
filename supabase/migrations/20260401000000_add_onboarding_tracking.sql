-- Onboarding wizard step tracking
-- 1 = at name/template step (just created)
-- 2 = at train/knowledge step
-- 3 = at style step
-- 4 = at deploy step
-- NULL = wizard completed or pre-wizard chatbot
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS onboarding_step integer;

-- Milestone timestamps
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS first_knowledge_source_at timestamptz;

ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS first_knowledge_ready_at timestamptz;

-- User-level onboarding milestones
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_milestones jsonb DEFAULT '{}';

-- Index for fast lookup of incomplete onboarding chatbots
CREATE INDEX IF NOT EXISTS idx_chatbots_onboarding_step
  ON chatbots (user_id)
  WHERE onboarding_step IS NOT NULL;

COMMENT ON COLUMN chatbots.onboarding_step IS
  'Current wizard step (1-4). NULL means wizard complete or pre-wizard chatbot.';
