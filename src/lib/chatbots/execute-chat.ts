/**
 * executeChat — Channel-agnostic chat pipeline
 *
 * Encapsulates the full chat flow: quota check, conversation management,
 * RAG retrieval, visitor memory, prompt building, AI generation,
 * message persistence, performance logging, sentiment analysis,
 * and webhook events.
 *
 * Used by both the HTTP chat route and the Slack integration.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { generate, generateStream } from '@/lib/ai/provider';
import type { GenerateResult, ImageInput } from '@/lib/ai/provider';
import {
  getRAGContext,
  startRAGPrework,
  buildRAGPrompt,
  buildSystemPrompt,
  formatConversationHistory,
  DEFAULT_LIVE_FETCH_THRESHOLD,
  type RAGContext,
  type StageSpan,
} from './rag';
import { detectLanguageSwitch, getLanguageName } from './translations';
import {
  getUserMemory,
  formatMemoryForPrompt,
  extractAndStoreMemory,
} from './memory';
import {
  getOrCreateConversation,
  getMessages,
  createMessage,
  getLeadBySession,
} from './api';
import { getActiveHandoff, forwardVisitorMessage } from '@/lib/telegram/handoff';
import { analyzeConversationSentiment, updateVisitorLoyalty } from './sentiment';
import { CalendarService } from '@/lib/calendar/service';
import { handleCalendarToolCall } from './tools/calendar-handler';
import { attemptAutoTopup, triggerPreemptiveTopup } from './auto-topup';
import { emitWebhookEvent, emitTypedWebhookEvent } from '@/lib/webhooks/emit';
import { isChatDebugMode } from '@/lib/settings';
import { checkSubscriptionStatus } from '@/lib/usage/tracker';
import { logAPICall } from '@/lib/api/logging';
import type { Chatbot, Message, Attachment, FileUploadConfig, ConversationMemory } from './types';
import { DEFAULT_FILE_UPLOAD_CONFIG } from './types';

// ── Types ───────────────────────────────────────────────────────────

export type ChatChannel = 'widget' | 'api' | 'slack' | 'telegram' | 'whatsapp' | 'messenger' | 'instagram' | 'sms' | 'email' | 'discord' | 'teams' | 'zapier';

export interface ExecuteChatInput {
  chatbotId: string;
  message: string;
  sessionId: string;
  channel: ChatChannel;
  visitorId?: string;
  /** Pre-chat form / authenticated user profile data */
  userData?: Record<string, string>;
  /** Arbitrary user context from host site (orders, billing, etc.) */
  userContext?: Record<string, unknown>;
  /** File attachments */
  attachments?: Attachment[];
  /** Whether to use streaming generation */
  stream: boolean;
  /** Pre-existing Supabase admin client (avoids creating a new one) */
  supabase?: TypedSupabaseClient;
}

export interface ExecuteChatResult {
  content: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  provider: string;
  conversationId: string;
  messageId: string;
  sessionId: string;
  language: string;
  /** Whether a live agent handoff is active (no AI response generated) */
  handoffActive?: boolean;
  handoffStatus?: string;
  agentName?: string | null;
  /** RAG metadata */
  ragChunksUsed: number;
  ragConfidence: number;
  latencyMs: number;
}

export interface ExecuteChatStreamCallbacks {
  onMeta: (meta: { conversationId: string; sessionId: string; language: string }) => void;
  onToken: (token: string) => void;
  onCalendar: (action: string, data: unknown) => void;
  onDone: (result: ExecuteChatResult) => void;
  onError: (error: Error) => void;
}

/**
 * Error thrown when the chatbot has exhausted its message quota.
 */
export class QuotaExhaustedError extends Error {
  constructor(message = 'Chatbot has reached its monthly message limit') {
    super(message);
    this.name = 'QuotaExhaustedError';
  }
}

/**
 * Error thrown when a live handoff is active (no AI response needed).
 */
export class HandoffActiveError extends Error {
  public handoffStatus: string;
  public agentName: string;
  public conversationId: string;
  public messageId: string;
  public sessionId: string;
  constructor(opts: { handoffStatus: string; agentName: string; conversationId: string; messageId: string; sessionId: string }) {
    super('Live handoff active');
    this.name = 'HandoffActiveError';
    this.handoffStatus = opts.handoffStatus;
    this.agentName = opts.agentName;
    this.conversationId = opts.conversationId;
    this.messageId = opts.messageId;
    this.sessionId = opts.sessionId;
  }
}

