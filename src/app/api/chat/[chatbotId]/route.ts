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
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';
import { getChatbotCorsOrigin } from '@/lib/api/cors';
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
  startRAGPrework,
  buildRAGPrompt,
  buildSystemPrompt,
  formatConversationHistory,
  DEFAULT_LIVE_FETCH_THRESHOLD,
  type StageSpan,
} from '@/lib/chatbots/rag';
import { detectLanguageSwitch, getLanguageName } from '@/lib/chatbots/translations';
import {
  getUserMemory,
  formatMemoryForPrompt,
  extractAndStoreMemory,
  summarizeConversation,
} from '@/lib/chatbots/memory';
import { getUserPreferredModel, isChatDebugMode } from '@/lib/settings';
import { logAPICall } from '@/lib/api/logging';
import type { Chatbot, Message, Attachment, FileUploadConfig } from '@/lib/chatbots/types';
import { DEFAULT_FILE_UPLOAD_CONFIG, FILE_TYPE_MAP } from '@/lib/chatbots/types';
import { getActiveHandoff, forwardVisitorMessage } from '@/lib/telegram/handoff';
import { analyzeConversationSentiment, updateVisitorLoyalty } from '@/lib/chatbots/sentiment';
import type { AIModelWithProvider } from '@/types/ai-models';
import { CalendarService } from '@/lib/calendar/service';
import { handleCalendarToolCall } from '@/lib/chatbots/tools/calendar-handler';

// ── Per-stage timing helper ──────────────────────────────────────────
function createStageTracker(t0: number) {
  const stages: Record<string, StageSpan> = {};
  const pending: Record<string, number> = {};
  return {
    /** Mark the start of a stage (ms from t0) */
    start(label: string) { pending[label] = Date.now() - t0; },
    /** Mark the end of a stage (ms from t0). If start wasn't called, records end-only. */
    end(label: string) {
      const end = Date.now() - t0;
      const start = pending[label] ?? end;
      stages[label] = { start, end };
      delete pending[label];
      console.log(`[Chat:Perf] ${label}: ${stages[label].end - stages[label].start}ms (${start}–${end})`);
    },
    /** Wrap: call start, run fn, call end, return result */
    async wrap<T>(label: string, fn: () => Promise<T>): Promise<T> {
      this.start(label);
      const result = await fn();
      this.end(label);
      return result;
    },
    /** Get the stages object (mutable reference for merging sub-stages) */
    getStages() { return stages; },
  };
}

// ── Fire-and-forget performance log save ────────────────────────────
interface PerfLogData {
  chatbot_id: string;
  conversation_id: string;
  session_id: string;
  timings: Record<string, number>;
  pipelineTimings?: Record<string, StageSpan>;
  model: string;
  rag_chunks_count: number;
  rag_confidence: number;
  rag_timings?: Record<string, number>;
  live_fetch_triggered: boolean;
  message_length: number;
  response_length: number;
  is_streaming: boolean;
  user_message: string;
  assistant_response: string;
}

function savePerfLog(supabase: any, data: PerfLogData): void {
  const t = data.timings;
  const rt = data.rag_timings || {};
  supabase
    .from('chat_performance_log')
    .insert({
      chatbot_id: data.chatbot_id,
      conversation_id: data.conversation_id,
      session_id: data.session_id,
      chatbot_loaded_ms: t.chatbot_loaded ?? null,
      conversation_ready_ms: t.conversation_ready ?? null,
      history_msg_handoff_ms: t.history_msg_handoff_done ?? t.parallel_done ?? null,
      attachments_ms: t.attachments_done ?? t.parallel_done ?? null,
      rag_embedding_ms: rt.embedding_and_priority_sources ?? null,
      rag_similarity_ms: rt.similarity_and_chunks ?? null,
      rag_live_fetch_ms: rt.live_fetch_done ?? null,
      rag_total_ms: rt.complete ?? null,
      prompts_built_ms: t.prompts_built ?? null,
      first_token_ms: t.first_token ?? null,
      stream_complete_ms: t.stream_complete ?? t.generate_done ?? null,
      total_ms: t.total ?? null,
      model: data.model,
      rag_chunks_count: data.rag_chunks_count,
      rag_confidence: data.rag_confidence,
      live_fetch_triggered: data.live_fetch_triggered,
      message_length: data.message_length,
      response_length: data.response_length,
      is_streaming: data.is_streaming,
      pipeline_timings: data.pipelineTimings ?? null,
      user_message: data.user_message.slice(0, 500),
      assistant_response: data.assistant_response.slice(0, 500),
    })
    .then(({ error }: any) => {
      if (error) console.warn('[Chat:Perf] Failed to save timing:', error?.message);
      else console.log('[Chat:Perf] Timing saved to DB');
    });
}

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

