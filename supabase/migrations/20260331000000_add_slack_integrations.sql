-- Create slack_integrations table for Slack bot deployment channel
CREATE TABLE IF NOT EXISTS public.slack_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  team_name TEXT,
  bot_token TEXT NOT NULL,
  bot_user_id TEXT,
  channel_ids TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  mention_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chatbot_id, team_id)
);

-- Index for fast lookups by chatbot
CREATE INDEX idx_slack_integrations_chatbot_id ON public.slack_integrations(chatbot_id);

-- RLS: users can only access their own integrations
ALTER TABLE public.slack_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own slack integrations"
  ON public.slack_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own slack integrations"
  ON public.slack_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own slack integrations"
  ON public.slack_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own slack integrations"
  ON public.slack_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bypass for admin operations (used by handleSlackEvent)
CREATE POLICY "Service role full access"
  ON public.slack_integrations FOR ALL
  USING (auth.role() = 'service_role');
