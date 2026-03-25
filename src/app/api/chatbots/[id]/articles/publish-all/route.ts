/**
 * Publish All Draft Articles
 * POST /api/chatbots/:id/articles/publish-all
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

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

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('help_articles')
      .update({ published: true, updated_at: new Date().toISOString() })
      .eq('chatbot_id', id)
      .eq('published', false)
      .select('id');

    if (error) throw error;

    const count = data?.length ?? 0;
    return successResponse({ published: count, message: `Published ${count} draft article(s)` });
  } catch (error) {
    return errorResponse(error);
  }
}
