/**
 * Admin Settings API
 * GET /api/admin/settings - Get current settings
 * PUT /api/admin/settings - Update settings
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/session';
import { getAppSettings, updateAppSettings } from '@/lib/settings';
import { successResponse, errorResponse, parseBody } from '@/lib/api/utils';

// Validation schema for updating settings
const updateSettingsSchema = z.object({
  ai_provider: z.enum(['claude', 'local']).optional(),
  local_api_path: z.string().min(1).optional(),
  local_api_key: z.string().optional().nullable(),
  local_api_timeout: z.number().min(10).max(600).optional(),
  local_api_provider: z.enum(['default', 'chatgpt', 'claude', 'grok']).optional(),
  token_multiplier: z.number().min(0.01).max(100).optional(), // Legacy
  multiplier_claude: z.number().min(0.01).max(100).optional(),
  multiplier_openai: z.number().min(0.01).max(100).optional(),
  multiplier_local: z.number().min(0.01).max(100).optional(),
  embedding_model_id: z.string().uuid().optional().nullable(),
  chat_debug_mode: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const settings = await getAppSettings();

    if (!settings) {
      return errorResponse(new Error('Settings not found'));
    }

    return successResponse({
      ai_provider: settings.ai_provider,
      local_api_path: settings.local_api_path,
      local_api_key: settings.local_api_key,
      local_api_timeout: settings.local_api_timeout,
      local_api_provider: settings.local_api_provider,
      token_multiplier: settings.token_multiplier,
      multiplier_claude: settings.multiplier_claude ?? settings.token_multiplier ?? 1,
      multiplier_openai: settings.multiplier_openai ?? settings.token_multiplier ?? 1,
      multiplier_local: settings.multiplier_local ?? settings.token_multiplier ?? 1,
      embedding_model_id: settings.embedding_model_id,
      chat_debug_mode: settings.chat_debug_mode ?? false,
      updated_at: settings.updated_at,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAdmin(req);
    const input = await parseBody(req, updateSettingsSchema);

    const updated = await updateAppSettings(input, user.id);

    if (!updated) {
      return errorResponse(new Error('Failed to update settings'));
    }

    return successResponse({
      ai_provider: updated.ai_provider,
      local_api_path: updated.local_api_path,
      local_api_key: updated.local_api_key,
      local_api_timeout: updated.local_api_timeout,
      local_api_provider: updated.local_api_provider,
      token_multiplier: updated.token_multiplier,
      multiplier_claude: updated.multiplier_claude ?? updated.token_multiplier ?? 1,
      multiplier_openai: updated.multiplier_openai ?? updated.token_multiplier ?? 1,
      multiplier_local: updated.multiplier_local ?? updated.token_multiplier ?? 1,
      embedding_model_id: updated.embedding_model_id,
      chat_debug_mode: updated.chat_debug_mode ?? false,
      updated_at: updated.updated_at,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
