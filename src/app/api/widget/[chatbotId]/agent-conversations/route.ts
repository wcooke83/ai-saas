/**
 * Agent Conversations API
 * GET /api/widget/:chatbotId/agent-conversations — List conversations with handoff status
 * Auth: Supabase session (dashboard) or chatbot API key (embedded)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateChatbotAPIKey } from '@/lib/chatbots/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

async function authenticateAgent(req: NextRequest, chatbotId: string): Promise<boolean> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer cb_')) {
    const key = authHeader.replace('Bearer ', '');
    const result = await validateChatbotAPIKey(key);
    return !!(result && result.chatbotId === chatbotId);
  }

  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  return !!chatbot;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const status = req.nextUrl.searchParams.get('status'); // pending, active, resolved, all
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    const isAuthed = await authenticateAgent(req, chatbotId);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const adminDb = createAdminClient();

    // Get conversations that have handoff sessions (or all with recent messages)
    let query = adminDb
      .from('telegram_handoff_sessions')
      .select(`
        id,
        conversation_id,
        status,
        agent_name,
        agent_source,
        agent_user_id,
        escalation_id,
        created_at,
        updated_at,
        resolved_at
      `)
      .eq('chatbot_id', chatbotId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: handoffs, error: handoffError } = await query;

    if (handoffError) {
      console.error('[Agent Conversations] Handoff query error:', handoffError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch handoffs' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Fire stats queries in parallel with enrichment -- they are independent
    const statsPromise = Promise.all([
      adminDb
        .from('telegram_handoff_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'pending'),
      adminDb
        .from('telegram_handoff_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'active'),
      adminDb
        .from('telegram_handoff_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbotId)
        .eq('status', 'resolved'),
    ]);

    if (!handoffs || handoffs.length === 0) {
      const [pending, active, resolved] = await statsPromise;
      return NextResponse.json(
        {
          success: true,
          data: {
            conversations: [],
            stats: {
              pending: pending.count || 0,
              active: active.count || 0,
              resolved: resolved.count || 0,
            },
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    // Collect IDs for parallel sub-queries
    const conversationIds = handoffs.map((h: any) => h.conversation_id);
    const escalationIds = handoffs.map((h: any) => h.escalation_id).filter(Boolean);

    // Run conversations, escalations, and last messages queries in parallel
    const [
      { data: conversations },
      escalationsResult,
      { data: lastMessages },
    ] = await Promise.all([
      adminDb
        .from('conversations')
        .select('id, session_id, visitor_id, visitor_metadata, message_count, first_message_at, last_message_at, language')
        .in('id', conversationIds),
      escalationIds.length > 0
        ? adminDb
            .from('conversation_escalations')
            .select('id, reason, details')
            .in('id', escalationIds)
        : Promise.resolve({ data: [] as any[] }),
      adminDb
        .from('messages')
        .select('conversation_id, content, role, metadata, created_at')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false }),
    ]);

    // Get lead info -- depends on conversations result for session_ids
    const sessionIds = (conversations || []).map((c: any) => c.session_id).filter(Boolean);
    const { data: leads } = sessionIds.length > 0
      ? await adminDb
          .from('chatbot_leads')
          .select('session_id, form_data')
          .eq('chatbot_id', chatbotId)
          .in('session_id', sessionIds)
      : { data: [] };

    // Build lookup maps
    const conversationMap = new Map<string, any>((conversations || []).map((c: any) => [c.id, c]));
    const leadMap = new Map<string, any>((leads || []).map((l: any) => [l.session_id, l.form_data]));
    const escalationMap = new Map<string, any>((escalationsResult.data || []).map((e: any) => [e.id, e]));
    const lastMessageMap = new Map<string, any>();
    for (const msg of (lastMessages || [])) {
      if (!lastMessageMap.has(msg.conversation_id)) {
        lastMessageMap.set(msg.conversation_id, msg);
      }
    }

    // Enrich conversations
    const enrichedConversations = handoffs.map((handoff: any) => {
      const conv = conversationMap.get(handoff.conversation_id);
      const lead = conv ? leadMap.get(conv.session_id) : null;
      const lastMsg = lastMessageMap.get(handoff.conversation_id);
      const escalation = handoff.escalation_id ? escalationMap.get(handoff.escalation_id) : null;

      return {
        handoff_id: handoff.id,
        conversation_id: handoff.conversation_id,
        handoff_status: handoff.status,
        agent_name: handoff.agent_name,
        agent_source: handoff.agent_source,
        handoff_created_at: handoff.created_at,
        resolved_at: handoff.resolved_at,
        visitor_name: lead?.name || conv?.visitor_metadata?.name || null,
        visitor_email: lead?.email || conv?.visitor_metadata?.email || null,
        message_count: conv?.message_count || 0,
        last_message_at: conv?.last_message_at,
        last_message: lastMsg ? {
          content: lastMsg.content?.substring(0, 200),
          role: lastMsg.role,
          is_agent: lastMsg.metadata?.is_human_agent === true,
          created_at: lastMsg.created_at,
        } : null,
        language: conv?.language,
        escalation_reason: escalation?.reason || null,
        escalation_details: escalation?.details || null,
      };
    });

    // Await the stats that were started in parallel at the top
    const [pending, active, resolved] = await statsPromise;

    return NextResponse.json(
      {
        success: true,
        data: {
          conversations: enrichedConversations,
          stats: {
            pending: pending.count || 0,
            active: active.count || 0,
            resolved: resolved.count || 0,
          },
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Agent Conversations API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
