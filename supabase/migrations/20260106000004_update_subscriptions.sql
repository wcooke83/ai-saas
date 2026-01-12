-- Update subscriptions table to reference subscription_plans

-- Add new columns
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.subscription_plans(id),
ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_link_id UUID REFERENCES public.trial_links(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial ON public.subscriptions(trial_ends_at)
  WHERE trial_ends_at IS NOT NULL;

-- Migrate existing subscriptions to use plan_id
-- Map existing 'plan' text field to subscription_plans
UPDATE public.subscriptions s
SET plan_id = sp.id
FROM public.subscription_plans sp
WHERE s.plan = sp.slug AND s.plan_id IS NULL;

-- Set free plan as default for any without plan_id
UPDATE public.subscriptions s
SET plan_id = (SELECT id FROM public.subscription_plans WHERE slug = 'free' LIMIT 1)
WHERE s.plan_id IS NULL;

-- Function to get user's effective plan (considering trials)
CREATE OR REPLACE FUNCTION public.get_effective_plan(p_user_id UUID)
RETURNS TABLE (
  plan_id UUID,
  plan_slug TEXT,
  plan_name TEXT,
  credits_monthly INTEGER,
  rate_limit_tokens INTEGER,
  rate_limit_period_seconds INTEGER,
  rate_limit_is_hard_cap BOOLEAN,
  features JSONB,
  is_trial BOOLEAN,
  trial_expires_at TIMESTAMPTZ,
  billing_status TEXT
) AS $$
DECLARE
  v_active_trial RECORD;
BEGIN
  -- Check for active trial first
  SELECT * INTO v_active_trial FROM get_active_trial(p_user_id);

  IF v_active_trial.trial_id IS NOT NULL THEN
    -- Return trial plan details
    RETURN QUERY
    SELECT
      sp.id,
      sp.slug,
      sp.name,
      COALESCE(v_active_trial.credits_limit, sp.credits_monthly),
      sp.rate_limit_tokens,
      sp.rate_limit_period_seconds,
      sp.rate_limit_is_hard_cap,
      COALESCE(v_active_trial.features, sp.features),
      true,
      v_active_trial.expires_at,
      'trial'::TEXT
    FROM subscription_plans sp
    WHERE sp.id = v_active_trial.plan_id;
  ELSE
    -- Return subscription plan details
    RETURN QUERY
    SELECT
      sp.id,
      sp.slug,
      sp.name,
      sp.credits_monthly,
      sp.rate_limit_tokens,
      sp.rate_limit_period_seconds,
      sp.rate_limit_is_hard_cap,
      sp.features,
      false,
      NULL::TIMESTAMPTZ,
      s.status
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade/downgrade subscription
CREATE OR REPLACE FUNCTION public.change_subscription_plan(
  p_user_id UUID,
  p_new_plan_id UUID,
  p_billing_interval TEXT DEFAULT 'monthly'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_plan_id UUID;
  v_new_plan subscription_plans%ROWTYPE;
BEGIN
  -- Get new plan
  SELECT * INTO v_new_plan FROM subscription_plans WHERE id = p_new_plan_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan not found';
  END IF;

  -- Get old plan for logging
  SELECT plan_id INTO v_old_plan_id FROM subscriptions WHERE user_id = p_user_id;

  -- Update subscription
  UPDATE subscriptions
  SET
    plan_id = p_new_plan_id,
    plan = v_new_plan.slug,
    billing_interval = p_billing_interval,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Update usage limits based on new plan
  UPDATE usage
  SET
    credits_limit = v_new_plan.credits_monthly,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Expire any active trial if upgrading
  UPDATE trial_redemptions
  SET status = 'converted', converted_at = now()
  WHERE user_id = p_user_id AND status = 'active';

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start a subscription trial
CREATE OR REPLACE FUNCTION public.start_subscription_trial(
  p_user_id UUID,
  p_plan_id UUID,
  p_trial_days INTEGER,
  p_trial_link_id UUID DEFAULT NULL
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  v_trial_ends_at TIMESTAMPTZ;
  v_plan subscription_plans%ROWTYPE;
BEGIN
  -- Get plan
  SELECT * INTO v_plan FROM subscription_plans WHERE id = p_plan_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan not found';
  END IF;

  v_trial_ends_at := now() + (p_trial_days * interval '1 day');

  -- Update subscription with trial
  UPDATE subscriptions
  SET
    plan_id = p_plan_id,
    plan = v_plan.slug,
    status = 'trialing',
    trial_ends_at = v_trial_ends_at,
    trial_link_id = p_trial_link_id,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Set usage limits for trial
  UPDATE usage
  SET
    credits_limit = COALESCE(v_plan.trial_credits, v_plan.credits_monthly),
    credits_used = 0,
    period_start = now(),
    period_end = v_trial_ends_at,
    updated_at = now()
  WHERE user_id = p_user_id;

  RETURN v_trial_ends_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end trial (convert or downgrade)
CREATE OR REPLACE FUNCTION public.end_trial(
  p_user_id UUID,
  p_convert_to_paid BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
DECLARE
  v_free_plan_id UUID;
BEGIN
  IF p_convert_to_paid THEN
    -- Just clear trial dates, keep plan
    UPDATE subscriptions
    SET
      status = 'active',
      trial_ends_at = NULL,
      trial_link_id = NULL,
      current_period_start = now(),
      current_period_end = now() + interval '1 month',
      updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Downgrade to free plan
    SELECT id INTO v_free_plan_id FROM subscription_plans WHERE slug = 'free' LIMIT 1;

    UPDATE subscriptions
    SET
      plan_id = v_free_plan_id,
      plan = 'free',
      status = 'free',
      trial_ends_at = NULL,
      trial_link_id = NULL,
      stripe_subscription_id = NULL,
      updated_at = now()
    WHERE user_id = p_user_id;

    -- Reset usage to free plan limits
    UPDATE usage u
    SET
      credits_limit = sp.credits_monthly,
      credits_used = 0,
      period_start = now(),
      period_end = now() + interval '1 month',
      updated_at = now()
    FROM subscription_plans sp
    WHERE u.user_id = p_user_id AND sp.id = v_free_plan_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
