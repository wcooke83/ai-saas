/**
 * Widget Handoff API
 * GET /api/widget/:chatbotId/handoff?conversation_id=...  - Check handoff status
 * POST /api/widget/:chatbotId/handoff - Initiate a handoff
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { initiateHandoff, getActiveHandoff } from '@/lib/telegram/handoff';
import { getTelegramConfig } from '@/lib/telegram/handoff';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

/**
 * GET - Check handoff status for a conversation
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const conversationId = req.nextUrl.searchParams.get('conversation_id');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversation_id required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const handoff = await getActiveHandoff(conversationId);
    const config = await getTelegramConfig(chatbotId);

    // Optionally return new agent messages since a given timestamp
    let newMessages: Array<{ id: string; content: string; agent_name: string | null; created_at: string }> = [];
    const since = req.nextUrl.searchParams.get('since');
    if (since && handoff) {
      const supabase = createAdminClient();
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, content, metadata, created_at')
        .eq('conversation_id', conversationId)
        .gt('created_at', since)
        .order('created_at', { ascending: true });

      if (msgs) {
        newMessages = msgs
          .filter((m: any) => m.metadata?.is_human_agent === true)
          .map((m: any) => ({
            id: m.id,
            content: m.content,
            agent_name: m.metadata?.agent_name || null,
            created_at: m.created_at,
          }));
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          handoff_active: !!handoff,
          handoff_status: handoff?.status || null,
          agent_name: handoff?.agent_name || null,
          telegram_enabled: config.enabled,
          new_messages: newMessages,
        },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Handoff API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST - Initiate a handoff to Telegram
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();

    const {
      conversation_id,
      session_id,
      reason,
      details,
      escalation_id,
      visitor_name,
      visitor_email,
      page_url,
    } = body;

    if (!conversation_id || !session_id || !reason) {
      return NextResponse.json(
        { success: false, error: 'conversation_id, session_id, and reason are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await initiateHandoff({
      chatbotId,
      conversationId: conversation_id,
      sessionId: session_id,
      reason,
      details,
      escalationId: escalation_id,
      visitorName: visitor_name,
      visitorEmail: visitor_email,
      pageUrl: page_url,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { handoff_id: result.handoffId },
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Handoff API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
