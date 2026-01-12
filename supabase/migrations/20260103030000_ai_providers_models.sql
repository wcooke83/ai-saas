-- AI Providers and Models Configuration
-- Enables admin to configure available AI providers and models with three-tier pricing

-- =============================================================================
-- AI PROVIDERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

-- Admin can manage providers
CREATE POLICY "Admin can manage providers"
  ON public.ai_providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- All authenticated users can view enabled providers
CREATE POLICY "Users can view enabled providers"
  ON public.ai_providers
  FOR SELECT
  USING (is_enabled = true);

-- =============================================================================
-- AI MODELS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  api_model_id TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('fast', 'balanced', 'powerful')),
  is_enabled BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  max_tokens INTEGER DEFAULT 4096,
  supports_streaming BOOLEAN DEFAULT true,

  -- Three-tier pricing (per million tokens)
  cost_input_per_mtok DECIMAL(10,4) DEFAULT 0,
  cost_output_per_mtok DECIMAL(10,4) DEFAULT 0,
  wholesale_input_per_mtok DECIMAL(10,4) DEFAULT 0,
  wholesale_output_per_mtok DECIMAL(10,4) DEFAULT 0,
  retail_input_per_mtok DECIMAL(10,4) DEFAULT 0,
  retail_output_per_mtok DECIMAL(10,4) DEFAULT 0,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(provider_id, slug)
);

-- Enable RLS
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

-- Admin can manage models
CREATE POLICY "Admin can manage models"
  ON public.ai_models
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- All authenticated users can view enabled models from enabled providers
CREATE POLICY "Users can view enabled models"
  ON public.ai_models
  FOR SELECT
  USING (
    is_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.ai_providers
      WHERE ai_providers.id = ai_models.provider_id
      AND ai_providers.is_enabled = true
    )
  );

