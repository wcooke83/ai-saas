/**
 * Generate Help Articles API
 * POST /api/chatbots/:id/articles/generate - Generate articles from knowledge sources
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { generateHelpArticles } from '@/lib/chatbots/articles';

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
    if (error instanceof APIError && error.code === 'INSUFFICIENT_CREDITS') {
      const d = error.details as { available: number; needed: number; needs_topup: boolean; upgrade_url: string } | undefined;
      return NextResponse.json(
        {
          error: 'insufficient_credits',
          code: 'INSUFFICIENT_CREDITS',
          available: d?.available ?? 0,
          needed: d?.needed ?? 0,
          needs_topup: d?.needs_topup ?? false,
          upgrade_url: d?.upgrade_url ?? '/dashboard/billing',
        },
        { status: 402 }
      );
    }
    return errorResponse(error);
  }
}
