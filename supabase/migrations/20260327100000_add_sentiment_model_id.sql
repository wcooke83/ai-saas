-- Add sentiment_model_id to app_settings
-- Allows admins to configure which AI model is used for sentiment analysis
-- When NULL, falls back to the system default chat model

ALTER TABLE app_settings
ADD COLUMN IF NOT EXISTS sentiment_model_id uuid REFERENCES ai_models(id) ON DELETE SET NULL;

COMMENT ON COLUMN app_settings.sentiment_model_id IS 'AI model used for sentiment analysis. NULL = use system default chat model.';
