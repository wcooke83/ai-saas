-- Enable Supabase Realtime on knowledge_sources for live processing status updates
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_sources;

-- Ensure RLS is enabled
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;

-- Chatbot owners can read their own knowledge sources (needed for Realtime subscriptions)
CREATE POLICY "Authenticated users can read own chatbot knowledge sources"
  ON knowledge_sources FOR SELECT TO authenticated
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );
