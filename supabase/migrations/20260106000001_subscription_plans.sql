-- Subscription Plans Table (database-driven plans, replacing hardcoded PLAN_LIMITS)
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                    -- 'free', 'pro', 'enterprise'
  name TEXT NOT NULL,                           -- 'Free', 'Pro', 'Enterprise'
  description TEXT,

  -- Pricing
  price_monthly_cents INTEGER NOT NULL DEFAULT 0,
  price_yearly_cents INTEGER,                   -- null = no yearly option
  stripe_price_id_monthly TEXT,                 -- Stripe Price ID for monthly
  stripe_price_id_yearly TEXT,                  -- Stripe Price ID for yearly

  -- Credit allocation
  credits_monthly INTEGER NOT NULL DEFAULT 0,   -- Monthly token allocation (-1 = unlimited)
  credits_rollover BOOLEAN DEFAULT false,       -- Do unused credits roll over?

  -- Rate limiting (Claude-style)
  rate_limit_tokens INTEGER,                    -- e.g., 1000 tokens per window
  rate_limit_period_seconds INTEGER,            -- e.g., 7200 (2 hours)
  rate_limit_is_hard_cap BOOLEAN DEFAULT true,  -- true = block, false = charge overage

  -- Features
  features JSONB DEFAULT '{}',                  -- Feature flags
  api_keys_limit INTEGER DEFAULT 2,             -- -1 = unlimited

  -- Trial configuration
  trial_days INTEGER DEFAULT 0,                 -- 0 = no trial
  trial_credits INTEGER,                        -- Credits during trial (null = use credits_monthly)

  -- Display
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,            -- Highlight on pricing page
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscription_plans_slug ON public.subscription_plans(slug);
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Public can view active plans
CREATE POLICY "Anyone can view active plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- Admins can manage all plans
CREATE POLICY "Admins can manage plans"
  ON public.subscription_plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Seed default plans
INSERT INTO public.subscription_plans (
  slug, name, description,
  price_monthly_cents, price_yearly_cents,
  credits_monthly,
  rate_limit_tokens, rate_limit_period_seconds, rate_limit_is_hard_cap,
  api_keys_limit, trial_days,
  display_order, is_featured,
  features
) VALUES
  (
    'free',
    'Free',
    'Perfect for trying out our AI tools',
    0,
    NULL,
    100,
    50, 3600, true,  -- 50 tokens per hour, hard cap
    2, 0,
    1, false,
    '{"email_writer": true, "proposal_generator": "basic", "social_post": true}'::jsonb
  ),
  (
    'pro',
    'Pro',
    'For professionals and small teams',
    2900,  -- $29/month
    29000, -- $290/year (2 months free)
    1000,
    500, 3600, false,  -- 500 tokens per hour, soft cap (overage charged)
    -1, 14,  -- unlimited API keys, 14-day trial
    2, true,
    '{"email_writer": true, "proposal_generator": "advanced", "social_post": true, "blog_writer": true, "ad_copy": true, "meeting_notes": true, "pdf_export": true, "docx_export": true, "priority_support": true}'::jsonb
  ),
  (
    'enterprise',
    'Enterprise',
    'For large teams with custom needs',
    0,  -- Custom pricing (contact sales)
    NULL,
    -1,  -- Unlimited credits
    -1, 0, true,  -- No rate limit
    -1, 0,  -- unlimited API keys, no default trial
    3, false,
    '{"email_writer": true, "proposal_generator": "advanced", "social_post": true, "blog_writer": true, "ad_copy": true, "meeting_notes": true, "pdf_export": true, "docx_export": true, "priority_support": true, "dedicated_support": true, "sso": true, "custom_integrations": true, "sla": true}'::jsonb
  );
