-- Add user message and assistant response text to performance log
-- for debugging slow requests in the pipeline waterfall view
ALTER TABLE chat_performance_log
  ADD COLUMN IF NOT EXISTS user_message text,
  ADD COLUMN IF NOT EXISTS assistant_response text;
