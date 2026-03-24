-- Calendar Booking Integration
-- Adds calendar_integrations, calendar_bookings, and calendar_availability_cache tables

-- ============================================
-- calendar_integrations
-- ============================================
CREATE TABLE IF NOT EXISTS public.calendar_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('hosted_calcom', 'customer_calcom', 'calendly')),
  is_active boolean DEFAULT true,
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Each chatbot can only have one active integration per provider
CREATE UNIQUE INDEX idx_calendar_integrations_chatbot_provider
  ON public.calendar_integrations (chatbot_id, provider)
  WHERE is_active = true;

CREATE INDEX idx_calendar_integrations_user ON public.calendar_integrations (user_id);

-- ============================================
-- calendar_bookings
-- ============================================
CREATE TABLE IF NOT EXISTS public.calendar_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES public.calendar_integrations(id) ON DELETE SET NULL,
  chatbot_id uuid NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  chat_session_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  provider text NOT NULL,
  provider_booking_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rescheduled', 'no_show')),
  attendee_name text NOT NULL,
  attendee_email text NOT NULL,
  attendee_timezone text NOT NULL DEFAULT 'UTC',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  meeting_url text,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_calendar_bookings_chatbot ON public.calendar_bookings (chatbot_id);
CREATE INDEX idx_calendar_bookings_integration ON public.calendar_bookings (integration_id);
CREATE INDEX idx_calendar_bookings_provider_id ON public.calendar_bookings (provider_booking_id);
CREATE INDEX idx_calendar_bookings_status ON public.calendar_bookings (status);
CREATE INDEX idx_calendar_bookings_start_time ON public.calendar_bookings (start_time);

-- ============================================
-- calendar_availability_cache
-- ============================================
CREATE TABLE IF NOT EXISTS public.calendar_availability_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid NOT NULL REFERENCES public.calendar_integrations(id) ON DELETE CASCADE,
  date date NOT NULL,
  slots jsonb NOT NULL,
  fetched_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE(integration_id, date)
);

CREATE INDEX idx_calendar_availability_cache_expires ON public.calendar_availability_cache (expires_at);

-- ============================================
-- Updated_at triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_calendar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calendar_integrations_updated_at
  BEFORE UPDATE ON public.calendar_integrations
  FOR EACH ROW EXECUTE FUNCTION update_calendar_updated_at();

CREATE TRIGGER trg_calendar_bookings_updated_at
  BEFORE UPDATE ON public.calendar_bookings
  FOR EACH ROW EXECUTE FUNCTION update_calendar_updated_at();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_availability_cache ENABLE ROW LEVEL SECURITY;

-- calendar_integrations: users can manage their own via chatbot ownership
CREATE POLICY "Users can view own calendar integrations"
  ON public.calendar_integrations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own calendar integrations"
  ON public.calendar_integrations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own calendar integrations"
  ON public.calendar_integrations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own calendar integrations"
  ON public.calendar_integrations FOR DELETE
  USING (user_id = auth.uid());

-- calendar_bookings: readable by integration owner (via chatbot ownership)
CREATE POLICY "Users can view bookings for own chatbots"
  ON public.calendar_bookings FOR SELECT
  USING (
    chatbot_id IN (
      SELECT id FROM public.chatbots WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage bookings for own chatbots"
  ON public.calendar_bookings FOR ALL
  USING (
    chatbot_id IN (
      SELECT id FROM public.chatbots WHERE user_id = auth.uid()
    )
  );

-- calendar_availability_cache: readable via integration ownership
CREATE POLICY "Users can view availability cache for own integrations"
  ON public.calendar_availability_cache FOR SELECT
  USING (
    integration_id IN (
      SELECT id FROM public.calendar_integrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage availability cache for own integrations"
  ON public.calendar_availability_cache FOR ALL
  USING (
    integration_id IN (
      SELECT id FROM public.calendar_integrations WHERE user_id = auth.uid()
    )
  );
