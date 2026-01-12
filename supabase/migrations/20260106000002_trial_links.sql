-- Trial Links Table
-- Supports both plan-specific trials and custom trial configurations
CREATE TABLE public.trial_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,                    -- Unique shareable code (e.g., 'SUMMER2024')

  -- Trial configuration
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  duration_days INTEGER NOT NULL DEFAULT 14,
  credits_limit INTEGER,                        -- Override plan credits (null = use plan default)
  features_override JSONB,                      -- Override plan features (null = use plan default)

  -- Usage limits
  max_redemptions INTEGER,                      -- null = unlimited redemptions
  redemptions_count INTEGER DEFAULT 0,

  -- Validity
  expires_at TIMESTAMPTZ,                       -- null = never expires
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  name TEXT,                                    -- Admin-friendly label
  description TEXT,                             -- Internal notes
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trial redemptions tracking
CREATE TABLE public.trial_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_link_id UUID NOT NULL REFERENCES public.trial_links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'expired', 'cancelled')),
  converted_at TIMESTAMPTZ,                     -- When user upgraded to paid plan

  UNIQUE(trial_link_id, user_id)                -- Prevent duplicate redemptions
);

-- Indexes
CREATE INDEX idx_trial_links_code ON public.trial_links(code);
CREATE INDEX idx_trial_links_active ON public.trial_links(is_active) WHERE is_active = true;
CREATE INDEX idx_trial_links_plan ON public.trial_links(plan_id);
CREATE INDEX idx_trial_redemptions_user ON public.trial_redemptions(user_id);
CREATE INDEX idx_trial_redemptions_status ON public.trial_redemptions(status);
CREATE INDEX idx_trial_redemptions_expires ON public.trial_redemptions(expires_at) WHERE status = 'active';

-- Enable RLS
ALTER TABLE public.trial_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_redemptions ENABLE ROW LEVEL SECURITY;

-- Trial links policies
CREATE POLICY "Admins can manage trial links"
  ON public.trial_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Allow public read access to active trial links (for redemption validation)
CREATE POLICY "Anyone can view active trial links"
  ON public.trial_links FOR SELECT
  USING (is_active = true);

-- Trial redemptions policies
CREATE POLICY "Users can view own redemptions"
  ON public.trial_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redemptions"
  ON public.trial_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all redemptions"
  ON public.trial_redemptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Triggers
CREATE TRIGGER set_trial_links_updated_at
  BEFORE UPDATE ON public.trial_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to redeem a trial link
CREATE OR REPLACE FUNCTION public.redeem_trial_link(
  p_code TEXT,
  p_user_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  trial_id UUID,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  v_trial trial_links%ROWTYPE;
  v_existing_redemption trial_redemptions%ROWTYPE;
  v_expires_at TIMESTAMPTZ;
  v_redemption_id UUID;
BEGIN
  -- Get trial link
  SELECT * INTO v_trial
  FROM trial_links
  WHERE code = p_code AND is_active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid or inactive trial code'::TEXT, NULL::UUID, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Check if expired
  IF v_trial.expires_at IS NOT NULL AND v_trial.expires_at < now() THEN
    RETURN QUERY SELECT false, 'Trial code has expired'::TEXT, NULL::UUID, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Check max redemptions
  IF v_trial.max_redemptions IS NOT NULL AND v_trial.redemptions_count >= v_trial.max_redemptions THEN
    RETURN QUERY SELECT false, 'Trial code has reached maximum redemptions'::TEXT, NULL::UUID, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Check if user already redeemed this trial
  SELECT * INTO v_existing_redemption
  FROM trial_redemptions
  WHERE trial_link_id = v_trial.id AND user_id = p_user_id;

  IF FOUND THEN
    RETURN QUERY SELECT false, 'You have already used this trial code'::TEXT, NULL::UUID, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  -- Calculate expiry
  v_expires_at := now() + (v_trial.duration_days * interval '1 day');

  -- Create redemption
  INSERT INTO trial_redemptions (trial_link_id, user_id, expires_at)
  VALUES (v_trial.id, p_user_id, v_expires_at)
  RETURNING id INTO v_redemption_id;

  -- Increment redemption count
  UPDATE trial_links
  SET redemptions_count = redemptions_count + 1
  WHERE id = v_trial.id;

  RETURN QUERY SELECT true, 'Trial activated successfully'::TEXT, v_redemption_id, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active trial
CREATE OR REPLACE FUNCTION public.get_active_trial(p_user_id UUID)
RETURNS TABLE (
  trial_id UUID,
  plan_id UUID,
  plan_slug TEXT,
  expires_at TIMESTAMPTZ,
  credits_limit INTEGER,
  features JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    tr.id,
    tl.plan_id,
    sp.slug,
    tr.expires_at,
    COALESCE(tl.credits_limit, sp.credits_monthly),
    COALESCE(tl.features_override, sp.features)
  FROM trial_redemptions tr
  JOIN trial_links tl ON tr.trial_link_id = tl.id
  LEFT JOIN subscription_plans sp ON tl.plan_id = sp.id
  WHERE tr.user_id = p_user_id
    AND tr.status = 'active'
    AND tr.expires_at > now()
  ORDER BY tr.expires_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to expire trial and handle conversion/downgrade
CREATE OR REPLACE FUNCTION public.expire_trial(p_redemption_id UUID, p_converted BOOLEAN DEFAULT false)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE trial_redemptions
  SET
    status = CASE WHEN p_converted THEN 'converted' ELSE 'expired' END,
    converted_at = CASE WHEN p_converted THEN now() ELSE NULL END
  WHERE id = p_redemption_id AND status = 'active';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
