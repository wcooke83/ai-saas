/**
 * Single Chatbot API Endpoint
 * GET /api/chatbots/:id - Get chatbot details
 * PATCH /api/chatbots/:id - Update chatbot
 * DELETE /api/chatbots/:id - Delete chatbot
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  updateChatbot,
  deleteChatbot,
  generateUniqueSlug,
} from '@/lib/chatbots/api';
import { DEFAULT_WIDGET_CONFIG, type WidgetConfig } from '@/lib/chatbots/types';

// Update chatbot validation schema
const updateChatbotSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  system_prompt: z.string().min(10).max(5000).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(100).max(4096).optional(),
  widget_config: z.record(z.unknown()).optional(),
  logo_url: z.string().url().nullable().optional(),
  welcome_message: z.string().max(500).optional(),
  placeholder_text: z.string().max(200).optional(),
  status: z.enum(['draft', 'active', 'paused', 'archived']).optional(),
});

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

    // Get chatbot
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }

    // Verify ownership (RLS should handle this, but double-check)
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    return successResponse({ chatbot });
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

    // Get existing chatbot
    const existing = await getChatbot(id);
    if (!existing) {
      throw APIError.notFound('Chatbot not found');
    }

    if (existing.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Validate input
    const input = await parseBody(req, updateChatbotSchema);

    // Handle slug update if name changed
    let slug = existing.slug;
    if (input.name && input.name !== existing.name) {
      slug = await generateUniqueSlug(user.id, input.name);
    }

    // Merge widget config if provided
    let widgetConfig = existing.widget_config as WidgetConfig;
    if (input.widget_config) {
      widgetConfig = {
        ...DEFAULT_WIDGET_CONFIG,
        ...widgetConfig,
        ...(input.widget_config as Partial<WidgetConfig>),
      };
    }

    // Update chatbot
    const chatbot = await updateChatbot(id, {
      ...input,
      slug,
      widget_config: widgetConfig,
    });

    return successResponse({ chatbot });
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

    // Get existing chatbot
    const existing = await getChatbot(id);
    if (!existing) {
      throw APIError.notFound('Chatbot not found');
    }

    if (existing.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Delete chatbot (cascades to all related data)
    await deleteChatbot(id);

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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
