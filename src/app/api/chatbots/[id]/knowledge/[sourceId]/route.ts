/**
 * Single Knowledge Source API Endpoint
 * GET /api/chatbots/:id/knowledge/:sourceId - Get source details
 * DELETE /api/chatbots/:id/knowledge/:sourceId - Delete source
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import {
  getChatbot,
  getKnowledgeSource,
  deleteKnowledgeSource,
} from '@/lib/chatbots/api';

interface RouteParams {
  params: Promise<{ id: string; sourceId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, sourceId } = await params;

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

    // Get knowledge source
    const source = await getKnowledgeSource(sourceId);
    if (!source) {
      throw APIError.notFound('Knowledge source not found');
    }
    if (source.chatbot_id !== id) {
      throw APIError.forbidden('Access denied');
    }

    return successResponse({ source });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, sourceId } = await params;

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

    // Get knowledge source to verify ownership
    const source = await getKnowledgeSource(sourceId);
    if (!source) {
      throw APIError.notFound('Knowledge source not found');
    }
    if (source.chatbot_id !== id) {
      throw APIError.forbidden('Access denied');
    }

    // Delete source (cascades to chunks)
    await deleteKnowledgeSource(sourceId);

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
