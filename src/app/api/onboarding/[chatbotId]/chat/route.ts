/**
 * Onboarding Test Chat API
 * POST /api/onboarding/[chatbotId]/chat
 *
 * Authenticated chat endpoint for the onboarding wizard's "Test your chatbot"
 * step. Uses the same executeChat/executeChatStream pipeline as the public
 * chat API, but:
 *   - Authenticates via session (not API key)
 *   - Does NOT require the chatbot to be published
 *   - Verifies the authenticated user owns the chatbot
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  executeChat,
  executeChatStream,
  QuotaExhaustedError,
} from '@/lib/chatbots/execute-chat';

const chatSchema = z.object({
  message: z.string().min(1).max(10000),
  stream: z.boolean().optional().default(false),
  session_id: z.string().max(100).optional(),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;

    // Authenticate via session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw APIError.unauthorized('Authentication required');
    }

    // Verify ownership (no is_published check)
    const adminSupabase = createAdminClient();
    const { data: chatbotData, error: chatbotError } = await adminSupabase
      .from('chatbots')
      .select('id, user_id, status')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbotData) {
      throw APIError.notFound('Chatbot not found');
    }

    if ((chatbotData as any).user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    const input = await parseBody(req, chatSchema);
    const sessionId = input.session_id || `onboarding_${crypto.randomUUID()}`;

    // Streaming response
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
                channel: 'widget',
                stream: true,
                supabase: adminSupabase,
              },
              {
                onMeta(meta) {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({
                        type: 'meta',
                        data: {
                          conversation_id: meta.conversationId,
                          session_id: meta.sessionId,
                        },
                      }) + '\n'
                    )
                  );
                },
                onToken(token) {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({ type: 'token', content: token }) + '\n'
                    )
                  );
                },
                onCalendar(action, data) {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({ type: 'calendar', action, data }) + '\n'
                    )
                  );
                },
                onDone(result) {
                  controller.enqueue(
                    encoder.encode(
                      JSON.stringify({
                        type: 'done',
                        data: { message_id: result.messageId },
                      }) + '\n'
                    )
                  );
                  controller.close();
                },
                onError(error) {
                  try {
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          type: 'error',
                          message: 'Failed to generate response',
                        }) + '\n'
                      )
                    );
                    controller.close();
                  } catch {
                    try {
                      controller.error(error);
                    } catch {
                      /* already closed */
                    }
                  }
                },
              }
            );
          } catch (error) {
            try {
              if (error instanceof QuotaExhaustedError) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: 'error',
                      message: 'Chatbot has reached its monthly message limit',
                    }) + '\n'
                  )
                );
              } else {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: 'error',
                      message: 'Failed to generate response',
                    }) + '\n'
                  )
                );
              }
              controller.close();
            } catch {
              try {
                controller.error(error);
              } catch {
                /* already closed */
              }
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
        },
      });
    }

    // Non-streaming response
    const result = await executeChat({
      chatbotId,
      message: input.message,
      sessionId,
      channel: 'widget',
      stream: false,
      supabase: adminSupabase,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          message: result.content,
          conversation_id: result.conversationId,
          message_id: result.messageId,
          session_id: result.sessionId,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
