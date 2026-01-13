/**
 * User Available Models API
 * GET /api/user/models - Get all available models for the current user
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getCostIndicator, type UserAvailableModel } from '@/types/ai-models';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const supabase = createAdminClient();

    // Get user's profile to check if they're an affiliate and their current preference
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferred_model_id, is_affiliate')
      .eq('id', user.id)
      .single();

    const isAffiliate = profile?.is_affiliate || false;
    const currentModelId = profile?.preferred_model_id || null;

    // Get all enabled models from enabled providers
    const { data: models, error } = await supabase
      .from('ai_models')
      .select(`
        id,
        provider_id,
        slug,
        name,
        tier,
        grade,
        is_enabled,
        is_default,
        retail_input_per_mtok,
        retail_output_per_mtok,
        wholesale_input_per_mtok,
        wholesale_output_per_mtok,
        provider:ai_providers (
          id,
          slug,
          name,
          is_enabled
        )
      `)
      .eq('is_enabled', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Filter and transform models for user
    const availableModels: UserAvailableModel[] = (models || [])
      .filter((model: any) => model.provider?.is_enabled)
      .map((model: any) => {
        // Use wholesale pricing for affiliates, retail for regular users
        const inputPrice = isAffiliate
          ? model.wholesale_input_per_mtok
          : model.retail_input_per_mtok;
        const outputPrice = isAffiliate
          ? model.wholesale_output_per_mtok
          : model.retail_output_per_mtok;

        return {
          id: model.id,
          provider_id: model.provider_id,
          provider_name: model.provider.name,
          provider_slug: model.provider.slug,
          name: model.name,
          tier: model.tier,
          grade: model.grade || '',
          input_per_mtok: inputPrice,
          output_per_mtok: outputPrice,
          cost_indicator: getCostIndicator(model),
          is_current: model.id === currentModelId,
          is_default: model.is_default,
        };
      });

    // Get the current model ID (user's preference or default)
    let effectiveModelId = currentModelId;
    if (!effectiveModelId) {
      const defaultModel = availableModels.find((m) => m.is_default);
      effectiveModelId = defaultModel?.id || (availableModels[0]?.id ?? null);
    }

    return successResponse({
      models: availableModels,
      current_model_id: effectiveModelId,
      is_affiliate: isAffiliate,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
