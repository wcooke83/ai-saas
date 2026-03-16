-- Add embedding provider configuration to app_settings
-- Allows admins to explicitly choose which AI provider to use for embeddings
-- Separate from the chat model selection

-- Add embedding_model_id column to app_settings
ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS embedding_model_id UUID REFERENCES public.ai_models(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_embedding_model_id 
ON public.app_settings(embedding_model_id);

-- Add comment
COMMENT ON COLUMN public.app_settings.embedding_model_id IS 
'AI model to use for generating embeddings in knowledge base. If NULL, auto-selects based on available providers (Gemini > OpenAI).';
