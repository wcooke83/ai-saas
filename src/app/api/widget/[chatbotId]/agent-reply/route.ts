/**
 * Agent Reply API
 * POST /api/widget/:chatbotId/agent-reply — Agent sends a message to a visitor
 * Auth: Supabase session (dashboard) or chatbot API key (embedded)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { handleAgentReply, getActiveHandoff } from '@/lib/telegram/handoff';
import { validateChatbotAPIKey } from '@/lib/chatbots/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

async function authenticateAgent(req: NextRequest, chatbotId: string): Promise<{ userId: string; agentName: string } | null> {
  // Try API key first (for embedded console)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer cb_')) {
    const key = authHeader.replace('Bearer ', '');
    const result = await validateChatbotAPIKey(key);
    if (result && result.chatbotId === chatbotId) {
      return { userId: result.userId, agentName: 'Agent' };
    }
    return null;
  }

  // Try Supabase session (dashboard)
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify ownership
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, user_id')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  if (!chatbot) return null;

  // Get agent name from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  return {
    userId: user.id,
    agentName: profile?.full_name || profile?.email || 'Agent',
  };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { conversation_id, content, agent_name } = body;

    if (!conversation_id || !content) {
      return NextResponse.json(
        { success: false, error: 'conversation_id and content are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const auth = await authenticateAgent(req, chatbotId);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // Verify conversation belongs to this chatbot
    const adminDb = createAdminClient();
    const { data: conversation } = await adminDb
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .eq('chatbot_id', chatbotId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Check for active handoff — reject replies to resolved conversations
    const activeHandoff = await getActiveHandoff(conversation_id);
    if (!activeHandoff) {
      return NextResponse.json(
        { success: false, error: 'No active handoff for this conversation' },
        { status: 409, headers: CORS_HEADERS }
      );
    }

    const result = await handleAgentReply({
      chatbotId,
      conversationId: conversation_id,
      agentName: agent_name || auth.agentName,
      agentUserId: auth.userId,
      content,
      source: 'platform',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Agent Reply API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
