-- Remove duplicate Google/Gemini models and fix display_order

-- Remove Gemini 2.0 Flash (Experimental) - superseded by stable gemini-2-flash
DELETE FROM public.ai_models WHERE slug = 'gemini-2-flash-exp';

-- Remove duplicate Gemini 1.5 Pro (gemini-1-5-pro-002) - same as gemini-1-5-pro
DELETE FROM public.ai_models WHERE slug = 'gemini-1-5-pro-002';

-- Fix display_order for remaining Google models
UPDATE public.ai_models SET display_order = 1 WHERE slug = 'gemini-2-flash';
UPDATE public.ai_models SET display_order = 2 WHERE slug = 'gemini-1-5-flash';
UPDATE public.ai_models SET display_order = 3 WHERE slug = 'gemini-1-5-pro';
