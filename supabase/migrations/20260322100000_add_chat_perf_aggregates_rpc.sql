-- RPC to compute performance aggregates in SQL instead of fetching all rows to JS
-- Returns: averages, p95, count, distinct models, and hourly breakdown
CREATE OR REPLACE FUNCTION get_chat_perf_aggregates(
  p_chatbot_id uuid,
  p_since timestamptz,
  p_to timestamptz DEFAULT NULL,
  p_models text[] DEFAULT NULL,
  p_live_fetch boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  agg_row record;
  hourly_data jsonb;
  models_data jsonb;
BEGIN
  -- Build aggregates from filtered rows
  SELECT
    count(*)::int AS total_count,
    round(avg(chatbot_loaded_ms))::int AS avg_chatbot_loaded_ms,
    round(avg(conversation_ready_ms))::int AS avg_conversation_ready_ms,
    round(avg(history_msg_handoff_ms))::int AS avg_history_msg_handoff_ms,
    round(avg(rag_embedding_ms))::int AS avg_rag_embedding_ms,
    round(avg(rag_similarity_ms))::int AS avg_rag_similarity_ms,
    round(avg(rag_live_fetch_ms))::int AS avg_rag_live_fetch_ms,
    round(avg(rag_total_ms))::int AS avg_rag_total_ms,
    round(avg(prompts_built_ms))::int AS avg_prompts_built_ms,
    round(avg(first_token_ms))::int AS avg_first_token_ms,
    round(avg(stream_complete_ms))::int AS avg_stream_complete_ms,
    round(avg(total_ms))::int AS avg_total_ms,
    (percentile_cont(0.95) WITHIN GROUP (ORDER BY total_ms))::int AS p95_total_ms
  INTO agg_row
  FROM chat_performance_log
  WHERE chatbot_id = p_chatbot_id
    AND created_at >= p_since
    AND (p_to IS NULL OR created_at <= p_to)
    AND (p_models IS NULL OR model = ANY(p_models))
    AND (p_live_fetch IS NULL OR live_fetch_triggered = p_live_fetch);

  -- Hourly breakdown
  SELECT coalesce(jsonb_agg(h ORDER BY h->>'hour'), '[]'::jsonb)
  INTO hourly_data
  FROM (
    SELECT jsonb_build_object(
      'hour', to_char(date_trunc('hour', created_at), 'YYYY-MM-DD"T"HH24:00:00"Z"'),
      'count', count(*)::int,
      'chatbot_loaded_ms', round(avg(chatbot_loaded_ms))::int,
      'conversation_ready_ms', round(avg(conversation_ready_ms))::int,
      'history_msg_handoff_ms', round(avg(history_msg_handoff_ms))::int,
      'rag_embedding_ms', round(avg(rag_embedding_ms))::int,
      'rag_similarity_ms', round(avg(rag_similarity_ms))::int,
      'rag_live_fetch_ms', round(avg(rag_live_fetch_ms))::int,
      'rag_total_ms', round(avg(rag_total_ms))::int,
      'prompts_built_ms', round(avg(prompts_built_ms))::int,
      'first_token_ms', round(avg(first_token_ms))::int,
      'stream_complete_ms', round(avg(stream_complete_ms))::int,
      'total_ms', round(avg(total_ms))::int
    ) AS h
    FROM chat_performance_log
    WHERE chatbot_id = p_chatbot_id
      AND created_at >= p_since
      AND (p_to IS NULL OR created_at <= p_to)
      AND (p_models IS NULL OR model = ANY(p_models))
      AND (p_live_fetch IS NULL OR live_fetch_triggered = p_live_fetch)
    GROUP BY date_trunc('hour', created_at)
  ) sub;

  -- Distinct models
  SELECT coalesce(jsonb_agg(DISTINCT model ORDER BY model), '[]'::jsonb)
  INTO models_data
  FROM chat_performance_log
  WHERE chatbot_id = p_chatbot_id
    AND created_at >= p_since
    AND (p_to IS NULL OR created_at <= p_to)
    AND model IS NOT NULL;

  result := jsonb_build_object(
    'total_count', coalesce(agg_row.total_count, 0),
    'averages', jsonb_build_object(
      'chatbot_loaded_ms', agg_row.avg_chatbot_loaded_ms,
      'conversation_ready_ms', agg_row.avg_conversation_ready_ms,
      'history_msg_handoff_ms', agg_row.avg_history_msg_handoff_ms,
      'rag_embedding_ms', agg_row.avg_rag_embedding_ms,
      'rag_similarity_ms', agg_row.avg_rag_similarity_ms,
      'rag_live_fetch_ms', agg_row.avg_rag_live_fetch_ms,
      'rag_total_ms', agg_row.avg_rag_total_ms,
      'prompts_built_ms', agg_row.avg_prompts_built_ms,
      'first_token_ms', agg_row.avg_first_token_ms,
      'stream_complete_ms', agg_row.avg_stream_complete_ms,
      'total_ms', agg_row.avg_total_ms
    ),
    'p95_total_ms', agg_row.p95_total_ms,
    'available_models', models_data,
    'hourly', hourly_data
  );

  RETURN result;
END;
$$;
