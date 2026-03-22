-- Returns conversation and message counts for a list of chatbot IDs in 2 scans
-- instead of 2N queries (N = number of chatbots)
CREATE OR REPLACE FUNCTION get_chatbot_stats(p_chatbot_ids uuid[])
RETURNS TABLE(chatbot_id uuid, conversation_count bigint, message_count bigint)
LANGUAGE sql STABLE
AS $$
  WITH conv_counts AS (
    SELECT c.chatbot_id, count(*) AS cnt
    FROM conversations c
    WHERE c.chatbot_id = ANY(p_chatbot_ids)
    GROUP BY c.chatbot_id
  ),
  msg_counts AS (
    SELECT m.chatbot_id, count(*) AS cnt
    FROM messages m
    WHERE m.chatbot_id = ANY(p_chatbot_ids)
    GROUP BY m.chatbot_id
  )
  SELECT
    u.id AS chatbot_id,
    COALESCE(cc.cnt, 0) AS conversation_count,
    COALESCE(mc.cnt, 0) AS message_count
  FROM unnest(p_chatbot_ids) AS u(id)
  LEFT JOIN conv_counts cc ON cc.chatbot_id = u.id
  LEFT JOIN msg_counts mc ON mc.chatbot_id = u.id;
$$;
