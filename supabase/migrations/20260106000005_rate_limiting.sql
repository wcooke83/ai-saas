-- Rate Limit Usage Table
-- Tracks token usage within sliding windows (Claude-style rate limiting)
CREATE TABLE public.rate_limit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Window tracking
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,

  -- Usage in this window
  tokens_used INTEGER DEFAULT 0,
  requests_count INTEGER DEFAULT 0,

  -- Context
  plan_slug TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint for user + window
  UNIQUE(user_id, window_start)
);

-- Indexes
CREATE INDEX idx_rate_limit_user_window ON public.rate_limit_usage(user_id, window_start, window_end);
CREATE INDEX idx_rate_limit_cleanup ON public.rate_limit_usage(window_end);

-- Enable RLS
ALTER TABLE public.rate_limit_usage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own rate limit"
  ON public.rate_limit_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all rate limits"
  ON public.rate_limit_usage FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_rate_limit_usage_updated_at
  BEFORE UPDATE ON public.rate_limit_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to check and update rate limit (Claude-style windowed rate limiting)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_tokens_requested INTEGER,
  p_window_seconds INTEGER,
  p_token_limit INTEGER
)
RETURNS TABLE (
  allowed BOOLEAN,
  tokens_remaining INTEGER,
  tokens_used INTEGER,
  reset_at TIMESTAMPTZ,
  is_soft_cap BOOLEAN
) AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_window_end TIMESTAMPTZ;
  v_current_usage INTEGER;
  v_is_hard_cap BOOLEAN;
BEGIN
  -- Handle unlimited rate limit
  IF p_token_limit = -1 OR p_window_seconds = 0 THEN
    RETURN QUERY SELECT true, -1, 0, now(), false;
    RETURN;
  END IF;

  -- Calculate current window (aligned to window_seconds)
  v_window_start := to_timestamp(
    floor(EXTRACT(EPOCH FROM now()) / p_window_seconds) * p_window_seconds
  );
  v_window_end := v_window_start + (p_window_seconds * interval '1 second');

  -- Get or create usage record for this window
  INSERT INTO public.rate_limit_usage (user_id, window_start, window_end, tokens_used, requests_count)
  VALUES (p_user_id, v_window_start, v_window_end, 0, 0)
  ON CONFLICT (user_id, window_start) DO NOTHING;

  -- Get current usage
  SELECT rl.tokens_used INTO v_current_usage
  FROM public.rate_limit_usage rl
  WHERE rl.user_id = p_user_id
    AND rl.window_start = v_window_start;

  -- Get user's rate limit config
  SELECT sp.rate_limit_is_hard_cap INTO v_is_hard_cap
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = p_user_id;

  v_is_hard_cap := COALESCE(v_is_hard_cap, true);

  -- Check if allowed
  IF v_current_usage + p_tokens_requested <= p_token_limit THEN
    -- Update and allow
    UPDATE public.rate_limit_usage
    SET
      tokens_used = tokens_used + p_tokens_requested,
      requests_count = requests_count + 1,
      updated_at = now()
    WHERE user_id = p_user_id AND window_start = v_window_start;

    RETURN QUERY SELECT
      true,
      p_token_limit - v_current_usage - p_tokens_requested,
      v_current_usage + p_tokens_requested,
      v_window_end,
      NOT v_is_hard_cap;
  ELSE
    -- Rate limit reached
    IF v_is_hard_cap THEN
      -- Hard cap - deny request
      RETURN QUERY SELECT
        false,
        GREATEST(0, p_token_limit - v_current_usage),
        v_current_usage,
        v_window_end,
        false;
    ELSE
      -- Soft cap - allow but flag for overage charges
      UPDATE public.rate_limit_usage
      SET
        tokens_used = tokens_used + p_tokens_requested,
        requests_count = requests_count + 1,
        updated_at = now()
      WHERE user_id = p_user_id AND window_start = v_window_start;

      RETURN QUERY SELECT
        true,
        0,  -- No tokens remaining in window
        v_current_usage + p_tokens_requested,
        v_window_end,
        true;  -- Indicate overage
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current rate limit status for a user
CREATE OR REPLACE FUNCTION public.get_rate_limit_status(p_user_id UUID)
RETURNS TABLE (
  tokens_limit INTEGER,
  tokens_used INTEGER,
  tokens_remaining INTEGER,
  window_seconds INTEGER,
  reset_at TIMESTAMPTZ,
  is_hard_cap BOOLEAN
) AS $$
DECLARE
  v_limit INTEGER;
  v_window INTEGER;
  v_hard_cap BOOLEAN;
  v_window_start TIMESTAMPTZ;
  v_window_end TIMESTAMPTZ;
  v_usage INTEGER;
BEGIN
  -- Get plan rate limit config
  SELECT
    sp.rate_limit_tokens,
    sp.rate_limit_period_seconds,
    sp.rate_limit_is_hard_cap
  INTO v_limit, v_window, v_hard_cap
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = p_user_id;

  -- Handle unlimited or no rate limit
  IF v_limit IS NULL OR v_limit = -1 OR v_window IS NULL OR v_window = 0 THEN
    RETURN QUERY SELECT -1, 0, -1, 0, now(), true;
    RETURN;
  END IF;

  -- Calculate current window
  v_window_start := to_timestamp(
    floor(EXTRACT(EPOCH FROM now()) / v_window) * v_window
  );
  v_window_end := v_window_start + (v_window * interval '1 second');

  -- Get current usage
  SELECT COALESCE(rl.tokens_used, 0) INTO v_usage
  FROM public.rate_limit_usage rl
  WHERE rl.user_id = p_user_id
    AND rl.window_start = v_window_start;

  v_usage := COALESCE(v_usage, 0);

  RETURN QUERY SELECT
    v_limit,
    v_usage,
    GREATEST(0, v_limit - v_usage),
    v_window,
    v_window_end,
    v_hard_cap;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_usage()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  -- Delete records older than 24 hours
  DELETE FROM public.rate_limit_usage
  WHERE window_end < now() - interval '24 hours';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
