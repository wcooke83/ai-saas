/**
 * Admin AI Model API (Single Model)
 * GET /api/admin/models/[id] - Get model details
 * PUT /api/admin/models/[id] - Update model
 * DELETE /api/admin/models/[id] - Delete model
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import type { UpdateModelInput } from '@/types/ai-models';

// Validation schema for updating a model
const updateModelSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  api_model_id: z.string().min(1).max(100).optional(),
  tier: z.enum(['fast', 'balanced', 'powerful']).optional().nullable(),
  grade: z.string().min(1).max(50).optional(),
  is_enabled: z.boolean().optional(),
  is_default: z.boolean().optional(),
  max_tokens: z.number().int().min(1).optional(),
  supports_streaming: z.boolean().optional(),
  cost_input_per_mtok: z.number().min(0).optional(),
  cost_output_per_mtok: z.number().min(0).optional(),
  wholesale_input_per_mtok: z.number().min(0).optional(),
  wholesale_output_per_mtok: z.number().min(0).optional(),
  retail_input_per_mtok: z.number().min(0).optional(),
  retail_output_per_mtok: z.number().min(0).optional(),
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

    const { data: model, error } = await supabase
      .from('ai_models')
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound('Model not found');
      }
      throw error;
    }

    return successResponse({ model });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const input = await parseBody(req, updateModelSchema) as UpdateModelInput;
    const supabase = createAdminClient();

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.api_model_id !== undefined) updateData.api_model_id = input.api_model_id;
    if (input.tier !== undefined) updateData.tier = input.tier;
    if (input.grade !== undefined) updateData.grade = input.grade;
    if (input.is_enabled !== undefined) updateData.is_enabled = input.is_enabled;
    if (input.is_default !== undefined) updateData.is_default = input.is_default;
    if (input.max_tokens !== undefined) updateData.max_tokens = input.max_tokens;
    if (input.supports_streaming !== undefined) updateData.supports_streaming = input.supports_streaming;
    if (input.cost_input_per_mtok !== undefined) updateData.cost_input_per_mtok = input.cost_input_per_mtok;
    if (input.cost_output_per_mtok !== undefined) updateData.cost_output_per_mtok = input.cost_output_per_mtok;
    if (input.wholesale_input_per_mtok !== undefined) updateData.wholesale_input_per_mtok = input.wholesale_input_per_mtok;
    if (input.wholesale_output_per_mtok !== undefined) updateData.wholesale_output_per_mtok = input.wholesale_output_per_mtok;
    if (input.retail_input_per_mtok !== undefined) updateData.retail_input_per_mtok = input.retail_input_per_mtok;
    if (input.retail_output_per_mtok !== undefined) updateData.retail_output_per_mtok = input.retail_output_per_mtok;
    if (input.display_order !== undefined) updateData.display_order = input.display_order;

    if (Object.keys(updateData).length === 0) {
      throw APIError.badRequest('No fields to update');
    }

    const { data, error } = await supabase
      .from('ai_models')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw APIError.notFound('Model not found');
      }
      throw error;
    }

    return successResponse({ model: data });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(req);
    const { id } = await params;

    const supabase = createAdminClient();

    // Check if model exists and is not the default
    const { data: existing, error: checkError } = await supabase
      .from('ai_models')
      .select('id, is_default')
      .eq('id', id)
      .single();

    if (checkError || !existing) {
      throw APIError.notFound('Model not found');
    }

    if (existing.is_default) {
      throw APIError.badRequest('Cannot delete the default model. Set another model as default first.');
    }

    // Clear any user preferences pointing to this model
    await supabase
      .from('profiles')
      .update({ preferred_model_id: null })
      .eq('preferred_model_id', id);

    const { error } = await supabase
      .from('ai_models')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
