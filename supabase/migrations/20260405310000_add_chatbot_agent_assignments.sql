-- Migration: chatbot agent assignments
-- Allows chatbot owners to assign their chatbots to other VocUI accounts with granular permissions.

-- =====================
-- TABLE
-- =====================

CREATE TABLE public.chatbot_agent_assignments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id    uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  owner_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  can_handle_conversations boolean NOT NULL DEFAULT true,
  can_modify_settings      boolean NOT NULL DEFAULT false,
  can_manage_knowledge     boolean NOT NULL DEFAULT false,
  can_view_analytics       boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  revoked_at    timestamptz,
  CONSTRAINT can_handle_conversations_must_be_true CHECK (can_handle_conversations = true),
  CONSTRAINT agent_not_owner CHECK (agent_id <> owner_id),
  UNIQUE (chatbot_id, agent_id)
);

CREATE INDEX idx_caa_agent_active  ON chatbot_agent_assignments (agent_id, status) WHERE status = 'active';
CREATE INDEX idx_caa_chatbot_owner ON chatbot_agent_assignments (chatbot_id, owner_id) WHERE status = 'active';

-- =====================
-- TRIGGER: auto-update updated_at
-- set_updated_at() is already defined in a prior migration — just attach the trigger.
-- =====================

DROP TRIGGER IF EXISTS caa_set_updated_at ON public.chatbot_agent_assignments;
CREATE TRIGGER caa_set_updated_at
  BEFORE UPDATE ON public.chatbot_agent_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================
-- RLS
-- =====================

ALTER TABLE public.chatbot_agent_assignments ENABLE ROW LEVEL SECURITY;

-- Owner: full access to their own assignments
CREATE POLICY caa_owner_all ON public.chatbot_agent_assignments
  FOR ALL
  USING  (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Agent: can read their own active assignments
CREATE POLICY caa_agent_select ON public.chatbot_agent_assignments
  FOR SELECT
  USING (agent_id = auth.uid() AND status = 'active');

-- Service role bypasses RLS by default; nothing extra needed.

-- =====================
-- Allow assigned agents to read chatbot config
-- =====================

CREATE POLICY chatbots_assigned_agent_select ON public.chatbots
  FOR SELECT
  USING (
    id IN (
      SELECT chatbot_id FROM public.chatbot_agent_assignments
      WHERE agent_id = auth.uid() AND status = 'active'
    )
  );
