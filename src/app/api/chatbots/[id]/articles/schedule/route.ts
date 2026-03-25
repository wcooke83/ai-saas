/**
 * Article Schedule API
 * GET  /api/chatbots/:id/articles/schedule - Get schedule settings
 * PATCH /api/chatbots/:id/articles/schedule - Update schedule
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

const updateScheduleSchema = z.object({
  article_schedule: z.enum(['manual', 'daily', 'weekly', 'monthly']),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('chatbots')
      .select('article_schedule, article_last_generated_at')
      .eq('id', id)
      .single();

    if (error) throw error;

    // article_source_urls added via migration — cast to access
    const row = data as typeof data & { article_source_urls?: string[] };

    return successResponse({
      schedule: data.article_schedule || 'manual',
      lastGeneratedAt: data.article_last_generated_at,
      sourceUrls: row.article_source_urls || [],
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) throw APIError.notFound('Chatbot not found');

    const input = await parseBody(req, updateScheduleSchema);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('chatbots')
      .update({ article_schedule: input.article_schedule })
      .eq('id', id);

    if (error) throw error;

    return successResponse({ schedule: input.article_schedule });
  } catch (error) {
    return errorResponse(error);
  }
}
