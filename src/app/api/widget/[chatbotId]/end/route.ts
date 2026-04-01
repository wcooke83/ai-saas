/**
 * Widget Conversation End Beacon
 * POST /api/widget/:chatbotId/end
 *
 * Called by the chat widget when a conversation session ends
 * (user closes widget, navigates away, or session times out).
 * Emits the conversation.ended webhook event.
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { emitTypedWebhookEvent } from '@/lib/webhooks/emit';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { session_id, conversation_id, message_count, duration_seconds } = body as {
      session_id: string;
      conversation_id?: string;
      message_count?: number;
      duration_seconds?: number;
    };

    if (!session_id || typeof session_id !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'session_id is required' } }),
        { status: 400, headers: corsHeaders },
      );
    }

    const supabase = createAdminClient();

    // Look up chatbot owner
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbotId)
      .single();

    if (!chatbot?.user_id) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Chatbot not found' } }),
        { status: 404, headers: corsHeaders },
      );
    }

    // If conversation_id not provided, look it up from the session
    let resolvedConversationId = conversation_id;
    let resolvedMessageCount = message_count;
    let resolvedDuration = duration_seconds;

    if (!resolvedConversationId) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id, created_at')
        .eq('chatbot_id', chatbotId)
        .eq('session_id', session_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (conversation) {
        resolvedConversationId = conversation.id;

        // Calculate duration from conversation start if not provided
        if (resolvedDuration === undefined && conversation.created_at) {
          resolvedDuration = Math.floor(
            (Date.now() - new Date(conversation.created_at).getTime()) / 1000,
          );
        }

        // Count messages if not provided
        if (resolvedMessageCount === undefined) {
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id);
          resolvedMessageCount = count ?? 0;
        }
      }
    }

    if (!resolvedConversationId) {
      // No conversation found -- nothing to end
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: corsHeaders },
      );
    }

    // Emit conversation.ended webhook (fire-and-forget)
    emitTypedWebhookEvent(chatbot.user_id, chatbotId, 'conversation.ended', {
      conversation_id: resolvedConversationId,
      session_id,
      message_count: resolvedMessageCount ?? 0,
      duration_seconds: resolvedDuration ?? 0,
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error('[Widget:End] Error:', err);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal error' } }),
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
