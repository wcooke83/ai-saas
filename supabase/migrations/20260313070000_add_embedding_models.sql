-- Add dedicated embedding models to ai_models table
-- These are separate from chat models and used specifically for vector embeddings
-- Only includes models verified to work with the Google AI Studio API (GOOGLE_API_KEY)

-- Clean up any old non-working embedding model entries
DELETE FROM public.ai_models WHERE slug IN ('text-embedding-004', 'embedding-001')
  AND provider_id = (SELECT id FROM public.ai_providers WHERE slug = 'google');

-- Insert Gemini embedding model (verified working with Google AI Studio API)
INSERT INTO public.ai_models (
  provider_id, slug, name, api_model_id, tier, is_enabled, is_default, max_tokens,
  cost_input_per_mtok, cost_output_per_mtok,
  wholesale_input_per_mtok, wholesale_output_per_mtok,
  retail_input_per_mtok, retail_output_per_mtok,
  grade, display_order, supports_streaming
) VALUES
  -- gemini-embedding-001 (stable, free, verified working)
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'google'),
    'gemini-embedding-001', 'Gemini Embedding 001', 'gemini-embedding-001', NULL,
    true, false, 2048,
    0.00, 0.00,     -- Cost (free)
    0.00, 0.00,     -- Wholesale
    0.00, 0.00,     -- Retail
    'Free',
    100,
    false           -- Embeddings don't stream
  )
ON CONFLICT (provider_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  api_model_id = EXCLUDED.api_model_id,
  max_tokens = EXCLUDED.max_tokens,
  cost_input_per_mtok = EXCLUDED.cost_input_per_mtok,
  cost_output_per_mtok = EXCLUDED.cost_output_per_mtok,
  wholesale_input_per_mtok = EXCLUDED.wholesale_input_per_mtok,
  wholesale_output_per_mtok = EXCLUDED.wholesale_output_per_mtok,
  retail_input_per_mtok = EXCLUDED.retail_input_per_mtok,
  retail_output_per_mtok = EXCLUDED.retail_output_per_mtok,
  grade = EXCLUDED.grade,
  display_order = EXCLUDED.display_order,
  supports_streaming = EXCLUDED.supports_streaming;

-- Insert OpenAI embedding models
INSERT INTO public.ai_models (
  provider_id, slug, name, api_model_id, tier, is_enabled, is_default, max_tokens,
  cost_input_per_mtok, cost_output_per_mtok,
  wholesale_input_per_mtok, wholesale_output_per_mtok,
  retail_input_per_mtok, retail_output_per_mtok,
  grade, display_order, supports_streaming
) VALUES
  -- OpenAI text-embedding-3-small (best value)
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'text-embedding-3-small', 'Text Embedding 3 Small', 'text-embedding-3-small', NULL,
    true, false, 8191,
    0.02, 0.00,
    0.024, 0.00,
    0.03, 0.00,
    'Standard',
    101,
    false
  ),
  -- OpenAI text-embedding-3-large (most capable)
  (
    (SELECT id FROM public.ai_providers WHERE slug = 'openai'),
    'text-embedding-3-large', 'Text Embedding 3 Large', 'text-embedding-3-large', NULL,
    true, false, 8191,
    0.13, 0.00,
    0.156, 0.00,
    0.195, 0.00,
    'Premium',
    102,
    false
  )
ON CONFLICT (provider_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  api_model_id = EXCLUDED.api_model_id,
  max_tokens = EXCLUDED.max_tokens,
  cost_input_per_mtok = EXCLUDED.cost_input_per_mtok,
  cost_output_per_mtok = EXCLUDED.cost_output_per_mtok,
  wholesale_input_per_mtok = EXCLUDED.wholesale_input_per_mtok,
  wholesale_output_per_mtok = EXCLUDED.wholesale_output_per_mtok,
  retail_input_per_mtok = EXCLUDED.retail_input_per_mtok,
  retail_output_per_mtok = EXCLUDED.retail_output_per_mtok,
  grade = EXCLUDED.grade,
  display_order = EXCLUDED.display_order,
  supports_streaming = EXCLUDED.supports_streaming;

-- Remove legacy ada-002 if present (superseded by text-embedding-3-small)
DELETE FROM public.ai_models WHERE slug = 'text-embedding-ada-002'
  AND provider_id = (SELECT id FROM public.ai_providers WHERE slug = 'openai');
