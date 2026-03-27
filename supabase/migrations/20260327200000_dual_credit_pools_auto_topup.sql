-- Migration: Dual credit pools + auto-topup support
-- Adds purchased_credits_remaining to chatbots (never expires, carries over)
-- Adds auto_topup_package_id and auto_topup_max_per_month for auto-purchase config
-- Adds purchase_type to credit_purchases to distinguish auto vs manual
-- Rewrites increment_chatbot_messages to consume monthly first, then purchased
-- Rewrites reset_monthly_message_counts to only reset monthly usage
-- Adds add_chatbot_purchased_credits helper

-- 1. Add new columns to chatbots
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS purchased_credits_remaining integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auto_topup_package_id uuid REFERENCES credit_packages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS auto_topup_max_per_month integer NOT NULL DEFAULT 3;

-- 2. Add purchase_type to credit_purchases
ALTER TABLE credit_purchases
  ADD COLUMN IF NOT EXISTS purchase_type text NOT NULL DEFAULT 'manual'
    CHECK (purchase_type IN ('manual', 'auto'));

-- 3. Add credit_source to messages for analytics (which pool was consumed)
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS credit_source text CHECK (credit_source IN ('monthly', 'purchased', 'unlimited'));

-- 4. Drop old increment_chatbot_messages (return type changes from void to jsonb)
DROP FUNCTION IF EXISTS increment_chatbot_messages(uuid, integer);

-- Rewrite increment_chatbot_messages
--    Now returns jsonb with balance info instead of void.
--    Consumes monthly credits first, purchased second.
--    Uses SELECT ... FOR UPDATE for atomic concurrent access.
CREATE OR REPLACE FUNCTION increment_chatbot_messages(
  p_chatbot_id uuid,
  p_amount integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_monthly_limit integer;
  v_messages_used integer;
  v_monthly_remaining integer;
  v_purchased integer;
  v_from_monthly integer;
  v_from_purchased integer;
BEGIN
  -- Lock the row to prevent concurrent overdraw
  SELECT monthly_message_limit, messages_this_month, purchased_credits_remaining
    INTO v_monthly_limit, v_messages_used, v_purchased
    FROM chatbots
    WHERE id = p_chatbot_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'not_found');
  END IF;

  -- If no limit is set (0 or NULL = unlimited), always allow
  IF COALESCE(v_monthly_limit, 0) = 0 THEN
    UPDATE chatbots
      SET messages_this_month = COALESCE(messages_this_month, 0) + p_amount
      WHERE id = p_chatbot_id;
    RETURN jsonb_build_object(
      'allowed', true,
      'monthly_remaining', -1,
      'purchased_remaining', COALESCE(v_purchased, 0),
      'source', 'unlimited'
    );
  END IF;

  -- Calculate remaining monthly credits
  v_monthly_remaining := GREATEST(0, v_monthly_limit - COALESCE(v_messages_used, 0));

  -- Check if total available credits cover the request
  IF v_monthly_remaining + COALESCE(v_purchased, 0) < p_amount THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'exhausted',
      'monthly_remaining', v_monthly_remaining,
      'purchased_remaining', COALESCE(v_purchased, 0)
    );
  END IF;

  -- Consume monthly credits first
  v_from_monthly := LEAST(p_amount, v_monthly_remaining);
  v_from_purchased := p_amount - v_from_monthly;

  UPDATE chatbots
    SET messages_this_month = COALESCE(messages_this_month, 0) + v_from_monthly,
        purchased_credits_remaining = COALESCE(purchased_credits_remaining, 0) - v_from_purchased
    WHERE id = p_chatbot_id;

  RETURN jsonb_build_object(
    'allowed', true,
    'monthly_remaining', v_monthly_remaining - v_from_monthly,
    'purchased_remaining', COALESCE(v_purchased, 0) - v_from_purchased,
    'source', CASE
      WHEN v_from_purchased > 0 THEN 'purchased'
      ELSE 'monthly'
    END
  );
END;
$$;

-- 5. Rewrite reset_monthly_message_counts
--    Resets messages_this_month to 0. Does NOT touch purchased_credits_remaining.
CREATE OR REPLACE FUNCTION reset_monthly_message_counts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE chatbots
    SET messages_this_month = 0;
END;
$$;

-- 6. Helper: add purchased credits to a chatbot (called after successful auto-topup payment)
CREATE OR REPLACE FUNCTION add_chatbot_purchased_credits(
  p_chatbot_id uuid,
  p_amount integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_balance integer;
BEGIN
  UPDATE chatbots
    SET purchased_credits_remaining = COALESCE(purchased_credits_remaining, 0) + p_amount
    WHERE id = p_chatbot_id
    RETURNING purchased_credits_remaining INTO v_new_balance;

  RETURN COALESCE(v_new_balance, 0);
END;
$$;

-- 7. Helper: count auto-topups this month for spend cap enforcement
CREATE OR REPLACE FUNCTION count_auto_topups_this_month(
  p_chatbot_id uuid
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)
    INTO v_count
    FROM credit_purchases
    WHERE chatbot_id = p_chatbot_id
      AND purchase_type = 'auto'
      AND status = 'completed'
      AND created_at >= date_trunc('month', now());

  RETURN COALESCE(v_count, 0);
END;
$$;
