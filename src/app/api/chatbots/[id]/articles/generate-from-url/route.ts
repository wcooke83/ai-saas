/**
 * Generate Articles from URL API
 * POST /api/chatbots/:id/articles/generate-from-url
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { generateArticlesFromUrl } from '@/lib/chatbots/articles';
import { deductCredits } from '@/lib/usage/tracker';

const generateFromUrlSchema = z.object({
  url: z.string().url('Please provide a valid URL'),
});

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

    const { url } = await parseBody(req, generateFromUrlSchema);

    // Deduct 5 credits for article generation before processing
    await deductCredits(user.id, 5, 'Article generation from URL', { chatbot_id: id, url });

    const result = await generateArticlesFromUrl(id, url);

    const chunks = result.chunksCreated > 0 ? ` (${result.chunksCreated} knowledge chunks added)` : '';
    return successResponse({
      articlesGenerated: result.count,
      chunksCreated: result.chunksCreated,
      message: `Generated ${result.count} articles from URL${result.promptsUsed > 0 ? ` using ${result.promptsUsed} prompts` : ''}${chunks}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
