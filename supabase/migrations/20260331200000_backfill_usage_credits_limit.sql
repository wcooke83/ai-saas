-- Backfill usage.credits_limit to match the authoritative credits_monthly from subscription_plans.
-- Prior to this migration, credits_limit was set at subscription creation time and never synced
-- when plans changed. The credit meter hides at >= 999999, so -1 (unlimited/enterprise) maps to
-- 999999999 as a sentinel. Only updates rows where a matching subscription exists.

UPDATE usage u
SET credits_limit = CASE
  WHEN sp.credits_monthly = -1 THEN 999999999
  ELSE sp.credits_monthly
END
FROM subscriptions s
JOIN subscription_plans sp ON sp.slug = s.plan
WHERE s.user_id = u.user_id;
