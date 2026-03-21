-- Finding #19: Make live fetch confidence threshold configurable per chatbot
-- Default 0.80 (was hardcoded at 0.90 which triggered unnecessary live fetches)
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS live_fetch_threshold float DEFAULT 0.80;
