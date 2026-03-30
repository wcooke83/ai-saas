-- Backfill usage.credits_used from api_logs for each user's current billing
-- period. The api_logs.tokens_total column is GENERATED ALWAYS AS
-- (tokens_input + tokens_output) so it is always accurate. The credits_used
-- counter was never incremented by the chat API, leaving it near zero despite
-- real token consumption. This backfill corrects the stale values.
--
-- Going forward, logAPICall() in src/lib/api/logging.ts increments
-- usage.credits_used after each successful chat API call.

UPDATE usage u
SET credits_used = (
  SELECT COALESCE(SUM(al.tokens_total), 0)
  FROM api_logs al
  WHERE al.user_id = u.user_id
    AND al.status_code < 400
    AND al.created_at >= u.period_start
    AND (u.period_end IS NULL OR al.created_at < u.period_end)
);
