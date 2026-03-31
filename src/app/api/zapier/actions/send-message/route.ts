/**
 * Zapier Action: Send Message
 * POST /api/zapier/actions/send-message
 *
 * Sends a message to a chatbot and returns the AI response.
 * Used as a Zapier action so users can trigger chatbot conversations
 * from other apps (e.g., "when a new Zendesk ticket arrives, ask my
 * VocUI bot for a suggested response").
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat } from '@/lib/chatbots/execute-chat';

const sendMessageSchema = z.object({
  chatbot_id: z.string().uuid('chatbot_id must be a valid UUID'),
  message: z.string().min(1, 'message is required').max(10000),
  session_id: z.string().max(100).optional(),
  visitor_id: z.string().max(100).optional(),
  user_data: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    const user = await authenticateAPIKeyStrict(authHeader);

    const body = await req.json();
    const input = sendMessageSchema.parse(body);

    // Verify the user owns this chatbot
    const supabase = createAdminClient();
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, user_id, is_published, status')
      .eq('id', input.chatbot_id)
      .eq('user_id', user.id)
      .single();

    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found or access denied' },
        { status: 404 },
      );
    }

    if (chatbot.status !== 'active') {
      return NextResponse.json(
        { error: 'Chatbot is not active' },
        { status: 400 },
      );
    }

    const sessionId = input.session_id || `zapier_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const result = await executeChat({
      chatbotId: input.chatbot_id,
      message: input.message,
      sessionId,
      channel: 'api',
      stream: false,
      visitorId: input.visitor_id,
      userData: input.user_data,
    });

    return NextResponse.json({
      id: result.messageId,
      chatbot_id: input.chatbot_id,
      session_id: sessionId,
      conversation_id: result.conversationId,
      message: input.message,
      response: result.content,
      model: result.model,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Zapier:SendMessage] Error:', err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: `Validation error: ${err.errors.map((e) => e.message).join(', ')}` },
        { status: 400 },
      );
    }

    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401
      : message.includes('quota') || message.includes('limit') ? 429
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
