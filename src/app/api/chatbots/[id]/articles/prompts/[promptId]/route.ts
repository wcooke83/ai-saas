/**
 * Single Extraction Prompt API
 * PATCH  /api/chatbots/:id/articles/prompts/:promptId - Update prompt
 * DELETE /api/chatbots/:id/articles/prompts/:promptId - Delete prompt
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

const updatePromptSchema = z.object({
  question: z.string().min(3).max(500).optional(),
  enabled: z.boolean().optional(),
  sort_order: z.number().optional(),
  schedule: z.enum(['inherit', 'manual', 'daily', 'weekly', 'monthly']).optional(),
});

interface RouteParams {
  params: Promise<{ id: string; promptId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, promptId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, updatePromptSchema);

    const supabase = createAdminClient();
    const { data: prompt, error } = await supabase
      .from('article_extraction_prompts')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', promptId)
      .eq('chatbot_id', id)
      .select()
      .single();

    if (error || !prompt) throw APIError.notFound('Prompt not found');

    return successResponse({ prompt });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, promptId } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('article_extraction_prompts')
      .delete()
      .eq('id', promptId)
      .eq('chatbot_id', id);

    if (error) throw error;

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
