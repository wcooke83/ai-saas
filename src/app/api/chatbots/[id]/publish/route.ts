/**
 * Publish Chatbot API Endpoint
 * POST /api/chatbots/:id/publish - Publish chatbot and get embed code
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import {
  getChatbot,
  publishChatbot,
  unpublishChatbot,
  getKnowledgeSources,
  createChatbotAPIKey,
} from '@/lib/chatbots/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
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

    // Check if chatbot has knowledge base (optional, but recommended)
    const sources = await getKnowledgeSources(id);
    const hasKnowledge = sources.some(s => s.status === 'completed');

    // Publish the chatbot (pass current status so draft→active transition works)
    const chatbot = await publishChatbot(id, existing.status);

    // Generate embed code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const iframeEmbed = `<iframe
  src="${baseUrl}/widget/${id}"
  style="border:none;position:fixed;bottom:20px;right:20px;width:400px;height:600px;z-index:9999;"
  allow="clipboard-write"
></iframe>`;

    const sdkEmbed = `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: '${id}'
  });
</script>`;

    return successResponse({
      chatbot,
      published: true,
      hasKnowledge,
      embed: {
        iframe: iframeEmbed,
        sdk: sdkEmbed,
        widgetUrl: `${baseUrl}/widget/${id}`,
        apiEndpoint: `${baseUrl}/api/chat/${id}`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// Unpublish endpoint via DELETE
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

    // Unpublish the chatbot
    const chatbot = await unpublishChatbot(id);

    return successResponse({
      chatbot,
      published: false,
    });
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
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
