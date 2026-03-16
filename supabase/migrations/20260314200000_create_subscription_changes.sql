-- Create subscription_changes table to track upgrades/downgrades with credits
CREATE TABLE IF NOT EXISTS subscription_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_plan_id UUID REFERENCES subscription_plans(id),
  new_plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  old_stripe_subscription_id TEXT,
  new_stripe_subscription_id TEXT,
  credit_amount_cents INTEGER NOT NULL DEFAULT 0,
  applied_to_invoice_id TEXT,
  change_type TEXT NOT NULL CHECK (change_type IN ('upgrade', 'downgrade', 'interval_change')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'refunded', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by user
CREATE INDEX IF NOT EXISTS idx_subscription_changes_user_id ON subscription_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_changes_status ON subscription_changes(status);

-- Enable RLS
ALTER TABLE subscription_changes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscription changes
CREATE POLICY "Users can view own subscription changes" ON subscription_changes
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can manage all
CREATE POLICY "Admins can manage subscription changes" ON subscription_changes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

COMMENT ON TABLE subscription_changes IS 'Tracks subscription upgrades/downgrades with prorated credits';
