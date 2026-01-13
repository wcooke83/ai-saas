-- Add is_hidden column to subscription_plans
-- Allows plans to be active (for existing subscribers) but hidden from pricing page

ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Update RLS policy to allow viewing non-hidden plans
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;

CREATE POLICY "Anyone can view active non-hidden plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true AND is_hidden = false);

-- Admins can still see all plans (existing policy covers this)
