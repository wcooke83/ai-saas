-- Performance timing log for chat API pipeline
-- Used to graph and analyze response time bottlenecks
CREATE TABLE IF NOT EXISTS chat_performance_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Pipeline timings in milliseconds (each is elapsed from request start)
  chatbot_loaded_ms int,
  conversation_ready_ms int,
  history_msg_handoff_ms int,
  attachments_ms int,
  rag_embedding_ms int,
  rag_similarity_ms int,
  rag_live_fetch_ms int,
  rag_total_ms int,
  prompts_built_ms int,
  first_token_ms int,
  stream_complete_ms int,
  total_ms int,

  -- Context metadata
  model text,
  rag_chunks_count int DEFAULT 0,
  rag_confidence real DEFAULT 0,
  live_fetch_triggered boolean DEFAULT false,
  message_length int DEFAULT 0,
  response_length int DEFAULT 0,
  is_streaming boolean DEFAULT true
);

-- Index for querying by chatbot and time range
CREATE INDEX idx_chat_perf_chatbot_created ON chat_performance_log (chatbot_id, created_at DESC);

-- RLS: only chatbot owner can read
ALTER TABLE chat_performance_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chatbot perf logs"
  ON chat_performance_log FOR SELECT
  USING (chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()));