// ── Per-stage timing helper ─────────────────────────────────────────

function createStageTracker(t0: number) {
  const stages: Record<string, StageSpan> = {};
  const pending: Record<string, number> = {};
  return {
    start(label: string) { pending[label] = Date.now() - t0; },
    end(label: string) {
      const end = Date.now() - t0;
      const start = pending[label] ?? end;
      stages[label] = { start, end };
      delete pending[label];
      console.log(`[Chat:Perf] ${label}: ${stages[label].end - stages[label].start}ms (${start}–${end})`);
    },
    async wrap<T>(label: string, fn: () => Promise<T>): Promise<T> {
      this.start(label);
      const result = await fn();
      this.end(label);
      return result;
    },
    getStages() { return stages; },
  };
}

// ── Fire-and-forget performance log ─────────────────────────────────

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

function savePerfLog(supabase: TypedSupabaseClient, data: PerfLogData): void {
  const t = data.timings;
  const rt = data.rag_timings || {};
  (supabase as any)
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

// ── Memory email mapping helper ─────────────────────────────────────

async function ensureMemoryEmailMapping(
  chatbotId: string,
  visitorId: string,
  preChatInfo: Record<string, string> | null,
  supabase: TypedSupabaseClient
): Promise<void> {
  if (!preChatInfo) return;

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
    await (supabase as any)
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

// ── Attachment processing ───────────────────────────────────────────

async function processAttachments(
  attachments: Attachment[] | undefined,
  chatbot: Chatbot,
): Promise<{ aiImages: ImageInput[]; documentText: string }> {
  let aiImages: ImageInput[] = [];
  let documentText = '';

  if (!attachments || attachments.length === 0) {
    return { aiImages, documentText };
  }

  // Images for AI vision
  const imageAttachments = attachments.filter((a) => a.file_type.startsWith('image/'));
  if (imageAttachments.length > 0) {
    const uploadConfig: FileUploadConfig = chatbot.file_upload_config || DEFAULT_FILE_UPLOAD_CONFIG;
    if (uploadConfig.enabled) {
      const imagePromises = imageAttachments.slice(0, 4).map(async (att) => {
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

  // Document text extraction
  const docAttachments = attachments.filter((a) => !a.file_type.startsWith('image/'));
  if (docAttachments.length > 0) {
    const docTexts = await Promise.all(
      docAttachments.slice(0, 5).map(async (att) => {
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

  return { aiImages, documentText };
}

// ── Calendar marker processing ──────────────────────────────────────

interface CalendarEvent {
  action: string;
  data: unknown;
}

async function processCalendarMarkers(
  response: string,
  chatbotId: string,
  sessionId: string,
): Promise<{ processedResponse: string; calendarEvents: CalendarEvent[] }> {
  const calendarEvents: CalendarEvent[] = [];
  let processedResponse = response;

  const calendarMarkerRegex = /\[CALENDAR_(LIST_SERVICES|CHECK|BOOK|CANCEL|RESCHEDULE):(\{[^}]*\})\]/g;
  let match;
  while ((match = calendarMarkerRegex.exec(response)) !== null) {
    const action = match[1];
    try {
      const params = JSON.parse(match[2]);
      let toolName = '';
      let toolArgs: Record<string, unknown> = {};

      switch (action) {
        case 'LIST_SERVICES':
          toolName = 'list_services';
          toolArgs = {};
          break;
        case 'CHECK':
          toolName = 'check_availability';
          toolArgs = { date_from: params.date_from, date_to: params.date_to, timezone: params.timezone, duration_minutes: params.duration, service_id: params.service_id };
          break;
        case 'BOOK':
          toolName = 'create_booking';
          toolArgs = { start_time: params.start, end_time: params.end, attendee_name: params.name, attendee_email: params.email, attendee_timezone: params.timezone, notes: params.notes, service_id: params.service_id };
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
        calendarEvents.push({ action: action.toLowerCase(), data: JSON.parse(result) });
        processedResponse = processedResponse.replace(match[0], '');
      }
    } catch (calErr) {
      console.error('[Calendar] Failed to process marker:', calErr);
    }
  }

  return { processedResponse: processedResponse.trim(), calendarEvents };
}

// ── Shared post-generation side-effects ─────────────────────────────

function firePostGenerationEffects(opts: {
  chatbot: Chatbot;
  conversationId: string;
  chatbotId: string;
  messages: Message[];
  userMessage: string;
  assistantResponse: string;
  visitorId?: string;
  existingMemory: ConversationMemory | null;
  preChatInfo: Record<string, string> | null;
  supabase: TypedSupabaseClient;
  isFirstMessage: boolean;
}): void {
  const {
    chatbot, conversationId, chatbotId, messages,
    userMessage, assistantResponse, visitorId,
    existingMemory, preChatInfo, supabase, isFirstMessage,
  } = opts;

  // First-conversation activation
  if (isFirstMessage) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activation/first-conversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatbotId, userId: chatbot.user_id }),
    }).catch(() => {});
  }

  // Memory extraction
  if (chatbot.memory_enabled && visitorId) {
    const allMessages = [
      ...messages,
      { role: 'user', content: userMessage } as Message,
      { role: 'assistant', content: assistantResponse } as Message,
    ];
    extractAndStoreMemory(visitorId, chatbotId, allMessages, existingMemory, supabase)
      .then(() => ensureMemoryEmailMapping(chatbotId, visitorId, preChatInfo, supabase))
      .catch(() => {});
  }

  // Sentiment analysis (every 5th message after 4+)
  const totalMessages = messages.length + 2; // existing + user + assistant
  if (totalMessages >= 4 && totalMessages % 5 === 0) {
    const allMsgs = [
      ...messages,
      { role: 'user', content: userMessage } as Message,
      { role: 'assistant', content: assistantResponse } as Message,
    ];
    analyzeConversationSentiment(allMsgs)
      .then(async (result) => {
        if (!result) return;
        await (supabase as any).from('conversations').update({
          sentiment_score: result.score,
          sentiment_label: result.label,
          sentiment_summary: result.summary,
          sentiment_analyzed_at: new Date().toISOString(),
        }).eq('id', conversationId);
        if (visitorId) {
          await updateVisitorLoyalty(chatbotId, visitorId, supabase);
        }
      })
      .catch(() => {});
  }
}

// ── Quota check ─────────────────────────────────────────────────────

async function checkAndIncrementQuota(
  chatbot: Chatbot,
  chatbotId: string,
  supabase: TypedSupabaseClient,
): Promise<void> {
  if (chatbot.monthly_message_limit <= 0) return;

  const { data: creditResult } = await supabase.rpc('increment_chatbot_messages', {
    p_chatbot_id: chatbotId,
  });

  const result = creditResult as {
    allowed: boolean;
    monthly_remaining?: number;
    purchased_remaining?: number;
    reason?: string;
    source?: string;
  } | null;

  if (!result?.allowed) {
    if ((chatbot as any).credit_exhaustion_mode === 'purchase_credits') {
      const topupResult = await attemptAutoTopup(chatbotId, chatbot.user_id);
      if (topupResult.success) {
        const { data: retryResult } = await supabase.rpc('increment_chatbot_messages', {
          p_chatbot_id: chatbotId,
        });
        const retry = retryResult as { allowed: boolean } | null;
        if (!retry?.allowed) {
          throw new QuotaExhaustedError();
        }
      } else {
        console.warn(`[Chat:AutoTopup] Failed for "${chatbot.name || chatbotId}": ${topupResult.error}`);
        throw new QuotaExhaustedError();
      }
    } else {
      console.warn(`[Chat:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit — model: ${chatbot.model || 'default'}, limit: ${chatbot.monthly_message_limit}`);
      throw new QuotaExhaustedError();
    }
  } else if (result.monthly_remaining === 0 && (result.purchased_remaining ?? 0) >= 0) {
    triggerPreemptiveTopup(chatbotId, chatbot.user_id, result.purchased_remaining ?? 0).catch(() => {});
  }
}

// ── Core setup shared by streaming and non-streaming paths ──────────

interface PipelineContext {
  supabase: TypedSupabaseClient;
  chatbot: Chatbot;
  conversation: { id: string };
  sessionId: string;
  messages: Message[];
  userMessage: Message;
  ragContext: RAGContext;
  systemPrompt: string;
  userPrompt: string;
  conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  aiImages: ImageInput[];
  documentText: string;
  activeLanguage: string;
  preChatInfo: Record<string, string> | null;
  existingMemory: ConversationMemory | null;
  hasCalendar: boolean;
  isFirstMessage: boolean;
  _timings: Record<string, number>;
  _stages: ReturnType<typeof createStageTracker>;
  _t0: number;
  activeHandoff: { status: string; agent_name: string | null } | null;
}

async function setupPipeline(input: ExecuteChatInput): Promise<PipelineContext> {
  const _t0 = Date.now();
  const _timings: Record<string, number> = {};
  const _perf = (label: string) => {
    const ms = Date.now() - _t0;
    _timings[label] = ms;
    console.log(`[Chat:Perf] ${label}: ${ms}ms`);
  };
  const _stages = createStageTracker(_t0);

  const supabase = input.supabase || createAdminClient();

  // Start RAG pre-work immediately (overlaps with conversation setup)
  const ragPreworkPromise = startRAGPrework(input.chatbotId);

  // Load chatbot
  _stages.start('chatbot_loaded');
  const { data: chatbotData, error: chatbotError } = await (supabase as any)
    .from('chatbots')
    .select('id, name, user_id, is_published, status, monthly_message_limit, messages_this_month, purchased_credits_remaining, credit_exhaustion_mode, language, file_upload_config, memory_enabled, memory_days, model, temperature, max_tokens, system_prompt, enable_prompt_protection, live_fetch_threshold, allowed_origins')
    .eq('id', input.chatbotId)
    .single();

  if (chatbotError || !chatbotData) {
    throw new Error('Chatbot not found');
  }
  const chatbot = chatbotData as unknown as Chatbot;
  _perf('chatbot_loaded');
  _stages.end('chatbot_loaded');

  // Check published/active
  if (!chatbot.is_published || chatbot.status !== 'active') {
    throw new Error('Chatbot is not available');
  }

  // Check chatbot owner's subscription status (Gap 3: enforce canceled/past_due/trial_expired)
  await checkSubscriptionStatus(chatbot.user_id);

  // Quota check
  await checkAndIncrementQuota(chatbot, input.chatbotId, supabase);

  // Get or create conversation
  _stages.start('conversation_ready');
  const conversation = await getOrCreateConversation(
    input.chatbotId,
    input.sessionId,
    input.channel,
    input.visitorId,
    supabase,
  );

  // Language switch detection
  const requestedLanguage = detectLanguageSwitch(input.message);
  let activeLanguage = (conversation as any).language || chatbot.language;

  if (requestedLanguage) {
    await (supabase as any)
      .from('conversations')
      .update({ language: requestedLanguage })
      .eq('id', conversation.id);
    activeLanguage = requestedLanguage;
    console.log(`[Chat] Language switch detected: ${requestedLanguage} (${getLanguageName(requestedLanguage)})`);
  }

  _perf('conversation_ready');
  _stages.end('conversation_ready');
  _stages.start('setup_pipeline');

  // RAG query strategy: short messages get enhanced with last assistant message
  const SHORT_MESSAGE_THRESHOLD = 20;
  const isShortMessage = input.message.length <= SHORT_MESSAGE_THRESHOLD;

  let resolveHistory: (msgs: Message[]) => void;
  const historyReady = new Promise<Message[]>((r) => { resolveHistory = r; });

  _stages.start('rag_context');
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

  // Attachment processing
  _stages.start('attachments');
  const attachmentPromise = processAttachments(input.attachments, chatbot)
    .then((r) => { _stages.end('attachments'); return r; });

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
      resolveHistory!(r);
      return r;
    }),
    createMessage({
      conversation_id: conversation.id,
      chatbot_id: input.chatbotId,
      role: 'user',
      content: input.message,
      ...(input.attachments && input.attachments.length > 0 ? { attachments: input.attachments } : {}),
    }, supabase).then((r) => { _stages.end('save_message'); return r; }),
    getActiveHandoff(conversation.id).then((r) => { _stages.end('check_handoff'); return r; }),
    getLeadBySession(input.chatbotId, input.sessionId, supabase).then((r) => { _stages.end('lead_lookup'); return r; }),
    (chatbot.memory_enabled && input.visitorId
      ? getUserMemory(input.visitorId, input.chatbotId, chatbot.memory_days, supabase)
      : Promise.resolve(null)
    ).then((r) => { _stages.end('memory_fetch'); return r; }),
    attachmentPromise,
    ragPromise,
  ]);

  _perf('parallel_done');

  // Emit conversation.started on first real user message
  if (messages.length === 0) {
    emitTypedWebhookEvent(chatbot.user_id, input.chatbotId, 'conversation.started', {
      conversation_id: conversation.id,
      session_id: input.sessionId,
      chatbot_name: chatbot.name,
      channel: input.channel,
      visitor: input.visitorId ? { id: input.visitorId, name: input.userData?.name, email: input.userData?.email } : undefined,
    }).catch(() => {});
  }

  // Emit message.received for the user message
  emitTypedWebhookEvent(chatbot.user_id, input.chatbotId, 'message.received', {
    conversation_id: conversation.id,
    message: {
      id: userMessage.id,
      role: 'user',
      content: input.message,
      created_at: userMessage.created_at || new Date().toISOString(),
    },
    visitor: input.visitorId ? { id: input.visitorId, name: input.userData?.name, email: input.userData?.email } : undefined,
  }).catch(() => {});

  const { aiImages, documentText } = attachmentResult;
  const preChatInfo = leadData ? leadData.form_data : null;

  let memoryContext: string | null = null;
  const existingMemory = memoryResult;
  if (existingMemory) {
    memoryContext = formatMemoryForPrompt(existingMemory);
    console.log(`[Chat] Memory found for visitor ${input.visitorId}: ${existingMemory.key_facts.length} facts`);
  }

  // Calendar integration
  const calendarIntegration = await CalendarService.getIntegration(input.chatbotId);
  const hasCalendar = !!calendarIntegration;
  const calendarHasPreselectedService = hasCalendar
    ? !!(calendarIntegration!.config as Record<string, unknown>)?.service_id
    : false;

  // Build prompts
  _stages.start('prompts_built');
  const chatbotWithActiveLanguage = { ...chatbot, language: activeLanguage };
  const systemPrompt = buildSystemPrompt(
    chatbotWithActiveLanguage,
    ragContext.contextText.length > 0,
    preChatInfo,
    memoryContext,
    input.userData,
    input.userContext,
    hasCalendar,
    calendarHasPreselectedService,
  );
  const userPrompt = buildRAGPrompt(ragContext, messages, input.message, documentText || undefined);

  // Debug logging
  const debugMode = await isChatDebugMode();
  if (debugMode) console.log(`[Chat:Debug] Prompt sources for "${input.message.slice(0, 50)}":`, JSON.stringify({
    hasMemory: !!memoryContext,
    memoryFacts: existingMemory?.key_facts?.length ?? 0,
    memoryPreview: memoryContext?.slice(0, 200) ?? null,
    hasPreChatInfo: !!preChatInfo,
    preChatKeys: preChatInfo ? Object.keys(preChatInfo) : [],
    hasUserData: !!(input.userData && Object.keys(input.userData).length > 0),
    userDataKeys: input.userData ? Object.keys(input.userData) : [],
    hasUserContext: !!(input.userContext && Object.keys(input.userContext).length > 0),
    userContextKeys: input.userContext ? Object.keys(input.userContext) : [],
    userContextPreview: input.userContext ? JSON.stringify(input.userContext).slice(0, 300) : null,
    ragChunks: ragContext.chunks.length,
    ragConfidence: ragContext.confidence,
    ragContextPreview: ragContext.contextText?.slice(0, 200) ?? null,
    historyLength: messages.length,
    systemPromptLength: systemPrompt.length,
  }));

  const conversationMessages = formatConversationHistory(messages.slice(-10));
  _perf('prompts_built');
  _stages.end('prompts_built');

  return {
    supabase,
    chatbot,
    conversation,
    sessionId: input.sessionId,
    messages,
    userMessage,
    ragContext,
    systemPrompt,
    userPrompt,
    conversationMessages,
    aiImages,
    documentText,
    activeLanguage,
    preChatInfo,
    existingMemory,
    hasCalendar,
    isFirstMessage: messages.length === 0,
    _timings,
    _stages,
    _t0,
    activeHandoff,
  };
}

