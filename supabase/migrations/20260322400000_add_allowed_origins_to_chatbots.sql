ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS allowed_origins text[] DEFAULT NULL;
