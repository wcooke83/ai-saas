/**
 * Chat API Endpoint
 * POST /api/chat/:chatbotId - Send a message and get AI response
 *
 * This is the public endpoint for chatbot conversations.
 * Supports both streaming and non-streaming responses.
 *
 * Core chat logic lives in executeChat() / executeChatStream() in
 * src/lib/chatbots/execute-chat.ts — this route handles HTTP concerns:
 * request parsing, CORS, rate limiting, API key auth, and response formatting.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';
import { getChatbotCorsOrigin } from '@/lib/api/cors';
import {
  validateChatbotAPIKey,
} from '@/lib/chatbots/api';
import { validateAPIKey } from '@/lib/auth/api-keys';
import { getOrCreateConversation, createMessage } from '@/lib/chatbots/api';
import { logAPICall } from '@/lib/api/logging';
import {
  executeChat,
  executeChatStream,
  QuotaExhaustedError,
} from '@/lib/chatbots/execute-chat';
import type { Chatbot } from '@/lib/chatbots/types';

// Rate limiting constants
const CHAT_RATE_LIMIT = 30;       // requests per window per IP+chatbot
const CHAT_RATE_WINDOW_SEC = 60;  // 1 minute

/**
 * Distributed rate limiting via Supabase RPC.
 * Falls open (allows request) if the check fails.
 */
async function isRateLimited(key: string, maxRequests: number = 30, windowSeconds: number = 60): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.warn('Rate limit check failed:', error);
    return false; // Fail open if rate limiting is unavailable
  }
  return !data; // RPC returns true if allowed, we return true if limited
}

// Chat request validation
const attachmentSchema = z.object({
  url: z.string().url(),
  file_name: z.string(),
  file_type: z.string(),
  file_size: z.number(),
});

