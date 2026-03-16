/**
 * Sentiment Analysis Trigger Endpoint
 * POST /api/chatbots/:id/sentiment/analyze - Process unanalyzed conversations
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { processUnanalyzedConversations, getUnanalyzedCount } from '@/lib/chatbots/sentiment';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const result = await processUnanalyzedConversations(id);

    return successResponse({
      processed: result.processed,
      failed: result.failed,
      total_unanalyzed: result.total_unanalyzed,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const count = await getUnanalyzedCount(id);

    return successResponse({ unanalyzed_count: count });
  } catch (error) {
    return errorResponse(error);
  }
}
