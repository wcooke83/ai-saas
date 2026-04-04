-- Migration: Add deduct_user_credits_atomic RPC
-- Atomic credit deduction with topup signal.
-- Deducts from plan allocation first, then purchased, then bonus.
-- Returns success=false + needs_topup=true when balance is insufficient
-- but auto-topup is configured.

CREATE OR REPLACE FUNCTION deduct_user_credits_atomic(
  p_user_id    uuid,
  p_amount     integer,
  p_description text DEFAULT NULL,
  p_metadata   jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_plan_allocation   integer;
  v_plan_used         integer;
  v_plan_remaining    integer;
  v_purchased         integer;
  v_bonus             integer;
  v_total_available   integer;
  v_is_unlimited      boolean;
  v_auto_topup        boolean;
  v_topup_pack_id     uuid;
  v_from_plan         integer;
  v_from_purchased    integer;
  v_from_bonus        integer;
  v_remaining_total   integer;
  v_balance_before    integer;
BEGIN
  -- Lock user_credits row to prevent concurrent overdraw
  SELECT
    COALESCE(uc.purchased_credits, 0),
    COALESCE(uc.bonus_credits, 0),
    COALESCE(uc.auto_topup_enabled, false),
    uc.auto_topup_amount
  INTO v_purchased, v_bonus, v_auto_topup, v_topup_pack_id
  FROM user_credits uc
  WHERE uc.user_id = p_user_id
  FOR UPDATE;

  -- If no user_credits row exists yet, treat as zeros
  IF NOT FOUND THEN
    v_purchased := 0;
    v_bonus := 0;
    v_auto_topup := false;
    v_topup_pack_id := NULL;
  END IF;

  -- Get plan allocation from usage table
  SELECT
    COALESCE(u.credits_limit, 100),
    COALESCE(u.credits_used, 0)
  INTO v_plan_allocation, v_plan_used
  FROM usage u
  WHERE u.user_id = p_user_id
  ORDER BY u.created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    v_plan_allocation := 100;
    v_plan_used := 0;
  END IF;

  -- Unlimited plans (limit = -1 or >= 999999) never fail
  v_is_unlimited := v_plan_allocation = -1 OR v_plan_allocation >= 999999;

  IF v_is_unlimited THEN
    -- Just increment usage, don't gate
    UPDATE usage
      SET credits_used = COALESCE(credits_used, 0) + p_amount,
          updated_at = now()
      WHERE user_id = p_user_id
        AND id = (SELECT id FROM usage WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1);

    -- Log transaction
    INSERT INTO credit_transactions (user_id, type, amount, description, metadata, balance_after, credit_source)
    VALUES (p_user_id, 'deduction', -p_amount, p_description, p_metadata, -1, 'plan');

    RETURN jsonb_build_object(
      'success', true,
      'needs_topup', false,
      'topup_pack_id', NULL,
      'remaining_total', -1
    );
  END IF;

  v_plan_remaining := GREATEST(0, v_plan_allocation - v_plan_used);
  v_total_available := v_plan_remaining + v_purchased + v_bonus;
  v_balance_before := v_total_available;

  -- Check if sufficient credits available
  IF v_total_available < p_amount THEN
    -- Signal whether auto-topup is configured
    RETURN jsonb_build_object(
      'success', false,
      'needs_topup', v_auto_topup,
      'topup_pack_id', v_topup_pack_id::text,
      'remaining_total', v_total_available
    );
  END IF;

  -- Deduct: plan first, then purchased, then bonus
  v_from_plan := LEAST(p_amount, v_plan_remaining);
  v_from_purchased := LEAST(p_amount - v_from_plan, v_purchased);
  v_from_bonus := p_amount - v_from_plan - v_from_purchased;

  -- Apply plan deduction (increment credits_used)
  IF v_from_plan > 0 THEN
    UPDATE usage
      SET credits_used = COALESCE(credits_used, 0) + v_from_plan,
          updated_at = now()
      WHERE user_id = p_user_id
        AND id = (SELECT id FROM usage WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1);
  END IF;

  -- Apply purchased + bonus deduction
  IF v_from_purchased > 0 OR v_from_bonus > 0 THEN
    UPDATE user_credits
      SET purchased_credits = COALESCE(purchased_credits, 0) - v_from_purchased,
          bonus_credits = COALESCE(bonus_credits, 0) - v_from_bonus,
          updated_at = now()
      WHERE user_id = p_user_id;
  END IF;

  v_remaining_total := v_total_available - p_amount;

  -- Log transaction
  INSERT INTO credit_transactions (user_id, type, amount, description, metadata, balance_after, credit_source)
  VALUES (
    p_user_id,
    'deduction',
    -p_amount,
    p_description,
    p_metadata,
    v_remaining_total,
    CASE
      WHEN v_from_purchased > 0 OR v_from_bonus > 0 THEN 'purchased'
      ELSE 'plan'
    END
  );

  RETURN jsonb_build_object(
    'success', true,
    'needs_topup', false,
    'topup_pack_id', NULL,
    'remaining_total', v_remaining_total
  );
END;
$$;
