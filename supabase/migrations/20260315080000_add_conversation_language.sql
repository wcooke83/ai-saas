-- Add language column to conversations table to track active language per conversation
-- This allows users to switch languages mid-conversation

ALTER TABLE conversations
ADD COLUMN language text;

-- Add index for faster queries
CREATE INDEX idx_conversations_language ON conversations(language);
