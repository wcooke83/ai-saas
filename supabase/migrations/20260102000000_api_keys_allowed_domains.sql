-- Add allowed_domains column to api_keys for domain restriction
-- This allows users to restrict their API keys to specific domains for embed security

ALTER TABLE public.api_keys
ADD COLUMN allowed_domains TEXT[] DEFAULT NULL;

-- Add policy for users to update their own api_keys
CREATE POLICY "Users can update own api_keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON COLUMN public.api_keys.allowed_domains IS 'List of allowed domains for this API key. NULL means no restriction. Empty array means blocked from all origins.';
