-- Add content_hash for deduplication of knowledge chunks across sources
ALTER TABLE knowledge_chunks
  ADD COLUMN IF NOT EXISTS content_hash text;

-- Index for fast dedup lookups per chatbot
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_chatbot_hash
  ON knowledge_chunks (chatbot_id, content_hash);
