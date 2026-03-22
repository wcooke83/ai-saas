-- Recreate match_knowledge_chunks with ef_search tuning for better HNSW recall.
-- Also serves as the canonical tracked migration for this RPC (previously untracked).
-- Setting ef_search = 100 (up from default 40) gives ~5-10% better recall on
-- borderline queries with <5ms additional latency.

-- Drop existing functions first (signature changed from sql to plpgsql)
DROP FUNCTION IF EXISTS match_knowledge_chunks(UUID, vector(1536), FLOAT, INT);
DROP FUNCTION IF EXISTS match_priority_knowledge_chunks(UUID, vector(1536), FLOAT, INT, UUID[]);

CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  p_chatbot_id UUID,
  p_query_embedding vector(1536),
  p_match_threshold FLOAT,
  p_match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  SET LOCAL hnsw.ef_search = 100;
  RETURN QUERY
    SELECT
      kc.id,
      kc.content,
      1 - (kc.embedding <=> p_query_embedding) AS similarity,
      kc.metadata
    FROM knowledge_chunks kc
    WHERE
      kc.chatbot_id = p_chatbot_id
      AND 1 - (kc.embedding <=> p_query_embedding) > p_match_threshold
    ORDER BY kc.embedding <=> p_query_embedding ASC
    LIMIT p_match_count;
END;
$$;

-- Update match_priority_knowledge_chunks with the same ef_search tuning.
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
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  SET LOCAL hnsw.ef_search = 100;
  RETURN QUERY
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
END;
$$;
