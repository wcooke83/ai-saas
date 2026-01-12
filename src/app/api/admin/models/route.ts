/**
 * Admin AI Models API
 * GET /api/admin/models - List all models (optionally filtered by provider)
 * POST /api/admin/models - Create a new model
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, parseBody } from '@/lib/api/utils';
import type { CreateModelInput, AIModelWithProvider } from '@/types/ai-models';

// Validation schema for creating a model
const createModelSchema = z.object({
  provider_id: z.string().uuid(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(100),
  api_model_id: z.string().min(1).max(100),
  tier: z.enum(['fast', 'balanced', 'powerful']).optional().nullable(),
  is_enabled: z.boolean().optional().default(true),
  is_default: z.boolean().optional().default(false),
  max_tokens: z.number().int().min(1).optional().default(4096),
  supports_streaming: z.boolean().optional().default(true),
  cost_input_per_mtok: z.number().min(0),
  cost_output_per_mtok: z.number().min(0),
  wholesale_input_per_mtok: z.number().min(0),
  wholesale_output_per_mtok: z.number().min(0),
  retail_input_per_mtok: z.number().min(0),
  retail_output_per_mtok: z.number().min(0),
  display_order: z.number().int().min(0).optional().default(0),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get('provider_id');
    const includeDisabled = searchParams.get('include_disabled') === 'true';

    const supabase = createAdminClient();

    let query = supabase
      .from('ai_models')
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .order('display_order', { ascending: true });

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (!includeDisabled) {
      query = query.eq('is_enabled', true);
    }

    const { data: models, error } = await query;

    if (error) throw error;

    return successResponse({ models: models as AIModelWithProvider[] });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const input = await parseBody(req, createModelSchema) as CreateModelInput;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_models')
      .insert({
        provider_id: input.provider_id,
        slug: input.slug,
        name: input.name,
        api_model_id: input.api_model_id,
        tier: input.tier || null,
        is_enabled: input.is_enabled ?? true,
        is_default: input.is_default ?? false,
        max_tokens: input.max_tokens ?? 4096,
        supports_streaming: input.supports_streaming ?? true,
        cost_input_per_mtok: input.cost_input_per_mtok,
        cost_output_per_mtok: input.cost_output_per_mtok,
        wholesale_input_per_mtok: input.wholesale_input_per_mtok,
        wholesale_output_per_mtok: input.wholesale_output_per_mtok,
        retail_input_per_mtok: input.retail_input_per_mtok,
        retail_output_per_mtok: input.retail_output_per_mtok,
        display_order: input.display_order ?? 0,
      })
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .single();

    if (error) throw error;

    return successResponse({ model: data }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
