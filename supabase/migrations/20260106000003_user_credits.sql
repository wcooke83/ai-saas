-- User Credits Table
-- Tracks purchased and bonus credits separate from plan allocation
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,

  -- Credit balance
  purchased_credits INTEGER DEFAULT 0,          -- Credits purchased by user
  bonus_credits INTEGER DEFAULT 0,              -- Promotional/bonus credits

  -- Auto top-up settings
  auto_topup_enabled BOOLEAN DEFAULT false,
  auto_topup_threshold INTEGER DEFAULT 100,     -- Trigger when total balance falls below
  auto_topup_amount INTEGER DEFAULT 1000,       -- Amount to purchase (in credits)
  auto_topup_max_monthly INTEGER,               -- Optional monthly cap (null = no cap)
  auto_topup_this_month INTEGER DEFAULT 0,      -- Track monthly auto-topup spend
  auto_topup_month_start TIMESTAMPTZ,           -- When current month tracking started

  -- Stripe customer info
  stripe_customer_id TEXT UNIQUE,
  default_payment_method_id TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Credit Transactions Table (audit trail)
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Transaction details
  type TEXT NOT NULL CHECK (type IN (
    'plan_allocation',      -- Monthly plan credits reset
    'purchase',             -- One-time purchase
    'auto_topup',           -- Auto top-up purchase
    'usage',                -- Usage deduction
    'refund',               -- Credit refund
    'bonus',                -- Promotional credits
    'expiry',               -- Credits expired
    'adjustment'            -- Admin adjustment
  )),

  amount INTEGER NOT NULL,                      -- Positive = credit, Negative = debit
  balance_after INTEGER,                        -- Balance after transaction

  -- Credit source tracking (for usage transactions)
  credit_source TEXT CHECK (credit_source IN ('plan', 'purchased', 'bonus')),

  -- Stripe references
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,

  -- Related records
  related_usage_id UUID,                        -- Link to generations table if applicable
  related_model_id UUID,                        -- AI model used if applicable

  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_credits_user ON public.user_credits(user_id);
CREATE INDEX idx_user_credits_stripe ON public.user_credits(stripe_customer_id);
CREATE INDEX idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON public.credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_stripe ON public.credit_transactions(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for user_credits
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own auto-topup settings"
  ON public.user_credits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all credits"
  ON public.user_credits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Policies for credit_transactions
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions"
  ON public.credit_transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update profile creation trigger to also create user_credits
CREATE OR REPLACE FUNCTION public.handle_new_profile_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user_credits record
  INSERT INTO public.user_credits (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_credits
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile_credits();

-- Function to add purchased credits
CREATE OR REPLACE FUNCTION public.add_purchased_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'purchase',
  p_payment_intent_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update balance
  UPDATE user_credits
  SET
    purchased_credits = purchased_credits + p_amount,
    auto_topup_this_month = CASE
      WHEN p_type = 'auto_topup' THEN auto_topup_this_month + p_amount
      ELSE auto_topup_this_month
    END,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING purchased_credits INTO v_new_balance;

  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, type, amount, balance_after,
    stripe_payment_intent_id, description
  ) VALUES (
    p_user_id, p_type, p_amount, v_new_balance,
    p_payment_intent_id, COALESCE(p_description, 'Credit purchase')
  );

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add bonus credits
CREATE OR REPLACE FUNCTION public.add_bonus_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT 'Bonus credits'
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE user_credits
  SET bonus_credits = bonus_credits + p_amount, updated_at = now()
  WHERE user_id = p_user_id
  RETURNING bonus_credits INTO v_new_balance;

  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (p_user_id, 'bonus', p_amount, v_new_balance, p_description);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits with priority: plan -> purchased -> bonus
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT NULL,
  p_related_usage_id UUID DEFAULT NULL,
  p_related_model_id UUID DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  deducted_from TEXT,
  remaining_total INTEGER
) AS $$
DECLARE
  v_plan_limit INTEGER;
  v_plan_used INTEGER;
  v_purchased INTEGER;
  v_bonus INTEGER;
  v_remaining INTEGER;
  v_from_plan INTEGER := 0;
  v_from_purchased INTEGER := 0;
  v_from_bonus INTEGER := 0;
  v_deducted_from TEXT;
