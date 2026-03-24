/**
 * Admin Tickets API
 * GET /api/chatbots/:id/tickets - List tickets for admin (authenticated)
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
    const status = req.nextUrl.searchParams.get('status');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    let query = supabase
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: tickets, count, error } = await query;
    if (error) throw error;

    return successResponse({ tickets: tickets || [], total: count || 0, page, limit });
  } catch (error) {
    return errorResponse(error);
  }
}
