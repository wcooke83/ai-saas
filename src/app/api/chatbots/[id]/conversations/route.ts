/**
 * Chatbot Conversations API
 * GET /api/chatbots/:id/conversations - Get all conversations for a chatbot
 * GET /api/chatbots/:id/conversations?conversationId=xxx - Get specific conversation with messages
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkChatbotOwnership } from '@/lib/chatbots/api';
import { APIError } from '@/lib/api/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatbotId } = await params;

    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify chatbot ownership
    const isOwner = await checkChatbotOwnership(chatbotId, user.id, supabase);
    if (!isOwner) {
      throw APIError.forbidden('Access denied');
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const conversationId = searchParams.get('conversationId');

    // If conversationId is provided, return that specific conversation with messages
    if (conversationId) {
      const { data: conversation, error: convError } = await (supabase as any)
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('chatbot_id', chatbotId)
        .single();

      if (convError || !conversation) {
        throw APIError.notFound('Conversation not found');
      }

      const { data: messages, error: msgError } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Failed to fetch messages:', msgError);
        throw APIError.internal('Failed to fetch messages');
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            conversation,
            messages: messages || [],
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Otherwise, return list of conversations
    const { data: conversations, error, count } = await (supabase as any)
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('chatbot_id', chatbotId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch conversations:', error);
      throw APIError.internal('Failed to fetch conversations');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          conversations: conversations || [],
          total: count || 0,
          limit,
          offset,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof APIError) {
      return new Response(
        JSON.stringify({ success: false, error: { message: error.message, code: error.code } }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Conversations API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
