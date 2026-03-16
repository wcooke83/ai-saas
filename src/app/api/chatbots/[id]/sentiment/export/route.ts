/**
 * Sentiment & Loyalty CSV Export Endpoint
 * GET /api/chatbots/:id/sentiment/export - Download CSV of sentiment & loyalty data
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';

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

    // Fetch all analyzed conversations
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, session_id, visitor_id, message_count, sentiment_score, sentiment_label, sentiment_summary, sentiment_analyzed_at, created_at')
      .eq('chatbot_id', id)
      .not('sentiment_analyzed_at', 'is', null)
      .order('created_at', { ascending: false });

    if (convError) {
      throw new Error(`Failed to fetch data: ${convError.message}`);
    }

    // Fetch all loyalty data for this chatbot
    const { data: loyaltyData } = await supabase
      .from('visitor_loyalty')
      .select('visitor_id, loyalty_score, loyalty_trend, total_sessions, avg_sentiment')
      .eq('chatbot_id', id);

    const loyaltyMap: Record<string, any> = {};
    if (loyaltyData) {
      for (const l of loyaltyData) {
        loyaltyMap[l.visitor_id] = l;
      }
    }

    // Build CSV
    const headers = [
      'Date',
      'Session ID',
      'Visitor ID',
      'Messages',
      'Sentiment Score',
      'Sentiment Label',
      'Sentiment Summary',
      'Loyalty Score',
      'Loyalty Trend',
      'Total Sessions',
      'Avg Sentiment',
      'Analyzed At',
    ];

    const rows = (conversations || []).map((conv: any) => {
      const loyalty = conv.visitor_id ? loyaltyMap[conv.visitor_id] : null;
      return [
        conv.created_at ? new Date(conv.created_at).toISOString().split('T')[0] : '',
        conv.session_id || '',
        conv.visitor_id || '',
        conv.message_count || 0,
        conv.sentiment_score || '',
        conv.sentiment_label || '',
        escapeCsvField(conv.sentiment_summary || ''),
        loyalty?.loyalty_score || '',
        loyalty?.loyalty_trend || '',
        loyalty?.total_sessions || '',
        loyalty?.avg_sentiment || '',
        conv.sentiment_analyzed_at ? new Date(conv.sentiment_analyzed_at).toISOString() : '',
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sentiment-loyalty-${id}.csv"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
