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
import {
  getSlackIntegration,
  getSlackOAuthURL,
  deleteSlackIntegration,
} from '@/lib/chatbots/integrations/slack';

interface RouteParams {
  params: Promise<{ id: string }>;
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

    // Get integration status
    const integration = await getSlackIntegration(id);

    if (integration) {
      return successResponse({
        connected: true,
        team_name: integration.team_name,
        team_id: integration.team_id,
        created_at: integration.created_at,
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
