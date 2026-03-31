-- Add chatbot_id column and RLS policies to existing webhooks table
-- The webhooks table was created manually in production; this migration
-- adds the chatbot_id FK and row-level security so users can only
-- manage their own webhook subscriptions.

-- ── Add chatbot_id column ─────────────────────────────────────────────
ALTER TABLE public.webhooks
  ADD COLUMN IF NOT EXISTS chatbot_id uuid REFERENCES public.chatbots(id) ON DELETE CASCADE;

-- Index for fan-out queries (deliver.ts queries by user_id + is_active)
CREATE INDEX IF NOT EXISTS idx_webhooks_user_active
  ON public.webhooks (user_id, is_active)
  WHERE is_active = true;

-- Index for chatbot-scoped lookups
CREATE INDEX IF NOT EXISTS idx_webhooks_chatbot_id
  ON public.webhooks (chatbot_id)
  WHERE chatbot_id IS NOT NULL;

-- ── Enable RLS ────────────────────────────────────────────────────────
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Users can read their own webhooks
CREATE POLICY webhooks_select_own ON public.webhooks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert webhooks for themselves
CREATE POLICY webhooks_insert_own ON public.webhooks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own webhooks
CREATE POLICY webhooks_update_own ON public.webhooks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own webhooks
CREATE POLICY webhooks_delete_own ON public.webhooks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role (admin client) bypasses RLS automatically.
-- The delivery system uses createAdminClient() so it is unaffected.

-- ── Updated_at trigger ────────────────────────────────────────────────
-- Reuse the set_updated_at trigger function if it already exists,
-- otherwise create it.
CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach to webhooks so updated_at auto-populates on UPDATE
DROP TRIGGER IF EXISTS webhooks_set_updated_at ON public.webhooks;
CREATE TRIGGER webhooks_set_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
