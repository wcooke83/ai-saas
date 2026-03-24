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
    // New columns not yet in generated types — use raw select
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const row = data as any;
    return successResponse({
      schedule: row.article_schedule || 'manual',
      lastGeneratedAt: row.article_last_generated_at,
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
      .update({ article_schedule: input.article_schedule } as any)
      .eq('id', id);

    if (error) throw error;

    return successResponse({ schedule: input.article_schedule });
  } catch (error) {
    return errorResponse(error);
  }
}
