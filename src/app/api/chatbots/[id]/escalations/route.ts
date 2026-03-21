/**
 * Chatbot Escalations API
 * GET /api/chatbots/:id/escalations - List escalations with stats and pagination
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError, successResponse, errorResponse } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const isOwner = await checkChatbotOwnership(chatbotId, user.id, supabase);
    if (!isOwner) {
      throw APIError.forbidden('Access denied');
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    const status = searchParams.get('status');

    const db = supabase as any;

    // Build escalations query
    let query = db
      .from('conversation_escalations')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    // Fetch escalations and stats in parallel
    const [escalationsResult, openResult, acknowledgedResult, resolvedResult] = await Promise.all([
      query,
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'open'),
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'acknowledged'),
      db
        .from('conversation_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'resolved'),
    ]);

    if (escalationsResult.error) {
      console.error('Failed to fetch escalations:', escalationsResult.error);
      throw APIError.internal('Failed to fetch escalations');
    }

    const total = (openResult.count || 0) + (acknowledgedResult.count || 0) + (resolvedResult.count || 0);

    return successResponse({
      data: escalationsResult.data || [],
      stats: {
        total,
        open: openResult.count || 0,
        acknowledged: acknowledgedResult.count || 0,
        resolved: resolvedResult.count || 0,
      },
      pagination: {
        page,
        limit,
        total: escalationsResult.count || 0,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
