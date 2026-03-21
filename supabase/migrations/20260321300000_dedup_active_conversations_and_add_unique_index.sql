-- Close duplicate active conversations, keeping only the most recent per (chatbot_id, session_id)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY chatbot_id, session_id
           ORDER BY COALESCE(last_message_at, created_at) DESC
         ) AS rn
  FROM conversations
  WHERE status = 'active'
)
UPDATE conversations
SET status = 'closed', updated_at = now()
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Partial unique index: only one active conversation per chatbot + session
-- Allows multiple closed/resolved conversations for the same pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_active_unique
  ON conversations (chatbot_id, session_id)
  WHERE status = 'active';
