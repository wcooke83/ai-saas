/**
 * Agent Actions API
 * POST /api/widget/:chatbotId/agent-actions — Take over, resolve, or end a conversation
 * Auth: Supabase session (dashboard) or chatbot API key (embedded)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { resolveHandoff, getActiveHandoff } from '@/lib/telegram/handoff';
import { validateChatbotAPIKey } from '@/lib/chatbots/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

async function authenticateAgent(req: NextRequest, chatbotId: string): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer cb_')) {
    const key = authHeader.replace('Bearer ', '');
    const result = await validateChatbotAPIKey(key);
    if (result && result.chatbotId === chatbotId) {
      return { userId: result.userId };
    }
    return null;
  }

  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  if (!chatbot) return null;
  return { userId: user.id };
}

type AgentAction = 'take_over' | 'resolve' | 'return_to_ai';

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { conversation_id, action, agent_name } = body as {
      conversation_id: string;
      action: AgentAction;
      agent_name?: string;
    };

    if (!conversation_id || !action) {
      return NextResponse.json(
        { success: false, error: 'conversation_id and action are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!['take_over', 'resolve', 'return_to_ai'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be: take_over, resolve, or return_to_ai' },
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

    const adminDb = createAdminClient() as any;

    // Verify conversation belongs to this chatbot
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

    switch (action) {
      case 'take_over': {
        // Check if there's already an active handoff
        const existing = await getActiveHandoff(conversation_id);
        if (existing) {
          // Update agent info
          await adminDb
            .from('telegram_handoff_sessions')
            .update({
              status: 'active',
              agent_name: agent_name || 'Agent',
              agent_source: 'platform',
              agent_user_id: auth.userId,
            })
            .eq('id', existing.id);
        } else {
          // Create a new handoff session for platform takeover
          await adminDb
            .from('telegram_handoff_sessions')
            .insert({
              chatbot_id: chatbotId,
              conversation_id,
              status: 'active',
              agent_name: agent_name || 'Agent',
              agent_source: 'platform',
              agent_user_id: auth.userId,
            });
        }

        return NextResponse.json(
          { success: true, data: { action: 'take_over' } },
          { headers: CORS_HEADERS }
        );
      }

      case 'resolve': {
        const resolved = await resolveHandoff(conversation_id);
        if (!resolved) {
          return NextResponse.json(
            { success: false, error: 'No active handoff to resolve' },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        return NextResponse.json(
          { success: true, data: { action: 'resolve' } },
          { headers: CORS_HEADERS }
        );
      }

      case 'return_to_ai': {
        // Resolve the handoff and let AI handle future messages
        await resolveHandoff(conversation_id);

        // Insert a system message noting the return to AI
        await adminDb.from('messages').insert({
          conversation_id,
          chatbot_id: chatbotId,
          role: 'system',
          content: 'Conversation returned to AI assistant.',
          metadata: { type: 'handoff_ended', agent_action: 'return_to_ai' },
        });

        return NextResponse.json(
          { success: true, data: { action: 'return_to_ai' } },
          { headers: CORS_HEADERS }
        );
      }
    }
  } catch (error) {
    console.error('[Agent Actions API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
