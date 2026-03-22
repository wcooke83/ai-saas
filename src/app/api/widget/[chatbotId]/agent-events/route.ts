/**
 * Agent Events API (SSE)
 * GET /api/widget/:chatbotId/agent-events — Server-Sent Events stream for embeddable console
 * Auth: chatbot API key (via query param or Authorization header)
 *
 * Events:
 * - new_handoff: Visitor requested human help
 * - new_message: New message in active handoff conversation
 * - handoff_resolved: Conversation closed
 * - heartbeat: Keep-alive every 30s
 */

import { NextRequest } from 'next/server';
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

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;

  // Auth via API key (query param or header)
  const apiKey = req.nextUrl.searchParams.get('api_key')
    || req.headers.get('authorization')?.replace('Bearer ', '');

  if (!apiKey || !apiKey.startsWith('cb_')) {
    return new Response(JSON.stringify({ success: false, error: 'API key required' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const keyResult = await validateChatbotAPIKey(apiKey);
  if (!keyResult || keyResult.chatbotId !== chatbotId) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid API key' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          closed = true;
        }
      }

      // Heartbeat
      const heartbeatInterval = setInterval(() => {
        send('heartbeat', { ts: Date.now() });
      }, 30000);

      // Send initial connected event
      send('connected', { chatbot_id: chatbotId });

      // Subscribe to Supabase Realtime and bridge to SSE
      const adminDb = createAdminClient();
      const channel = adminDb.channel(`agent-console-${chatbotId}-${Date.now()}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chatbot_id=eq.${chatbotId}`,
        }, (payload: any) => {
          const msg = payload.new;
          // Only forward visitor messages (not agent messages, to avoid echo)
          if (msg.role === 'user') {
            send('new_message', {
              conversation_id: msg.conversation_id,
              message: {
                id: msg.id,
                content: msg.content,
                role: msg.role,
                created_at: msg.created_at,
              },
            });
          }
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'telegram_handoff_sessions',
          filter: `chatbot_id=eq.${chatbotId}`,
        }, (payload: any) => {
          send('new_handoff', {
            handoff_id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            status: payload.new.status,
            created_at: payload.new.created_at,
          });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'telegram_handoff_sessions',
          filter: `chatbot_id=eq.${chatbotId}`,
        }, (payload: any) => {
          if (payload.new.status === 'resolved') {
            send('handoff_resolved', {
              handoff_id: payload.new.id,
              conversation_id: payload.new.conversation_id,
              resolved_at: payload.new.resolved_at,
            });
          }
        })
        .subscribe();

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(heartbeatInterval);
        channel.unsubscribe();
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
