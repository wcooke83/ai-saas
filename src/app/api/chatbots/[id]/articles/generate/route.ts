/**
 * Generate Help Articles API
 * POST /api/chatbots/:id/articles/generate - Generate articles from knowledge sources
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { generateHelpArticles } from '@/lib/chatbots/articles';
import { deductCredits } from '@/lib/usage/tracker';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    // Deduct 5 credits for article generation before processing
    await deductCredits(user.id, 5, 'Article generation', { chatbot_id: id });

    const result = await generateHelpArticles(id);

    const chunks = result.chunksCreated > 0 ? ` (${result.chunksCreated} knowledge chunks added)` : '';
    return successResponse({
      articlesGenerated: result.count,
      promptsUsed: result.promptsUsed,
      chunksCreated: result.chunksCreated,
      message: result.promptsUsed > 0
        ? `Generated ${result.count} articles using ${result.promptsUsed} prompts from ${result.sourcesUsed} sources${chunks}`
        : `Generated ${result.count} articles from ${result.sourcesUsed} knowledge sources${chunks}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
