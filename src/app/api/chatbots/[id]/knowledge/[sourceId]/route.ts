/**
 * Single Knowledge Source API Endpoint
 * GET /api/chatbots/:id/knowledge/:sourceId - Get source details
 * PATCH /api/chatbots/:id/knowledge/:sourceId - Update source (e.g. toggle priority)
 * DELETE /api/chatbots/:id/knowledge/:sourceId - Delete source
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  getKnowledgeSource,
  deleteKnowledgeSource,
  updateKnowledgeSource,
} from '@/lib/chatbots/api';
import { emitTypedWebhookEvent } from '@/lib/webhooks/emit';

import { reprocessKnowledgeSource } from '@/lib/chatbots/knowledge/processor';

const updateSourceSchema = z.object({
  is_priority: z.boolean().optional(),
  action: z.enum(['reprocess']).optional(),
});

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

    // Emit knowledge.updated webhook (fire-and-forget)
    emitTypedWebhookEvent(user.id, id, 'knowledge.updated', {
      source_id: sourceId,
      source_type: source.type,
      source_name: source.name || source.url || 'Untitled',
      action: 'deleted',
    }).catch(() => {});

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, sourceId } = await params;

    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    const source = await getKnowledgeSource(sourceId);
    if (!source) {
      throw APIError.notFound('Knowledge source not found');
    }
    if (source.chatbot_id !== id) {
      throw APIError.forbidden('Access denied');
    }

    const input = await parseBody(req, updateSourceSchema);

    // Handle reprocess action
    if (input.action === 'reprocess') {
      reprocessKnowledgeSource(sourceId).catch(console.error);
      return successResponse({ reprocessing: true });
    }

    const { action: _, ...updates } = input;
    const updated = await updateKnowledgeSource(sourceId, updates);

    return successResponse({ source: updated });
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
