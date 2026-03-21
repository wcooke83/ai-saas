-- Add configurable session TTL (hours) to chatbots
-- Controls how long a chat session remains active before expiring
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS session_ttl_hours integer NOT NULL DEFAULT 24;
