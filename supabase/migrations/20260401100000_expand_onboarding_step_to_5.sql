-- Expand onboarding wizard from 4 to 5 steps.
-- New flow: Name (1) -> Train (2) -> Test (3) -> Style (4) -> Deploy (5)
-- Existing chatbots on steps 3 (Style) or 4 (Deploy) need to be shifted up by 1
-- to reflect the new step numbering.

-- Shift step 4 (old Deploy) -> 5 (new Deploy)
UPDATE chatbots SET onboarding_step = 5 WHERE onboarding_step = 4;
-- Shift step 3 (old Style) -> 4 (new Style)
UPDATE chatbots SET onboarding_step = 4 WHERE onboarding_step = 3;
-- Note: steps 1 and 2 are unchanged (Name, Train)
-- New step 3 (Test) is not set on any existing rows; users will naturally
-- land on it when they complete step 2 going forward.

COMMENT ON COLUMN chatbots.onboarding_step IS
  'Current wizard step (1-5). NULL means wizard complete or pre-wizard chatbot.';
