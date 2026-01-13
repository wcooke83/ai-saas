/**
 * Chat API Endpoint
 * POST /api/chat/:chatbotId - Send a message and get AI response
 *
 * This is the public endpoint for chatbot conversations.
 * Supports both streaming and non-streaming responses.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { generate, generateStream, createStreamingResponse } from '@/lib/ai/provider';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  getOrCreateConversation,
  getMessages,
  createMessage,
  validateChatbotAPIKey,
} from '@/lib/chatbots/api';
import { validateAPIKey } from '@/lib/auth/api-keys';
import {
  getRAGContext,
  buildRAGPrompt,
  buildSystemPrompt,
  formatConversationHistory,
} from '@/lib/chatbots/rag';
import { getUserPreferredModel } from '@/lib/settings';
import type { Chatbot } from '@/lib/chatbots/types';
import type { AIModelWithProvider } from '@/types/ai-models';

// Chat request validation
const chatSchema = z.object({
  message: z.string().min(1).max(10000),
  stream: z.boolean().optional().default(false),
  session_id: z.string().max(100).optional(),
  visitor_id: z.string().max(100).optional(),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;

    // Get chatbot (using admin client to bypass RLS for public access)
    const supabase = createAdminClient() as any;
    const { data: chatbotData, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbotData) {
      throw APIError.notFound('Chatbot not found');
    }

    const chatbot = chatbotData as Chatbot;

    // Check if chatbot is published/active
    if (!chatbot.is_published || chatbot.status !== 'active') {
      throw APIError.forbidden('Chatbot is not available');
    }

    // Check message limits
    if (
      chatbot.monthly_message_limit > 0 &&
      chatbot.messages_this_month >= chatbot.monthly_message_limit
    ) {
      throw APIError.forbidden('Chatbot has reached its monthly message limit');
    }

    // Optional API key authentication (for API access)
    let authenticatedUserId: string | null = null;
    let userPreferredModel: AIModelWithProvider | null = null;

    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const key = authHeader.substring(7);

      // Try chatbot-specific API key first
      const chatbotKeyValidation = await validateChatbotAPIKey(key);
      if (chatbotKeyValidation && chatbotKeyValidation.chatbotId === chatbotId) {
        authenticatedUserId = chatbotKeyValidation.userId;
      } else {
        // Try general API key - check if chatbot belongs to user
        try {
          const origin = req.headers.get('origin') || req.headers.get('referer');
          const generalKeyValidation = await validateAPIKey(key, origin);
          // Verify the chatbot belongs to this user
          if (chatbot.user_id === generalKeyValidation.user.id) {
            authenticatedUserId = generalKeyValidation.user.id;
          } else {
            throw APIError.forbidden('API key does not have access to this chatbot');
          }
        } catch (err) {
          // If it's already an APIError, rethrow; otherwise throw unauthorized
          if (err instanceof APIError) throw err;
          throw APIError.unauthorized('Invalid API key');
        }
      }

      // Get user's preferred AI model
      userPreferredModel = await getUserPreferredModel(authenticatedUserId);

      // Debug logging
      console.log('[Chat API] User preferred model:', {
        userId: authenticatedUserId,
        modelId: userPreferredModel?.id,
        modelName: userPreferredModel?.name,
        providerSlug: userPreferredModel?.provider?.slug,
        providerName: userPreferredModel?.provider?.name,
      });
    }

    // Parse and validate input
    const input = await parseBody(req, chatSchema);

    // Generate session ID if not provided
    const sessionId = input.session_id || generateSessionId();

    // Get or create conversation (pass admin client to bypass RLS)
    const channel = authHeader ? 'api' : 'widget';
    const conversation = await getOrCreateConversation(
      chatbotId,
      sessionId,
      channel,
      input.visitor_id,
      supabase
    );

    // Get conversation history
    const messages = await getMessages(conversation.id, supabase);

    // Save user message
    const userMessage = await createMessage({
      conversation_id: conversation.id,
      chatbot_id: chatbotId,
      role: 'user',
      content: input.message,
    }, supabase);

    // Get RAG context
    const ragContext = await getRAGContext(chatbot, input.message);

    // Build prompts
    const systemPrompt = buildSystemPrompt(chatbot, ragContext.chunks.length > 0);
    const userPrompt = buildRAGPrompt(
      ragContext,
      messages,
      input.message
    );

    // Model mapping (used as fallback when no user preference)
    const modelMap: Record<string, 'balanced' | 'powerful' | 'fast'> = {
      'claude-3-haiku-20240307': 'fast',
      'claude-3-5-sonnet-20241022': 'balanced',
      'claude-sonnet-4-20250514': 'powerful',
    };
    const modelLevel = modelMap[chatbot.model] || 'balanced';

    if (input.stream) {
      // Streaming response
      const generator = generateStream(userPrompt, {
        provider: 'claude',
        model: modelLevel,
        systemPrompt,
        temperature: chatbot.temperature,
        maxTokens: chatbot.max_tokens,
        // Use user's preferred model if authenticated
        specificModel: userPreferredModel || undefined,
      });

      // Create a transform to capture the full response
      let fullResponse = '';
      const captureTransform = new TransformStream<string, string>({
        transform(chunk, controller) {
          fullResponse += chunk;
          controller.enqueue(chunk);
        },
        async flush() {
          // Save assistant message after streaming completes
          await createMessage({
            conversation_id: conversation.id,
            chatbot_id: chatbotId,
            role: 'assistant',
            content: fullResponse,
            model: chatbot.model,
            context_chunks: ragContext.chunks.map((c) => c.id),
          });
        },
      });

      // Create streaming response with transform
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of generator) {
              controller.enqueue(chunk);
              fullResponse += chunk;
            }
            // Save message after stream completes
            await createMessage({
              conversation_id: conversation.id,
              chatbot_id: chatbotId,
              role: 'assistant',
              content: fullResponse,
              model: chatbot.model,
              context_chunks: ragContext.chunks.map((c) => c.id),
            }, supabase);
          } catch (error) {
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Non-streaming response
    const startTime = Date.now();
    const result = await generate(userPrompt, {
      provider: 'claude',
      model: modelLevel,
      systemPrompt,
      temperature: chatbot.temperature,
      maxTokens: chatbot.max_tokens,
      // Use user's preferred model if authenticated
      specificModel: userPreferredModel || undefined,
    });
    const latencyMs = Date.now() - startTime;

    // Save assistant message (use actual model from result)
    const assistantMessage = await createMessage({
      conversation_id: conversation.id,
      chatbot_id: chatbotId,
      role: 'assistant',
      content: result.content,
      model: result.model,
      tokens_input: result.tokensInput,
      tokens_output: result.tokensOutput,
      latency_ms: latencyMs,
      context_chunks: ragContext.chunks.map((c) => c.id),
    }, supabase);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          message: result.content,
          conversation_id: conversation.id,
          message_id: assistantMessage.id,
          session_id: sessionId,
        },
        meta: {
          model: result.model,
          provider: result.provider,
          tokens_used: result.tokensInput + result.tokensOutput,
          latency_ms: latencyMs,
          context_used: ragContext.chunks.length > 0,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID, X-Visitor-ID',
    },
  });
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
