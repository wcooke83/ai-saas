-- Composite index for model filter queries
-- Covers: WHERE chatbot_id = ? AND created_at >= ? AND model = ?
CREATE INDEX IF NOT EXISTS idx_chat_perf_chatbot_model_created
  ON chat_performance_log (chatbot_id, model, created_at DESC);

-- Partial index for live_fetch_triggered filter (sparse — most rows are false)
-- Covers: WHERE chatbot_id = ? AND created_at >= ? AND live_fetch_triggered = true
CREATE INDEX IF NOT EXISTS idx_chat_perf_chatbot_livefetch_created
  ON chat_performance_log (chatbot_id, created_at DESC)
  WHERE live_fetch_triggered = true;

-- Index for the backfill join: conversation_id lookups on perf log
CREATE INDEX IF NOT EXISTS idx_chat_perf_conversation
  ON chat_performance_log (conversation_id)
  WHERE conversation_id IS NOT NULL;
