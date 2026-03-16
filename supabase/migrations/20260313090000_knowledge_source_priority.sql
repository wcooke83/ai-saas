-- Add is_priority flag to knowledge_sources table
-- Priority sources have their chunks always included in AI chat context
ALTER TABLE knowledge_sources
ADD COLUMN IF NOT EXISTS is_priority boolean NOT NULL DEFAULT false;

-- Index for efficient priority source lookup
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_priority
ON knowledge_sources (chatbot_id, is_priority)
WHERE is_priority = true;
