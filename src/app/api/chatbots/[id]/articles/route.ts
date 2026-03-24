/**
 * Admin Help Articles API
 * GET /api/chatbots/:id/articles - List articles (authenticated)
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

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
    const { data: articles, error } = await supabase
      .from('help_articles')
      .select('*')
      .eq('chatbot_id', id)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Get knowledge sources count
    const { count: sourcesCount } = await supabase
      .from('knowledge_sources')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', id);

    return successResponse({
      articles: articles || [],
      knowledgeSourcesCount: sourcesCount || 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
