-- Add local_api_key column to app_settings for API authentication
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS local_api_key text DEFAULT NULL;
