-- Business Hours & Event Type Configuration
-- Stores scheduling config locally so users never touch Cal.com directly

-- ============================================
-- calendar_event_types
-- ============================================
CREATE TABLE IF NOT EXISTS public.calendar_event_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid NOT NULL REFERENCES public.calendar_integrations(id) ON DELETE CASCADE,
  provider_event_type_id text,
  provider_schedule_id text,
  title text NOT NULL DEFAULT 'Appointment',
  slug text NOT NULL DEFAULT 'appointment',
  description text,
  duration_minutes integer NOT NULL DEFAULT 30,
  buffer_before_minutes integer DEFAULT 0,
  buffer_after_minutes integer DEFAULT 0,
  min_notice_hours integer DEFAULT 1,
  max_days_ahead integer DEFAULT 30,
  timezone text NOT NULL DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_calendar_event_types_integration ON public.calendar_event_types (integration_id);

-- ============================================
-- calendar_business_hours
-- ============================================
CREATE TABLE IF NOT EXISTS public.calendar_business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid NOT NULL REFERENCES public.calendar_integrations(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '17:00',
  is_enabled boolean DEFAULT true,
  UNIQUE(integration_id, day_of_week)
);

CREATE INDEX idx_calendar_business_hours_integration ON public.calendar_business_hours (integration_id);

-- ============================================
-- Triggers
-- ============================================
CREATE TRIGGER trg_calendar_event_types_updated_at
  BEFORE UPDATE ON public.calendar_event_types
  FOR EACH ROW EXECUTE FUNCTION update_calendar_updated_at();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.calendar_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage event types for own integrations"
  ON public.calendar_event_types FOR ALL
  USING (integration_id IN (SELECT id FROM public.calendar_integrations WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage business hours for own integrations"
  ON public.calendar_business_hours FOR ALL
  USING (integration_id IN (SELECT id FROM public.calendar_integrations WHERE user_id = auth.uid()));
