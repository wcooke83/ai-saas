/**
 * Admin AI Provider API (Single Provider)
 * GET /api/admin/providers/[id] - Get provider details with models
 * PUT /api/admin/providers/[id] - Update provider
 * DELETE /api/admin/providers/[id] - Delete provider (cascades to models)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import type { UpdateProviderInput } from '@/types/ai-models';

// Validation schema for updating a provider
const updateProviderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  is_enabled: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const supabase = createAdminClient();

    const { data: provider, error } = await supabase
      .from('ai_providers')
      .select(`
        *,
        ai_models (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound('Provider not found');
      }
      throw error;
    }

    return successResponse({ provider });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const input = await parseBody(req, updateProviderSchema) as UpdateProviderInput;
    const supabase = createAdminClient();

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.logo_url !== undefined) updateData.logo_url = input.logo_url;
    if (input.is_enabled !== undefined) updateData.is_enabled = input.is_enabled;
    if (input.display_order !== undefined) updateData.display_order = input.display_order;

    if (Object.keys(updateData).length === 0) {
      throw APIError.badRequest('No fields to update');
    }

    const { data, error } = await supabase
      .from('ai_providers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound('Provider not found');
      }
      throw error;
    }

    // If is_enabled changed, cascade to all models for this provider
    if (input.is_enabled !== undefined) {
      const { error: modelsError } = await supabase
        .from('ai_models')
        .update({ is_enabled: input.is_enabled })
        .eq('provider_id', id);

      if (modelsError) {
        console.error('Failed to cascade is_enabled to models:', modelsError);
        // Don't throw - the provider update succeeded
      }
    }

    return successResponse({ provider: data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const supabase = createAdminClient();

    // Check if provider exists
    const { data: existing, error: checkError } = await supabase
      .from('ai_providers')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (checkError || !existing) {
      throw APIError.notFound('Provider not found');
    }

    // Prevent deleting built-in providers
    const builtInSlugs = ['anthropic', 'openai', 'xai', 'google', 'meta', 'local'];
    if (builtInSlugs.includes(existing.slug)) {
      throw APIError.badRequest('Cannot delete built-in provider. Disable it instead.');
    }

    const { error } = await supabase
      .from('ai_providers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
