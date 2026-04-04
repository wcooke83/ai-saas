/**
 * Teams Integration Setup API
 * POST /api/teams/setup - Save Teams config and return webhook URL
 * GET /api/teams/setup - Get config status for a chatbot
 * DELETE /api/teams/setup - Clear Teams config
 *
 * The user registers the returned webhook URL in Azure Bot Registration.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot, updateChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_TEAMS_CONFIG } from '@/lib/chatbots/types';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';
import type { TeamsConfig } from '@/lib/chatbots/types';
import { encryptToken } from '@/lib/telegram/crypto';

const setupSchema = z.object({
  chatbot_id: z.string().uuid(),
  app_id: z.string().min(1, 'Microsoft App ID is required'),
  app_secret: z.string().min(1, 'Microsoft App Secret is required'),
  bot_name: z.string().max(100).optional(),
  ai_responses_enabled: z.boolean().optional(),
});

const deleteSchema = z.object({
  chatbot_id: z.string().uuid(),
});

async function getTeamsAllowed(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = data?.plan || 'free';
  const limits = await getPlanLimits(planSlug).catch(() => FREE_PLAN_LIMITS);
  return limits.teamsEnabled;
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
    if (!chatbotId) {
      throw APIError.badRequest('chatbot_id query parameter is required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(chatbotId);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Check plan
    const planAllowed = await getTeamsAllowed(user.id);
    if (!planAllowed) {
      return successResponse({ connected: false, plan_required: true });
    }

    // Read config
    const config = chatbot.teams_config as unknown as TeamsConfig | null;

    if (config && config.enabled) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || '';
      return successResponse({
        connected: true,
        app_id: config.app_id,
        bot_name: config.bot_name,
        ai_responses_enabled: config.ai_responses_enabled ?? false,
        webhook_url: `${baseUrl}/api/teams/webhook/${chatbotId}`,
      });
    }

    return successResponse({ connected: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const input = await parseBody(req, setupSchema);

    // Verify chatbot ownership
    const chatbot = await getChatbot(input.chatbot_id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Enforce Pro+ plan
    const planAllowed = await getTeamsAllowed(user.id);
    if (!planAllowed) {
      throw APIError.forbidden('Teams integration requires a Pro or Agency plan');
    }

    // Build config with encrypted secret
    const teamsConfig: TeamsConfig = {
      enabled: true,
      app_id: input.app_id,
      app_secret: encryptToken(input.app_secret),
      bot_name: input.bot_name,
      ai_responses_enabled: input.ai_responses_enabled ?? false,
    };

    // Save to chatbot record
    await updateChatbot(input.chatbot_id, { teams_config: teamsConfig });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || '';
    const webhookUrl = `${baseUrl}/api/teams/webhook/${input.chatbot_id}`;

    return successResponse({
      connected: true,
      webhook_url: webhookUrl,
      message: 'Register this webhook URL in your Azure Bot Registration messaging endpoint.',
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

    const input = await parseBody(req, deleteSchema);

    // Verify chatbot ownership
    const chatbot = await getChatbot(input.chatbot_id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Clear config
    await updateChatbot(input.chatbot_id, { teams_config: DEFAULT_TEAMS_CONFIG });

    return successResponse({ disconnected: true });
  } catch (error) {
    return errorResponse(error);
  }
}
