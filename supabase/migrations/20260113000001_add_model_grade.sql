-- Add grade column to ai_models table
-- Grade is a marketing tier name for the model

ALTER TABLE public.ai_models
ADD COLUMN IF NOT EXISTS grade TEXT NOT NULL DEFAULT 'Standard';

-- Remove the default after adding (so new inserts require it)
ALTER TABLE public.ai_models
ALTER COLUMN grade DROP DEFAULT;

-- Add index for grade filtering
CREATE INDEX IF NOT EXISTS idx_ai_models_grade ON public.ai_models(grade);
