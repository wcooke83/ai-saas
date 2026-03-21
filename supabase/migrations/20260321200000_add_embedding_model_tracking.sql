-- Track which embedding model was used for each knowledge source
-- This prevents query/chunk embedding model mismatches (P0 bug)
ALTER TABLE knowledge_sources
  ADD COLUMN IF NOT EXISTS embedding_provider text,
  ADD COLUMN IF NOT EXISTS embedding_model text;

-- Backfill: all existing completed sources were embedded with OpenAI ada-002
UPDATE knowledge_sources
SET embedding_provider = 'openai',
    embedding_model = 'text-embedding-ada-002'
WHERE status = 'completed'
  AND embedding_provider IS NULL
  AND chunks_count > 0;
