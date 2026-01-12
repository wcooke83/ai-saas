-- Add raw AI prompt/response fields to api_logs table
ALTER TABLE api_logs
ADD COLUMN IF NOT EXISTS raw_ai_prompt TEXT,
ADD COLUMN IF NOT EXISTS raw_ai_response TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
