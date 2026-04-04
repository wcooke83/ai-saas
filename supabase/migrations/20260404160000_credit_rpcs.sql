-- Migration: Credit-based billing RPCs.
-- Adds: get_full_credit_status, allocate_monthly_credits, process_ltd_redemption.

-- ── get_full_credit_status ─────────────────────────────────────────────────────
-- Returns a single JSON object with the user's complete credit picture.
-- Reads usage, user_credits, subscriptions, subscription_plans.
CREATE OR REPLACE FUNCTION get_full_credit_status(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usage             record;
  v_credits           record;
  v_sub               record;
  v_plan_slug         text;
  v_plan_remaining    int;
BEGIN
  -- usage row (guaranteed unique after migration 20260404110000)
  SELECT credits_limit, credits_used, period_end,
         credit_alert_75_sent_at, credit_alert_90_sent_at
    INTO v_usage
    FROM usage
    WHERE user_id = p_user_id;

  -- user_credits row
  SELECT purchased_credits, bonus_credits, lifetime_credits,
         auto_topup_enabled, auto_topup_threshold, auto_topup_pack_id
    INTO v_credits
    FROM user_credits
    WHERE user_id = p_user_id;

  -- subscription + plan slug
  SELECT s.plan, sp.slug AS plan_slug
    INTO v_sub
    FROM subscriptions s
    LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
    WHERE s.user_id = p_user_id;

  v_plan_slug     := COALESCE(v_sub.plan_slug, v_sub.plan, 'free');
  v_plan_remaining := GREATEST(0,
    COALESCE(v_usage.credits_limit, 0) - COALESCE(v_usage.credits_used, 0)
  );

  RETURN jsonb_build_object(
    -- plan credit pool
    'plan_credits_limit',     COALESCE(v_usage.credits_limit, 0),
    'plan_credits_used',      COALESCE(v_usage.credits_used, 0),
    'plan_credits_remaining', v_plan_remaining,
    -- purchased / bonus pools
    'purchased_credits',      COALESCE(v_credits.purchased_credits, 0),
    'bonus_credits',          COALESCE(v_credits.bonus_credits, 0),
    'lifetime_credits',       COALESCE(v_credits.lifetime_credits, 0),
    'total_available',        v_plan_remaining
                              + COALESCE(v_credits.purchased_credits, 0)
                              + COALESCE(v_credits.bonus_credits, 0),
    -- auto-topup config
    'auto_topup_enabled',     COALESCE(v_credits.auto_topup_enabled, false),
    'auto_topup_threshold',   v_credits.auto_topup_threshold,
    'auto_topup_pack_id',     v_credits.auto_topup_pack_id,
    -- alert flags
    'alert_75_sent',          (v_usage.credit_alert_75_sent_at IS NOT NULL),
    'alert_90_sent',          (v_usage.credit_alert_90_sent_at IS NOT NULL),
    -- period
    'period_end',             v_usage.period_end,
    'plan_slug',              v_plan_slug
  );
END;
$$;

-- ── allocate_monthly_credits ───────────────────────────────────────────────────
-- Called at the start of each billing period (Stripe invoice.paid webhook, or cron).
-- 1. Reads credits_monthly from the plan (or ltd, if subscriptions.ltd_id is set).
-- 2. If the plan has credits_rollover=true, banks unused plan credits into
--    user_credits.purchased_credits, capped at 2× monthly (LTD) or 1× (Pro).
-- 3. Resets usage (credits_used=0, credits_limit=new monthly, period dates).
-- 4. Inserts a credit_transactions row for the ledger.
-- 5. Returns the new credits_limit.
CREATE OR REPLACE FUNCTION allocate_monthly_credits(p_user_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sub            record;
  v_plan           record;
  v_ltd            record;
  v_credits_monthly int;
  v_rollover       boolean;
  v_is_ltd         boolean;
  v_current_usage  record;
  v_unused         int;
  v_rollover_cap   int;
  v_rollover_amount int;
  v_new_limit      int;
BEGIN
  -- Lock subscription row
  SELECT s.*, sp.credits_monthly, sp.credits_rollover, sp.is_ltd AS plan_is_ltd,
         s.ltd_id
    INTO v_sub
    FROM subscriptions s
    LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
    WHERE s.user_id = p_user_id
    FOR UPDATE OF s;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  v_rollover := COALESCE(v_sub.credits_rollover, false);
  v_is_ltd   := (v_sub.ltd_id IS NOT NULL);

  -- Determine credits_monthly: prefer LTD override if applicable
  IF v_is_ltd THEN
    SELECT credits_monthly INTO v_ltd
      FROM ltds WHERE id = v_sub.ltd_id;
    v_credits_monthly := COALESCE(v_ltd.credits_monthly, v_sub.credits_monthly, 0);
  ELSE
    v_credits_monthly := COALESCE(v_sub.credits_monthly, 0);
  END IF;

  v_new_limit := v_credits_monthly;

  -- Rollover: bank unused plan credits into purchased pool
  IF v_rollover THEN
    SELECT credits_limit, credits_used INTO v_current_usage
      FROM usage WHERE user_id = p_user_id;

    v_unused := GREATEST(0,
      COALESCE(v_current_usage.credits_limit, 0) - COALESCE(v_current_usage.credits_used, 0)
    );

    -- Cap: LTD = 2× monthly, Pro = 1× monthly, others = 0 (no rollover despite flag)
    IF v_is_ltd THEN
      v_rollover_cap := v_credits_monthly * 2;
    ELSE
      v_rollover_cap := v_credits_monthly * 1;
    END IF;

    v_rollover_amount := LEAST(v_unused, v_rollover_cap);

    IF v_rollover_amount > 0 THEN
      INSERT INTO user_credits (user_id, purchased_credits, lifetime_credits)
        VALUES (p_user_id, v_rollover_amount, 0)
        ON CONFLICT (user_id) DO UPDATE
          SET purchased_credits = COALESCE(user_credits.purchased_credits, 0) + v_rollover_amount,
              updated_at = now();
    END IF;
  END IF;

  -- Reset usage for new period
  INSERT INTO usage (user_id, credits_limit, credits_used, period_start, period_end)
    VALUES (
      p_user_id,
      v_new_limit,
      0,
      now(),
      now() + interval '1 month'
    )
    ON CONFLICT (user_id) DO UPDATE
      SET credits_limit  = v_new_limit,
          credits_used   = 0,
          period_start   = now(),
          period_end     = now() + interval '1 month',
          updated_at     = now();

  -- Ledger entry
  INSERT INTO credit_transactions (
    user_id, type, amount, description, credit_source
  ) VALUES (
    p_user_id,
    'plan_allocation',
    v_new_limit,
    'Monthly plan credit allocation',
    'plan'
  );

  RETURN v_new_limit;
END;
$$;

-- ── process_ltd_redemption ─────────────────────────────────────────────────────
-- Idempotent: safe to call twice for the same (user_id, ltd_id) pair.
-- 1. Inserts into ltd_redemptions (conflict = already redeemed, return success).
-- 2. Upserts subscriptions to point at the LTD plan.
-- 3. Upserts usage with the LTD's monthly credit allowance.
-- 4. Returns { success: true, credits_monthly: int }.
CREATE OR REPLACE FUNCTION process_ltd_redemption(
  p_user_id                uuid,
  p_ltd_id                 uuid,
  p_payment_intent_id      text DEFAULT NULL,
  p_external_order_id      text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ltd              record;
  v_already_redeemed boolean := false;
BEGIN
  -- Fetch LTD definition
  SELECT id, plan_id, credits_monthly, chatbots_limit, knowledge_sources_limit
    INTO v_ltd
    FROM ltds
    WHERE id = p_ltd_id AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'ltd_not_found');
  END IF;

  -- Insert redemption record (idempotent)
  BEGIN
    INSERT INTO ltd_redemptions (
      user_id, ltd_id, stripe_payment_intent_id, external_order_id, status
    ) VALUES (
      p_user_id, p_ltd_id, p_payment_intent_id, p_external_order_id, 'active'
    );
  EXCEPTION WHEN unique_violation THEN
    -- Already redeemed — still sync the subscription and usage below
    v_already_redeemed := true;
  END;

  -- Upsert subscription to LTD plan
  INSERT INTO subscriptions (
    user_id, plan_id, ltd_id, status,
    stripe_subscription_id, purchase_source, current_period_end
  ) VALUES (
    p_user_id, v_ltd.plan_id, p_ltd_id, 'active',
    NULL, 'ltd', NULL
  )
  ON CONFLICT (user_id) DO UPDATE
    SET plan_id                = v_ltd.plan_id,
        ltd_id                 = p_ltd_id,
        status                 = 'active',
        stripe_subscription_id = NULL,
        purchase_source        = 'ltd',
        current_period_end     = NULL,
        updated_at             = now();

  -- Upsert usage for the new period
  INSERT INTO usage (
    user_id, credits_limit, credits_used, period_start, period_end
  ) VALUES (
    p_user_id, v_ltd.credits_monthly, 0, now(), now() + interval '1 month'
  )
  ON CONFLICT (user_id) DO UPDATE
    SET credits_limit = v_ltd.credits_monthly,
        credits_used  = 0,
        period_start  = now(),
        period_end    = now() + interval '1 month',
        updated_at    = now();

  RETURN jsonb_build_object(
    'success',         true,
    'credits_monthly', v_ltd.credits_monthly,
    'already_redeemed', v_already_redeemed
  );
END;
$$;
