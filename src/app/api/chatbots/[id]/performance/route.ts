import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const { id } = await params;

    // Verify ownership
    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from('chat_performance_log')
      .select('*')
      .eq('chatbot_id', id)
      .gte('created_at', since)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const rows = data || [];

    // Compute aggregated averages per hour for charting
    const hourlyMap = new Map<string, { count: number; sums: Record<string, number> }>();

    for (const row of rows) {
      const hour = row.created_at.substring(0, 13); // "2026-03-21T14"
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { count: 0, sums: {} });
      }
      const entry = hourlyMap.get(hour)!;
      entry.count++;

      const fields = [
        'chatbot_loaded_ms', 'conversation_ready_ms', 'history_msg_handoff_ms',
        'rag_embedding_ms', 'rag_similarity_ms', 'rag_live_fetch_ms', 'rag_total_ms',
        'prompts_built_ms', 'first_token_ms', 'stream_complete_ms', 'total_ms',
      ];
      for (const f of fields) {
        if (row[f] != null) {
          entry.sums[f] = (entry.sums[f] || 0) + row[f];
        }
      }
    }

    const hourly = Array.from(hourlyMap.entries()).map(([hour, { count, sums }]) => {
      const avgs: Record<string, number | null> = {};
      for (const [key, total] of Object.entries(sums)) {
        avgs[key] = Math.round(total / count);
      }
      return { hour: hour + ':00:00Z', count, ...avgs };
    });

    // Overall averages
    const totalCount = rows.length;
    const overallAvgs: Record<string, number | null> = {};
    if (totalCount > 0) {
      const fields = [
        'chatbot_loaded_ms', 'conversation_ready_ms', 'history_msg_handoff_ms',
        'rag_embedding_ms', 'rag_similarity_ms', 'rag_live_fetch_ms', 'rag_total_ms',
        'prompts_built_ms', 'first_token_ms', 'stream_complete_ms', 'total_ms',
      ];
      for (const f of fields) {
        const values = rows.filter((r: any) => r[f] != null).map((r: any) => r[f] as number);
        overallAvgs[f] = values.length > 0 ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length) : null;
      }
    }

    return successResponse({
      total_requests: totalCount,
      days,
      averages: overallAvgs,
      hourly,
      recent: rows.slice(-50).reverse(), // Last 50 requests, newest first
    });
  } catch (error) {
    return errorResponse(error);
  }
}
