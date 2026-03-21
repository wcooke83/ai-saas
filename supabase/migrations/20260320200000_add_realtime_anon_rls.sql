-- Migration: Add anon-friendly RLS policies for Supabase Realtime subscriptions
-- The chat widget is public-facing and uses the anon key for Realtime.
-- Supabase Realtime requires SELECT access on the table for the subscribing role.
-- Conversation IDs are UUIDs (unguessable), but we still limit exposure:
-- anon can only read messages/handoff sessions where handoff_active is true on the conversation.

-- Ensure RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Anon can read messages only for conversations with active handoffs
CREATE POLICY "Anon can read messages for active handoffs"
  ON messages FOR SELECT TO anon
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE handoff_active = true
    )
  );

-- Anon can read handoff sessions that are pending or active (not resolved history)
CREATE POLICY "Anon can read active handoff sessions"
  ON telegram_handoff_sessions FOR SELECT TO anon
  USING (status IN ('pending', 'active'));

-- Anon can read conversations only when handoff is active
CREATE POLICY "Anon can read conversations with active handoff"
  ON conversations FOR SELECT TO anon
  USING (handoff_active = true);

-- Authenticated users (chatbot owners) need full access to conversations and messages
-- for the dashboard. These may already exist via service_role policies, but add
-- explicit authenticated role policies to be safe.
CREATE POLICY "Authenticated users can read own chatbot conversations"
  ON conversations FOR SELECT TO authenticated
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can read own chatbot messages"
  ON messages FOR SELECT TO authenticated
  USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
  );
