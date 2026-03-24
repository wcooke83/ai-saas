/**
 * Admin Single Article API
 * PATCH /api/chatbots/:id/articles/:articleId - Update article
 * DELETE /api/chatbots/:id/articles/:articleId - Delete article
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

const updateArticleSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  summary: z.string().max(1000).optional(),
  body: z.string().max(50000).optional(),
  published: z.boolean().optional(),
  sort_order: z.number().optional(),
});

interface RouteParams {
  params: Promise<{ id: string; articleId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, articleId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, updateArticleSchema);

    const supabase = createAdminClient();
    const { data: article, error } = await supabase
      .from('help_articles')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', articleId)
      .eq('chatbot_id', id)
      .select()
      .single();

    if (error || !article) throw APIError.notFound('Article not found');

    return successResponse({ article });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, articleId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('help_articles')
      .delete()
      .eq('id', articleId)
      .eq('chatbot_id', id);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