/**
 * Create or update the email→visitor_id mapping in conversation_memory_emails.
 * This allows returning visitors to be recognized by email for memory reload.
 */
async function ensureMemoryEmailMapping(
  chatbotId: string,
  visitorId: string,
  preChatInfo: Record<string, string> | null,
  supabase: any
): Promise<void> {
  if (!preChatInfo) return;

  // Find email from pre-chat form data (check common field names)
  const email =
    preChatInfo.email ||
    preChatInfo.Email ||
    preChatInfo.EMAIL ||
    Object.values(preChatInfo).find((v) =>
      typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    );

  if (!email || typeof email !== 'string') return;

  const normalizedEmail = email.toLowerCase().trim();
  try {
    await supabase
      .from('conversation_memory_emails')
      .upsert(
        {
          chatbot_id: chatbotId,
          email: normalizedEmail,
          visitor_id: visitorId,
        },
        { onConflict: 'chatbot_id,email' }
      );
    console.log(`[Memory] Email mapping saved: ${normalizedEmail} → ${visitorId}`);
  } catch (err: any) {
    console.warn('[Memory] Failed to save email mapping:', err?.message || err);
  }
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
    const _t0 = Date.now();
    const _timings: Record<string, number> = {};
    const _perf = (label: string) => {
      const ms = Date.now() - _t0;
      _timings[label] = ms;
      console.log(`[Chat:Perf] ${label}: ${ms}ms`);
    };
    const _stages = createStageTracker(_t0);

    // Get chatbot (using admin client to bypass RLS for public access)
    const supabase = createAdminClient();
    _stages.start('chatbot_loaded');
    const { data: chatbotData, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, name, user_id, is_published, status, monthly_message_limit, messages_this_month, language, file_upload_config, memory_enabled, memory_days, model, temperature, max_tokens, system_prompt, enable_prompt_protection, live_fetch_threshold, allowed_origins')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbotData) {
      throw APIError.notFound('Chatbot not found');
    }

    const chatbot = chatbotData as unknown as Chatbot;
    chatbotUserId = chatbot.user_id;
    const corsOrigin = getChatbotCorsOrigin(chatbot.allowed_origins, req.headers.get('origin'));
    _perf('chatbot_loaded');
    _stages.end('chatbot_loaded');
    _stages.start('validate_and_parse');

    // Finding #15: Start RAG pre-work immediately (overlaps with conversation setup)
    const ragPreworkPromise = startRAGPrework(chatbotId);

    // Check if chatbot is published/active
    if (!chatbot.is_published || chatbot.status !== 'active') {
      throw APIError.forbidden('Chatbot is not available');
    }

    // Atomic message limit check + increment (prevents TOCTOU race condition)
    if (chatbot.monthly_message_limit > 0) {
      const { data: allowed } = await supabase.rpc('increment_chatbot_messages', {
        p_chatbot_id: chatbotId,
      });
      if (allowed === false) {
        console.warn(`[Chat:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit — model: ${chatbot.model || 'default'}, limit: ${chatbot.monthly_message_limit}`);
        throw APIError.usageLimitReached('Chatbot has reached its monthly message limit');
      }
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
    _stages.end('validate_and_parse');
    _stages.start('conversation_ready');
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
            'Access-Control-Allow-Origin': corsOrigin,
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
            'Access-Control-Allow-Origin': corsOrigin,
          },
        }
      );
    }

    _perf('conversation_ready');
    _stages.end('conversation_ready');
    _stages.start('setup_pipeline');

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

    // ── Parallel mega-group ─────────────────────────────────────────
    // For long messages (>20 chars) RAG needs only `chatbot` + `input.message`,
    // so it can run in parallel with history/save/handoff/attachments.
    // For short messages RAG needs the last assistant message from history,
    // so we chain: history → build ragQuery → RAG.
    const SHORT_MESSAGE_THRESHOLD = 20; // characters
    const isShortMessage = input.message.length <= SHORT_MESSAGE_THRESHOLD;

    // RAG promise — for long messages, start immediately; for short messages,
    // start after history resolves (via the deferred promise below).
    let resolveHistory: (msgs: Message[]) => void;
    const historyReady = new Promise<Message[]>((r) => { resolveHistory = r; });

    // For long messages, fire RAG right away with the raw query.
    // For short messages, wait for history so we can enhance the query.
    _stages.start('rag_context');
    // Await prework that was started right after chatbot loaded (Finding #15)
    const ragPrework = await ragPreworkPromise;
    const ragPromise = (isShortMessage
      ? historyReady.then((msgs) => {
          let ragQuery = input.message;
          const lastAssistantMsg = [...msgs].reverse().find(m => m.role === 'assistant');
          if (lastAssistantMsg) {
            ragQuery = `${lastAssistantMsg.content} ${input.message}`;
            console.log('[Chat] Enhanced RAG query with conversation context:', ragQuery);
          }
          return getRAGContext(chatbot, ragQuery, 5, 0.45, ragPrework);
        })
      : getRAGContext(chatbot, input.message, 5, 0.45, ragPrework)
    ).then((r) => { _stages.end('rag_context'); return r; });

    // Attachment processing — no dependency on history or conversation
    _stages.start('attachments');
    const attachmentPromise = (async () => {
      let aiImages: ImageInput[] = [];
      let documentText = '';

      // Prepare images for AI vision
      const imageAttachments = (input.attachments || []).filter((a: Attachment) =>
        a.file_type.startsWith('image/')
      );
      if (imageAttachments.length > 0) {
        const uploadConfig: FileUploadConfig = chatbot.file_upload_config || DEFAULT_FILE_UPLOAD_CONFIG;
        if (uploadConfig.enabled) {
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
          if (aiImages.length > 0) console.log(`[Chat] Prepared ${aiImages.length} images for AI vision`);
        }
      }

      // Extract text content from non-image file attachments
      const docAttachments = (input.attachments || []).filter((a: Attachment) =>
        !a.file_type.startsWith('image/')
      );
      if (docAttachments.length > 0) {
        const docTexts = await Promise.all(
          docAttachments.slice(0, 5).map(async (att: Attachment) => {
            try {
              const res = await fetch(att.url);
              if (!res.ok) return null;

              if (att.file_type === 'text/plain' || att.file_type === 'text/csv') {
                const text = await res.text();
                return { name: att.file_name, content: text.substring(0, 50000) };
              }

              if (att.file_type === 'application/pdf') {
                const buffer = await res.arrayBuffer();
                const { PDFParse } = await import('pdf-parse');
                const pdf = new PDFParse({ data: new Uint8Array(buffer) });
                const textResult = await pdf.getText();
                await pdf.destroy();
                return { name: att.file_name, content: textResult.text.substring(0, 50000) };
              }

              if (
                att.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                att.file_type === 'application/msword'
              ) {
                const buffer = await res.arrayBuffer();
                const mammoth = await import('mammoth');
                const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
                return { name: att.file_name, content: result.value.substring(0, 50000) };
              }

              if (
                att.file_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                att.file_type === 'application/vnd.ms-excel'
              ) {
                const text = await res.text();
                return { name: att.file_name, content: text.substring(0, 50000) };
              }

              return null;
            } catch (err) {
              console.warn(`[Chat] Failed to extract text from ${att.file_name}:`, err);
              return null;
            }
          })
        );

        const validDocs = docTexts.filter((d): d is { name: string; content: string } => d !== null);
        if (validDocs.length > 0) {
          documentText = validDocs
            .map((d) => `### File: ${d.name}\n\n${d.content}`)
            .join('\n\n---\n\n');
          console.log(`[Chat] Extracted text from ${validDocs.length} document(s), total ${documentText.length} chars`);
        }
      }

      _stages.end('attachments');
      return { aiImages, documentText };
    })();

    // Fire everything in parallel
    _stages.end('setup_pipeline');
    _perf('pre_parallel');
    _stages.start('get_history');
    _stages.start('save_message');
    _stages.start('check_handoff');
    _stages.start('lead_lookup');
    _stages.start('memory_fetch');

    const [messages, userMessage, activeHandoff, leadData, memoryResult, attachmentResult, ragContext] = await Promise.all([
      getMessages(conversation.id, supabase).then((r) => {
        _stages.end('get_history');
        // Unblock RAG for short messages once history is available
        resolveHistory!(r);
        return r;
      }),
      createMessage({
        conversation_id: conversation.id,
        chatbot_id: chatbotId,
        role: 'user',
        content: input.message,
        ...(input.attachments && input.attachments.length > 0 ? { attachments: input.attachments } : {}),
      }, supabase).then((r) => { _stages.end('save_message'); return r; }),
      getActiveHandoff(conversation.id).then((r) => { _stages.end('check_handoff'); return r; }),
      getLeadBySession(chatbotId, sessionId, supabase).then((r) => { _stages.end('lead_lookup'); return r; }),
      (chatbot.memory_enabled && input.visitor_id
        ? getUserMemory(input.visitor_id, chatbotId, chatbot.memory_days, supabase)
        : Promise.resolve(null)
      ).then((r) => { _stages.end('memory_fetch'); return r; }),
      attachmentPromise,
      ragPromise,
    ]);

    _perf('parallel_done');

    // Unpack attachment results
    const { aiImages, documentText } = attachmentResult;

    if (activeHandoff) {
      // Forward message to Telegram agent
      const visitorName = input.user_data?.name || 'Visitor';
      await forwardVisitorMessage({
        chatbotId,
        conversationId: conversation.id,
        visitorName,
        content: input.message,
      });

      // Return acknowledgment (no AI response — agent will reply via Telegram)
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            message: '',
            conversation_id: conversation.id,
            message_id: userMessage.id,
            session_id: sessionId,
            handoff_active: true,
            handoff_status: activeHandoff.status,
            agent_name: activeHandoff.agent_name,
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

    const preChatInfo = leadData ? leadData.form_data : null;

    let memoryContext: string | null = null;
    const existingMemory = memoryResult;
    if (existingMemory) {
      memoryContext = formatMemoryForPrompt(existingMemory);
      console.log(`[Chat] Memory found for visitor ${input.visitor_id}: ${existingMemory.key_facts.length} facts`);
    }

    // Check for active calendar integration (fire-and-forget style, cached)
    const calendarIntegration = await CalendarService.getIntegration(chatbotId);
    const hasCalendar = !!calendarIntegration;

    // Build prompts with active language (conversation language overrides chatbot default)
    _stages.start('prompts_built');
    const chatbotWithActiveLanguage = { ...chatbot, language: activeLanguage };
    const systemPrompt = buildSystemPrompt(chatbotWithActiveLanguage, ragContext.contextText.length > 0, preChatInfo, memoryContext, input.user_data, input.user_context, hasCalendar);
    const userPrompt = buildRAGPrompt(
      ragContext,
      messages,
      input.message,
      documentText || undefined
    );

    // Debug: log all prompt sources so operators can diagnose unexpected responses
    // Controlled by chat_debug_mode in admin settings (cached, no extra DB call)
    const debugMode = await isChatDebugMode();
    if (debugMode) console.log(`[Chat:Debug] Prompt sources for "${input.message.slice(0, 50)}":`, JSON.stringify({
      hasMemory: !!memoryContext,
      memoryFacts: existingMemory?.key_facts?.length ?? 0,
      memoryPreview: memoryContext?.slice(0, 200) ?? null,
      hasPreChatInfo: !!preChatInfo,
      preChatKeys: preChatInfo ? Object.keys(preChatInfo) : [],
      hasUserData: !!(input.user_data && Object.keys(input.user_data).length > 0),
      userDataKeys: input.user_data ? Object.keys(input.user_data) : [],
      hasUserContext: !!(input.user_context && Object.keys(input.user_context).length > 0),
      userContextKeys: input.user_context ? Object.keys(input.user_context) : [],
      userContextPreview: input.user_context ? JSON.stringify(input.user_context).slice(0, 300) : null,
      ragChunks: ragContext.chunks.length,
      ragConfidence: ragContext.confidence,
      ragContextPreview: ragContext.contextText?.slice(0, 200) ?? null,
      historyLength: messages.length,
      systemPromptLength: systemPrompt.length,
    }));

    // Model mapping (used as fallback when no user preference)
    const modelMap: Record<string, 'balanced' | 'powerful' | 'fast'> = {
      'claude-3-haiku-20240307': 'fast',
      'claude-3-5-sonnet-20241022': 'balanced',
      'claude-sonnet-4-20250514': 'powerful',
    };
    const modelLevel = modelMap[chatbot.model] || 'balanced';

    // Build multi-turn conversation messages (last 10 turns)
    const conversationMessages = formatConversationHistory(messages.slice(-10));

    _perf('prompts_built');
    _stages.end('prompts_built');

    if (input.stream) {
      // Streaming response with NDJSON events
      _perf('stream_start');
      _stages.start('first_token');
      const generator = generateStream(userPrompt, {
        provider: 'claude',
        model: modelLevel,
        systemPrompt,
        temperature: chatbot.temperature,
        maxTokens: chatbot.max_tokens,
        specificModel: userPreferredModel || undefined,
        images: aiImages.length > 0 ? aiImages : undefined,
        conversationMessages,
      });

      const encoder = new TextEncoder();
      let fullResponse = '';

      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Send metadata first so client can update state immediately
            controller.enqueue(encoder.encode(
              JSON.stringify({ type: 'meta', data: { conversation_id: conversation.id, session_id: sessionId, language: activeLanguage } }) + '\n'
            ));

            // Stream AI tokens
            let _firstToken = true;
            for await (const chunk of generator) {
              if (_firstToken) { _perf('first_token'); _stages.end('first_token'); _stages.start('stream_complete'); _firstToken = false; }
              fullResponse += chunk;
              controller.enqueue(encoder.encode(
                JSON.stringify({ type: 'token', content: chunk }) + '\n'
              ));
            }
            _perf('stream_complete');
            _stages.end('stream_complete');

            // Process calendar markers if calendar is enabled
            let processedResponse = fullResponse;
            if (hasCalendar) {
              const calendarMarkerRegex = /\[CALENDAR_(CHECK|BOOK|CANCEL|RESCHEDULE):(\{[^}]+\})\]/g;
              let match;
              while ((match = calendarMarkerRegex.exec(fullResponse)) !== null) {
                const action = match[1];
                try {
                  const params = JSON.parse(match[2]);
                  let toolName = '';
                  let toolArgs: Record<string, unknown> = {};

                  switch (action) {
                    case 'CHECK':
                      toolName = 'check_availability';
                      toolArgs = { date_from: params.date_from, date_to: params.date_to, timezone: params.timezone, duration_minutes: params.duration };
                      break;
                    case 'BOOK':
                      toolName = 'create_booking';
                      toolArgs = { start_time: params.start, end_time: params.end, attendee_name: params.name, attendee_email: params.email, attendee_timezone: params.timezone, notes: params.notes };
                      break;
                    case 'CANCEL':
                      toolName = 'cancel_booking';
                      toolArgs = { booking_id: params.booking_id, reason: params.reason };
                      break;
                    case 'RESCHEDULE':
                      toolName = 'reschedule_booking';
                      toolArgs = { booking_id: params.booking_id, new_start_time: params.new_start, new_end_time: params.new_end, reason: params.reason };
                      break;
                  }

                  if (toolName) {
                    const result = await handleCalendarToolCall(toolName, toolArgs, { chatbotId, sessionId });
                    // Send calendar event to client
                    controller.enqueue(encoder.encode(
                      JSON.stringify({ type: 'calendar', action: action.toLowerCase(), data: JSON.parse(result) }) + '\n'
                    ));
                    // Remove marker from saved response
                    processedResponse = processedResponse.replace(match[0], '');
                  }
                } catch (calErr) {
                  console.error('[Calendar] Failed to process marker:', calErr);
                }
              }
              processedResponse = processedResponse.trim();
            }

            // Save assistant message
            const assistantMessage = await createMessage({
              conversation_id: conversation.id,
              chatbot_id: chatbotId,
              role: 'assistant',
              content: processedResponse,
              model: chatbot.model,
              context_chunks: ragContext.chunks.map((c) => c.id),
            }, supabase);

            // Send done event with message_id
            controller.enqueue(encoder.encode(
              JSON.stringify({ type: 'done', data: { message_id: assistantMessage.id } }) + '\n'
            ));

            // Fire-and-forget: memory extraction + performance log
            if (chatbot.memory_enabled && input.visitor_id) {
              const allMessages = [...messages, { role: 'user', content: input.message } as Message, { role: 'assistant', content: processedResponse } as Message];
              extractAndStoreMemory(input.visitor_id, chatbotId, allMessages, existingMemory, supabase)
                .then(() => ensureMemoryEmailMapping(chatbotId, input.visitor_id!, preChatInfo, supabase))
                .catch(() => {});
            }

            // Fire-and-forget: auto-sentiment analysis (every 5th message after 4+)
            const totalMessages = messages.length + 2; // existing + user + assistant
            if (totalMessages >= 4 && totalMessages % 5 === 0) {
              const allMsgs = [...messages, { role: 'user', content: input.message } as Message, { role: 'assistant', content: fullResponse } as Message];
              analyzeConversationSentiment(allMsgs)
                .then(async (result) => {
                  if (!result) return;
                  await supabase.from('conversations').update({
                    sentiment_score: result.score,
                    sentiment_label: result.label,
                    sentiment_summary: result.summary,
                    sentiment_analyzed_at: new Date().toISOString(),
                  }).eq('id', conversation.id);
                  if (input.visitor_id) {
                    await updateVisitorLoyalty(chatbotId, input.visitor_id, supabase);
                  }
                })
                .catch(() => {});
            }

            // Fire-and-forget: save performance timing
            _perf('total');
            // Merge RAG sub-stage timings into pipeline_timings
            const ragStageStart = _stages.getStages().rag_context?.start ?? 0;
            const ragSt = ragContext.stageTimings || {};
            console.log('[Chat:Perf] RAG stageTimings:', JSON.stringify(ragSt), 'keys:', Object.keys(ragSt));
            // RAG stageTimings are relative to RAG start — offset to request start
            for (const [key, span] of Object.entries(ragSt)) {
              if (span.end > 0) {
                _stages.getStages()[`rag_${key}`] = {
                  start: ragStageStart + span.start,
                  end: ragStageStart + span.end,
                };
              }
            }
            savePerfLog(supabase, {
              chatbot_id: chatbotId,
              conversation_id: conversation.id,
              session_id: sessionId,
              timings: _timings,
              pipelineTimings: _stages.getStages(),
              model: chatbot.model,
              rag_chunks_count: ragContext.chunks.length,
              rag_confidence: ragContext.confidence,
              rag_timings: ragContext.perfTimings,
              live_fetch_triggered: ragContext.pinnedUrls.length > 0 && ragContext.confidence < (chatbot.live_fetch_threshold ?? DEFAULT_LIVE_FETCH_THRESHOLD),
              message_length: input.message.length,
              response_length: fullResponse.length,
              is_streaming: true,
              user_message: input.message,
              assistant_response: fullResponse,
            });

            // Close the stream after all data has been enqueued
            controller.close();
          } catch (error) {
            try {
              controller.enqueue(encoder.encode(
                JSON.stringify({ type: 'error', message: 'Failed to generate response' }) + '\n'
              ));
              controller.close();
            } catch {
              // Enqueue failed — stream already closed/errored, signal error state
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

    // Non-streaming response
    _perf('generate_start');
    _stages.start('generate');
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
      conversationMessages,
    });
    const latencyMs = Date.now() - startTime;
    _stages.end('generate');

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
      extractAndStoreMemory(input.visitor_id, chatbotId, allMessages, existingMemory, supabase)
        .then(() => ensureMemoryEmailMapping(chatbotId, input.visitor_id!, preChatInfo, supabase))
        .catch(() => {});
    }

    // Fire-and-forget: auto-sentiment analysis (every 5th message after 4+)
    const totalMsgCount = messages.length + 2;
    if (totalMsgCount >= 4 && totalMsgCount % 5 === 0) {
      const allMsgs = [...messages, { role: 'user', content: input.message } as Message, { role: 'assistant', content: result.content } as Message];
      analyzeConversationSentiment(allMsgs)
        .then(async (sentResult) => {
          if (!sentResult) return;
          await supabase.from('conversations').update({
            sentiment_score: sentResult.score,
            sentiment_label: sentResult.label,
            sentiment_summary: sentResult.summary,
            sentiment_analyzed_at: new Date().toISOString(),
          }).eq('id', conversation.id);
          if (input.visitor_id) {
            await updateVisitorLoyalty(chatbotId, input.visitor_id, supabase);
          }
        })
        .catch(() => {});
    }

    // Fire-and-forget: save performance timing
    _perf('total');
    // Merge RAG sub-stage timings into pipeline_timings
    const ragNsStart = _stages.getStages().rag_context?.start ?? 0;
    const ragStNs = ragContext.stageTimings || {};
    for (const [key, span] of Object.entries(ragStNs)) {
      if (span.end > 0) {
        _stages.getStages()[`rag_${key}`] = {
          start: ragNsStart + span.start,
          end: ragNsStart + span.end,
        };
      }
    }
    savePerfLog(supabase, {
      chatbot_id: chatbotId,
      conversation_id: conversation.id,
      session_id: sessionId,
      timings: _timings,
      pipelineTimings: _stages.getStages(),
      model: chatbot.model,
      rag_chunks_count: ragContext.chunks.length,
      rag_confidence: ragContext.confidence,
      rag_timings: ragContext.perfTimings,
      live_fetch_triggered: ragContext.pinnedUrls.length > 0 && ragContext.confidence < (chatbot.live_fetch_threshold ?? DEFAULT_LIVE_FETCH_THRESHOLD),
      message_length: input.message.length,
      response_length: result.content.length,
      is_streaming: false,
      user_message: input.message,
      assistant_response: result.content,
    });

    // Log API call for usage tracking (fire-and-forget, don't block response)
    logAPICall({
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
    }).catch(() => {});

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
          'Access-Control-Allow-Origin': corsOrigin,
        },
      }
    );
  } catch (error) {
    // Log failed API call using captured user_id (no extra DB query)
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
