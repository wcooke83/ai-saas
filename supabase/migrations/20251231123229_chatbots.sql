-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- CHATBOTS TABLE
-- ============================================
CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,

  -- AI Configuration
  system_prompt TEXT NOT NULL DEFAULT 'You are a helpful AI assistant. Answer questions based on the provided context. If you don''t know the answer, say so.',
  model VARCHAR(50) DEFAULT 'claude-3-haiku-20240307',
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1024,

  -- Widget Configuration (stored as JSONB for flexibility)
  widget_config JSONB DEFAULT '{
    "position": "bottom-right",
    "offsetX": 20,
    "offsetY": 20,
    "width": 380,
    "height": 600,
    "buttonSize": 60,
    "primaryColor": "#0ea5e9",
    "secondaryColor": "#f0f9ff",
    "backgroundColor": "#ffffff",
    "textColor": "#0f172a",
    "userBubbleColor": "#0ea5e9",
    "botBubbleColor": "#f1f5f9",
    "fontFamily": "Inter, system-ui, sans-serif",
    "fontSize": 14,
    "showBranding": true,
    "headerText": "Chat with us",
    "autoOpen": false,
    "autoOpenDelay": 3000,
    "soundEnabled": false,
    "customCss": ""
  }'::jsonb,

  -- Branding
  logo_url TEXT,
  welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
  placeholder_text VARCHAR(200) DEFAULT 'Type your message...',

  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  is_published BOOLEAN DEFAULT false,

  -- Limits
  monthly_message_limit INTEGER DEFAULT 1000,
  messages_this_month INTEGER DEFAULT 0,

  -- Billing (for per-chatbot pricing)
  pricing_type VARCHAR(20) DEFAULT 'included' CHECK (pricing_type IN ('included', 'per_chatbot')),
  stripe_product_id VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

CREATE INDEX idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX idx_chatbots_status ON chatbots(status) WHERE status = 'active';
CREATE INDEX idx_chatbots_slug ON chatbots(slug);

-- ============================================
-- KNOWLEDGE SOURCES TABLE
-- ============================================
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,

  type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'url', 'qa_pair', 'text')),
  name VARCHAR(255) NOT NULL,

  -- Source-specific data
  content TEXT,  -- For text/qa_pair types
  file_path TEXT,  -- For document uploads (Supabase Storage)
  file_type VARCHAR(50),  -- pdf, txt, md, docx
  file_size INTEGER,
  url TEXT,  -- For URL scraping

  -- Q&A specific
  question TEXT,  -- For qa_pair type
  answer TEXT,  -- For qa_pair type

  -- Processing status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  chunks_count INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_sources_chatbot ON knowledge_sources(chatbot_id);
CREATE INDEX idx_knowledge_sources_status ON knowledge_sources(status);

-- ============================================
-- KNOWLEDGE CHUNKS TABLE (with vector embeddings)
-- ============================================
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  embedding vector(1536),  -- OpenAI ada-002 dimensions

  -- Chunk metadata
  chunk_index INTEGER NOT NULL,
  token_count INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index (HNSW for better performance)
CREATE INDEX idx_knowledge_chunks_embedding ON knowledge_chunks
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_knowledge_chunks_chatbot ON knowledge_chunks(chatbot_id);
CREATE INDEX idx_knowledge_chunks_source ON knowledge_chunks(source_id);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,

  -- Session info
  session_id VARCHAR(100) NOT NULL,
  channel VARCHAR(20) DEFAULT 'widget' CHECK (channel IN ('widget', 'api', 'slack')),

  -- Visitor info (anonymous)
  visitor_id VARCHAR(100),
  visitor_metadata JSONB DEFAULT '{}'::jsonb,

  -- Conversation state
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),

  -- Analytics
  message_count INTEGER DEFAULT 0,
  first_message_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,

  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_chatbot ON conversations(chatbot_id);
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);
CREATE INDEX idx_conversations_channel ON conversations(channel);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,

  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- AI metadata
  model VARCHAR(50),
  tokens_input INTEGER,
  tokens_output INTEGER,
  latency_ms INTEGER,

  -- Retrieved context (for RAG)
  context_chunks JSONB,  -- Array of chunk IDs used

  -- Feedback
  thumbs_up BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_chatbot ON messages(chatbot_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================
-- CHATBOT API KEYS TABLE
-- ============================================
CREATE TABLE chatbot_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,
  key_hash VARCHAR(64) NOT NULL,

  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['chat'],

  -- Rate limiting
  rate_limit INTEGER DEFAULT 100,  -- requests per minute

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatbot_api_keys_hash ON chatbot_api_keys(key_hash);
CREATE INDEX idx_chatbot_api_keys_chatbot ON chatbot_api_keys(chatbot_id);

-- ============================================
-- SLACK INTEGRATIONS TABLE
-- ============================================
CREATE TABLE slack_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Slack OAuth data
  team_id VARCHAR(50) NOT NULL,
  team_name VARCHAR(100),
  bot_token TEXT NOT NULL,  -- Should be encrypted at app level
  bot_user_id VARCHAR(50),

  -- Configuration
  channel_ids TEXT[],  -- Channels bot responds in
  mention_only BOOLEAN DEFAULT true,  -- Only respond when mentioned

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(chatbot_id, team_id)
);