// ── Non-streaming execution ─────────────────────────────────────────

export async function executeChat(input: ExecuteChatInput): Promise<ExecuteChatResult> {
  const ctx = await setupPipeline(input);

  // Check for active handoff
  if (ctx.activeHandoff) {
    const visitorName = input.userData?.name || 'Visitor';
    await forwardVisitorMessage({
      chatbotId: input.chatbotId,
      conversationId: ctx.conversation.id,
      visitorName,
      content: input.message,
    });

    return {
      content: '',
      tokensInput: 0,
      tokensOutput: 0,
      model: '',
      provider: '',
      conversationId: ctx.conversation.id,
      messageId: ctx.userMessage.id,
      sessionId: ctx.sessionId,
      language: ctx.activeLanguage,
      handoffActive: true,
      handoffStatus: ctx.activeHandoff.status,
      agentName: ctx.activeHandoff.agent_name,
      ragChunksUsed: 0,
      ragConfidence: 0,
      latencyMs: Date.now() - ctx._t0,
    };
  }

  // Generate
  ctx._stages.start('generate');
  const startTime = Date.now();
  const result = await generate(ctx.userPrompt, {
    systemPrompt: ctx.systemPrompt,
    temperature: ctx.chatbot.temperature,
    maxTokens: ctx.chatbot.max_tokens,
    images: ctx.aiImages.length > 0 ? ctx.aiImages : undefined,
    conversationMessages: ctx.conversationMessages,
  });
  const latencyMs = Date.now() - startTime;
  ctx._stages.end('generate');

  // Save assistant message
  const assistantMessage = await createMessage({
    conversation_id: ctx.conversation.id,
    chatbot_id: input.chatbotId,
    role: 'assistant',
    content: result.content,
    model: result.model,
    tokens_input: result.tokensInput,
    tokens_output: result.tokensOutput,
    latency_ms: latencyMs,
    context_chunks: ctx.ragContext.chunks.map((c) => c.id),
  }, ctx.supabase);

  // Emit message.sent webhook
  emitTypedWebhookEvent(ctx.chatbot.user_id, input.chatbotId, 'message.sent', {
    conversation_id: ctx.conversation.id,
    message: {
      id: assistantMessage.id,
      role: 'assistant',
      content: result.content,
      created_at: assistantMessage.created_at || new Date().toISOString(),
    },
  }).catch(() => {});

  // Fire-and-forget side effects
  firePostGenerationEffects({
    chatbot: ctx.chatbot,
    conversationId: ctx.conversation.id,
    chatbotId: input.chatbotId,
    messages: ctx.messages,
    userMessage: input.message,
    assistantResponse: result.content,
    visitorId: input.visitorId,
    existingMemory: ctx.existingMemory,
    preChatInfo: ctx.preChatInfo,
    supabase: ctx.supabase,
    isFirstMessage: ctx.isFirstMessage,
  });

  // Performance log
  ctx._timings.total = Date.now() - ctx._t0;
  const ragStageStart = ctx._stages.getStages().rag_context?.start ?? 0;
  const ragSt = ctx.ragContext.stageTimings || {};
  for (const [key, span] of Object.entries(ragSt)) {
    if (span.end > 0) {
      ctx._stages.getStages()[`rag_${key}`] = {
        start: ragStageStart + span.start,
        end: ragStageStart + span.end,
      };
    }
  }
  savePerfLog(ctx.supabase, {
    chatbot_id: input.chatbotId,
    conversation_id: ctx.conversation.id,
    session_id: ctx.sessionId,
    timings: ctx._timings,
    pipelineTimings: ctx._stages.getStages(),
    model: ctx.chatbot.model,
    rag_chunks_count: ctx.ragContext.chunks.length,
    rag_confidence: ctx.ragContext.confidence,
    rag_timings: ctx.ragContext.perfTimings,
    live_fetch_triggered: ctx.ragContext.pinnedUrls.length > 0 && ctx.ragContext.confidence < (ctx.chatbot.live_fetch_threshold ?? DEFAULT_LIVE_FETCH_THRESHOLD),
    message_length: input.message.length,
    response_length: result.content.length,
    is_streaming: false,
    user_message: input.message,
    assistant_response: result.content,
  });

  // API call log
  logAPICall({
    user_id: ctx.chatbot.user_id,
    endpoint: `/api/chat/${input.chatbotId}`,
    method: 'POST',
    request_body: { message: input.message, stream: false },
    response_body: { message: result.content },
    status_code: 200,
    provider: result.provider,
    model: result.model,
    tokens_input: result.tokensInput,
    tokens_output: result.tokensOutput,
    tokens_billed: result.tokensInput + result.tokensOutput,
    duration_ms: latencyMs,
  }).catch(() => {});

  return {
    content: result.content,
    tokensInput: result.tokensInput,
    tokensOutput: result.tokensOutput,
    model: result.model,
    provider: result.provider,
    conversationId: ctx.conversation.id,
    messageId: assistantMessage.id,
    sessionId: ctx.sessionId,
    language: ctx.activeLanguage,
    ragChunksUsed: ctx.ragContext.chunks.length,
    ragConfidence: ctx.ragContext.confidence,
    latencyMs,
  };
}

