CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_chatbot_id UUID,
  p_session_id TEXT,
  p_channel TEXT DEFAULT 'widget',
  p_visitor_id TEXT DEFAULT NULL
)
RETURNS conversations
LANGUAGE plpgsql
AS $$
DECLARE
  conv conversations;
BEGIN
  -- Try to find existing active conversation
  SELECT * INTO conv
  FROM conversations
  WHERE chatbot_id = p_chatbot_id
    AND session_id = p_session_id
    AND status = 'active'
  LIMIT 1;

  IF FOUND THEN
    RETURN conv;
  END IF;

  -- Create new conversation
  INSERT INTO conversations (chatbot_id, session_id, channel, visitor_id)
  VALUES (p_chatbot_id, p_session_id, p_channel, p_visitor_id)
  RETURNING * INTO conv;

  RETURN conv;
END;
$$;
