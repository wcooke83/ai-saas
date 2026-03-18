-- Add conversation memory support for cross-session context

-- 1. Add summary column to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS summary text;

-- 2. Add memory settings to chatbots table
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS memory_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS memory_days integer NOT NULL DEFAULT 30;

-- 3. Create conversation_memory table for persistent cross-session memory
CREATE TABLE IF NOT EXISTS conversation_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  key_facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  last_accessed timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, visitor_id)
);

-- Index for fast lookup by chatbot + visitor
CREATE INDEX IF NOT EXISTS idx_conversation_memory_chatbot_visitor
  ON conversation_memory(chatbot_id, visitor_id);

-- Index for cleanup of expired memory
CREATE INDEX IF NOT EXISTS idx_conversation_memory_last_accessed
  ON conversation_memory(last_accessed);

-- RLS policies for conversation_memory
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;

-- Chatbot owners can read/manage memory for their chatbots
DROP POLICY IF EXISTS "Chatbot owners can manage memory" ON conversation_memory;
CREATE POLICY "Chatbot owners can manage memory"
  ON conversation_memory
  FOR ALL
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Service role (admin) can do everything (for the chat API which uses admin client)
DROP POLICY IF EXISTS "Service role full access to conversation_memory" ON conversation_memory;
CREATE POLICY "Service role full access to conversation_memory"
  ON conversation_memory
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
