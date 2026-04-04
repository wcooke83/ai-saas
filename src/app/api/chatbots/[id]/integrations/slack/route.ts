/**
 * Slack Integration API
 * GET /api/chatbots/:id/integrations/slack - Get Slack integration status
 * POST /api/chatbots/:id/integrations/slack - Start OAuth flow
 * DELETE /api/chatbots/:id/integrations/slack - Disconnect Slack
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';
import {
  getSlackIntegration,
  getSlackOAuthURL,
  deleteSlackIntegration,
  getWorkspaceConflict,
  updateSlackIntegrationConfig,
} from '@/lib/chatbots/integrations/slack';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function getSlackAllowed(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = data?.plan || 'free';
  const limits = await getPlanLimits(planSlug).catch(() => FREE_PLAN_LIMITS);
  return limits.slackEnabled;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Check plan — free users see connected: false so UI can show upgrade prompt
    const planAllowed = await getSlackAllowed(user.id);
    if (!planAllowed) {
      return successResponse({ connected: false, plan_required: true });
    }

    // Get integration status
    const integration = await getSlackIntegration(id);

    if (integration) {
      // Check if another chatbot already owns this workspace
      const conflict = await getWorkspaceConflict(integration.team_id, id);

      return successResponse({
        connected: true,
        team_name: integration.team_name,
        team_id: integration.team_id,
        created_at: integration.created_at,
        mention_only: integration.mention_only ?? false,
        channel_ids: integration.channel_ids ?? [],
        ...(conflict && { workspace_taken_by: conflict }),
      });
    }

    return successResponse({ connected: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Enforce plan — Pro+ required
    const planAllowed = await getSlackAllowed(user.id);
    if (!planAllowed) {
      throw APIError.forbidden('Slack integration requires a Pro plan or higher');
    }

    // Generate OAuth URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || '';
    const redirectUri = `${baseUrl}/api/chatbots/${id}/integrations/slack/callback`;
    const oauthUrl = getSlackOAuthURL(id, redirectUri);

    return successResponse({ oauth_url: oauthUrl });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Delete integration
    await deleteSlackIntegration(id);

    return successResponse({ disconnected: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Validate body
    const body = await req.json();
    const config: { mention_only?: boolean; channel_ids?: string[] } = {};

    if (typeof body.mention_only === 'boolean') {
      config.mention_only = body.mention_only;
    }
    if (Array.isArray(body.channel_ids)) {
      config.channel_ids = body.channel_ids.filter(
        (id: unknown): id is string => typeof id === 'string' && id.trim().length > 0
      );
    }

    if (Object.keys(config).length === 0) {
      throw APIError.badRequest('No valid fields to update');
    }

    const updated = await updateSlackIntegrationConfig(id, config);

    return successResponse({
      mention_only: updated.mention_only ?? false,
      channel_ids: updated.channel_ids ?? [],
    });
  } catch (error) {
    return errorResponse(error);
  }
}
