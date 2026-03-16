-- Add sentiment analysis and visitor loyalty tracking

-- 1. Add sentiment columns to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment_score smallint;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment_label text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment_summary text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment_analyzed_at timestamptz;

-- Add check constraint for valid sentiment scores (1-5)
ALTER TABLE conversations ADD CONSTRAINT chk_sentiment_score
  CHECK (sentiment_score IS NULL OR (sentiment_score >= 1 AND sentiment_score <= 5));

-- Add check constraint for valid sentiment labels
ALTER TABLE conversations ADD CONSTRAINT chk_sentiment_label
  CHECK (sentiment_label IS NULL OR sentiment_label IN ('very_negative', 'negative', 'neutral', 'positive', 'very_positive'));

-- Index for finding unanalyzed conversations
CREATE INDEX IF NOT EXISTS idx_conversations_sentiment_unanalyzed
  ON conversations(chatbot_id, sentiment_analyzed_at)
  WHERE sentiment_analyzed_at IS NULL;

-- Index for sentiment analytics queries
CREATE INDEX IF NOT EXISTS idx_conversations_sentiment_chatbot
  ON conversations(chatbot_id, sentiment_analyzed_at, sentiment_score)
  WHERE sentiment_analyzed_at IS NOT NULL;

-- 2. Create visitor_loyalty table
CREATE TABLE IF NOT EXISTS visitor_loyalty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  loyalty_score smallint NOT NULL DEFAULT 3,
  loyalty_trend text NOT NULL DEFAULT 'stable',
  total_sessions integer NOT NULL DEFAULT 0,
  avg_sentiment numeric(3,2) NOT NULL DEFAULT 0,
  last_sentiment_score smallint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, visitor_id)
);

-- Check constraints
ALTER TABLE visitor_loyalty ADD CONSTRAINT chk_loyalty_score
  CHECK (loyalty_score >= 1 AND loyalty_score <= 5);

ALTER TABLE visitor_loyalty ADD CONSTRAINT chk_loyalty_trend
  CHECK (loyalty_trend IN ('improving', 'stable', 'declining'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_visitor_loyalty_chatbot
  ON visitor_loyalty(chatbot_id);

CREATE INDEX IF NOT EXISTS idx_visitor_loyalty_chatbot_visitor
  ON visitor_loyalty(chatbot_id, visitor_id);

-- RLS policies
ALTER TABLE visitor_loyalty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chatbot owners can manage visitor loyalty"
  ON visitor_loyalty
  FOR ALL
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  )
  WITH CHECK (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role full access to visitor_loyalty"
  ON visitor_loyalty
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
