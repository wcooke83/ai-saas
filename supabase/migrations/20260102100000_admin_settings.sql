-- Migration: Add admin support and app settings
-- Adds is_admin to profiles and creates app_settings table

-- ===================
-- ADD ADMIN COLUMN TO PROFILES
-- ===================
ALTER TABLE public.profiles
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- ===================
-- APP SETTINGS TABLE (Global settings, singleton)
-- ===================
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- AI Provider: 'claude' | 'local'
  ai_provider TEXT DEFAULT 'claude' NOT NULL,
  -- Path to local AI script (used when ai_provider = 'local')
  local_api_path TEXT DEFAULT '/home/wcooke/projects/ai-prompt/ai-prompt-cli/ai-prompt.py',
  -- Local API options
  local_api_timeout INTEGER DEFAULT 120,
  local_api_provider TEXT DEFAULT 'claude', -- chatgpt, claude, grok
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Insert default settings row
INSERT INTO public.app_settings (id) VALUES (uuid_generate_v4());

-- ===================
-- RLS POLICIES
-- ===================
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view settings
CREATE POLICY "Admins can view app settings"
  ON public.app_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Only admins can update settings
CREATE POLICY "Admins can update app settings"
  ON public.app_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===================
-- HELPER FUNCTION TO CHECK ADMIN STATUS
-- ===================
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================
-- UPDATED_AT TRIGGER
-- ===================
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
