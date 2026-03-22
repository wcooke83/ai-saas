CREATE TABLE IF NOT EXISTS chat_rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_rate_limits_window ON chat_rate_limits (window_start);

-- RPC to atomically check and increment rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
  v_window_start timestamptz;
BEGIN
  -- Try to get existing record
  SELECT count, window_start INTO v_count, v_window_start
  FROM chat_rate_limits WHERE key = p_key FOR UPDATE;

  IF NOT FOUND THEN
    -- First request
    INSERT INTO chat_rate_limits (key, count, window_start)
    VALUES (p_key, 1, now());
    RETURN true;
  END IF;

  -- Check if window has expired
  IF v_window_start + (p_window_seconds || ' seconds')::interval < now() THEN
    -- Reset window
    UPDATE chat_rate_limits SET count = 1, window_start = now() WHERE key = p_key;
    RETURN true;
  END IF;

  -- Check if under limit
  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  -- Increment
  UPDATE chat_rate_limits SET count = count + 1 WHERE key = p_key;
  RETURN true;
END;
$$;

-- Cleanup old entries periodically (can be called from a cron)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM chat_rate_limits WHERE window_start < now() - interval '1 hour';
$$;