CREATE INDEX idx_slack_integrations_chatbot ON slack_integrations(chatbot_id);
CREATE INDEX idx_slack_integrations_team ON slack_integrations(team_id);

-- ============================================
-- CHATBOT ANALYTICS TABLE (daily aggregates)
-- ============================================
CREATE TABLE chatbot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,

  date DATE NOT NULL,

  -- Counts
  conversations_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,

  -- Engagement
  avg_messages_per_conversation DECIMAL(5,2),
  avg_response_time_ms INTEGER,

  -- Feedback
  thumbs_up_count INTEGER DEFAULT 0,
  thumbs_down_count INTEGER DEFAULT 0,

  -- Top questions (stored as JSONB array)
  top_questions JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(chatbot_id, date)
);

CREATE INDEX idx_chatbot_analytics_date ON chatbot_analytics(chatbot_id, date DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Chatbots: Users can only access their own chatbots
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;

CREATE POLICY chatbots_select ON chatbots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY chatbots_insert ON chatbots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY chatbots_update ON chatbots
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY chatbots_delete ON chatbots
  FOR DELETE USING (auth.uid() = user_id);

-- Knowledge sources: Access through chatbot ownership
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY knowledge_sources_all ON knowledge_sources
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Knowledge chunks: Same pattern
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY knowledge_chunks_all ON knowledge_chunks
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Conversations: Chatbot owners can view all conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY conversations_select ON conversations
  FOR SELECT USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Allow public insert for widget conversations (no auth required)
CREATE POLICY conversations_insert_public ON conversations
  FOR INSERT WITH CHECK (true);

-- Messages: Same pattern
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_select ON messages
  FOR SELECT USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- Allow public insert for widget messages
CREATE POLICY messages_insert_public ON messages
  FOR INSERT WITH CHECK (true);

-- Chatbot API keys: Owner access only
ALTER TABLE chatbot_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY chatbot_api_keys_all ON chatbot_api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Slack integrations: Owner access only
ALTER TABLE slack_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY slack_integrations_all ON slack_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Analytics: Chatbot owners only
ALTER TABLE chatbot_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY analytics_select ON chatbot_analytics
  FOR SELECT USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Semantic search function for RAG
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  p_chatbot_id UUID,
  p_query_embedding vector(1536),
  p_match_threshold FLOAT DEFAULT 0.7,
  p_match_count INT DEFAULT 5
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
    AND 1 - (kc.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY kc.embedding <=> p_query_embedding ASC
  LIMIT p_match_count;
$$;

-- Increment monthly message count
CREATE OR REPLACE FUNCTION increment_chatbot_messages(
  p_chatbot_id UUID,
  p_amount INT DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chatbots
  SET messages_this_month = messages_this_month + p_amount,
      updated_at = NOW()
  WHERE id = p_chatbot_id;
END;
$$;

-- Reset monthly message counts (called by cron)
CREATE OR REPLACE FUNCTION reset_monthly_message_counts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chatbots
  SET messages_this_month = 0,
      updated_at = NOW();
END;
$$;

-- Increment conversation message count
CREATE OR REPLACE FUNCTION increment_conversation_messages(
  p_conversation_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE conversations
  SET
    message_count = message_count + 1,
    last_message_at = NOW(),
    first_message_at = COALESCE(first_message_at, NOW()),
    updated_at = NOW()
  WHERE id = p_conversation_id;
END;
$$;

-- Aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_chatbot_analytics(p_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO chatbot_analytics (
    chatbot_id,
    date,
    conversations_count,
    messages_count,
    unique_visitors,
    avg_messages_per_conversation,
    thumbs_up_count,
    thumbs_down_count
  )
  SELECT
    c.chatbot_id,
    p_date,
    COUNT(DISTINCT c.id),
    COALESCE(SUM(c.message_count), 0),
    COUNT(DISTINCT c.visitor_id),
    CASE WHEN COUNT(DISTINCT c.id) > 0
         THEN ROUND(AVG(c.message_count)::numeric, 2)
         ELSE 0 END,
    COUNT(CASE WHEN m.thumbs_up = true THEN 1 END),
    COUNT(CASE WHEN m.thumbs_up = false THEN 1 END)
  FROM conversations c
  LEFT JOIN messages m ON m.conversation_id = c.id
  WHERE c.created_at::date = p_date
  GROUP BY c.chatbot_id
  ON CONFLICT (chatbot_id, date)
  DO UPDATE SET
    conversations_count = EXCLUDED.conversations_count,
    messages_count = EXCLUDED.messages_count,
    unique_visitors = EXCLUDED.unique_visitors,
    avg_messages_per_conversation = EXCLUDED.avg_messages_per_conversation,
    thumbs_up_count = EXCLUDED.thumbs_up_count,
    thumbs_down_count = EXCLUDED.thumbs_down_count;
END;
$$;

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_chatbot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chatbots_updated_at
  BEFORE UPDATE ON chatbots
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_updated_at();

CREATE TRIGGER knowledge_sources_updated_at
  BEFORE UPDATE ON knowledge_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_updated_at();

CREATE TRIGGER slack_integrations_updated_at
  BEFORE UPDATE ON slack_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_updated_at();

-- ============================================
-- STORAGE BUCKET FOR KNOWLEDGE BASE FILES
-- ============================================
-- Note: Run this in the Supabase dashboard or via admin API
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('chatbot-knowledge', 'chatbot-knowledge', false);
