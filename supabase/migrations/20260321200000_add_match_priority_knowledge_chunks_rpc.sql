-- Similarity search scoped to specific source IDs (for priority sources)
-- Instead of brute-force fetching all priority chunks, this applies the same
-- cosine similarity filtering used by match_knowledge_chunks.
CREATE OR REPLACE FUNCTION match_priority_knowledge_chunks(
  p_chatbot_id UUID,
  p_query_embedding vector(1536),
  p_match_threshold FLOAT,
  p_match_count INT,
  p_source_ids UUID[]
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kc.id,
    kc.content,
    1 - (kc.embedding <=> p_query_embedding) AS similarity,
    kc.metadata
  FROM knowledge_chunks kc
  WHERE
    kc.chatbot_id = p_chatbot_id
    AND kc.source_id = ANY(p_source_ids)
    AND 1 - (kc.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY kc.embedding <=> p_query_embedding ASC
  LIMIT p_match_count;
$$;
