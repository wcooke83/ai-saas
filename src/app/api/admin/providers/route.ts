/**
 * Admin AI Providers API
 * GET /api/admin/providers - List all providers with model counts
 * POST /api/admin/providers - Create a new provider
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, parseBody } from '@/lib/api/utils';
import type { AIProviderWithModels, CreateProviderInput } from '@/types/ai-models';

// Validation schema for creating a provider
const createProviderSchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  logo_url: z.string().url().optional().nullable(),
  is_enabled: z.boolean().optional().default(true),
  display_order: z.number().int().min(0).optional().default(0),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const supabase = createAdminClient();

    // Get all providers with model counts
    const { data: providers, error } = await supabase
      .from('ai_providers')
      .select(`
        *,
        ai_models (count)
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Transform to include model count
    const providersWithCounts: AIProviderWithModels[] = (providers || []).map((p: any) => ({
      ...p,
      models: [],
      models_count: p.ai_models?.[0]?.count || 0,
    }));

    return successResponse({ providers: providersWithCounts });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const input = await parseBody(req, createProviderSchema) as CreateProviderInput;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_providers')
      .insert({
        slug: input.slug,
        name: input.name,
        description: input.description || null,
        logo_url: input.logo_url || null,
        is_enabled: input.is_enabled ?? true,
        display_order: input.display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse({ provider: data }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