-- =============================================================================
-- MODIFY PROFILES TABLE
-- =============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferred_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_affiliate BOOLEAN DEFAULT false;

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_providers_slug ON public.ai_providers(slug);
CREATE INDEX IF NOT EXISTS idx_ai_providers_enabled ON public.ai_providers(is_enabled);
CREATE INDEX IF NOT EXISTS idx_ai_models_provider_id ON public.ai_models(provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_slug ON public.ai_models(slug);
CREATE INDEX IF NOT EXISTS idx_ai_models_tier ON public.ai_models(tier);
CREATE INDEX IF NOT EXISTS idx_ai_models_enabled ON public.ai_models(is_enabled);
CREATE INDEX IF NOT EXISTS idx_ai_models_default ON public.ai_models(is_default) WHERE is_default = true;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update updated_at on ai_providers
CREATE TRIGGER update_ai_providers_updated_at
  BEFORE UPDATE ON public.ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update updated_at on ai_models
CREATE TRIGGER update_ai_models_updated_at
  BEFORE UPDATE ON public.ai_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Ensure only one default model
CREATE OR REPLACE FUNCTION ensure_single_default_model()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.ai_models
    SET is_default = false
    WHERE id != NEW.id AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_model_trigger
  BEFORE INSERT OR UPDATE ON public.ai_models
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION ensure_single_default_model();

-- =============================================================================
-- SEED DATA: PROVIDERS
-- =============================================================================

INSERT INTO public.ai_providers (slug, name, description, is_enabled, display_order) VALUES
  ('anthropic', 'Anthropic', 'Claude AI models - safe, helpful, and honest', true, 1),
  ('openai', 'OpenAI', 'GPT models including GPT-4o and o1 reasoning', true, 2),
  ('xai', 'xAI', 'Grok models with real-time knowledge', true, 3),
  ('google', 'Google', 'Gemini models with multimodal capabilities', true, 4),
  ('meta', 'Meta', 'Open-source Llama models', true, 5),
  ('local', 'Local', 'Self-hosted or local AI models', true, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- =============================================================================
-- SEED DATA: MODELS
-- Pricing is per million tokens (MTok)
-- =============================================================================

-- Anthropic Claude models
INSERT INTO public.ai_models (
  provider_id, slug, name, api_model_id, tier, is_enabled, is_default, max_tokens,
  cost_input_per_mtok, cost_output_per_mtok,
  wholesale_input_per_mtok, wholesale_output_per_mtok,
  retail_input_per_mtok, retail_output_per_mtok,
  display_order
) VALUES
  -- Claude Opus 4.5
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'anthropic'),
    'claude-opus-4-5', 'Claude Opus 4.5', 'claude-opus-4-5-20251101', 'powerful',
    true, false, 8192,
    15.00, 75.00,   -- Cost (what we pay Anthropic)
    18.00, 90.00,   -- Wholesale (affiliates)
    22.50, 112.50,  -- Retail (users) ~50% markup
    1
  ),
  -- Claude Sonnet 4.5
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'anthropic'),
    'claude-sonnet-4-5', 'Claude Sonnet 4.5', 'claude-sonnet-4-5-20250929', 'balanced',
    true, true, 8192,  -- Default model
    3.00, 15.00,    -- Cost
    3.60, 18.00,    -- Wholesale
    4.50, 22.50,    -- Retail
    2
  ),
  -- Claude Haiku 4.5
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'anthropic'),
    'claude-haiku-4-5', 'Claude Haiku 4.5', 'claude-haiku-4-5-20251001', 'fast',
    true, false, 8192,
    1.00, 5.00,     -- Cost
    1.20, 6.00,     -- Wholesale
    1.50, 7.50,     -- Retail
    3
  ),

  -- OpenAI models
  -- GPT-4o
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'gpt-4o', 'GPT-4o', 'gpt-4o', 'balanced',
    true, false, 4096,
    2.50, 10.00,    -- Cost
    3.00, 12.00,    -- Wholesale
    3.75, 15.00,    -- Retail
    1
  ),
  -- GPT-4o mini
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'gpt-4o-mini', 'GPT-4o Mini', 'gpt-4o-mini', 'fast',
    true, false, 4096,
    0.15, 0.60,     -- Cost
    0.18, 0.72,     -- Wholesale
    0.23, 0.90,     -- Retail
    2
  ),
  -- o1
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'o1', 'o1', 'o1', 'powerful',
    true, false, 32768,
    15.00, 60.00,   -- Cost
    18.00, 72.00,   -- Wholesale
    22.50, 90.00,   -- Retail
    3
  ),
  -- o1-mini
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'o1-mini', 'o1 Mini', 'o1-mini', 'balanced',
    true, false, 32768,
    3.00, 12.00,    -- Cost
    3.60, 14.40,    -- Wholesale
    4.50, 18.00,    -- Retail
    4
  ),

  -- xAI Grok models
  -- Grok-2
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'xai'),
    'grok-2', 'Grok 2', 'grok-2-latest', 'powerful',
    true, false, 8192,
    2.00, 10.00,    -- Cost
    2.40, 12.00,    -- Wholesale
    3.00, 15.00,    -- Retail
    1
  ),
  -- Grok-2 mini
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'xai'),
    'grok-2-mini', 'Grok 2 Mini', 'grok-2-mini', 'fast',
    true, false, 8192,
    0.30, 1.00,     -- Cost
    0.36, 1.20,     -- Wholesale
    0.45, 1.50,     -- Retail
    2
  ),

  -- Google Gemini models
  -- Gemini 2.0 Flash
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'google'),
    'gemini-2-flash', 'Gemini 2.0 Flash', 'gemini-2.0-flash', 'fast',
    true, false, 8192,
    0.10, 0.40,     -- Cost
    0.12, 0.48,     -- Wholesale
    0.15, 0.60,     -- Retail
    1
  ),
  -- Gemini 1.5 Pro
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'google'),
    'gemini-1-5-pro', 'Gemini 1.5 Pro', 'gemini-1.5-pro', 'powerful',
    true, false, 8192,
    1.25, 5.00,     -- Cost
    1.50, 6.00,     -- Wholesale
    1.88, 7.50,     -- Retail
    2
  ),

  -- Meta Llama models
  -- Llama 3.3 70B
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'meta'),
    'llama-3-3-70b', 'Llama 3.3 70B', 'llama-3.3-70b', 'balanced',
    true, false, 4096,
    0.80, 0.80,     -- Cost (via provider like Together/Groq)
    0.96, 0.96,     -- Wholesale
    1.20, 1.20,     -- Retail
    1
  ),

  -- Local models
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'local'),
    'local-default', 'Local Model', 'local', 'balanced',
    true, false, 4096,
    0.00, 0.00,     -- Cost (free - self-hosted)
    0.00, 0.00,     -- Wholesale
    0.00, 0.00,     -- Retail
    1
  )
ON CONFLICT (provider_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  api_model_id = EXCLUDED.api_model_id,
  tier = EXCLUDED.tier,
  cost_input_per_mtok = EXCLUDED.cost_input_per_mtok,
  cost_output_per_mtok = EXCLUDED.cost_output_per_mtok,
  wholesale_input_per_mtok = EXCLUDED.wholesale_input_per_mtok,
  wholesale_output_per_mtok = EXCLUDED.wholesale_output_per_mtok,
  retail_input_per_mtok = EXCLUDED.retail_input_per_mtok,
  retail_output_per_mtok = EXCLUDED.retail_output_per_mtok;