// ── Streaming execution ─────────────────────────────────────────────

export async function executeChatStream(
  input: ExecuteChatInput,
  callbacks: ExecuteChatStreamCallbacks,
): Promise<void> {
  const ctx = await setupPipeline(input);

  // Check for active handoff
  if (ctx.activeHandoff) {
    const visitorName = input.userData?.name || 'Visitor';
    await forwardVisitorMessage({
      chatbotId: input.chatbotId,
      conversationId: ctx.conversation.id,
      visitorName,
      content: input.message,
    });

    callbacks.onDone({
      content: '',
      tokensInput: 0,
      tokensOutput: 0,
      model: '',
      provider: '',
      conversationId: ctx.conversation.id,
      messageId: ctx.userMessage.id,
      sessionId: ctx.sessionId,
      language: ctx.activeLanguage,
      handoffActive: true,
      handoffStatus: ctx.activeHandoff.status,
      agentName: ctx.activeHandoff.agent_name,
      ragChunksUsed: 0,
      ragConfidence: 0,
      latencyMs: Date.now() - ctx._t0,
    });
    return;
  }

  // Send metadata
  callbacks.onMeta({
    conversationId: ctx.conversation.id,
    sessionId: ctx.sessionId,
    language: ctx.activeLanguage,
  });

  // Stream generation
  ctx._stages.start('first_token');
  const generator = generateStream(ctx.userPrompt, {
    systemPrompt: ctx.systemPrompt,
    temperature: ctx.chatbot.temperature,
    maxTokens: ctx.chatbot.max_tokens,
    images: ctx.aiImages.length > 0 ? ctx.aiImages : undefined,
    conversationMessages: ctx.conversationMessages,
  });

  let fullResponse = '';
  let firstToken = true;
  let streamResult: GenerateResult | null = null;

  let next = await generator.next();
  while (!next.done) {
    const chunk = next.value as string;
    if (firstToken) {
      ctx._timings.first_token = Date.now() - ctx._t0;
      ctx._stages.end('first_token');
      ctx._stages.start('stream_complete');
      firstToken = false;
    }
    fullResponse += chunk;
    callbacks.onToken(chunk);
    next = await generator.next();
  }
  streamResult = next.value as GenerateResult;
  ctx._timings.stream_complete = Date.now() - ctx._t0;
  ctx._stages.end('stream_complete');

  // Calendar marker processing
  let processedResponse = fullResponse;
  if (ctx.hasCalendar) {
    const calResult = await processCalendarMarkers(fullResponse, input.chatbotId, ctx.sessionId);
    processedResponse = calResult.processedResponse;
    for (const evt of calResult.calendarEvents) {
      callbacks.onCalendar(evt.action, evt.data);
    }
  }

  // Save assistant message
  const assistantMessage = await createMessage({
    conversation_id: ctx.conversation.id,
    chatbot_id: input.chatbotId,
    role: 'assistant',
    content: processedResponse,
    model: ctx.chatbot.model,
    context_chunks: ctx.ragContext.chunks.map((c) => c.id),
  }, ctx.supabase);

  // Emit message.sent webhook
  emitTypedWebhookEvent(ctx.chatbot.user_id, input.chatbotId, 'message.sent', {
    conversation_id: ctx.conversation.id,
    message: {
      id: assistantMessage.id,
      role: 'assistant',
      content: processedResponse,
      created_at: assistantMessage.created_at || new Date().toISOString(),
    },
  }).catch(() => {});

  // Fire-and-forget side effects
  firePostGenerationEffects({
    chatbot: ctx.chatbot,
    conversationId: ctx.conversation.id,
    chatbotId: input.chatbotId,
    messages: ctx.messages,
    userMessage: input.message,
    assistantResponse: processedResponse,
    visitorId: input.visitorId,
    existingMemory: ctx.existingMemory,
    preChatInfo: ctx.preChatInfo,
    supabase: ctx.supabase,
    isFirstMessage: ctx.isFirstMessage,
  });

  // Performance log
  ctx._timings.total = Date.now() - ctx._t0;
  const ragStageStart = ctx._stages.getStages().rag_context?.start ?? 0;
  const ragSt = ctx.ragContext.stageTimings || {};
  for (const [key, span] of Object.entries(ragSt)) {
    if (span.end > 0) {
      ctx._stages.getStages()[`rag_${key}`] = {
        start: ragStageStart + span.start,
        end: ragStageStart + span.end,
      };
    }
  }
  savePerfLog(ctx.supabase, {
    chatbot_id: input.chatbotId,
    conversation_id: ctx.conversation.id,
    session_id: ctx.sessionId,
    timings: ctx._timings,
    pipelineTimings: ctx._stages.getStages(),
    model: ctx.chatbot.model,
    rag_chunks_count: ctx.ragContext.chunks.length,
    rag_confidence: ctx.ragContext.confidence,
    rag_timings: ctx.ragContext.perfTimings,
    live_fetch_triggered: ctx.ragContext.pinnedUrls.length > 0 && ctx.ragContext.confidence < (ctx.chatbot.live_fetch_threshold ?? DEFAULT_LIVE_FETCH_THRESHOLD),
    message_length: input.message.length,
    response_length: fullResponse.length,
    is_streaming: true,
    user_message: input.message,
    assistant_response: fullResponse,
  });

  // API call log
  logAPICall({
    user_id: ctx.chatbot.user_id,
    endpoint: `/api/chat/${input.chatbotId}`,
    method: 'POST',
    request_body: { message: input.message, stream: true },
    response_body: { message: fullResponse },
    status_code: 200,
    provider: streamResult?.provider ?? ctx.chatbot.model,
    model: streamResult?.model ?? ctx.chatbot.model,
    tokens_input: streamResult?.tokensInput ?? Math.ceil(ctx.userPrompt.length / 4),
    tokens_output: streamResult?.tokensOutput ?? Math.ceil(fullResponse.length / 4),
    tokens_billed: (streamResult?.tokensInput ?? Math.ceil(ctx.userPrompt.length / 4)) + (streamResult?.tokensOutput ?? Math.ceil(fullResponse.length / 4)),
    duration_ms: streamResult?.durationMs ?? ctx._timings.stream_complete,
  }).catch(() => {});

  // Notify completion
  callbacks.onDone({
    content: processedResponse,
    tokensInput: streamResult?.tokensInput ?? 0,
    tokensOutput: streamResult?.tokensOutput ?? 0,
    model: streamResult?.model ?? ctx.chatbot.model,
    provider: streamResult?.provider ?? ctx.chatbot.model,
    conversationId: ctx.conversation.id,
    messageId: assistantMessage.id,
    sessionId: ctx.sessionId,
    language: ctx.activeLanguage,
    ragChunksUsed: ctx.ragContext.chunks.length,
    ragConfidence: ctx.ragContext.confidence,
    latencyMs: streamResult?.durationMs ?? Date.now() - ctx._t0,
  });
}
