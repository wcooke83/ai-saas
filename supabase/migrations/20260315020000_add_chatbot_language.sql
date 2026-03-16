-- Add language column to chatbots table for multilingual support
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';
