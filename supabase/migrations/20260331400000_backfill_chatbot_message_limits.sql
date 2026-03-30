-- Backfill monthly_message_limit for existing chatbots based on their owner's current plan.
-- Only updates chatbots that still have the stale DB default of 1000.
-- Maps plan slugs to limits from CHATBOT_PLAN_LIMITS in src/lib/chatbots/types.ts:
--   free:   100
--   pro:    10000
--   agency: 0  (unlimited sentinel — the RPC treats 0 as unlimited)

UPDATE chatbots c
SET monthly_message_limit = CASE s.plan
  WHEN 'free'   THEN 100
  WHEN 'pro'    THEN 10000
  WHEN 'agency' THEN 0
  ELSE 1000
END
FROM subscriptions s
WHERE s.user_id = c.user_id
  AND c.monthly_message_limit = 1000;