const chatSchema = z.object({
  message: z.string().min(1).max(10000),
  stream: z.boolean().optional().default(false),
  session_id: z.string().max(100).optional(),
  visitor_id: z.string().max(100).optional(),
  welcome_message: z.string().optional(),
  proactive_message: z.string().optional(),
  user_data: z.record(z.string()).optional(),
  user_context: z.record(z.unknown()).optional(),
  attachments: z.array(attachmentSchema).optional(),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;
  let chatbotUserId: string | null = null;

  // Rate limit by IP + chatbotId (distributed via Supabase RPC)
  const ip = getClientIP(req);
  const rateLimitKey = `chat:${ip}:${chatbotId}`;
  if (await isRateLimited(rateLimitKey, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW_SEC)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Retry-After': String(CHAT_RATE_WINDOW_SEC),
        },
      }
    );
  }

  try {
    const supabase = createAdminClient();

    // Fetch chatbot for CORS origin + ownership check (lightweight query)
    const { data: chatbotData, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, user_id, is_published, status, allowed_origins')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbotData) {
      throw APIError.notFound('Chatbot not found');
    }

    const chatbotMeta = chatbotData as unknown as Pick<Chatbot, 'id' | 'user_id' | 'is_published' | 'status' | 'allowed_origins'>;
    chatbotUserId = chatbotMeta.user_id;
    const corsOrigin = getChatbotCorsOrigin(chatbotMeta.allowed_origins, req.headers.get('origin'));

    if (!chatbotMeta.is_published || chatbotMeta.status !== 'active') {
      throw APIError.forbidden('Chatbot is not available');
    }

    // Optional API key authentication (for API access)
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const key = authHeader.substring(7);

      const chatbotKeyValidation = await validateChatbotAPIKey(key);
      if (chatbotKeyValidation && chatbotKeyValidation.chatbotId === chatbotId) {
        // Valid chatbot-specific key
      } else {
        try {
          const origin = req.headers.get('origin') || req.headers.get('referer');
          const generalKeyValidation = await validateAPIKey(key, origin);
          if (chatbotMeta.user_id !== generalKeyValidation.user.id) {
            throw APIError.forbidden('API key does not have access to this chatbot');
          }
        } catch (err) {
          if (err instanceof APIError) throw err;
          throw APIError.unauthorized('Invalid API key');
        }
      }
    }

    // Parse and validate input
    const input = await parseBody(req, chatSchema);
    const sessionId = input.session_id || generateSessionId();
    const channel = authHeader ? 'api' as const : 'widget' as const;

    // ── Welcome message (no AI call) ────────────────────────────────
    if (input.message === '__WELCOME__' && input.welcome_message) {
      const conversation = await getOrCreateConversation(chatbotId, sessionId, channel, input.visitor_id, supabase);
      const welcomeMessage = await createMessage({
        conversation_id: conversation.id,
        chatbot_id: chatbotId,
        role: 'assistant',
        content: input.welcome_message,
      }, supabase);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message: input.welcome_message,
            conversation_id: conversation.id,
            message_id: welcomeMessage.id,
            session_id: sessionId,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': corsOrigin,
          },
        }
      );
    }

    // ── Proactive message (no AI call) ──────────────────────────────
    if (input.message === '__PROACTIVE__' && input.proactive_message) {
      console.log('[Chat] Saving proactive message to database:', input.proactive_message);
      const conversation = await getOrCreateConversation(chatbotId, sessionId, channel, input.visitor_id, supabase);
      const proactiveMessage = await createMessage({
        conversation_id: conversation.id,
        chatbot_id: chatbotId,
        role: 'assistant',
        content: input.proactive_message,
      }, supabase);

      console.log('[Chat] Proactive message saved with ID:', proactiveMessage.id);
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message: input.proactive_message,
            conversation_id: conversation.id,
            message_id: proactiveMessage.id,
            session_id: sessionId,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': corsOrigin,
          },
        }
      );
    }

    // ── Streaming response ──────────────────────────────────────────
    if (input.stream) {
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            await executeChatStream(
              {
                chatbotId,
                message: input.message,
                sessionId,
                channel,
                visitorId: input.visitor_id,
                userData: input.user_data,
                userContext: input.user_context,
                attachments: input.attachments,
                stream: true,
                supabase,
              },
              {
                onMeta(meta) {
                  controller.enqueue(encoder.encode(
                    JSON.stringify({ type: 'meta', data: { conversation_id: meta.conversationId, session_id: meta.sessionId, language: meta.language } }) + '\n'
                  ));
                },
                onToken(token) {
                  controller.enqueue(encoder.encode(
                    JSON.stringify({ type: 'token', content: token }) + '\n'
                  ));
                },
                onCalendar(action, data) {
                  controller.enqueue(encoder.encode(
                    JSON.stringify({ type: 'calendar', action, data }) + '\n'
                  ));
                },
                onDone(result) {
                  if (result.handoffActive) {
                    controller.enqueue(encoder.encode(
                      JSON.stringify({
                        type: 'done',
                        data: {
                          message_id: result.messageId,
                          handoff_active: true,
                          handoff_status: result.handoffStatus,
                          agent_name: result.agentName,
                        },
                      }) + '\n'
                    ));
                  } else {
                    controller.enqueue(encoder.encode(
                      JSON.stringify({ type: 'done', data: { message_id: result.messageId } }) + '\n'
                    ));
                  }
                  controller.close();
                },
                onError(error) {
                  try {
                    controller.enqueue(encoder.encode(
                      JSON.stringify({ type: 'error', message: 'Failed to generate response' }) + '\n'
                    ));
                    controller.close();
                  } catch {
                    try { controller.error(error); } catch { /* already closed */ }
                  }
                },
              },
            );
          } catch (error) {
            console.error('[Chat:Stream] Streaming error caught in route:', error);
            try {
              if (error instanceof QuotaExhaustedError) {
                controller.enqueue(encoder.encode(
                  JSON.stringify({ type: 'error', message: 'Chatbot has reached its monthly message limit' }) + '\n'
                ));
              } else {
                controller.enqueue(encoder.encode(
                  JSON.stringify({ type: 'error', message: 'Failed to generate response' }) + '\n'
                ));
              }
              controller.close();
            } catch {
              try { controller.error(error); } catch { /* already closed */ }
            }
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': corsOrigin,
        },
      });
    }

    // ── Non-streaming response ──────────────────────────────────────
    const result = await executeChat({
      chatbotId,
      message: input.message,
      sessionId,
      channel,
      visitorId: input.visitor_id,
      userData: input.user_data,
      userContext: input.user_context,
      attachments: input.attachments,
      stream: false,
      supabase,
    });

    if (result.handoffActive) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message: '',
            conversation_id: result.conversationId,
            message_id: result.messageId,
            session_id: result.sessionId,
            handoff_active: true,
            handoff_status: result.handoffStatus,
            agent_name: result.agentName,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': corsOrigin,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          message: result.content,
          conversation_id: result.conversationId,
          message_id: result.messageId,
          session_id: result.sessionId,
          language: result.language,
        },
        meta: {
          model: result.model,
          provider: result.provider,
          tokens_used: result.tokensInput + result.tokensOutput,
          latency_ms: result.latencyMs,
          context_used: result.ragChunksUsed > 0,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': corsOrigin,
        },
      }
    );
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      const apiErr = APIError.usageLimitReached(error.message);
      // Log the error
      if (chatbotUserId) {
        logAPICall({
          user_id: chatbotUserId,
          endpoint: `/api/chat/${chatbotId}`,
          method: 'POST',
          status_code: apiErr.statusCode,
          error_message: error.message,
          duration_ms: 0,
        }).catch(() => {});
      }
      return errorResponse(apiErr);
    }

    if (chatbotUserId) {
      try {
        await logAPICall({
          user_id: chatbotUserId,
          endpoint: `/api/chat/${chatbotId}`,
          method: 'POST',
          status_code: error instanceof APIError ? error.statusCode : 500,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          duration_ms: 0,
        });
      } catch {
        // Ignore logging errors
      }
    }
    return errorResponse(error);
  }
}

// CORS preflight
export async function OPTIONS(req: NextRequest, { params }: RouteParams) {
  const { chatbotId } = await params;
  let corsOriginHeader = '*';
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('chatbots')
      .select('allowed_origins')
      .eq('id', chatbotId)
      .single();
    if (data) {
      corsOriginHeader = getChatbotCorsOrigin(
        (data as any).allowed_origins,
        req.headers.get('origin')
      );
    }
  } catch {
    // Fall through with wildcard
  }
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOriginHeader,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID, X-Visitor-ID',
    },
  });
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${crypto.randomUUID()}`;
}
