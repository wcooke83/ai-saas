-- RPC: get_full_credit_status
-- Returns a unified credit status view combining usage (plan credits) + user_credits (purchased/bonus)
-- Used by the /api/credit-alerts/check GET endpoint and dashboard credit meter.

CREATE OR REPLACE FUNCTION get_full_credit_status(p_user_id uuid)
RETURNS TABLE (
  plan_credits_limit    integer,
  plan_credits_used     integer,
  plan_credits_remaining integer,
  purchased_credits     integer,
  bonus_credits         integer,
  total_available       integer,
  auto_topup_enabled    boolean,
  period_end            timestamptz,
  plan_slug             text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits_limit     integer;
  v_credits_used      integer;
  v_period_end        timestamptz;
  v_purchased         integer;
  v_bonus             integer;
  v_auto_topup        boolean;
  v_plan_slug         text;
BEGIN
  -- Pull from usage table (plan allocation)
  SELECT
    COALESCE(u.credits_limit, 0),
    COALESCE(u.credits_used, 0),
    u.period_end
  INTO v_credits_limit, v_credits_used, v_period_end
  FROM usage u
  WHERE u.user_id = p_user_id
  ORDER BY u.created_at DESC
  LIMIT 1;

  -- Pull purchased + bonus + auto-topup from user_credits
  SELECT
    COALESCE(uc.purchased_credits, 0),
    COALESCE(uc.bonus_credits, 0),
    COALESCE(uc.auto_topup_enabled, false)
  INTO v_purchased, v_bonus, v_auto_topup
  FROM user_credits uc
  WHERE uc.user_id = p_user_id
  LIMIT 1;

  -- Pull plan slug from subscriptions (join to subscription_plans)
  SELECT COALESCE(s.plan, sp.slug, 'free')
  INTO v_plan_slug
  FROM subscriptions s
  LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
  WHERE s.user_id = p_user_id
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Default nulls
  v_credits_limit  := COALESCE(v_credits_limit, 0);
  v_credits_used   := COALESCE(v_credits_used, 0);
  v_purchased      := COALESCE(v_purchased, 0);
  v_bonus          := COALESCE(v_bonus, 0);
  v_auto_topup     := COALESCE(v_auto_topup, false);
  v_plan_slug      := COALESCE(v_plan_slug, 'free');

  RETURN QUERY SELECT
    v_credits_limit,
    v_credits_used,
    GREATEST(0, v_credits_limit - v_credits_used),
    v_purchased,
    v_bonus,
    GREATEST(0, v_credits_limit - v_credits_used) + v_purchased + v_bonus,
    v_auto_topup,
    v_period_end,
    v_plan_slug;
END;
$$;

GRANT EXECUTE ON FUNCTION get_full_credit_status(uuid) TO authenticated, service_role;
