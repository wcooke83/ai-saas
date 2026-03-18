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
import type { ImageInput } from '@/lib/ai/provider';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  getChatbot,
  getOrCreateConversation,
  getMessages,
  createMessage,
  validateChatbotAPIKey,
  getLeadBySession,
} from '@/lib/chatbots/api';
import { validateAPIKey } from '@/lib/auth/api-keys';
import {
  getRAGContext,
  buildRAGPrompt,
  buildSystemPrompt,
  formatConversationHistory,
} from '@/lib/chatbots/rag';
import { detectLanguageSwitch, getLanguageName } from '@/lib/chatbots/translations';
import {
  getUserMemory,
  formatMemoryForPrompt,
  extractAndStoreMemory,
  summarizeConversation,
} from '@/lib/chatbots/memory';
import { getUserPreferredModel } from '@/lib/settings';
import { logAPICall } from '@/lib/api/logging';
import type { Chatbot, Message, Attachment, FileUploadConfig } from '@/lib/chatbots/types';
import { DEFAULT_FILE_UPLOAD_CONFIG, FILE_TYPE_MAP } from '@/lib/chatbots/types';
import type { AIModelWithProvider } from '@/types/ai-models';

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

    // Handle welcome message initialization (no AI call needed)
    if (input.message === '__WELCOME__' && input.welcome_message) {
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
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Handle proactive message (save to database for conversation history)
    if (input.message === '__PROACTIVE__' && input.proactive_message) {
      console.log('[Chat] Saving proactive message to database:', input.proactive_message);
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
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Detect language switch request
    const requestedLanguage = detectLanguageSwitch(input.message);
    let activeLanguage = conversation.language || chatbot.language;
    
    if (requestedLanguage) {
      // Update conversation language
      await supabase
        .from('conversations')
        .update({ language: requestedLanguage })
        .eq('id', conversation.id);
      
      activeLanguage = requestedLanguage;
      console.log(`[Chat] Language switch detected: ${requestedLanguage} (${getLanguageName(requestedLanguage)})`);
    }

    // Get conversation history
    const messages = await getMessages(conversation.id, supabase);
    console.log('[Chat] Conversation history retrieved:', messages.length, 'messages');
    console.log('[Chat] History:', messages.map(m => `${m.role}: ${m.content.substring(0, 50)}...`).join(' | '));

    // Save user message (with attachments if any)
    const userMessage = await createMessage({
      conversation_id: conversation.id,
      chatbot_id: chatbotId,
      role: 'user',
      content: input.message,
      ...(input.attachments && input.attachments.length > 0 ? { attachments: input.attachments } : {}),
    }, supabase);

    // Prepare images for AI vision (if any image attachments)
    const imageAttachments = (input.attachments || []).filter((a: Attachment) =>
      a.file_type.startsWith('image/')
    );
    let aiImages: ImageInput[] = [];
    if (imageAttachments.length > 0) {
      const uploadConfig: FileUploadConfig = chatbot.file_upload_config || DEFAULT_FILE_UPLOAD_CONFIG;
      if (uploadConfig.enabled) {
        // Fetch images and convert to base64
        const imagePromises = imageAttachments.slice(0, 4).map(async (att: Attachment) => {
          try {
            const imgRes = await fetch(att.url);
            if (!imgRes.ok) return null;
            const buffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            return { data: base64, media_type: att.file_type } as ImageInput;
          } catch {
            console.warn(`[Chat] Failed to fetch image: ${att.url}`);
            return null;
          }
        });
        const results = await Promise.all(imagePromises);
        aiImages = results.filter((r): r is ImageInput => r !== null);
        console.log(`[Chat] Prepared ${aiImages.length} images for AI vision`);
      }
    }

    // Build RAG search query — enhance short/ambiguous messages with conversation context
    let ragQuery = input.message;
    const SHORT_MESSAGE_THRESHOLD = 20; // characters
    if (input.message.length <= SHORT_MESSAGE_THRESHOLD && messages.length > 0) {
      // Find the last assistant message for context (e.g., proactive bubble message)
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg) {
        ragQuery = `${lastAssistantMsg.content} ${input.message}`;
        console.log('[Chat] Enhanced RAG query with conversation context:', ragQuery);
      }
    }

    // Get RAG context
    const ragContext = await getRAGContext(chatbot, ragQuery);

    // Get pre-chat form data if available
    const leadData = await getLeadBySession(chatbotId, sessionId, supabase);
    const preChatInfo = leadData ? leadData.form_data : null;

    // Get conversation memory for returning visitors
    let memoryContext: string | null = null;
    let existingMemory = null;
    if (chatbot.memory_enabled && input.visitor_id) {
      existingMemory = await getUserMemory(input.visitor_id, chatbotId, chatbot.memory_days, supabase);
      if (existingMemory) {
        memoryContext = formatMemoryForPrompt(existingMemory);
        console.log(`[Chat] Memory found for visitor ${input.visitor_id}: ${existingMemory.key_facts.length} facts`);
      }
    }

    // Build prompts with active language (conversation language overrides chatbot default)
    const chatbotWithActiveLanguage = { ...chatbot, language: activeLanguage };
    const systemPrompt = buildSystemPrompt(chatbotWithActiveLanguage, ragContext.contextText.length > 0, preChatInfo, memoryContext, input.user_data, input.user_context);
    const userPrompt = buildRAGPrompt(
      ragContext,
      messages,
      input.message
    );

    console.log('[Chat] === SYSTEM PROMPT ===');
    console.log(systemPrompt);
    console.log('[Chat] === USER PROMPT ===');
    console.log(userPrompt);
    console.log('[Chat] === END PROMPTS ===');
    console.log(`[Chat] confidence=${ragContext.confidence.toFixed(3)}, pinnedUrls=${JSON.stringify(ragContext.pinnedUrls)}`);

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
        images: aiImages.length > 0 ? aiImages : undefined,
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
            console.log('[Chat] === AI RESPONSE (streaming) ===');
            console.log(fullResponse);
            console.log('[Chat] === END AI RESPONSE ===');
            await createMessage({
              conversation_id: conversation.id,
              chatbot_id: chatbotId,
              role: 'assistant',
              content: fullResponse,
              model: chatbot.model,
              context_chunks: ragContext.chunks.map((c) => c.id),
            }, supabase);

            // Async memory extraction for streaming responses
            if (chatbot.memory_enabled && input.visitor_id) {
              const allMessages = [...messages, { role: 'user', content: input.message } as Message, { role: 'assistant', content: fullResponse } as Message];
              extractAndStoreMemory(input.visitor_id, chatbotId, allMessages, existingMemory, supabase).catch(() => {});
            }
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
      images: aiImages.length > 0 ? aiImages : undefined,
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

    // Async memory extraction (non-blocking)
    if (chatbot.memory_enabled && input.visitor_id) {
      const allMessages = [...messages, { role: 'user', content: input.message } as Message, { role: 'assistant', content: result.content } as Message];
      extractAndStoreMemory(input.visitor_id, chatbotId, allMessages, existingMemory, supabase).catch(() => {});
    }

    // Log API call for usage tracking
    await logAPICall({
      user_id: chatbot.user_id,
      endpoint: `/api/chat/${chatbotId}`,
      method: 'POST',
      request_body: { message: input.message, stream: input.stream },
      response_body: { message: result.content },
      status_code: 200,
      provider: result.provider,
      model: result.model,
      tokens_input: result.tokensInput,
      tokens_output: result.tokensOutput,
      tokens_billed: result.tokensInput + result.tokensOutput,
      duration_ms: latencyMs,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          message: result.content,
          conversation_id: conversation.id,
          message_id: assistantMessage.id,
          session_id: sessionId,
          language: activeLanguage,
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
    // Log failed API call
    try {
      const { chatbotId } = await params;
      const supabase = createAdminClient() as any;
      const { data: chatbotData } = await supabase
        .from('chatbots')
        .select('user_id')
        .eq('id', chatbotId)
        .single();
      
      if (chatbotData) {
        await logAPICall({
          user_id: chatbotData.user_id,
          endpoint: `/api/chat/${chatbotId}`,
          method: 'POST',
          status_code: error instanceof APIError ? error.statusCode : 500,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          duration_ms: 0,
        });
      }
    } catch (logError) {
      // Ignore logging errors
    }
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
