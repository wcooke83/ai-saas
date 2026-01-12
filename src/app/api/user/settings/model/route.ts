/**
 * User Model Preference API
 * PUT /api/user/settings/model - Update user's preferred AI model
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';

const updateModelSchema = z.object({
  model_id: z.string().uuid('Invalid model ID'),
});

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const { model_id } = await parseBody(req, updateModelSchema);
    const supabase = createAdminClient();

    // Verify the model exists and is enabled
    const { data: model, error: modelError } = await supabase
      .from('ai_models')
      .select(`
        id,
        name,
        is_enabled,
        provider:ai_providers (
          id,
          is_enabled
        )
      `)
      .eq('id', model_id)
      .single();

    if (modelError || !model) {
      throw APIError.notFound('Model not found');
    }

    if (!model.is_enabled) {
      throw APIError.badRequest('This model is currently disabled');
    }

    if (!model.provider?.is_enabled) {
      throw APIError.badRequest('This model\'s provider is currently disabled');
    }

    // Update user's preferred model
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ preferred_model_id: model_id })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return successResponse({
      model_id,
      model_name: model.name,
      message: `AI model updated to ${model.name}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const supabase = createAdminClient();

    // Clear user's preferred model (will fall back to default)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ preferred_model_id: null })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return successResponse({
      model_id: null,
      message: 'AI model preference cleared. Will use system default.',
    });
  } catch (error) {
    return errorResponse(error);
  }
}
