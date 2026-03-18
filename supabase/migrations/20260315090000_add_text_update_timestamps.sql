-- Add timestamp columns to track when custom text and language were last updated
-- This allows us to show language mismatch warnings only when relevant

ALTER TABLE chatbots
ADD COLUMN IF NOT EXISTS custom_text_updated_at timestamptz,
ADD COLUMN IF NOT EXISTS language_updated_at timestamptz;

-- Set initial values: custom_text_updated_at to created_at for existing chatbots with custom text
UPDATE chatbots
SET custom_text_updated_at = created_at
WHERE welcome_message IS NOT NULL 
   OR placeholder_text IS NOT NULL 
   OR (pre_chat_form_config IS NOT NULL AND pre_chat_form_config::text != '{}'::text)
   OR (post_chat_survey_config IS NOT NULL AND post_chat_survey_config::text != '{}'::text);

-- Set initial values: language_updated_at to created_at for all existing chatbots
UPDATE chatbots
SET language_updated_at = created_at;

-- Add comment explaining the purpose
COMMENT ON COLUMN chatbots.custom_text_updated_at IS 'Timestamp of last update to welcome_message, placeholder_text, pre_chat_form_config, or post_chat_survey_config';
COMMENT ON COLUMN chatbots.language_updated_at IS 'Timestamp of last language change';
