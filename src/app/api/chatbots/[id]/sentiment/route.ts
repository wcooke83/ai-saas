/**
 * Sentiment Data Endpoint
 * GET /api/chatbots/:id/sentiment - List conversations with sentiment & loyalty data
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSentimentStats } from '@/lib/chatbots/sentiment';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }

    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    const supabase = createAdminClient() as any;

    // Parse pagination params
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // Fetch analyzed conversations with pagination
    const { data: conversations, error: convError, count } = await supabase
      .from('conversations')
      .select('id, session_id, visitor_id, message_count, sentiment_score, sentiment_label, sentiment_summary, sentiment_analyzed_at, created_at', { count: 'exact' })
      .eq('chatbot_id', id)
      .not('sentiment_analyzed_at', 'is', null)
      .order('sentiment_analyzed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (convError) {
      throw new Error(`Failed to fetch sentiment data: ${convError.message}`);
    }

    // Fetch loyalty data for all visitors in the results
    const visitorIds = [...new Set((conversations || []).map((c: any) => c.visitor_id).filter(Boolean))];
    let loyaltyMap: Record<string, any> = {};

    if (visitorIds.length > 0) {
      const { data: loyaltyData } = await supabase
        .from('visitor_loyalty')
        .select('visitor_id, loyalty_score, loyalty_trend, total_sessions, avg_sentiment')
        .eq('chatbot_id', id)
        .in('visitor_id', visitorIds);

      if (loyaltyData) {
        for (const l of loyaltyData) {
          loyaltyMap[l.visitor_id] = l;
        }
      }
    }

    // Merge conversation data with loyalty
    const items = (conversations || []).map((conv: any) => ({
      ...conv,
      loyalty: conv.visitor_id ? loyaltyMap[conv.visitor_id] || null : null,
    }));

    // Get summary stats
    const stats = await getSentimentStats(id, supabase);

    return successResponse({
      items,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
