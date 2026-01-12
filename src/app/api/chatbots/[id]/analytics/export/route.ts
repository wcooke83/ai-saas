/**
 * Chatbot Analytics Export API
 * GET /api/chatbots/:id/analytics/export - Export analytics as CSV
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { APIError } from '@/lib/api/utils';
import { getChatbot, getChatbotAnalytics } from '@/lib/chatbots/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Authenticate
    const user = await authenticate(req);
    if (!user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot) {
      throw APIError.notFound('Chatbot not found');
    }
    if (chatbot.user_id !== user.id) {
      throw APIError.forbidden('Access denied');
    }

    // Get analytics data
    const analytics = await getChatbotAnalytics(id, days);

    // Generate CSV
    const headers = ['Date', 'Conversations', 'Messages', 'Unique Visitors', 'Thumbs Up', 'Thumbs Down'];
    const rows = analytics.map((day) => [
      day.date,
      day.conversations_count,
      day.messages_count,
      day.unique_visitors,
      day.thumbs_up_count,
      day.thumbs_down_count,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="chatbot-analytics-${id}.csv"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
