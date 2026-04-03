-- ============================================================
-- Status Page Tables
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE public.component_status AS ENUM (
  'operational', 'degraded', 'outage', 'maintenance'
);

CREATE TYPE public.incident_status AS ENUM (
  'investigating', 'identified', 'monitoring', 'resolved'
);

CREATE TYPE public.incident_update_status AS ENUM (
  'Investigating', 'Identified', 'Monitoring', 'Resolved'
);

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE public.status_components (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text        NOT NULL,
  slug           text        NOT NULL UNIQUE,
  category       text        NOT NULL,
  display_order  integer     NOT NULL DEFAULT 0,
  status         public.component_status NOT NULL DEFAULT 'operational',
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_components_display_order
  ON public.status_components (display_order ASC);

CREATE TABLE public.status_component_history (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid        NOT NULL REFERENCES public.status_components(id) ON DELETE CASCADE,
  status       public.component_status NOT NULL,
  recorded_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_component_history_component_date
  ON public.status_component_history (component_id, recorded_at DESC);


CREATE TABLE public.status_incidents (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text        NOT NULL,
  status              public.incident_status NOT NULL DEFAULT 'investigating',
  is_maintenance      boolean     NOT NULL DEFAULT false,
  affected_components text[]      NOT NULL DEFAULT '{}',
  scheduled_start     timestamptz,
  scheduled_end       timestamptz,
  started_at          timestamptz NOT NULL DEFAULT now(),
  resolved_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_maintenance_has_schedule CHECK (
    NOT is_maintenance OR (scheduled_start IS NOT NULL AND scheduled_end IS NOT NULL)
  )
);

CREATE INDEX idx_status_incidents_active
  ON public.status_incidents (resolved_at)
  WHERE resolved_at IS NULL;

CREATE INDEX idx_status_incidents_maintenance
  ON public.status_incidents (scheduled_end)
  WHERE is_maintenance = true;

CREATE INDEX idx_status_incidents_recent
  ON public.status_incidents (created_at DESC);

CREATE TABLE public.status_incident_updates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid        NOT NULL REFERENCES public.status_incidents(id) ON DELETE CASCADE,
  message     text        NOT NULL,
  status      public.incident_update_status NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_incident_updates_incident
  ON public.status_incident_updates (incident_id, created_at ASC);

-- ── Triggers ─────────────────────────────────────────────────────────────────

-- Auto-log status changes to history
CREATE OR REPLACE FUNCTION public.log_component_status_change()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_component_history (component_id, status, recorded_at)
    VALUES (NEW.id, NEW.status, now());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_component_status_history
  AFTER UPDATE ON public.status_components
  FOR EACH ROW
  EXECUTE FUNCTION public.log_component_status_change();

-- Reuse existing set_updated_at function (already defined in prior migrations)
CREATE TRIGGER trg_status_components_updated_at
  BEFORE UPDATE ON public.status_components
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_status_incidents_updated_at
  BEFORE UPDATE ON public.status_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.status_components       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_component_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_incidents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_incident_updates ENABLE ROW LEVEL SECURITY;

-- Public read (anon + authenticated)
CREATE POLICY status_components_public_read
  ON public.status_components FOR SELECT USING (true);

CREATE POLICY status_component_history_public_read
  ON public.status_component_history FOR SELECT USING (true);

CREATE POLICY status_incidents_public_read
  ON public.status_incidents FOR SELECT USING (true);

CREATE POLICY status_incident_updates_public_read
  ON public.status_incident_updates FOR SELECT USING (true);

-- Admin writes via service role in API routes (createAdminClient bypasses RLS).
-- DB-level guard as defence-in-depth using the existing is_admin() function.
CREATE POLICY status_components_admin_write
  ON public.status_components FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY status_component_history_admin_write
  ON public.status_component_history FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY status_incidents_admin_write
  ON public.status_incidents FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY status_incident_updates_admin_write
  ON public.status_incident_updates FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ── Seed Data ────────────────────────────────────────────────────────────────

INSERT INTO public.status_components (name, slug, category, display_order, status) VALUES
  ('Web App',                'web-app',               'core',           1, 'operational'),
  ('AI Generation (Claude)', 'ai-generation-claude',  'ai',             2, 'operational'),
  ('AI Fallback (OpenAI)',   'ai-fallback-openai',    'ai',             3, 'operational'),
  ('Knowledge Processing',  'knowledge-processing',  'ai',             4, 'operational'),
  ('Chat Widget / Embed',   'chat-widget-embed',     'core',           5, 'operational'),
  ('Billing (Stripe)',       'billing-stripe',        'payments',       6, 'operational'),
  ('Slack Integration',     'slack-integration',     'integrations',   7, 'operational'),
  ('Calendar Booking',      'calendar-booking',      'integrations',   8, 'operational'),
  ('Database / API',        'database-api',          'infrastructure', 9, 'operational');

-- Seed initial history row per component so 90-day bars have a baseline
INSERT INTO public.status_component_history (component_id, status, recorded_at)
SELECT id, status, now() FROM public.status_components;
