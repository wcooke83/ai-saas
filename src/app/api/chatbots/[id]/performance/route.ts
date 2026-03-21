import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { getChatbot } from '@/lib/chatbots/api';
import { createClient } from '@/lib/supabase/server';

const PAGE_SIZE = 50;

function applyFilters(query: any, searchParams: URLSearchParams) {
  const to = searchParams.get('to');
  const models = searchParams.get('models');
  const liveFetch = searchParams.get('live_fetch');

  if (to) query = query.lte('created_at', to);
  if (models) {
    const modelList = models.split(',').filter(Boolean);
    if (modelList.length > 0) query = query.in('model', modelList);
  }
  if (liveFetch === 'true') query = query.eq('live_fetch_triggered', true);

  return query;
}

function getSince(searchParams: URLSearchParams): string {
  const days = searchParams.get('days');
  const from = searchParams.get('from');
  if (days) return new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();
  if (from) return from;
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const { id } = await params;
    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const supabase = await createClient() as any;
    const since = getSince(searchParams);

    // Parse filter params for RPC
    const modelsParam = searchParams.get('models');
    const modelArray = modelsParam ? modelsParam.split(',').filter(Boolean) : null;
    const liveFetchParam = searchParams.get('live_fetch');
    const liveFetchBool = liveFetchParam === 'true' ? true : null;
    const toParam = searchParams.get('to') || null;

    // 1. Get aggregates from SQL RPC (single query — count, averages, P95, hourly, models)
    const { data: agg, error: aggError } = await supabase.rpc('get_chat_perf_aggregates', {
      p_chatbot_id: id,
      p_since: since,
      p_to: toParam,
      p_models: modelArray,
      p_live_fetch: liveFetchBool,
    });

    if (aggError) throw aggError;

    const total = agg?.total_count ?? 0;

    // 2. Fetch paginated rows for display (full columns, newest first)
    const offset = (page - 1) * PAGE_SIZE;
    let pageQ = supabase
      .from('chat_performance_log')
      .select('*')
      .eq('chatbot_id', id)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);
    pageQ = applyFilters(pageQ, searchParams);
    const { data: pageRows, error: pageError } = await pageQ;

    if (pageError) throw pageError;
    const recentRows = pageRows || [];

    // Backfill user_message/assistant_response from messages table for legacy rows
    const needsBackfill = recentRows.filter((r: any) => r.conversation_id && !r.user_message);
    if (needsBackfill.length > 0) {
      const convIds = [...new Set(needsBackfill.map((r: any) => r.conversation_id))];
      const { data: msgs } = await supabase
        .from('messages')
        .select('conversation_id, role, content, created_at')
        .in('conversation_id', convIds)
        .in('role', ['user', 'assistant'])
        .order('created_at', { ascending: true });

      if (msgs) {
        const msgsByConv = new Map<string, Array<{ role: string; content: string; created_at: string }>>();
        for (const m of msgs) {
          if (!msgsByConv.has(m.conversation_id)) msgsByConv.set(m.conversation_id, []);
          msgsByConv.get(m.conversation_id)!.push(m);
        }
        for (const row of needsBackfill) {
          const convMsgs = msgsByConv.get(row.conversation_id);
          if (!convMsgs) continue;
          const perfTime = new Date(row.created_at).getTime();
          let bestUser: string | null = null;
          let bestAssistant: string | null = null;
          for (const m of convMsgs) {
            const msgTime = new Date(m.created_at).getTime();
            if (m.role === 'user' && msgTime <= perfTime + 2000) bestUser = m.content;
            if (m.role === 'assistant' && msgTime <= perfTime + 30000 && msgTime >= perfTime - 2000) bestAssistant = m.content;
          }
          row.user_message = bestUser?.slice(0, 500) ?? null;
          row.assistant_response = bestAssistant?.slice(0, 500) ?? null;
        }
      }
    }

    return successResponse({
      total_requests: total,
      page,
      page_size: PAGE_SIZE,
      total_pages: Math.ceil(total / PAGE_SIZE),
      averages: agg?.averages ?? {},
      p95_total_ms: agg?.p95_total_ms ?? null,
      available_models: agg?.available_models ?? [],
      hourly: agg?.hourly ?? [],
      recent: recentRows,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