BEGIN
  -- Get current balances
  SELECT
    u.credits_limit,
    u.credits_used,
    uc.purchased_credits,
    uc.bonus_credits
  INTO v_plan_limit, v_plan_used, v_purchased, v_bonus
  FROM usage u
  JOIN user_credits uc ON u.user_id = uc.user_id
  WHERE u.user_id = p_user_id;

  v_remaining := p_amount;

  -- 1. Deduct from plan allocation first
  IF v_plan_limit > 0 OR v_plan_limit = -1 THEN
    DECLARE
      v_plan_remaining INTEGER;
    BEGIN
      IF v_plan_limit = -1 THEN
        -- Unlimited plan
        v_from_plan := v_remaining;
        v_remaining := 0;
      ELSE
        v_plan_remaining := GREATEST(0, v_plan_limit - v_plan_used);
        v_from_plan := LEAST(v_remaining, v_plan_remaining);
        v_remaining := v_remaining - v_from_plan;
      END IF;
    END;
  END IF;

  -- 2. Deduct from purchased credits
  IF v_remaining > 0 AND v_purchased > 0 THEN
    v_from_purchased := LEAST(v_remaining, v_purchased);
    v_remaining := v_remaining - v_from_purchased;
  END IF;

  -- 3. Deduct from bonus credits
  IF v_remaining > 0 AND v_bonus > 0 THEN
    v_from_bonus := LEAST(v_remaining, v_bonus);
    v_remaining := v_remaining - v_from_bonus;
  END IF;

  -- Check if we have enough credits
  IF v_remaining > 0 THEN
    RETURN QUERY SELECT false, 'insufficient'::TEXT, 0;
    RETURN;
  END IF;

  -- Determine primary source
  IF v_from_plan > 0 THEN
    v_deducted_from := 'plan';
  ELSIF v_from_purchased > 0 THEN
    v_deducted_from := 'purchased';
  ELSE
    v_deducted_from := 'bonus';
  END IF;

  -- Apply deductions
  IF v_from_plan > 0 THEN
    UPDATE usage SET credits_used = credits_used + v_from_plan WHERE user_id = p_user_id;

    INSERT INTO credit_transactions (
      user_id, type, amount, credit_source, description, related_usage_id, related_model_id
    ) VALUES (
      p_user_id, 'usage', -v_from_plan, 'plan', p_description, p_related_usage_id, p_related_model_id
    );
  END IF;

  IF v_from_purchased > 0 THEN
    UPDATE user_credits SET purchased_credits = purchased_credits - v_from_purchased WHERE user_id = p_user_id;

    INSERT INTO credit_transactions (
      user_id, type, amount, credit_source, description, related_usage_id, related_model_id
    ) VALUES (
      p_user_id, 'usage', -v_from_purchased, 'purchased', p_description, p_related_usage_id, p_related_model_id
    );
  END IF;

  IF v_from_bonus > 0 THEN
    UPDATE user_credits SET bonus_credits = bonus_credits - v_from_bonus WHERE user_id = p_user_id;

    INSERT INTO credit_transactions (
      user_id, type, amount, credit_source, description, related_usage_id, related_model_id
    ) VALUES (
      p_user_id, 'usage', -v_from_bonus, 'bonus', p_description, p_related_usage_id, p_related_model_id
    );
  END IF;

  -- Calculate remaining total
  SELECT
    GREATEST(0, u.credits_limit - u.credits_used) + uc.purchased_credits + uc.bonus_credits
  INTO v_remaining
  FROM usage u
  JOIN user_credits uc ON u.user_id = uc.user_id
  WHERE u.user_id = p_user_id;

  RETURN QUERY SELECT true, v_deducted_from, v_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total credit balance
CREATE OR REPLACE FUNCTION public.get_credit_balance(p_user_id UUID)
RETURNS TABLE (
  plan_allocation INTEGER,
  plan_used INTEGER,
  plan_remaining INTEGER,
  purchased_credits INTEGER,
  bonus_credits INTEGER,
  total_available INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE WHEN u.credits_limit = -1 THEN -1 ELSE u.credits_limit END,
    u.credits_used,
    CASE WHEN u.credits_limit = -1 THEN -1 ELSE GREATEST(0, u.credits_limit - u.credits_used) END,
    uc.purchased_credits,
    uc.bonus_credits,
    CASE
      WHEN u.credits_limit = -1 THEN -1
      ELSE GREATEST(0, u.credits_limit - u.credits_used) + uc.purchased_credits + uc.bonus_credits
    END
  FROM usage u
  JOIN user_credits uc ON u.user_id = uc.user_id
  WHERE u.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if auto-topup should trigger
CREATE OR REPLACE FUNCTION public.should_auto_topup(p_user_id UUID)
RETURNS TABLE (
  should_trigger BOOLEAN,
  amount INTEGER,
  reason TEXT
) AS $$
DECLARE
  v_balance RECORD;
  v_credits user_credits%ROWTYPE;
BEGIN
  -- Get balance
  SELECT * INTO v_balance FROM get_credit_balance(p_user_id);

  -- Get auto-topup settings
  SELECT * INTO v_credits FROM user_credits WHERE user_id = p_user_id;

  -- Check if auto-topup is enabled
  IF NOT v_credits.auto_topup_enabled THEN
    RETURN QUERY SELECT false, 0, 'Auto-topup disabled'::TEXT;
    RETURN;
  END IF;

  -- Check if below threshold (only for non-unlimited plans)
  IF v_balance.total_available = -1 OR v_balance.total_available >= v_credits.auto_topup_threshold THEN
    RETURN QUERY SELECT false, 0, 'Above threshold'::TEXT;
    RETURN;
  END IF;

  -- Reset monthly counter if new month
  IF v_credits.auto_topup_month_start IS NULL OR
     date_trunc('month', v_credits.auto_topup_month_start) < date_trunc('month', now()) THEN
    UPDATE user_credits
    SET auto_topup_this_month = 0, auto_topup_month_start = now()
    WHERE user_id = p_user_id;
    v_credits.auto_topup_this_month := 0;
  END IF;

  -- Check monthly cap
  IF v_credits.auto_topup_max_monthly IS NOT NULL AND
     v_credits.auto_topup_this_month + v_credits.auto_topup_amount > v_credits.auto_topup_max_monthly THEN
    RETURN QUERY SELECT false, 0, 'Monthly cap reached'::TEXT;
    RETURN;
  END IF;

  -- Check if payment method exists
  IF v_credits.default_payment_method_id IS NULL THEN
    RETURN QUERY SELECT false, 0, 'No payment method'::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, v_credits.auto_topup_amount, 'Below threshold'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset plan credits at billing cycle start
CREATE OR REPLACE FUNCTION public.reset_plan_credits(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_old_credits INTEGER;
BEGIN
  -- Get current usage before reset
  SELECT credits_used INTO v_old_credits FROM usage WHERE user_id = p_user_id;

  -- Reset usage
  UPDATE usage
  SET
    credits_used = 0,
    period_start = now(),
    period_end = now() + interval '1 month',
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Log the reset
  INSERT INTO credit_transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'plan_allocation', 0, 'Monthly billing cycle reset');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
