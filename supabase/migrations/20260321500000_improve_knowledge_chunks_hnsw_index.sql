-- Drop the old standalone HNSW index (no chatbot_id filter)
DROP INDEX IF EXISTS idx_knowledge_chunks_embedding;

-- Create HNSW index with tuned params for better recall at scale
-- ef_construction=128 (build quality), m=16 (graph connectivity)
CREATE INDEX idx_knowledge_chunks_embedding
  ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 128);

-- Composite B-tree index on (chatbot_id, source_id) to support both
-- match_knowledge_chunks and match_priority_knowledge_chunks efficiently.
-- Replaces the old single-column chatbot_id index.
DROP INDEX IF EXISTS idx_knowledge_chunks_chatbot;
CREATE INDEX idx_knowledge_chunks_chatbot_source
  ON knowledge_chunks (chatbot_id, source_id);
