'use client';

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { MessageSquare, X, Send, ThumbsUp, ThumbsDown, Loader2, MessageCircle, Paperclip, FileIcon, Download, XCircle, Mail, Check, Expand, Shrink, RotateCcw, AlertCircle, Clock, ShieldOff } from 'lucide-react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import type { WidgetConfig, Chatbot, PreChatFormConfig, PostChatSurveyConfig, PreChatFormField, ProactiveMessagesConfig, FileUploadConfig, Attachment, TranscriptConfig, EscalationConfig, FeedbackConfig, LiveHandoffConfig } from '@/lib/chatbots/types';
import { getTranslations, translateDefault } from '@/lib/chatbots/translations';
import { DEFAULT_PRE_CHAT_FORM_CONFIG, DEFAULT_POST_CHAT_SURVEY_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, FILE_TYPE_MAP } from '@/lib/chatbots/types';
import { FallbackTicketForm, FallbackContactForm, FallbackPurchaseCredits, FallbackHelpArticles } from './fallback-views';
import type { FileUploadAllowedTypes } from '@/lib/chatbots/types';

// Singleton Supabase client for widget Realtime subscriptions (anon key)
let widgetSupabaseClient: ReturnType<typeof createClient> | null = null;
function getWidgetSupabase() {
  if (!widgetSupabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    widgetSupabaseClient = createClient(url, key);
  }
  return widgetSupabaseClient;
}

// Session persistence helpers
const DEFAULT_SESSION_TTL_HOURS = 24;
const SESSION_INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes of inactivity

interface PersistedSession {
  sessionId: string;
  conversationId: string | null;
  preChatCompleted: boolean;
  preChatFormData: Record<string, string>;
  handoffActive: boolean;
  lastActivity: number;
  createdAt: number;
}

function getSessionStorageKey(chatbotId: string) {
  return `chatbot_session_${chatbotId}`;
}

function loadPersistedSession(chatbotId: string, sessionTtlHours?: number): PersistedSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getSessionStorageKey(chatbotId));
    if (!raw) return null;
    const session: PersistedSession = JSON.parse(raw);
    const now = Date.now();
    const maxAgeMs = (sessionTtlHours ?? DEFAULT_SESSION_TTL_HOURS) * 60 * 60 * 1000;
    // Check TTL: inactive too long or too old
    if (now - session.lastActivity > SESSION_INACTIVITY_MS || now - session.createdAt > maxAgeMs) {
      localStorage.removeItem(getSessionStorageKey(chatbotId));
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function savePersistedSession(chatbotId: string, session: PersistedSession) {
  if (typeof window === 'undefined') return;
  try {
    session.lastActivity = Date.now();
    localStorage.setItem(getSessionStorageKey(chatbotId), JSON.stringify(session));
  } catch { /* storage full or blocked */ }
}

// Map of Google Font names to their URL-friendly versions
const GOOGLE_FONTS: Record<string, string> = {
  'Inter': 'Inter:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Nunito': 'Nunito:wght@400;500;600;700',
  'Raleway': 'Raleway:wght@400;500;600;700',
  'Source Sans Pro': 'Source+Sans+Pro:wght@400;600;700',
  'Ubuntu': 'Ubuntu:wght@400;500;700',
  'DM Sans': 'DM+Sans:wght@400;500;600;700',
  'Manrope': 'Manrope:wght@400;500;600;700',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@400;500;600;700',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700',
  'Merriweather': 'Merriweather:wght@400;700',
  'Lora': 'Lora:wght@400;500;600;700',
  'Source Serif Pro': 'Source+Serif+Pro:wght@400;600;700',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;700',
  'Fira Code': 'Fira+Code:wght@400;500;700',
  'Source Code Pro': 'Source+Code+Pro:wght@400;500;700',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;700',
  'Quicksand': 'Quicksand:wght@400;500;600;700',
  'Comfortaa': 'Comfortaa:wght@400;500;700',
  'Varela Round': 'Varela+Round',
};

/**
 * Sanitize user-provided CSS to remove dangerous constructs
 * that could be used for data exfiltration or code execution.
 */
function sanitizeCSS(css: string): string {
  let sanitized = css;
  // Remove @import statements
  sanitized = sanitized.replace(/@import\s+[^;]+;?/gi, '');
  // Remove url() references except data: URIs
  sanitized = sanitized.replace(/url\s*\(\s*(?!['"]?data:)([^)]*)\)/gi, '');
  // Remove expression() (IE legacy)
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '');
  // Remove -moz-binding
  sanitized = sanitized.replace(/-moz-binding\s*:[^;]+;?/gi, '');
  // Remove javascript: references
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  // Remove behavior: property (IE HTC)
  sanitized = sanitized.replace(/behavior\s*:[^;]+;?/gi, '');
  return sanitized;
}

function extractFontName(fontFamily: string): string | null {
  // Extract the first font name from the font-family string
  const match = fontFamily.match(/^([^,]+)/);
  if (!match) return null;
  return match[1].trim().replace(/['"]/g, '');
}

function loadGoogleFont(fontFamily: string): void {
  const fontName = extractFontName(fontFamily);
  if (!fontName || !GOOGLE_FONTS[fontName]) return;

  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return; // Already loaded

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS[fontName]}&display=swap`;
  document.head.appendChild(link);
}

interface CheckInAction {
  label: string;
  action: string;
  primary?: boolean;
}

type ChatErrorType = 'rate_limit' | 'message_limit' | 'unavailable' | 'server_error';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  checkInActions?: CheckInAction[];
  clickedAction?: string;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  failed?: boolean;
  errorType?: ChatErrorType;
  errorMessage?: string;
  retryAfter?: number;
}

type WidgetView = 'pre-chat-form' | 'verify-email' | 'chat' | 'survey' | 'survey-thanks' | 'report' | 'ticket-form' | 'contact-form' | 'purchase-credits' | 'help-articles';

/**
 * Lightweight markdown-to-HTML renderer for chat bubbles.
 * Handles: **bold**, *italic*, line breaks, - bullet lists, numbered lists.
 * Results are memoized by content string to avoid redundant work during streaming.
 */
const markdownCache = new Map<string, string>();
const MARKDOWN_CACHE_MAX = 500;

function renderMarkdown(text: string): string {
  const cached = markdownCache.get(text);
  if (cached) return cached;

  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (but not inside bold)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Split into lines for list handling
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Bullet list: - item or * item
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
    // Numbered list: 1. item, 2. item
    const numberMatch = trimmed.match(/^\d+\.\s+(.+)/);

    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ul style="margin:4px 0;padding-left:20px;">');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${bulletMatch[1]}</li>`);
    } else if (numberMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ol style="margin:4px 0;padding-left:20px;">');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${numberMatch[1]}</li>`);
    } else {
      if (inList) {
        result.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
        listType = null;
      }
      // Empty line = paragraph break, otherwise line break
      if (trimmed === '') {
        result.push('<br/>');
      } else {
        result.push(trimmed);
        result.push('<br/>');
      }
    }
  }

  if (inList) {
    result.push(listType === 'ol' ? '</ol>' : '</ul>');
  }

  // Clean up trailing <br/>
  let output = result.join('');
  output = output.replace(/(<br\/>)+$/, '');

  // Evict oldest entries when cache is full
  if (markdownCache.size >= MARKDOWN_CACHE_MAX) {
    const firstKey = markdownCache.keys().next().value;
    if (firstKey !== undefined) markdownCache.delete(firstKey);
  }
  markdownCache.set(text, output);

  return output;
}

interface ChatWidgetProps {
  chatbotId: string;
  chatbot: Partial<Chatbot>;
  config: WidgetConfig;
  preChatFormConfig?: PreChatFormConfig;
  postChatSurveyConfig?: PostChatSurveyConfig;
  language?: string;
  fileUploadConfig?: FileUploadConfig;
  proactiveMessagesConfig?: ProactiveMessagesConfig;
  transcriptConfig?: TranscriptConfig;
  escalationConfig?: EscalationConfig;
  feedbackConfig?: FeedbackConfig;
  liveHandoffConfig?: LiveHandoffConfig;
  agentsAvailable?: boolean;
  memoryEnabled?: boolean;
  sessionTtlHours?: number;
  userData?: Record<string, string> | null;
  userContext?: Record<string, unknown> | null;
  creditExhausted?: boolean;
  creditLow?: boolean;
  creditRemaining?: number | null;
  creditExhaustionMode?: string;
  creditExhaustionConfig?: Record<string, unknown>;
  creditPackages?: Array<{ id: string; name: string; creditAmount: number; priceCents: number; stripePriceId: string }>;
}

export function ChatWidget({ chatbotId, chatbot, config, preChatFormConfig, postChatSurveyConfig, language = 'en', fileUploadConfig, proactiveMessagesConfig, transcriptConfig, escalationConfig, feedbackConfig, liveHandoffConfig, agentsAvailable = false, memoryEnabled = false, sessionTtlHours, userData, userContext, creditExhausted = false, creditLow = false, creditRemaining = null, creditExhaustionMode = 'tickets', creditExhaustionConfig = {}, creditPackages = [] }: ChatWidgetProps) {
  const [activeLanguage, setActiveLanguage] = useState(language);
  const t = getTranslations(activeLanguage);
  const tRef = useRef(t);
  tRef.current = t;
  const hasUserData = !!(userData && userData.id);
  const showPreChat = preChatFormConfig?.enabled === true && !hasUserData;
  const showPostChat = postChatSurveyConfig?.enabled === true;

  // Restore persisted session if available
  const [persistedSession] = useState(() => loadPersistedSession(chatbotId, sessionTtlHours));
  const preChatAlreadyCompleted = !!(persistedSession?.preChatCompleted);

  const [currentView, setCurrentView] = useState<WidgetView>(
    showPreChat && !preChatAlreadyCompleted ? 'pre-chat-form' : 'chat'
  );
  const [isOpen, setIsOpen] = useState(config.autoOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [sessionRestoredRef] = useState(() => ({ current: false }));
  const [sessionId] = useState(() => {
    if (persistedSession?.sessionId) return persistedSession.sessionId;
    return `session_${crypto.randomUUID()}`;
  });
  const [visitorId, setVisitorId] = useState(() => {
    if (typeof window === 'undefined') return `visitor_${crypto.randomUUID()}`;
    const stored = localStorage.getItem(`chatbot_visitor_${chatbotId}`);
    if (stored) return stored;
    const newId = `visitor_${crypto.randomUUID()}`;
    localStorage.setItem(`chatbot_visitor_${chatbotId}`, newId);
    return newId;
  });

  // File upload state
  const uploadConfig = fileUploadConfig || DEFAULT_FILE_UPLOAD_CONFIG;
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, boolean | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Chat disabled state (message limit reached or chatbot unavailable)
  const [chatDisabled, setChatDisabled] = useState<'message_limit' | 'unavailable' | null>(
    creditExhausted ? 'message_limit' : null
  );

  // If credits are already exhausted on mount, immediately show the fallback view
  useEffect(() => {
    if (creditExhausted && currentView === 'chat') {
      const viewMap: Record<string, WidgetView> = {
        tickets: 'ticket-form',
        contact_form: 'contact-form',
        purchase_credits: 'purchase-credits',
        help_articles: 'help-articles',
      };
      const fallbackView = viewMap[creditExhaustionMode];
      if (fallbackView) {
        setChatDisabled('message_limit');
        setCurrentView(fallbackView);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  // Transcript state
  const transcriptEnabled = transcriptConfig?.enabled === true;
  const [transcriptEmail, setTranscriptEmail] = useState('');
  const [transcriptSending, setTranscriptSending] = useState(false);
  const [transcriptSent, setTranscriptSent] = useState(false);
  const [transcriptError, setTranscriptError] = useState('');
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);
  const pendingSurveyAfterTranscript = useRef(false);

  // Low credit warning state
  const [lowCreditDismissed, setLowCreditDismissed] = useState(false);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);
  const showLowCreditBanner = creditLow && !lowCreditDismissed && !creditExhausted;

  // Feedback follow-up state
  const feedbackFollowUpEnabled = feedbackConfig?.follow_up_enabled === true;
  const [feedbackFollowUpId, setFeedbackFollowUpId] = useState<string | null>(null);
  const [feedbackReasonSubmitting, setFeedbackReasonSubmitting] = useState(false);

  // Escalation / Report state
  const escalationEnabled = escalationConfig?.enabled === true;
  const liveHandoffEnabled = liveHandoffConfig?.enabled === true;
  const handoffTimeoutMinutes = liveHandoffConfig?.handoff_timeout_minutes ?? escalationConfig?.handoff_timeout_minutes ?? 5;
  const [conversationId, setConversationId] = useState<string | null>(persistedSession?.conversationId || null);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [reportConversation, setReportConversation] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportedMessageIds, setReportedMessageIds] = useState<Set<string>>(new Set());
  const [reportSuccess, setReportSuccess] = useState(false);

  // Handoff state
  const [handoffActive, setHandoffActive] = useState(persistedSession?.handoffActive || false);
  // Agent presence via Supabase Realtime Presence — no polling needed.
  // Agents track on `agent-presence:${chatbotId}`; when they disconnect,
  // Supabase removes their presence automatically.
  const [agentsOnline, setAgentsOnline] = useState(agentsAvailable === true);
  useEffect(() => {
    // Telegram-based handoff is always available (no presence channel needed)
    if (agentsAvailable === true) {
      setAgentsOnline(true);
      return;
    }
    if (!liveHandoffEnabled) return;

    const supabase = getWidgetSupabase();
    if (!supabase) return;

    const channel = supabase.channel(`agent-presence:${chatbotId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        let count = 0;
        for (const key of Object.keys(state)) {
          count += (state[key] as unknown[]).length;
        }
        setAgentsOnline(count > 0);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentsAvailable, chatbotId, liveHandoffEnabled]);
  const showHandoffIcon = liveHandoffEnabled && agentsOnline && !handoffActive;
  const [handoffStatus, setHandoffStatus] = useState<string | null>(null);
  const [handoffAgentName, setHandoffAgentName] = useState<string | null>(null);
  const handoffAgentNameRef = useRef<string | null>(null);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const lastMessageCountRef = useRef(0);

  // Keep agent name ref in sync for use in callbacks after state is cleared
  if (handoffAgentName) handoffAgentNameRef.current = handoffAgentName;

  // Typing indicator & presence state
  const [agentIsTyping, setAgentIsTyping] = useState(false);
  const agentTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingBroadcastRef = useRef<number>(0);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);

  // Handoff inactivity timeout
  const handoffWarningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoffCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handoffCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handoffWarningShownRef = useRef(false);
  const resetHandoffTimerRef = useRef<() => void>(() => {});
  const [handoffCountdownSeconds, setHandoffCountdownSeconds] = useState<number | null>(null);

  // Handoff end transition
  const [handoffEndedInfo, setHandoffEndedInfo] = useState<{ agentName: string } | null>(null);
  const [handoffRating, setHandoffRating] = useState<number | null>(null);
  const [handoffRatingSubmitted, setHandoffRatingSubmitted] = useState(false);

  // Build accepted MIME types from config
  const acceptedMimes = (() => {
    if (!uploadConfig.enabled) return '';
    const mimes: string[] = [];
    for (const [category, cfg] of Object.entries(FILE_TYPE_MAP)) {
      if (uploadConfig.allowed_types[category as keyof FileUploadAllowedTypes]) {
        mimes.push(...cfg.mimes);
      }
    }
    return mimes.join(',');
  })();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Reset input so same file can be selected again
    e.target.value = '';

    const maxFiles = uploadConfig.max_files_per_message ?? 3;
    const remaining = maxFiles - pendingAttachments.length;
    if (remaining <= 0) return;

    // Take only as many files as slots remain
    const selectedFiles = Array.from(files).slice(0, remaining);

    // Validate file size and type
    const maxBytes = uploadConfig.max_file_size_mb * 1024 * 1024;
    const allowedMimes: string[] = [];
    for (const [category, cfg] of Object.entries(FILE_TYPE_MAP)) {
      if (uploadConfig.allowed_types[category as keyof FileUploadAllowedTypes]) {
        allowedMimes.push(...cfg.mimes);
      }
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxBytes) return false;
      if (!allowedMimes.includes(file.type)) return false;
      return true;
    });

    const rejectedCount = selectedFiles.length - validFiles.length;
    if (rejectedCount > 0) {
      const msg = rejectedCount === selectedFiles.length
        ? `File${rejectedCount > 1 ? 's' : ''} rejected: check size (max ${uploadConfig.max_file_size_mb}MB) and type`
        : `${rejectedCount} file${rejectedCount > 1 ? 's' : ''} rejected (size/type), ${validFiles.length} accepted`;
      setUploadError(msg);
      setTimeout(() => setUploadError(null), 4000);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded: Attachment[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('session_id', sessionId);

        const response = await fetch(`/api/widget/${chatbotId}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          console.warn(`Upload failed for ${file.name}:`, data.error?.message);
          continue;
        }

        const data = await response.json();
        uploaded.push(data.data);
      }
      if (uploaded.length > 0) {
        setPendingAttachments((prev) => [...prev, ...uploaded]);
      }
    } catch (err) {
      console.warn('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [chatbotId, sessionId, uploadConfig, t, pendingAttachments.length]);

  const removePendingAttachment = useCallback((index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const downloadAttachment = useCallback(async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(url, '_blank');
    }
  }, []);

  // Re-translate survey/transcript action messages when language changes mid-conversation
  useEffect(() => {
    setMessages((prev) => {
      let changed = false;
      const updated = prev.map((msg) => {
        if (msg.id.startsWith('survey_suggest_')) {
          changed = true;
          return {
            ...msg,
            content: t.surveyPrompt,
            checkInActions: msg.checkInActions?.map((a) => ({
              ...a,
              label: a.action === 'survey-yes' ? t.surveyYes : a.action === 'survey-no' ? t.surveyNo : a.label,
            })),
          };
        }
        return msg;
      });
      return changed ? updated : prev;
    });
  }, [activeLanguage, t]);

  // When authenticated user data is provided, use user.id as visitorId for cross-device memory
  useEffect(() => {
    if (userData?.id) {
      setVisitorId(userData.id);
    }
  }, [userData]);
  const [preChatFormData, setPreChatFormData] = useState<Record<string, string>>(persistedSession?.preChatFormData || {});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [surveyResponses, setSurveyResponses] = useState<Record<string, unknown>>({});
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [endOfChatState, setEndOfChatState] = useState<'idle' | 'waiting' | 'offered'>('idle');
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyResponseId, setSurveyResponseId] = useState<string | null>(null);
  const [isPreChatSubmitting, setIsPreChatSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  // Chat history state
  const [historyMessages, setHistoryMessages] = useState<WidgetMessage[]>([]);
  const [historySessionBreaks, setHistorySessionBreaks] = useState<Map<string, string>>(new Map());
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyNextCursor, setHistoryNextCursor] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Font if needed
  useEffect(() => {
    if (config.fontFamily) {
      loadGoogleFont(config.fontFamily);
    }
  }, [config.fontFamily]);

  // Auto-open after delay
  useEffect(() => {
    if (config.autoOpen && config.autoOpenDelay > 0) {
      const timer = setTimeout(() => setIsOpen(true), config.autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [config.autoOpen, config.autoOpenDelay]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when history is first loaded (initial fetch only)
  useEffect(() => {
    if (historyLoaded && historyMessages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      });
    }
  }, [historyLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when returning to chat view (e.g. after survey)
  useEffect(() => {
    if (currentView === 'chat') {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      });
    }
  }, [currentView]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-expand on mobile viewport (only when NOT in iframe;
  // in iframe mode the SDK parent handles mobile detection and iframe resizing)
  // Note: uses synchronous iframe check since isInIframe state is set async after mount
  useEffect(() => {
    if (window.self !== window.top) return;
    const checkMobile = () => {
      if (window.innerWidth <= 768) setIsExpanded(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle expand/shrink toggle
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => {
      const next = !prev;
      // Notify parent (SDK) if in iframe
      if (window.self !== window.top) {
        window.parent.postMessage({
          type: next ? 'expand-chat-widget' : 'shrink-chat-widget',
        }, '*');
      }
      return next;
    });
  }, []);

  // Listen for expand/shrink confirmations and mobile-mode from SDK parent
  useEffect(() => {
    const handleExpandMessage = (event: MessageEvent) => {
      if (event.data?.type === 'widget-expanded') {
        setIsExpanded(true);
      } else if (event.data?.type === 'widget-shrunk') {
        setIsExpanded(false);
      } else if (event.data?.type === 'mobile-mode') {
        setIsMobileMode(true);
        setIsExpanded(true);
      }
    };
    window.addEventListener('message', handleExpandMessage);
    return () => window.removeEventListener('message', handleExpandMessage);
  }, []);

  // Fetch chat history for a verified visitor
  const fetchHistory = useCallback(async (vId: string, cursor?: string | null) => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({ visitor_id: vId, limit: '20' });
      if (cursor) params.set('before', cursor);
      const res = await fetch(`/api/widget/${chatbotId}/history?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        const { groups, has_more, next_cursor } = data.data;
        // Build messages and session break markers from groups
        const newMessages: WidgetMessage[] = [];
        const newBreaks = new Map<string, string>(cursor ? historySessionBreaks : undefined);
        for (const group of groups) {
          // Mark the first message of each conversation group as a session break
          if (group.messages.length > 0) {
            newBreaks.set(group.messages[0].id, group.started_at);
          }
          for (const msg of group.messages) {
            newMessages.push({
              id: `history_${msg.id}`,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
            });
          }
        }
        if (cursor) {
          // Prepend older messages, deduplicating by ID
          setHistoryMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const unique = newMessages.filter((m) => !existingIds.has(m.id));
            return [...unique, ...prev];
          });
        } else {
          setHistoryMessages(newMessages);
        }
        setHistorySessionBreaks(newBreaks);
        setHistoryHasMore(has_more);
        setHistoryNextCursor(next_cursor);
        setHistoryLoaded(true);
      }
    } catch (err) {
      console.warn('Failed to fetch chat history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [chatbotId, historySessionBreaks]);

  // Lazy load more history on scroll to top (skip for proactive sessions without userData)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !historyLoaded || !historyHasMore) return;
    if (proactiveInitiatedRef.current && !hasUserData) return;

    const handleScroll = () => {
      const cursor = historyNextCursor;
      if (container.scrollTop < 50 && !historyLoading && historyHasMore && cursor) {
        const prevScrollHeight = container.scrollHeight;
        fetchHistory(visitorId, cursor).then(() => {
          // Preserve scroll position after prepending
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          });
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [historyLoaded, historyHasMore, historyLoading, historyNextCursor, visitorId, fetchHistory]);

  // Load conversation history on initial open (when no pre-chat form or already completed)
  useEffect(() => {
    if (!isOpen || historyLoaded || historyLoading) return;
    if (currentView !== 'chat') return;
    // Skip if proactive-initiated without user data
    if (proactiveInitiatedRef.current && !hasUserData) return;
    fetchHistory(visitorId);
  }, [isOpen, currentView, historyLoaded, historyLoading, visitorId, hasUserData, fetchHistory]);

  // Helper to convert field label to placeholder name (e.g., "Company Name" -> "company_name")
  const getPlaceholderName = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  // Helper to process welcome message with any placeholders from form data
  const processWelcomeMessage = useCallback((message: string): string => {
    if (!preChatFormConfig || !preChatFormData || !preChatFormConfig.fields) return message;

    let processedMessage = message;

    // Build a map of placeholders to their values
    const placeholderMap: Record<string, string> = {};

    // Add special handling for {{name}} - look for field with id 'name' or label containing 'name'
    const nameFieldById = preChatFormConfig.fields.find(f => f.id === 'name');
    const nameFieldByLabel = preChatFormConfig.fields.find(
      f => f.label.toLowerCase().includes('name')
    );
    const nameField = nameFieldById || nameFieldByLabel;
    if (nameField && preChatFormData[nameField.id]) {
      placeholderMap['name'] = preChatFormData[nameField.id].trim();
    }

    // Process all fields - create placeholders from their labels
    preChatFormConfig.fields.forEach((field) => {
      const value = preChatFormData[field.id];
      if (value && value.trim()) {
        const placeholder = getPlaceholderName(field.label);
        if (placeholder && !placeholderMap[placeholder]) {
          placeholderMap[placeholder] = value.trim();
        }
      }
    });

    // Replace all placeholders in the message
    // Match pattern: {{placeholder_name}}
    processedMessage = processedMessage.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
      const value = placeholderMap[placeholder];
      return value !== undefined ? value : '';
    }).replace(/  +/g, ' ').trim();

    // Auto-inject name into common greeting patterns if no {{name}} placeholder was used
    // and the message still doesn't contain the visitor's name
    const visitorName = placeholderMap['name'];
    if (visitorName && !message.includes('{{name}}') && !processedMessage.includes(visitorName)) {
      processedMessage = processedMessage.replace(
        /^(Hi|Hello|Hey|Welcome)(!|\b)/i,
        `$1 ${visitorName}$2`
      );
    }

    return processedMessage;
  }, [preChatFormConfig, preChatFormData]);

  // Restore messages from server when we have a persisted conversation
  // Store the persisted convId + handoff flag in a ref so the effect below
  // (which runs after startHandoffSubscription is defined) can use them.
  const pendingHandoffResubRef = useRef<string | null>(
    persistedSession?.handoffActive && persistedSession?.conversationId
      ? persistedSession.conversationId
      : null
  );

  useEffect(() => {
    const convId = persistedSession?.conversationId;
    if (!convId || sessionRestoredRef.current) return;
    sessionRestoredRef.current = true;

    async function restoreSession() {
      try {
        const res = await fetch(
          `/api/widget/${chatbotId}/history?visitor_id=${encodeURIComponent(visitorId)}&limit=50`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!data.success || !data.data.groups?.length) return;

        // Find the group matching our persisted conversation
        const group = data.data.groups.find(
          (g: { conversation_id: string }) => g.conversation_id === convId
        );
        if (!group?.messages?.length) return;

        const restored: WidgetMessage[] = group.messages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.created_at),
        }));

        setMessages(restored);
      } catch (err) {
        console.warn('[ChatWidget] Failed to restore session:', err);
      }
    }

    restoreSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotId, visitorId]);

  // Persist session state to localStorage on key changes
  useEffect(() => {
    // Only persist once we have a conversationId (i.e., first message was sent)
    if (!conversationId) return;
    const preChatCompleted = currentView !== 'pre-chat-form' && (
      !showPreChat || Object.keys(preChatFormData).length > 0
    );
    savePersistedSession(chatbotId, {
      sessionId,
      conversationId,
      preChatCompleted,
      preChatFormData,
      handoffActive,
      lastActivity: Date.now(),
      createdAt: persistedSession?.createdAt || Date.now(),
    });
  }, [chatbotId, sessionId, conversationId, currentView, showPreChat, preChatFormData, handoffActive, persistedSession?.createdAt]);

  // Add welcome message on first open (after pre-chat form if enabled)
  useEffect(() => {
    // Only show welcome message when:
    // 1. Widget is open
    // 2. No messages yet
    // 3. Welcome message exists
    // 4. Either no pre-chat form, or pre-chat form was submitted (currentView === 'chat')
    // 5. Not restoring a persisted session
    const shouldShowWelcome = isOpen &&
      messages.length === 0 &&
      !persistedSession?.conversationId &&
      chatbot.welcome_message &&
      (!showPreChat || currentView === 'chat');
    
    if (shouldShowWelcome) {
      const processedMessage = processWelcomeMessage(chatbot.welcome_message!);
      const welcomeMessage: WidgetMessage = {
        id: 'welcome',
        role: 'assistant',
        content: processedMessage,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Save welcome message to conversation so AI has full context
      fetch(`/api/chat/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '__WELCOME__',
          session_id: sessionId,
          visitor_id: visitorId,
          stream: false,
          welcome_message: processedMessage,
          ...(userData ? { user_data: userData } : {}),
          ...(userContext ? { user_context: userContext } : {}),
        }),
      }).catch((err) => {
        console.warn('Failed to save welcome message:', err);
      });
    }
  }, [isOpen, messages.length, chatbot.welcome_message, showPreChat, currentView, processWelcomeMessage, chatbotId, sessionId, visitorId, userData, userContext]);

  // Trigger end-of-chat flow: offer transcript (if enabled) then survey
  const triggerEndOfChat = useCallback(() => {
    if (endOfChatState !== 'idle' && endOfChatState !== 'waiting') return;
    setEndOfChatState('offered');

    const currentT = tRef.current;

    // If transcript chat prompt is enabled, offer that first
    if (transcriptEnabled && transcriptConfig?.show_chat_prompt !== false && !transcriptSent) {
      const transcriptActions: CheckInAction[] = [
        { label: currentT.emailTranscript, action: 'transcript-yes', primary: true },
        { label: currentT.skip, action: 'transcript-skip' },
      ];
      setMessages((prev) => [...prev, {
        id: `transcript_offer_${Date.now()}`,
        role: 'assistant',
        content: currentT.transcriptPrompt,
        timestamp: new Date(),
        checkInActions: transcriptActions,
      }]);
    } else if (showPostChat && !surveyCompleted) {
      // Go straight to survey offer
      setMessages((prev) => [...prev, {
        id: `survey_suggest_${Date.now()}`,
        role: 'assistant',
        content: currentT.surveyPrompt,
        timestamp: new Date(),
        checkInActions: [
          { label: currentT.surveyYes, action: 'survey-yes', primary: true },
          { label: currentT.surveyNo, action: 'survey-no' },
        ],
      }]);
    }
  }, [endOfChatState, transcriptEnabled, transcriptConfig, transcriptSent, showPostChat, surveyCompleted]);

  // Reset the inactivity timer (called after each assistant response)
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    // Only start timer if there's something to offer
    const hasTranscriptPrompt = transcriptEnabled && transcriptConfig?.show_chat_prompt !== false && !transcriptSent;
    const hasSurvey = showPostChat && !surveyCompleted;
    if (!hasTranscriptPrompt && !hasSurvey) return;
    if (endOfChatState === 'offered') return;

    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount < 2) return; // Need at least 2 exchanges

    setEndOfChatState('waiting');
    inactivityTimerRef.current = setTimeout(() => {
      triggerEndOfChat();
    }, 120_000); // 2 minutes of inactivity
  }, [transcriptEnabled, transcriptConfig, transcriptSent, showPostChat, surveyCompleted, endOfChatState, messages, triggerEndOfChat]);

  const sendMessage = useCallback(async (overrideContent?: string) => {
    const contentToSend = overrideContent ?? input.trim();
    if ((!contentToSend && pendingAttachments.length === 0) || isLoading) return;

    // Capture input value before clearing
    const messageContent = contentToSend;
    
    // Clear input immediately
    setInput('');

    // Reset handoff inactivity timer on visitor message
    if (handoffActive) resetHandoffTimerRef.current();

    // Stop typing indicator on send
    if (handoffActive) broadcastVisitorTyping(false);

    // Wait for any pending proactive message save to complete first
    if (pendingProactiveSaveRef.current) {
      console.log('[ChatWidget] Waiting for proactive message save to complete before sending...');
      await pendingProactiveSaveRef.current;
    }

    // Clear inactivity timer when user sends a message
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (endOfChatState === 'waiting') {
      setEndOfChatState('idle');
    }

    // Capture and clear pending attachments
    const messageAttachments = [...pendingAttachments];
    setPendingAttachments([]);

    const userMessage: WidgetMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent || (messageAttachments.length > 0 ? `[${messageAttachments.map(a => a.file_name).join(', ')}]` : ''),
      timestamp: new Date(),
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    // Only show "thinking" dots for AI responses, not during live agent handoff
    if (!handoffActive) {
      setIsLoading(true);
    }

    try {
      // Abort any in-flight request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(`/api/chat/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: userMessage.content,
          session_id: sessionId,
          visitor_id: visitorId,
          stream: true,
          ...(userData ? { user_data: userData } : {}),
          ...(userContext ? { user_context: userContext } : {}),
          ...(messageAttachments.length > 0 ? { attachments: messageAttachments } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const code = errorData?.error?.code;
        const message = errorData?.error?.message;
        const retryAfter = parseInt(response.headers.get('Retry-After') || '0', 10);

        let errorType: ChatErrorType = 'server_error';
        if (response.status === 429) {
          errorType = 'rate_limit';
        } else if (response.status === 403) {
          errorType = code === 'USAGE_LIMIT_REACHED' || message?.includes('monthly message limit')
            ? 'message_limit'
            : 'unavailable';
        }

        // Disable input for permanent errors
        if (errorType === 'message_limit' || errorType === 'unavailable') {
          setChatDisabled(errorType);
          // Transition to fallback view if credits exhausted
          if (errorType === 'message_limit') {
            const viewMap: Record<string, WidgetView> = {
              tickets: 'ticket-form',
              contact_form: 'contact-form',
              purchase_credits: 'purchase-credits',
              help_articles: 'help-articles',
            };
            const fallbackView = viewMap[creditExhaustionMode];
            if (fallbackView) {
              setTimeout(() => setCurrentView(fallbackView), 1500);
            }
          }
        }

        setMessages((prev) => prev.map((m) =>
          m.id === userMessage.id
            ? { ...m, failed: true, errorType, errorMessage: message, retryAfter: retryAfter || undefined }
            : m
        ));
        setIsLoading(false);
        return;
      }

      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        // Non-streaming response (handoff case or fallback)
        const data = await response.json();

        if (data.data.conversation_id) {
          setConversationId(data.data.conversation_id);
        }
        if (data.data.language && data.data.language !== activeLanguage) {
          setActiveLanguage(data.data.language);
        }

        if (data.data.handoff_active) {
          setHandoffActive(true);
          setHandoffStatus(data.data.handoff_status || 'pending');
          setHandoffAgentName(data.data.agent_name || null);
          startHandoffSubscription(data.data.conversation_id);
          setIsLoading(false);
          return;
        }

        const assistantMessage: WidgetMessage = {
          id: data.data.message_id || `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Streaming response — read NDJSON events
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        const assistantId = `assistant_${Date.now()}`;
        let streamedContent = '';
        let buffer = '';
        let rafScheduled = false;

        // Add empty assistant message that we'll update progressively
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }]);
        setIsLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const event = JSON.parse(line);
              if (event.type === 'meta') {
                if (event.data.conversation_id) setConversationId(event.data.conversation_id);
                if (event.data.language && event.data.language !== activeLanguage) setActiveLanguage(event.data.language);
              } else if (event.type === 'token') {
                streamedContent += event.content;
                // Batch renders using requestAnimationFrame to avoid per-token re-renders
                if (!rafScheduled) {
                  rafScheduled = true;
                  requestAnimationFrame(() => {
                    setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: streamedContent } : m));
                    rafScheduled = false;
                  });
                }
              } else if (event.type === 'done') {
                // Update message with final ID from server
                if (event.data?.message_id) {
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, id: event.data.message_id } : m));
                }
              }
            } catch {
              // Skip malformed lines
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const event = JSON.parse(buffer);
            if (event.type === 'token') {
              streamedContent += event.content;
            }
          } catch { /* ignore */ }
        }

        // Final render to ensure all content is displayed
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: streamedContent } : m));
      }

      // Start inactivity timer after assistant responds
      if (endOfChatState !== 'offered') {
        resetInactivityTimer();
      }
    } catch (error) {
      // Don't treat abort as an error
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Chat error:', error);
      // Mark the user message as failed so user can retry
      setMessages((prev) => prev.map((m) =>
        m.id === userMessage.id ? { ...m, failed: true } : m
      ));
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, [input, isLoading, chatbotId, sessionId, visitorId, userData, userContext, t, activeLanguage, endOfChatState, pendingAttachments, handoffActive, resetInactivityTimer]);

  const retryMessage = useCallback((failedMsg: WidgetMessage) => {
    // Remove the failed message, set input to its content, and re-send
    setMessages((prev) => prev.filter((m) => m.id !== failedMsg.id));
    setInput(failedMsg.content);
    // Use setTimeout to let state update, then trigger send
    setTimeout(() => {
      sendMessage(failedMsg.content);
    }, 0);
  }, [sendMessage]);

  const handleFeedback = useCallback(async (messageId: string, thumbsUp: boolean) => {
    const current = messageFeedback[messageId];
    // Toggle off if same value clicked again
    const newValue = current === thumbsUp ? null : thumbsUp;
    setMessageFeedback((prev) => ({ ...prev, [messageId]: newValue }));
    // Show follow-up prompt on thumbs-down
    if (newValue === false && feedbackFollowUpEnabled) {
      setFeedbackFollowUpId(messageId);
    } else {
      setFeedbackFollowUpId((prev) => prev === messageId ? null : prev);
    }
    try {
      if (newValue !== null) {
        // Strip history_ prefix to get the actual DB message ID
        const dbMessageId = messageId.replace(/^history_/, '');
        await fetch(`/api/widget/${chatbotId}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message_id: dbMessageId, thumbs_up: newValue }),
        });
      }
    } catch {
      // Revert on failure
      setMessageFeedback((prev) => ({ ...prev, [messageId]: current ?? null }));
    }
  }, [chatbotId, messageFeedback, feedbackFollowUpEnabled]);

  const handleFeedbackReason = useCallback(async (messageId: string, reason: string) => {
    setFeedbackReasonSubmitting(true);
    try {
      const dbMessageId = messageId.replace(/^history_/, '');
      await fetch(`/api/widget/${chatbotId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: dbMessageId, thumbs_up: false, feedback_reason: reason }),
      });
      setFeedbackFollowUpId(null);
    } catch {
      // Silent fail — the thumbs-down was already saved
    } finally {
      setFeedbackReasonSubmitting(false);
    }
  }, [chatbotId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Validation functions
  const validateEmail = (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t.validationEmail;
    }
    return null;
  };

  const validatePhone = (value: string): string | null => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return t.validationPhone;
    }
    return null;
  };

  const validateField = (field: PreChatFormField, value: string): string | null => {
    if (field.required && (!value || !value.trim())) {
      return t.validationRequired.replace('{field}', field.label);
    }
    if (value && value.trim()) {
      if (field.type === 'email') {
        return validateEmail(value);
      }
      if (field.type === 'phone') {
        return validatePhone(value);
      }
    }
    return null;
  };

  const validateAllFields = (): boolean => {
    if (!preChatFormConfig) return true;
    
    const errors: Record<string, string> = {};
    let hasErrors = false;

    preChatFormConfig.fields.forEach((field) => {
      const value = preChatFormData[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
        hasErrors = true;
      }
    });

    setFieldErrors(errors);
    return !hasErrors;
  };

  const clearFieldError = (fieldId: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  };

  // Pre-chat form submission
  const handlePreChatSubmit = useCallback(async () => {
    if (!preChatFormConfig || isPreChatSubmitting) return;

    // Validate all fields
    if (!validateAllFields()) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.chat-widget-form-field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Save lead data
    setIsPreChatSubmitting(true);
    try {
      await fetch(`/api/widget/${chatbotId}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          visitor_id: visitorId,
          form_data: preChatFormData,
        }),
      });
    } catch (err) {
      console.warn('Failed to save lead data:', err);
    }

    // Check if email has existing memory (for identity verification)
    // Only attempt when memory is enabled for this chatbot
    console.log('[Memory] Pre-chat form submitted. memoryEnabled:', memoryEnabled);
    if (memoryEnabled) {
      // Look up email by field ID first, then fall back to field type
      let emailValue = preChatFormData.email || preChatFormData.Email || preChatFormData.EMAIL;
      if (!emailValue && preChatFormConfig.fields) {
        const emailField = preChatFormConfig.fields.find(f => f.type === 'email');
        if (emailField) {
          emailValue = preChatFormData[emailField.id];
          console.log('[Memory] Email found via field type lookup, fieldId:', emailField.id);
        }
      }
      console.log('[Memory] Email from pre-chat form:', emailValue || '(none found)');
      if (emailValue) {
        try {
          console.log('[Memory] Checking if email has existing memory...');
          const checkRes = await fetch(`/api/widget/${chatbotId}/memory/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValue }),
          });
          const checkData = await checkRes.json();
          console.log('[Memory] Memory check response:', checkData);
          if (checkData.success && checkData.data?.has_memory) {
            console.log('[Memory] Previous memory found — showing verify-email view');
            // Email has existing memory — offer verification
            setVerifyEmail(emailValue);
            setIsPreChatSubmitting(false);
            setCurrentView('verify-email');
            return;
          } else {
            console.log('[Memory] No previous memory for this email — proceeding to chat');
          }
        } catch (err) {
          console.warn('[Memory] Failed to check memory:', err);
        }
      } else {
        console.log('[Memory] No email field found in pre-chat form data — skipping memory check');
      }
    } else {
      console.log('[Memory] Memory is disabled for this chatbot — skipping memory check');
    }

    setIsPreChatSubmitting(false);
    // Move to chat
    setCurrentView('chat');
  }, [preChatFormConfig, preChatFormData, chatbotId, sessionId, visitorId, isPreChatSubmitting, memoryEnabled]);

  // OTP verification handlers
  const handleSendOtp = useCallback(async () => {
    if (!verifyEmail || otpSending) return;
    
    // Validate email format before sending
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(verifyEmail)) {
      setOtpError('Please enter a valid email address');
      return;
    }
    
    console.log('[Memory] Sending OTP to:', verifyEmail);
    setOtpSending(true);
    setOtpError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/memory/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail }),
      });
      const data = await res.json();
      console.log('[Memory] Send OTP response:', data);
      if (data.success) {
        console.log('[Memory] OTP sent successfully — showing code entry');
        setOtpSent(true);
      } else {
        console.warn('[Memory] OTP send failed:', data.error?.message);
        setOtpError(data.error?.message || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('[Memory] OTP send error:', err);
      setOtpError('Failed to send verification code');
    } finally {
      setOtpSending(false);
    }
  }, [verifyEmail, chatbotId, otpSending]);

  const handleVerifyOtp = useCallback(async () => {
    if (!verifyEmail || !otpCode.trim() || otpVerifying) return;
    console.log('[Memory] Verifying OTP for:', verifyEmail, 'code:', otpCode.trim());
    setOtpVerifying(true);
    setOtpError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/memory/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code: otpCode.trim() }),
      });
      const data = await res.json();
      console.log('[Memory] Verify OTP response:', data);
      if (data.success && data.data?.verified) {
        // Swap visitorId to the verified one so memory is loaded
        const verifiedVisitorId = data.data.visitor_id;
        console.log('[Memory] OTP verified! Swapping visitorId to:', verifiedVisitorId);
        setVisitorId(verifiedVisitorId);
        // Fetch previous chat history for the verified visitor
        console.log('[Memory] Fetching chat history for verified visitor...');
        fetchHistory(verifiedVisitorId);
        setCurrentView('chat');
      } else {
        console.warn('[Memory] OTP verification failed:', data.error?.message);
        setOtpError(data.error?.message || 'Invalid verification code');
      }
    } catch (err) {
      console.error('[Memory] OTP verify error:', err);
      setOtpError('Verification failed');
    } finally {
      setOtpVerifying(false);
    }
  }, [verifyEmail, otpCode, chatbotId, otpVerifying, fetchHistory]);

  const handleSkipVerification = useCallback(() => {
    console.log('[Memory] User skipped verification — starting fresh chat with visitorId:', visitorId);
    // Proceed to chat without loading memory (keep current visitorId)
    setCurrentView('chat');
  }, [visitorId]);

  // End chat and show survey
  const handleEndChat = useCallback(() => {
    if (showPostChat) {
      setCurrentView('survey');
    }
  }, [showPostChat]);

  // Survey submission
  const handleSurveySubmit = useCallback(async () => {
    if (!postChatSurveyConfig) return;

    setSurveySubmitting(true);
    try {
      const response = await fetch(`/api/widget/${chatbotId}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          responses: surveyResponses,
          response_id: surveyResponseId,
        }),
      });
      
      const data = await response.json();
      if (data.success && data.data?.response_id) {
        setSurveyResponseId(data.data.response_id);
      }
    } catch (err) {
      console.warn('Failed to save survey response:', err);
    } finally {
      setSurveySubmitting(false);
      setCurrentView('survey-thanks');
    }
  }, [postChatSurveyConfig, chatbotId, sessionId, surveyResponses, surveyResponseId]);

  // Transcript: determine if we already have an email from pre-chat form or SDK data
  const getKnownEmail = useCallback((): string | null => {
    if (userData?.email) return userData.email;
    if (preChatFormData?.email) return preChatFormData.email as string;
    return null;
  }, [userData, preChatFormData]);

  const handleTranscriptClick = useCallback(() => {
    if (transcriptSent) return;
    const knownEmail = getKnownEmail();
    if (transcriptConfig?.email_mode === 'pre_chat' && knownEmail) {
      // Send immediately using known email
      handleSendTranscript(knownEmail);
    } else {
      // Show email input
      const prefill = knownEmail || '';
      setTranscriptEmail(prefill);
      setShowTranscriptInput(true);
      setTranscriptError('');
    }
  }, [transcriptSent, transcriptConfig, getKnownEmail]);

  const handleSendTranscript = useCallback(async (emailToUse?: string) => {
    const email = emailToUse || transcriptEmail;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTranscriptError(t.validationEmail);
      return;
    }
    setTranscriptSending(true);
    setTranscriptError('');
    try {
      const response = await fetch(`/api/widget/${chatbotId}/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, email }),
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      setTranscriptSent(true);
      setShowTranscriptInput(false);
      if (pendingSurveyAfterTranscript.current && showPostChat && !surveyCompleted) {
        pendingSurveyAfterTranscript.current = false;
        const currentT = tRef.current;
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `survey_suggest_${Date.now()}`,
            role: 'assistant',
            content: currentT.surveyPrompt,
            timestamp: new Date(),
            checkInActions: [
              { label: currentT.surveyYes, action: 'survey-yes', primary: true },
              { label: currentT.surveyNo, action: 'survey-no' },
            ],
          }]);
        }, 500);
      }
    } catch {
      setTranscriptError(t.emailTranscriptFailed);
    } finally {
      setTranscriptSending(false);
    }
  }, [transcriptEmail, chatbotId, sessionId, t, showPostChat, surveyCompleted]);

  // Escalation: submit report
  // Handoff Realtime: subscribe to new agent messages during active handoff
  const seenMessageIdsRef = useRef<Set<string>>(new Set());

  const startHandoffSubscription = useCallback((convId: string) => {
    // Clean up any existing subscription
    if (realtimeChannelRef.current) {
      const supabase = getWidgetSupabase();
      if (supabase) supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }

    const supabase = getWidgetSupabase();
    if (!supabase) {
      console.warn('[ChatWidget] No Supabase client for Realtime, cannot subscribe');
      return;
    }

    seenMessageIdsRef.current = new Set();

    const channel = supabase
      .channel(`widget-handoff-${convId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${convId}`,
      }, (payload) => {
        const msg = payload.new as Record<string, unknown>;
        // Only handle agent messages (not user messages or AI responses)
        const metadata = msg.metadata as Record<string, unknown> | null;
        if (!metadata?.is_human_agent) return;

        const msgId = msg.id as string;
        if (seenMessageIdsRef.current.has(msgId)) return;
        seenMessageIdsRef.current.add(msgId);

        setMessages((prev) => [
          ...prev,
          {
            id: msgId,
            role: 'assistant' as const,
            content: msg.content as string,
            timestamp: new Date(msg.created_at as string),
            metadata: { is_human_agent: true, agent_name: metadata.agent_name },
          },
        ]);

        if (metadata.agent_name) {
          setHandoffAgentName(metadata.agent_name as string);
        }

        // Agent replied — reset inactivity timer (conversation is active)
        resetHandoffTimerRef.current();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'telegram_handoff_sessions',
        filter: `conversation_id=eq.${convId}`,
      }, (payload) => {
        const session = payload.new as Record<string, unknown> | null;
        if (!session) return;

        const status = session.status as string;
        setHandoffStatus(status);

        if (session.agent_name) {
          setHandoffAgentName(session.agent_name as string);
        }

        // Handoff resolved - show transition card
        if (status === 'resolved') {
          const agentName = (session.agent_name as string) || handoffAgentNameRef.current || t.defaultAgentName;
          setHandoffActive(false);
          setHandoffStatus(null);
          setHandoffAgentName(null);
          clearHandoffTimers();
          setHandoffEndedInfo({ agentName });
          setHandoffRating(null);
          setHandoffRatingSubmitted(false);

          // Clean up the subscription since handoff is over
          if (realtimeChannelRef.current) {
            supabase.removeChannel(realtimeChannelRef.current);
            realtimeChannelRef.current = null;
          }
        }
      })
      .subscribe();

    realtimeChannelRef.current = channel;
  }, []);

  // Re-subscribe to handoff Realtime if restoring a session with active handoff
  useEffect(() => {
    const convId = pendingHandoffResubRef.current;
    if (convId) {
      pendingHandoffResubRef.current = null;
      setHandoffActive(true);
      setHandoffStatus('pending');
      startHandoffSubscription(convId);
    }
  }, [startHandoffSubscription]);

  // Cleanup Realtime subscription on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannelRef.current) {
        const supabase = getWidgetSupabase();
        if (supabase) supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, []);

  // Typing indicator: broadcast visitor typing to agents (throttled to 2s)
  const broadcastVisitorTyping = useCallback((isTyping: boolean) => {
    const channel = presenceChannelRef.current;
    if (!channel) return;
    const now = Date.now();
    if (isTyping && now - lastTypingBroadcastRef.current < 2000) return;
    lastTypingBroadcastRef.current = now;
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { typing: isTyping, role: 'visitor' },
    });
  }, []);

  // Presence + typing channel: join when handoff becomes active, leave when resolved
  useEffect(() => {
    if (!handoffActive || !conversationId) {
      // Clean up presence channel when handoff ends
      if (presenceChannelRef.current) {
        const supabase = getWidgetSupabase();
        if (supabase) supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
      setAgentIsTyping(false);
      return;
    }

    const supabase = getWidgetSupabase();
    if (!supabase) return;

    const channel = supabase.channel(`conversation:${conversationId}`, {
      config: { presence: { key: `visitor-${sessionId}` } },
    });

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.role === 'agent') {
          if (payload.typing) {
            setAgentIsTyping(true);
            if (agentTypingTimeoutRef.current) clearTimeout(agentTypingTimeoutRef.current);
            agentTypingTimeoutRef.current = setTimeout(() => setAgentIsTyping(false), 3000);
          } else {
            setAgentIsTyping(false);
            if (agentTypingTimeoutRef.current) {
              clearTimeout(agentTypingTimeoutRef.current);
              agentTypingTimeoutRef.current = null;
            }
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        // Widget doesn't need to react to presence sync
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            role: 'visitor',
            page_url: window.location.href,
            page_title: document.title,
            online_at: new Date().toISOString(),
          });
        }
      });

    presenceChannelRef.current = channel;

    // Update presence when page URL changes (popstate for SPA navigation)
    const handlePopState = () => {
      channel.track({
        role: 'visitor',
        page_url: window.location.href,
        page_title: document.title,
        online_at: new Date().toISOString(),
      });
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (agentTypingTimeoutRef.current) {
        clearTimeout(agentTypingTimeoutRef.current);
        agentTypingTimeoutRef.current = null;
      }
      supabase.removeChannel(channel);
      presenceChannelRef.current = null;
    };
  }, [handoffActive, conversationId, sessionId]);

  // Handoff inactivity timeout: warn visitor with countdown, then auto-resolve
  const clearHandoffTimers = useCallback(() => {
    if (handoffWarningRef.current) {
      clearTimeout(handoffWarningRef.current);
      handoffWarningRef.current = null;
    }
    if (handoffCloseRef.current) {
      clearTimeout(handoffCloseRef.current);
      handoffCloseRef.current = null;
    }
    if (handoffCountdownRef.current) {
      clearInterval(handoffCountdownRef.current);
      handoffCountdownRef.current = null;
    }
    handoffWarningShownRef.current = false;
    setHandoffCountdownSeconds(null);
  }, []);

  // "I'm here" button handler — resets inactivity timer
  const handleImHere = useCallback(() => {
    clearHandoffTimers();
    // Remove the warning message
    setMessages((prev) => prev.filter((m) => !m.metadata?.is_warning));
    resetHandoffTimerRef.current();
  }, [clearHandoffTimers]);

  const resetHandoffInactivityTimer = useCallback(() => {
    if (!handoffActive || handoffTimeoutMinutes <= 0) return;
    clearHandoffTimers();

    const timeoutMs = handoffTimeoutMinutes * 60 * 1000;
    const warningMs = Math.floor(timeoutMs * 0.6); // warn at 60% mark
    const remainingMs = timeoutMs - warningMs;
    const remainingMinutes = Math.ceil(remainingMs / 60000);

    // Warning timer — shows message with "I'm here" button + starts countdown bar
    handoffWarningRef.current = setTimeout(() => {
      if (!handoffWarningShownRef.current) {
        handoffWarningShownRef.current = true;
        const tt = tRef.current;
        setMessages((prev) => [...prev, {
          id: `handoff_warning_${Date.now()}`,
          role: 'assistant',
          content: tt.handoffInactivityWarning
            || `Are you still there? This conversation will close in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'} due to inactivity.`,
          timestamp: new Date(),
          metadata: { is_system: true, is_warning: true, has_im_here: true },
        }]);

        // Start countdown
        const closeAt = Date.now() + remainingMs;
        setHandoffCountdownSeconds(Math.ceil(remainingMs / 1000));
        handoffCountdownRef.current = setInterval(() => {
          const secsLeft = Math.max(0, Math.ceil((closeAt - Date.now()) / 1000));
          setHandoffCountdownSeconds(secsLeft);
          if (secsLeft <= 0 && handoffCountdownRef.current) {
            clearInterval(handoffCountdownRef.current);
            handoffCountdownRef.current = null;
          }
        }, 1000);

        // Update tab title if widget is minimized
        if (!isOpen) {
          const originalTitle = document.title;
          document.title = 'Your chat is ending...';
          setTimeout(() => { document.title = originalTitle; }, 5000);
        }
      }
    }, warningMs);

    // Close timer — resolves both client and server side
    handoffCloseRef.current = setTimeout(() => {
      setHandoffActive(false);
      setHandoffStatus(null);
      setHandoffAgentName(null);
      clearHandoffTimers();

      const tt = tRef.current;
      setMessages((prev) => [
        ...prev.filter((m) => !m.metadata?.is_warning),
        {
          id: `handoff_timeout_${Date.now()}`,
          role: 'assistant',
          content: tt.handoffInactivityClosed
            || 'This conversation was closed due to inactivity. Feel free to start a new chat!',
          timestamp: new Date(),
          metadata: { is_system: true },
        },
      ]);

      // Resolve server-side handoff session
      if (conversationId) {
        fetch(`/api/widget/${chatbotId}/agent-actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation_id: conversationId, action: 'resolve' }),
        }).catch(() => {});
      }
    }, timeoutMs);
  }, [handoffActive, handoffTimeoutMinutes, clearHandoffTimers, conversationId, chatbotId, sessionId, isOpen]);

  // Keep ref in sync so sendMessage (defined earlier) can call it
  resetHandoffTimerRef.current = resetHandoffInactivityTimer;

  // Start/stop inactivity timer when handoff state changes
  useEffect(() => {
    if (handoffActive && handoffTimeoutMinutes > 0) {
      resetHandoffInactivityTimer();
    } else {
      clearHandoffTimers();
    }
    return clearHandoffTimers;
  }, [handoffActive, handoffTimeoutMinutes, resetHandoffInactivityTimer, clearHandoffTimers]);

  // Contextual placeholder and submit label based on selected reason
  const getReportPlaceholder = useCallback((reason: string) => {
    const tt = tRef.current;
    switch (reason) {
      case 'wrong_answer': return tt.reportDetailsWrongAnswer || 'What was incorrect?';
      case 'offensive_content': return tt.reportDetailsOffensive || 'What was offensive?';
      case 'need_human_help': return tt.reportDetailsHumanHelp || 'Briefly describe what you need help with...';
      default: return tt.reportDetailsPlaceholder;
    }
  }, []);

  const getReportSubmitLabel = useCallback((reason: string, submitting: boolean) => {
    const tt = tRef.current;
    if (submitting) return tt.reportSubmitting;
    switch (reason) {
      case 'wrong_answer': return tt.reportSubmitWrongAnswer || 'Report wrong answer';
      case 'offensive_content': return tt.reportSubmitOffensive || 'Report offensive content';
      case 'need_human_help': return tt.reportSubmitHumanHelp || 'Connect to support';
      default: return tt.reportSubmit;
    }
  }, []);

  const handleReportSubmit = useCallback(async () => {
    if (!reportReason || reportSubmitting) return;
    setReportSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        session_id: sessionId,
        conversation_id: conversationId,
        reason: reportReason,
        details: reportDetails || null,
      };
      if (reportingMessageId) {
        body.message_id = reportingMessageId;
      }
      // Include visitor info for Telegram handoff context
      if (userData?.name) body.visitor_name = userData.name;
      if (userData?.email) body.visitor_email = userData.email;

      const response = await fetch(`/api/widget/${chatbotId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Report failed');
      const data = await response.json();

      // Mark message as reported
      if (reportingMessageId) {
        setReportedMessageIds((prev) => new Set(prev).add(reportingMessageId));
      }

      // Check if handoff was initiated
      if (data.data?.handoff_initiated && conversationId) {
        setHandoffActive(true);
        setHandoffStatus('pending');
        startHandoffSubscription(conversationId);
        // Add a system message about the handoff
        const tt = tRef.current;
        setMessages((prev) => [...prev, {
          id: `handoff_${Date.now()}`,
          role: 'assistant',
          content: tt.reportConnected || 'Connected! An agent will respond shortly.',
          timestamp: new Date(),
          metadata: { is_system: true },
        }]);
        // Go straight back to chat to see the handoff
        setReportSuccess(false);
        setReportingMessageId(null);
        setReportConversation(false);
        setReportReason('');
        setReportDetails('');
        if (currentView === 'report') setCurrentView('chat');
        return;
      }

      setReportSuccess(true);
    } catch (err) {
      console.warn('Failed to submit report:', err);
    } finally {
      setReportSubmitting(false);
    }
  }, [reportReason, reportDetails, reportSubmitting, reportingMessageId, sessionId, conversationId, chatbotId, currentView, startHandoffSubscription]);

  const closeReportForm = useCallback(() => {
    setReportingMessageId(null);
    setReportConversation(false);
    setReportReason('');
    setReportDetails('');
    setReportSuccess(false);
    if (currentView === 'report') setCurrentView('chat');
  }, [currentView]);

  const dismissReportSuccess = useCallback(() => {
    setReportSuccess(false);
    setReportingMessageId(null);
    setReportConversation(false);
    setReportReason('');
    setReportDetails('');
    if (currentView === 'report') setCurrentView('chat');
  }, [currentView]);

  // Direct handoff — triggered by the headset icon
  const [showHandoffConfirm, setShowHandoffConfirm] = useState(false);
  const [handoffContext, setHandoffContext] = useState('');
  const [handoffConnecting, setHandoffConnecting] = useState(false);

  const initiateDirectHandoff = useCallback(async () => {
    if (handoffConnecting) return;
    setHandoffConnecting(true);
    try {
      const body: Record<string, unknown> = {
        session_id: sessionId,
        conversation_id: conversationId,
        reason: 'need_human_help',
        details: handoffContext || null,
      };
      if (userData?.name) body.visitor_name = userData.name;
      if (userData?.email) body.visitor_email = userData.email;

      const response = await fetch(`/api/widget/${chatbotId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Handoff failed');
      }
      const data = await response.json();

      if (data.data?.handoff_initiated && conversationId) {
        setHandoffActive(true);
        setHandoffStatus('pending');
        startHandoffSubscription(conversationId);
        const tt = tRef.current;
        setMessages((prev) => [...prev, {
          id: `handoff_${Date.now()}`,
          role: 'assistant',
          content: tt.reportConnected || 'Connected! An agent will respond shortly.',
          timestamp: new Date(),
          metadata: { is_system: true },
        }]);
        setShowHandoffConfirm(false);
        setHandoffContext('');
        if (currentView !== 'chat') setCurrentView('chat');
      } else if (!conversationId) {
        // No conversation yet — prompt user to send a message first
        setMessages((prev) => [...prev, {
          id: `handoff_err_${Date.now()}`,
          role: 'assistant',
          content: 'Please send a message first so we can connect you with an agent.',
          timestamp: new Date(),
          metadata: { is_system: true },
        }]);
        setShowHandoffConfirm(false);
        if (currentView !== 'chat') setCurrentView('chat');
      } else {
        setMessages((prev) => [...prev, {
          id: `handoff_err_${Date.now()}`,
          role: 'assistant',
          content: 'Unable to connect to support right now. Please try again later.',
          timestamp: new Date(),
          metadata: { is_system: true },
        }]);
        setShowHandoffConfirm(false);
        if (currentView !== 'chat') setCurrentView('chat');
      }
    } catch (err) {
      console.warn('Failed to initiate handoff:', err);
      setMessages((prev) => [...prev, {
        id: `handoff_err_${Date.now()}`,
        role: 'assistant',
        content: 'Unable to connect to support right now. Please try again later.',
        timestamp: new Date(),
        metadata: { is_system: true },
      }]);
      setShowHandoffConfirm(false);
      if (currentView !== 'chat') setCurrentView('chat');
    } finally {
      setHandoffConnecting(false);
    }
  }, [handoffConnecting, sessionId, conversationId, handoffContext, chatbotId, currentView, startHandoffSubscription, userData]);

  // Generate CSS from config
  const styles = generateStyles(config, isInIframe, isExpanded);

  // Handle action button clicks (survey, transcript offers)
  const handleCheckInClick = useCallback((action: string, messageId: string) => {
    // Remove buttons from the message and add a user message with the clicked label
    setMessages((prev) => {
      const msg = prev.find((m) => m.id === messageId);
      const clickedLabel = msg?.checkInActions?.find((a) => a.action === action)?.label || action;
      const updated = prev.map((m) =>
        m.id === messageId ? { ...m, checkInActions: undefined, clickedAction: action } : m
      );
      updated.push({
        id: `action_reply_${Date.now()}`,
        role: 'user',
        content: clickedLabel,
        timestamp: new Date(),
      });
      return updated;
    });

    switch (action) {
      case 'survey-yes':
        setSurveyCompleted(true);
        setCurrentView('survey');
        break;
      case 'survey-no':
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `thanks_${Date.now()}`,
            role: 'assistant',
            content: t.thanksDismiss,
            timestamp: new Date(),
          }]);
        }, 300);
        break;
      case 'transcript-yes':
        // User wants transcript — trigger the email flow, defer survey until after submission
        pendingSurveyAfterTranscript.current = true;
        handleTranscriptClick();
        break;
      case 'transcript-skip':
        // User skipped transcript, offer survey if enabled
        if (showPostChat && !surveyCompleted) {
          const currentT = tRef.current;
          setTimeout(() => {
            setMessages((prev) => [...prev, {
              id: `survey_suggest_${Date.now()}`,
              role: 'assistant',
              content: currentT.surveyPrompt,
              timestamp: new Date(),
              checkInActions: [
                { label: currentT.surveyYes, action: 'survey-yes', primary: true },
                { label: currentT.surveyNo, action: 'survey-no' },
              ],
            }]);
          }, 300);
        }
        break;
    }
  }, [t, handleTranscriptClick, showPostChat, surveyCompleted]);

  // Track which proactive rule IDs have been shown (prevent duplicates)
  const proactiveFiredRef = useRef<Set<string>>(new Set());
  // Track pending proactive message save to avoid race condition with user reply
  const pendingProactiveSaveRef = useRef<Promise<any> | null>(null);
  // Ref for visitorId so the iframe message handler always has the latest value
  const visitorIdRef = useRef(visitorId);
  visitorIdRef.current = visitorId;
  // Track whether the chat was initiated by a proactive message (privacy: fresh session)
  const proactiveInitiatedRef = useRef(false);
  // Ref for hasUserData so the useEffect handler can read the latest value
  const hasUserDataRef = useRef(hasUserData);
  hasUserDataRef.current = hasUserData;

  // When loaded in iframe, always show the chat (no button needed)
  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
    if (inIframe) {
      setIsOpen(true);
      
      // Listen for messages from parent
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'widget-id') {
          console.log('[ChatWidget] Received widget ID:', event.data.widgetId);
          setWidgetId(event.data.widgetId);
        } else if (event.data && event.data.type === 'show-button') {
          console.log('[ChatWidget] Received show-button message');
          setIsOpen(false);
          setShowButton(true);
        } else if (event.data && event.data.type === 'clear-proactive-state') {
          // Clear proactive chat state so next manual open is completely fresh
          console.log('[ChatWidget] Clearing proactive state - resetting to default view');
          setMessages([]);
          proactiveFiredRef.current.clear();
          proactiveInitiatedRef.current = false;
          pendingProactiveSaveRef.current = null;
          
          // Restore original visitor ID (proactive may have set a fresh one)
          if (!hasUserDataRef.current) {
            const stored = localStorage.getItem('chatbot_visitor_' + chatbotId);
            if (stored) {
              console.log('[ChatWidget] Restoring original visitorId:', stored);
              setVisitorId(stored);
              visitorIdRef.current = stored;
            }
          }
          
          // Reset to appropriate default view
          if (showPreChat) {
            setCurrentView('pre-chat-form');
          } else {
            setCurrentView('chat');
          }
        } else if (event.data && event.data.type === 'proactive-trigger') {
          // Proactive message from SDK
          const { ruleId, message } = event.data;
          if (ruleId && message && !proactiveFiredRef.current.has(ruleId)) {
            proactiveFiredRef.current.add(ruleId);
            proactiveInitiatedRef.current = true;
            
            // Privacy: use a fresh visitorId for proactive-initiated chats
            // unless admin passed authenticated user data via ChatWidget.init({ user: {} })
            if (!hasUserDataRef.current) {
              const freshId = `visitor_${crypto.randomUUID()}`;
              console.log('[ChatWidget] Proactive session without userData — using fresh visitorId:', freshId);
              setVisitorId(freshId);
              visitorIdRef.current = freshId;
            }
            
            // Skip pre-chat form and show chat to display the proactive message immediately
            if (currentView === 'pre-chat-form') {
              setCurrentView('chat');
            }
            
            // Add to UI immediately
            const proactiveMsg: WidgetMessage = {
              id: `proactive_${ruleId}_${Date.now()}`,
              role: 'assistant',
              content: message,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, proactiveMsg]);
            
            // Save to database so it's part of conversation history for AI context
            const savePromise = fetch(`/api/chat/${chatbotId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: '__PROACTIVE__',
                proactive_message: message,
                session_id: sessionId,
                visitor_id: visitorIdRef.current,
              }),
            }).then((res) => {
              console.log('[ChatWidget] Proactive message saved to DB, status:', res.status);
            }).catch((err) => {
              console.error('[ChatWidget] Failed to save proactive message:', err);
            }).finally(() => {
              pendingProactiveSaveRef.current = null;
            });
            pendingProactiveSaveRef.current = savePromise;
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Floating button to reopen widget (only shown in iframe when closed) */}
      {showButton && isInIframe && (
        <button
          onClick={() => {
            setShowButton(false);
            setIsOpen(true);
          }}
          className="chat-widget-button"
          aria-label={t.openAriaLabel}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chat-widget-container">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-content">
              {chatbot.logo_url && (
                <img
                  src={chatbot.logo_url}
                  alt={chatbot.name || 'Chat'}
                  className="chat-widget-logo"
                />
              )}
              <div className="chat-widget-header-text">
                <span className="chat-widget-title">
                  {translateDefault(config.headerText, 'Chat with us', t.headerTitle) || chatbot.name || 'Chat'}
                </span>
                <span className="chat-widget-status">
                  {handoffActive
                    ? (handoffAgentName ? `${handoffAgentName} connected` : t.handoffConnecting)
                    : t.online}
                </span>
              </div>
            </div>
            {escalationEnabled && (currentView === 'chat' || currentView === 'report') && (
              <button
                onClick={() => {
                  if (currentView === 'report') {
                    closeReportForm();
                    setCurrentView('chat');
                  } else {
                    setReportConversation(true);
                    setReportingMessageId(null);
                    setReportReason('');
                    setReportDetails('');
                    setReportSuccess(false);
                    setCurrentView('report');
                  }
                }}
                className="chat-widget-close"
                aria-label={t.flagIssue}
                title={t.flagIssue}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={currentView === 'report' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              </button>
            )}
            {showHandoffIcon && currentView === 'chat' && (
              <button
                onClick={() => setShowHandoffConfirm(true)}
                className="chat-widget-close"
                aria-label={t.reportConnectToHuman || 'Talk to a person'}
                title={t.reportConnectToHuman || 'Talk to a person'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              </button>
            )}
            {handoffActive && currentView === 'chat' && (
              <span className="chat-widget-handoff-indicator" title={t.handoffConnectedToAgent}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              </span>
            )}
            {transcriptEnabled && transcriptConfig?.show_header_icon !== false && currentView === 'chat' && (
              <button
                onClick={handleTranscriptClick}
                className="chat-widget-close"
                aria-label={t.emailTranscript}
                title={t.emailTranscript}
              >
                {transcriptSent ? <Check size={18} /> : <Mail size={18} />}
              </button>
            )}
            {!isMobileMode && (
              <button
                onPointerDown={(e) => { e.preventDefault(); toggleExpand(); }}
                className="chat-widget-close"
                aria-label={isExpanded ? t.shrinkAriaLabel : t.expandAriaLabel}
                title={isExpanded ? t.shrinkAriaLabel : t.expandAriaLabel}
              >
                {isExpanded ? <Shrink size={18} /> : <Expand size={18} />}
              </button>
            )}
            <button
              onClick={() => {
                // Trigger end-of-chat offers if not already shown and there's been conversation
                const userMsgCount = messages.filter(m => m.role === 'user').length;
                if (endOfChatState !== 'offered' && userMsgCount >= 2) {
                  triggerEndOfChat();
                }

                // If in iframe, notify parent and let parent decide what to do
                if (window.self !== window.top) {
                  window.parent.postMessage({ type: 'close-chat-widget', widgetId }, '*');
                } else {
                  setIsOpen(false);
                }
              }}
              className="chat-widget-close"
              aria-label={t.closeAriaLabel}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body wrapper — provides positioning context for overlays like handoff confirm */}
          <div className="chat-widget-body-wrapper">

          {/* Pre-Chat Form View */}
          {currentView === 'pre-chat-form' && preChatFormConfig && (
            <div className="chat-widget-form-view">
              <div className="chat-widget-form-header">
                <h3 className="chat-widget-form-title">
                  {translateDefault(preChatFormConfig.title, DEFAULT_PRE_CHAT_FORM_CONFIG.title, t.preChatTitle)}
                </h3>
                <p className="chat-widget-form-desc">
                  {translateDefault(preChatFormConfig.description, DEFAULT_PRE_CHAT_FORM_CONFIG.description, t.preChatDescription)}
                </p>
              </div>
              <div className="chat-widget-form-fields">
                {preChatFormConfig.fields.map((field) => (
                  <div key={field.id} className={`chat-widget-form-field ${fieldErrors[field.id] ? 'chat-widget-form-field-error' : ''}`}>
                    <label className="chat-widget-form-label">
                      {field.label}
                      {field.required && <span className="chat-widget-required">*</span>}
                    </label>
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                        value={preChatFormData[field.id] || ''}
                        onChange={(e) => {
                          setPreChatFormData((prev) => ({ ...prev, [field.id]: e.target.value }));
                          clearFieldError(field.id);
                        }}
                        placeholder={field.placeholder}
                        className="chat-widget-form-input"
                        disabled={isPreChatSubmitting}
                        aria-required={field.required}
                        aria-invalid={!!fieldErrors[field.id]}
                        aria-describedby={fieldErrors[field.id] ? `error-${field.id}` : undefined}
                      />
                    {fieldErrors[field.id] && (
                      <span id={`error-${field.id}`} className="chat-widget-form-error-message" role="alert">{fieldErrors[field.id]}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="chat-widget-form-submit-container">
                <button
                  onClick={handlePreChatSubmit}
                  className="chat-widget-form-submit"
                  disabled={isPreChatSubmitting || preChatFormConfig.fields.some((f) => f.required && !preChatFormData[f.id]?.trim())}
                >
                  {isPreChatSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader2 size={18} className="animate-spin" />
                      {translateDefault(preChatFormConfig.submitButtonText, DEFAULT_PRE_CHAT_FORM_CONFIG.submitButtonText, t.preChatSubmit)}
                    </span>
                  ) : (
                    translateDefault(preChatFormConfig.submitButtonText, DEFAULT_PRE_CHAT_FORM_CONFIG.submitButtonText, t.preChatSubmit)
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Email Verification View */}
          {currentView === 'verify-email' && verifyEmail && (
            <div className="chat-widget-form-view">
              <div className="chat-widget-form-header">
                <h3 className="chat-widget-form-title">{t.memoryWelcomeBack}</h3>
                <p className="chat-widget-form-desc" dangerouslySetInnerHTML={{ __html: t.memoryFoundContext.replace('{email}', verifyEmail) }} />
              </div>

              {!otpSent ? (
                <div className="chat-widget-form-fields" style={{ gap: '10px' }}>
                  <button
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="chat-widget-form-submit"
                  >
                    {otpSending ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Loader2 size={18} className="animate-spin" />
                        {t.memorySendingCode}
                      </span>
                    ) : (
                      t.memoryVerifyIdentity
                    )}
                  </button>
                  <button
                    onClick={handleSkipVerification}
                    className="chat-widget-form-submit"
                    style={{
                      background: config.secondaryButtonColor || 'transparent',
                      color: config.secondaryButtonTextColor || '#374151',
                      border: `1px solid ${config.secondaryButtonBorderColor || '#d1d5db'}`,
                    }}
                  >
                    {t.memoryStartFresh}
                  </button>
                  {otpError && (
                    <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', margin: '4px 0 0' }}>{otpError}</p>
                  )}
                </div>
              ) : (
                <div className="chat-widget-form-fields">
                  <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', margin: '0 0 8px' }} dangerouslySetInnerHTML={{ __html: t.memoryCodeSent.replace('{email}', verifyEmail) }} />
                  <div className="chat-widget-form-field">
                    <label className="chat-widget-form-label">{t.memoryVerificationCode}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setOtpError(null);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyOtp(); }}
                      placeholder={t.memoryEnterCode}
                      className="chat-widget-form-input"
                      style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
                      autoFocus
                    />
                  </div>
                  {otpError && (
                    <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', margin: '4px 0 0' }}>{otpError}</p>
                  )}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying || otpCode.length !== 6}
                    className="chat-widget-form-submit"
                  >
                    {otpVerifying ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Loader2 size={18} className="animate-spin" />
                        {t.memoryVerifying}
                      </span>
                    ) : (
                      t.memoryVerifyContinue
                    )}
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
                    <button
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                    >
                      {t.memoryResendCode}
                    </button>
                    <button
                      onClick={handleSkipVerification}
                      style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                    >
                      {t.skip}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat View */}
          {currentView === 'chat' && (
            <>
              {/* Low credit warning banner */}
              {showLowCreditBanner && (
                <div className="chat-widget-low-credit-banner" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                  padding: '8px 12px', backgroundColor: '#fef3c7', borderBottom: '1px solid #f59e0b',
                  fontSize: '13px', color: '#92400e', flexShrink: 0,
                }}>
                  <span>
                    You&apos;re running low on credits ({creditRemaining ?? 0} remaining).{' '}
                    {creditExhaustionMode === 'purchase_credits' && (
                      <button
                        onClick={() => setShowPurchaseOverlay(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d97706', fontWeight: 600, fontSize: '13px', padding: 0, textDecoration: 'underline' }}
                      >
                        Purchase more &rarr;
                      </button>
                    )}
                  </span>
                  <button
                    onClick={() => setLowCreditDismissed(true)}
                    aria-label="Dismiss low credit warning"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: '16px', lineHeight: 1, padding: '2px 4px', flexShrink: 0 }}
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Purchase overlay (shown from low credit banner) */}
              {showPurchaseOverlay && (
                <div className="chat-widget-purchase-overlay" style={{
                  position: 'absolute', inset: 0, zIndex: 50,
                  display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.4)',
                }}>
                  <div style={{
                    margin: '20px', borderRadius: '12px', backgroundColor: config.backgroundColor || '#fff',
                    padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: config.textColor || '#0f172a' }}>Purchase More Credits</p>
                      <button
                        onClick={() => setShowPurchaseOverlay(false)}
                        aria-label="Close purchase overlay"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: config.textColor || '#0f172a', fontSize: '20px', lineHeight: 1, padding: '4px' }}
                      >
                        &times;
                      </button>
                    </div>
                    <FallbackPurchaseCredits chatbotId={chatbotId} packages={creditPackages} widgetConfig={config} />
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="chat-widget-messages" ref={messagesContainerRef} role="log" aria-live="polite">
                {/* Loading spinner for lazy-loaded history */}
                {historyLoading && (
                  <div className="chat-widget-history-loading">
                    <span>{t.loadingHistory}</span>
                  </div>
                )}
                {/* Previous conversation history messages */}
                {historyMessages.map((message) => {
                  const rawId = message.id.replace('history_', '');
                  const sessionBreak = historySessionBreaks.get(rawId);
                  return (
                    <Fragment key={message.id}>
                      {sessionBreak && (
                        <div className="chat-widget-session-divider">
                          <span>{t.previousConversation} · {new Date(sessionBreak).toLocaleDateString(language, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      <div className={`chat-widget-message chat-widget-message-${message.role} chat-widget-previous-message`}>
                        <div className={`chat-widget-bubble chat-widget-bubble-${message.role}`}>
                          {message.role === 'assistant' ? (
                            <span
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                              style={{ cursor: 'default' }}
                            />
                          ) : (
                            message.content
                          )}
                        </div>
                        <div className="chat-widget-timestamp">
                          {message.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
                {/* New conversation divider (shown when history exists) */}
                {historyLoaded && historyMessages.length > 0 && (
                  <div className="chat-widget-session-divider chat-widget-session-divider-new">
                    <span>{t.newConversation}</span>
                  </div>
                )}
                {/* Conversation-level report moved to full-view 'report' currentView */}
                {/* Current session messages (skip any already shown in history) */}
                {messages.filter((message) => !historyMessages.some((h) => h.id === `history_${message.id}`)).map((message) => (
                  <div
                    key={message.id}
                    className={`chat-widget-message chat-widget-message-${message.role}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, width: '100%', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }} className={message.role === 'assistant' ? 'chat-widget-msg-row' : ''}>
                      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column' as const, alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div className={`chat-widget-bubble chat-widget-bubble-${message.role}`} style={{
                        maxWidth: '100%',
                        ...(message.failed ? { opacity: 0.6 } : {}),
                      }}>
                        {message.role === 'assistant' && (message as any).metadata?.is_human_agent && (
                          <div style={{ fontSize: '11px', fontWeight: 600, color: config.primaryColor, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                            {(message as any).metadata?.agent_name || t.defaultAgentName}
                          </div>
                        )}
                        {message.role === 'assistant' ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(message.content)
                            }}
                            style={{ cursor: 'default' }}
                          />
                        ) : (
                          message.content
                        )}
                        {/* Failed messages — retry UI is rendered below the bubble in the timestamp row */}
                        {/* "I'm here" button on inactivity warning */}
                        {(message as any).metadata?.has_im_here && handoffCountdownSeconds !== null && (
                          <button
                            onClick={handleImHere}
                            style={{
                              marginTop: '8px', padding: '6px 16px',
                              backgroundColor: config.primaryColor, color: '#fff',
                              border: 'none', borderRadius: '6px', fontSize: '13px',
                              fontWeight: 600, cursor: 'pointer', width: '100%',
                            }}
                          >
                            I&apos;m here
                          </button>
                        )}
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="chat-widget-attachments">
                            {message.attachments.map((att, i) => (
                              att.file_type.startsWith('image/') ? (
                                <a key={i} href={att.url} onClick={(e) => { e.preventDefault(); downloadAttachment(att.url, att.file_name); }} className="chat-widget-attachment-image" style={{ cursor: 'pointer' }}>
                                  <img src={att.url} alt={att.file_name} />
                                </a>
                              ) : (
                                <a key={i} href={att.url} onClick={(e) => { e.preventDefault(); downloadAttachment(att.url, att.file_name); }} className="chat-widget-attachment-file" style={{ cursor: 'pointer' }}>
                                  <FileIcon size={16} />
                                  <span className="chat-widget-attachment-name">{att.file_name}</span>
                                  <Download size={14} />
                                </a>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Timestamp + feedback row — inside bubble wrapper so it matches bubble width */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        {message.failed ? (
                          message.errorType === 'message_limit' ? (
                            <div role="alert" style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '3px 8px', marginTop: '2px', marginLeft: 'auto',
                            }}>
                              <ShieldOff size={12} style={{ color: '#dc2626', flexShrink: 0 }} />
                              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 500 }}>
                                Unable to send message
                              </span>
                            </div>
                          ) : message.errorType === 'unavailable' ? (
                            <div role="alert" style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '3px 8px', marginTop: '2px', marginLeft: 'auto',
                            }}>
                              <AlertCircle size={12} style={{ color: '#dc2626', flexShrink: 0 }} />
                              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 500 }}>
                                Chatbot unavailable
                              </span>
                            </div>
                          ) : message.errorType === 'rate_limit' ? (
                            <button
                              onClick={() => retryMessage(message)}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.08)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '3px 8px', marginTop: '2px', marginLeft: 'auto',
                                backgroundColor: 'transparent', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', transition: 'background-color 0.15s ease',
                              }}
                            >
                              <Clock size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
                                Too many messages
                              </span>
                              <span style={{ fontSize: '11px', color: '#9ca3af', margin: '0 1px' }}>·</span>
                              <span style={{ fontSize: '11px', color: config.primaryColor, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                                Retry
                              </span>
                            </button>
                          ) : (
                          <button
                            onClick={() => retryMessage(message)}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              padding: '3px 8px', marginTop: '2px', marginLeft: 'auto',
                              backgroundColor: 'transparent', border: 'none', borderRadius: '8px',
                              cursor: 'pointer', transition: 'background-color 0.15s ease',
                            }}
                          >
                            <AlertCircle size={12} style={{ color: '#dc2626', flexShrink: 0 }} />
                            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 500 }}>
                              Not delivered
                            </span>
                            <span style={{ fontSize: '11px', color: '#9ca3af', margin: '0 1px' }}>·</span>
                            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                              Retry
                            </span>
                            <RotateCcw size={10} style={{ color: '#6b7280' }} />
                          </button>
                          )
                        ) : (
                        <div className="chat-widget-timestamp">
                          {message.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        )}
                        {message.role === 'assistant' && !message.id.startsWith('loading_') && !message.id.startsWith('error_') && !message.id.startsWith('welcome_') && (
                          <>
                            <div
                              className={`chat-widget-feedback-btns${messageFeedback[message.id] != null ? ' chat-widget-feedback-voted' : ''}`}
                              style={{ display: 'flex', gap: 2 }}
                            >
                              <button
                                type="button"
                                onClick={() => handleFeedback(message.id, true)}
                                className="chat-widget-feedback-btn"
                                style={{
                                  color: messageFeedback[message.id] === true ? '#22c55e' : '#9ca3af',
                                  opacity: messageFeedback[message.id] === false ? 0.3 : undefined,
                                }}
                                aria-label={t.feedbackHelpful}
                              >
                                <ThumbsUp size={14} fill={messageFeedback[message.id] === true ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFeedback(message.id, false)}
                                className="chat-widget-feedback-btn"
                                style={{
                                  color: messageFeedback[message.id] === false ? '#ef4444' : '#9ca3af',
                                  opacity: messageFeedback[message.id] === true ? 0.3 : undefined,
                                }}
                                aria-label={t.feedbackNotHelpful}
                              >
                                <ThumbsDown size={14} fill={messageFeedback[message.id] === false ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                            {feedbackFollowUpId === message.id && (
                              <div className="chat-widget-feedback-followup" style={{ position: 'absolute', bottom: -4, left: 0, transform: 'translateY(100%)', zIndex: 3 }}>
                                <button
                                  type="button"
                                  onClick={() => setFeedbackFollowUpId(null)}
                                  className="chat-widget-feedback-dismiss"
                                  aria-label={t.closeAriaLabel}
                                >
                                  <X size={12} />
                                </button>
                                <div style={{ fontSize: 12, fontWeight: 600, color: config.botBubbleTextColor || '#374151', opacity: 0.7, marginBottom: 8 }}>{t.feedbackWhatWentWrong}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  {([
                                    ['incorrect', t.feedbackIncorrect],
                                    ['not_relevant', t.feedbackNotRelevant],
                                    ['too_vague', t.feedbackTooVague],
                                    ['other', t.feedbackOther],
                                  ] as const).map(([key, label]) => (
                                    <button
                                      key={key}
                                      type="button"
                                      disabled={feedbackReasonSubmitting}
                                      onClick={() => handleFeedbackReason(message.id, key)}
                                      className="chat-widget-feedback-reason-btn"
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      </div>{/* end bubble wrapper */}
                      {/* Per-message report flag — larger touch target (44px min) */}
                      {escalationEnabled && message.role === 'assistant' && (
                        <button
                          type="button"
                          className="chat-widget-report-btn"
                          title={reportedMessageIds.has(message.id) ? t.reportSuccess : t.reportFlagMessage}
                          disabled={reportedMessageIds.has(message.id)}
                          onClick={() => { if (!reportedMessageIds.has(message.id)) { setReportingMessageId(message.id); setReportConversation(false); setReportReason(''); setReportDetails(''); } }}
                        >
                          {reportedMessageIds.has(message.id) ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                          )}
                        </button>
                      )}
                    </div>
                    {/* Inline report form for this message */}
                    {reportingMessageId === message.id && escalationEnabled && (
                      <div className="chat-widget-report-form" ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}>
                        {reportSuccess ? (
                          <div className="chat-widget-report-success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ margin: '0 auto 4px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span style={{ fontWeight: 500 }}>{t.reportSuccess}</span>
                            <span style={{ fontSize: 12, opacity: 0.8 }}>{t.reportSuccessDetail}</span>
                            <button type="button" className="chat-widget-report-back-btn" onClick={dismissReportSuccess}>{t.reportBackToConversation}</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ fontWeight: 500, fontSize: 13, color: config.reportTextColor || config.textColor }}>{t.reportFlagMessage}</span>
                              <button onClick={closeReportForm} className="chat-widget-report-close" aria-label={t.closeAriaLabel}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                            <div className="chat-widget-report-reasons">
                              <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'wrong_answer' ? 'selected' : ''}`} onClick={() => setReportReason('wrong_answer')}>{t.reportWrongAnswer}</button>
                              <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'offensive_content' ? 'selected' : ''}`} onClick={() => setReportReason('offensive_content')}>{t.reportOffensiveContent}</button>
                              <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'other' ? 'selected' : ''}`} onClick={() => setReportReason('other')}>{t.reportOther}</button>
                            </div>
                            <textarea className="chat-widget-report-textarea" rows={2} value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} placeholder={getReportPlaceholder(reportReason)} />
                            <button type="button" className="chat-widget-report-submit" disabled={!reportReason || reportSubmitting} onClick={handleReportSubmit}>
                              {getReportSubmitLabel(reportReason, reportSubmitting)}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    {/* Check-in action buttons */}
                    {message.checkInActions && message.checkInActions.length > 0 && (
                      <div className="chat-widget-checkin-actions">
                        {message.checkInActions.map((action) => (
                          <button
                            key={action.action}
                            type="button"
                            className={`chat-widget-checkin-btn ${action.primary ? 'chat-widget-checkin-btn-primary' : ''}`}
                            onClick={() => handleCheckInClick(action.action, message.id)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-widget-message chat-widget-message-assistant">
                    <div className="chat-widget-bubble chat-widget-bubble-assistant">
                      <div className="chat-widget-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                {agentIsTyping && !isLoading && (
                  <div className="chat-widget-agent-typing-indicator" aria-label={t.agentTyping}>
                    {t.agentTyping}
                    <span className="chat-widget-agent-typing-dots" aria-hidden="true">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Transcript Email Input */}
              {showTranscriptInput && (
                <div className="chat-widget-input-container" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                  <div style={{ fontSize: 'inherit', color: config.inputTextColor, fontWeight: 500 }}>
                    {t.transcriptEmailLabel}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="email"
                      value={transcriptEmail}
                      onChange={(e) => { setTranscriptEmail(e.target.value); setTranscriptError(''); }}
                      placeholder={t.enterYourEmail}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendTranscript(); }}
                      className="chat-widget-input"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSendTranscript()}
                      disabled={transcriptSending}
                      className="chat-widget-send"
                      style={{ opacity: transcriptSending ? 0.7 : 1, cursor: transcriptSending ? 'not-allowed' : 'pointer' }}
                    >
                      {transcriptSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setShowTranscriptInput(false);
                        if (pendingSurveyAfterTranscript.current && showPostChat && !surveyCompleted) {
                          pendingSurveyAfterTranscript.current = false;
                          const currentT = tRef.current;
                          setTimeout(() => {
                            setMessages((prev) => [...prev, {
                              id: `survey_suggest_${Date.now()}`,
                              role: 'assistant',
                              content: currentT.surveyPrompt,
                              timestamp: new Date(),
                              checkInActions: [
                                { label: currentT.surveyYes, action: 'survey-yes', primary: true },
                                { label: currentT.surveyNo, action: 'survey-no' },
                              ],
                            }]);
                          }, 300);
                        }
                      }}
                      style={{
                        padding: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: config.inputPlaceholderColor || '#6b7280',
                        lineHeight: 0,
                      }}
                      aria-label={t.closeAriaLabel}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {transcriptError && (
                    <div style={{ color: '#ef4444', fontSize: '12px' }}>{transcriptError}</div>
                  )}
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <div style={{ padding: '4px 12px', fontSize: '12px', color: '#ef4444', background: '#fef2f2', borderTop: '1px solid #fecaca' }}>
                  {uploadError}
                </div>
              )}

              {/* Pending Attachments Preview */}
              {pendingAttachments.length > 0 && (
                <div className="chat-widget-pending-attachments">
                  {pendingAttachments.map((att, i) => (
                    <div key={i} className="chat-widget-pending-item">
                      {att.file_type.startsWith('image/') ? (
                        <img src={att.url} alt={att.file_name} className="chat-widget-pending-thumb" />
                      ) : (
                        <div className="chat-widget-pending-file-icon"><FileIcon size={16} /></div>
                      )}
                      <span className="chat-widget-pending-name">{att.file_name}</span>
                      <button
                        type="button"
                        onClick={() => removePendingAttachment(i)}
                        className="chat-widget-pending-remove"
                        aria-label={t.removeAttachment}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Handoff inactivity countdown bar */}
              {handoffCountdownSeconds !== null && handoffCountdownSeconds > 0 && (
                <div className="chat-widget-countdown-bar" style={{
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  backgroundColor: handoffCountdownSeconds <= 30 ? '#FEE2E2' : '#FEF3C7',
                  color: handoffCountdownSeconds <= 30 ? '#991B1B' : '#92400E',
                  borderTop: `1px solid ${handoffCountdownSeconds <= 30 ? '#FECACA' : '#FDE68A'}`,
                  transition: 'background-color 0.3s, color 0.3s',
                }}>
                  <div style={{ flex: 1, height: '4px', backgroundColor: handoffCountdownSeconds <= 30 ? '#FCA5A5' : '#FCD34D', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: handoffCountdownSeconds <= 30 ? '#DC2626' : '#F59E0B',
                      borderRadius: '2px',
                      width: `${Math.min(100, (handoffCountdownSeconds / 120) * 100)}%`,
                      transition: 'width 1s linear',
                    }} />
                  </div>
                  <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {Math.floor(handoffCountdownSeconds / 60)}:{String(handoffCountdownSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Handoff ended transition card */}
              {handoffEndedInfo && (
                <div className="chat-widget-handoff-ended" style={{
                  padding: '16px',
                  margin: '0 12px 8px',
                  backgroundColor: config.formBackgroundColor || '#f9fafb',
                  borderRadius: '12px',
                  border: `1px solid ${config.formBorderColor || '#e5e7eb'}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: config.formTitleColor || config.textColor, marginBottom: '12px' }}>
                    Conversation with {handoffEndedInfo.agentName} ended
                  </div>
                  {!handoffRatingSubmitted ? (
                    <>
                      <div style={{ fontSize: '12px', color: config.formDescriptionColor || '#6b7280', marginBottom: '8px' }}>
                        How was your experience?
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => {
                              setHandoffRating(n);
                              setHandoffRatingSubmitted(true);
                              // Fire-and-forget: save rating
                              if (conversationId) {
                                fetch(`/api/chatbots/${chatbotId}/surveys`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    conversation_id: conversationId,
                                    session_id: sessionId,
                                    responses: [{ question: 'Agent rating', type: 'rating', answer: n }],
                                  }),
                                }).catch(() => {});
                              }
                            }}
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              border: `2px solid ${handoffRating === n ? config.primaryColor : (config.formBorderColor || '#d1d5db')}`,
                              backgroundColor: handoffRating === n ? config.primaryColor : 'transparent',
                              color: handoffRating === n ? '#fff' : (config.formLabelColor || config.textColor),
                              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setHandoffEndedInfo(null);
                          setMessages((prev) => [...prev, {
                            id: `ai_return_${Date.now()}`,
                            role: 'assistant',
                            content: 'You\'re now chatting with the AI assistant.',
                            timestamp: new Date(),
                            metadata: { is_system: true },
                          }]);
                        }}
                        style={{
                          fontSize: '11px', color: config.formDescriptionColor || '#9ca3af',
                          background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
                        }}
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: '12px', color: config.formDescriptionColor || '#6b7280', marginBottom: '8px' }}>
                      Thanks for your feedback!
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setHandoffEndedInfo(null);
                      setMessages((prev) => [...prev, {
                        id: `ai_return_${Date.now()}`,
                        role: 'assistant',
                        content: 'You\'re now chatting with the AI assistant.',
                        timestamp: new Date(),
                        metadata: { is_system: true },
                      }]);
                    }}
                    style={{
                      marginTop: '8px', width: '100%', padding: '8px 16px',
                      backgroundColor: config.primaryColor, color: '#fff',
                      border: 'none', borderRadius: '8px', fontSize: '13px',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Continue with AI assistant
                  </button>
                </div>
              )}

              {/* Input — disabled banner when chat is disabled */}
              {chatDisabled ? (
                <div
                  role="status"
                  aria-disabled="true"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 16px',
                    backgroundColor: config.botBubbleColor || '#f1f5f9',
                    borderTop: `1px solid ${config.formBorderColor || '#e5e7eb'}`,
                  }}
                >
                  {chatDisabled === 'message_limit' ? (
                    <ShieldOff size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontSize: '13px', color: config.botBubbleTextColor || '#0f172a', opacity: 0.8,
                  }}>
                    {chatDisabled === 'message_limit'
                      ? 'This chatbot has reached its message limit for now. Please check back later.'
                      : 'This chatbot is currently unavailable. Please check back later.'}
                  </span>
                </div>
              ) : (
              <div className="chat-widget-input-container">
                {/* Hidden file input */}
                {uploadConfig.enabled && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedMimes}
                    onChange={handleFileSelect}
                    multiple
                    style={{ display: 'none' }}
                  />
                )}
                {/* Attach button */}
                {uploadConfig.enabled && (() => {
                  const maxFiles = uploadConfig.max_files_per_message ?? 3;
                  const atLimit = pendingAttachments.length >= maxFiles;
                  return (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isLoading || atLimit}
                      className="chat-widget-attach-btn"
                      aria-label={atLimit ? t.maxFilesLabel.replace('{count}', String(maxFiles)) : t.attachFile}
                      title={atLimit ? t.maxFilesLabel.replace('{count}', String(maxFiles)) : t.attachFile}
                      style={atLimit ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                    >
                      {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                    </button>
                  );
                })()}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Broadcast typing indicator during handoff
                    if (handoffActive) {
                      broadcastVisitorTyping(e.target.value.length > 0);
                    }
                    // Dismiss action buttons and reset inactivity timer if user starts typing
                    if (endOfChatState === 'offered') {
                      setEndOfChatState('idle');
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.checkInActions ? { ...msg, checkInActions: undefined } : msg
                        )
                      );
                    }
                    if (inactivityTimerRef.current) {
                      clearTimeout(inactivityTimerRef.current);
                      inactivityTimerRef.current = null;
                    }
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder={activeLanguage !== language ? t.typePlaceholder : (chatbot.placeholder_text || t.typePlaceholder)}
                  className="chat-widget-input"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={(!input.trim() && pendingAttachments.length === 0) || isLoading}
                  className="chat-widget-send"
                  aria-label={t.sendAriaLabel}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
              )}
            </>
          )}

          {/* Report View (full-view replacement for conversation-level escalation) */}
          {currentView === 'report' && escalationEnabled && (
            <div className="chat-widget-report-view">
              {reportSuccess ? (
                <div className="chat-widget-report-view-success">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <p style={{ fontSize: 15, fontWeight: 500, color: config.reportTextColor || config.textColor, marginTop: 8 }}>
                    {t.reportSuccess}
                  </p>
                  <p style={{ fontSize: 13, color: config.reportTextColor || config.textColor, opacity: 0.7, marginTop: 4 }}>
                    {t.reportSuccessDetail}
                  </p>
                  <button type="button" className="chat-widget-report-back-btn" onClick={dismissReportSuccess} style={{ marginTop: 16 }}>
                    {t.reportBackToConversation}
                  </button>
                </div>
              ) : (
                <>
                  <div className="chat-widget-report-view-header">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: config.reportTextColor || config.textColor, margin: 0 }}>{t.reportIssue}</h3>
                    <button onClick={closeReportForm} className="chat-widget-report-close" aria-label={t.closeAriaLabel}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  <div className="chat-widget-report-view-body">
                    {/* Report reasons — 3-item grid */}
                    <div className="chat-widget-report-reasons">
                      <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'wrong_answer' ? 'selected' : ''}`} onClick={() => setReportReason('wrong_answer')}>{t.reportWrongAnswer}</button>
                      <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'offensive_content' ? 'selected' : ''}`} onClick={() => setReportReason('offensive_content')}>{t.reportOffensiveContent}</button>
                      <button type="button" className={`chat-widget-report-reason-btn ${reportReason === 'other' ? 'selected' : ''}`} onClick={() => setReportReason('other')}>{t.reportOther}</button>
                    </div>

                    {/* Details textarea */}
                    <textarea
                      className="chat-widget-report-textarea"
                      rows={3}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder={getReportPlaceholder(reportReason)}
                    />
                  </div>

                  <div className="chat-widget-report-view-footer">
                    <button type="button" className="chat-widget-report-submit" disabled={!reportReason || reportSubmitting} onClick={handleReportSubmit}>
                      {getReportSubmitLabel(reportReason, reportSubmitting)}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Handoff Confirmation Panel — form layout matching other views */}
          {showHandoffConfirm && currentView === 'chat' && (
            <div className="chat-widget-handoff-confirm" role="dialog" aria-labelledby="handoff-title" onKeyDown={(e) => { if (e.key === 'Escape') { setShowHandoffConfirm(false); setHandoffContext(''); } }}>
              <div className="chat-widget-form-header">
                <h3 id="handoff-title" className="chat-widget-form-title">
                  {t.reportConnectToHuman || 'Chat with a person'}
                </h3>
                <p className="chat-widget-form-desc">
                  {t.handoffConfirmDescription || 'A team member will join this conversation and can see your messages so far.'}
                </p>
              </div>
              <div className="chat-widget-form-fields">
                <div className="chat-widget-form-field">
                  <label className="chat-widget-form-label">
                    {t.reportDetailsHumanHelp || 'What can we help with? (optional)'}
                  </label>
                  <textarea
                    className="chat-widget-handoff-textarea"
                    rows={3}
                    value={handoffContext}
                    onChange={(e) => setHandoffContext(e.target.value)}
                    placeholder={t.reportDetailsHumanHelp || 'What can we help with? (optional)'}
                    aria-label={t.handoffDescribeLabel}
                  />
                </div>
              </div>
              <div className="chat-widget-handoff-footer">
                <button
                  type="button"
                  className="chat-widget-form-submit"
                  disabled={handoffConnecting}
                  onClick={initiateDirectHandoff}
                >
                  {handoffConnecting ? (t.reportConnecting || 'Connecting...') : (t.reportSubmitHumanHelp || 'Connect to support')}
                </button>
                <button
                  type="button"
                  className="chat-widget-handoff-cancel"
                  onClick={() => { setShowHandoffConfirm(false); setHandoffContext(''); }}
                >
                  {t.cancelLabel || 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Survey View */}
          {currentView === 'survey' && postChatSurveyConfig && (
            <div className="chat-widget-form-view">
              <div className="chat-widget-form-header">
                <h3 className="chat-widget-form-title">
                  {translateDefault(postChatSurveyConfig.title, DEFAULT_POST_CHAT_SURVEY_CONFIG.title, t.postChatTitle)}
                </h3>
                <p className="chat-widget-form-desc">
                  {translateDefault(postChatSurveyConfig.description, DEFAULT_POST_CHAT_SURVEY_CONFIG.description, t.postChatDescription)}
                </p>
              </div>
              <div className="chat-widget-form-fields">
                {postChatSurveyConfig.questions.map((question) => (
                  <div key={question.id} className="chat-widget-form-field">
                    <label className="chat-widget-form-label">
                      {question.label}
                      {question.required && <span className="chat-widget-required">*</span>}
                    </label>
                    {question.type === 'rating' && (
                      <div className="chat-widget-rating">
                        {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }).map((_, i) => {
                          const ratingValue = (question.minRating || 1) + i;
                          const currentRating = (surveyResponses[question.id] as number) || 0;
                          return (
                            <button
                              key={ratingValue}
                              type="button"
                              onClick={() => setSurveyResponses((prev) => ({ ...prev, [question.id]: ratingValue }))}
                              className={`chat-widget-rating-star ${ratingValue <= currentRating ? 'active' : ''}`}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {question.type === 'text' && (
                      <textarea
                        value={(surveyResponses[question.id] as string) || ''}
                        onChange={(e) => setSurveyResponses((prev) => ({ ...prev, [question.id]: e.target.value }))}
                        placeholder={t.surveyPlaceholder}
                        className="chat-widget-form-textarea"
                      />
                    )}
                    {question.type === 'single_choice' && (
                      <div className="chat-widget-choices">
                        {(question.options || []).map((opt) => (
                          <label key={opt} className="chat-widget-choice">
                            <input
                              type="radio"
                              name={question.id}
                              value={opt}
                              checked={surveyResponses[question.id] === opt}
                              onChange={(e) => setSurveyResponses((prev) => ({ ...prev, [question.id]: e.target.value }))}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {question.type === 'multi_choice' && (
                      <div className="chat-widget-choices">
                        {(question.options || []).map((opt) => {
                          const selected = ((surveyResponses[question.id] as string[]) || []);
                          return (
                            <label key={opt} className="chat-widget-choice">
                              <input
                                type="checkbox"
                                value={opt}
                                checked={selected.includes(opt)}
                                onChange={(e) => {
                                  const newSelected = e.target.checked
                                    ? [...selected, opt]
                                    : selected.filter((s) => s !== opt);
                                  setSurveyResponses((prev) => ({ ...prev, [question.id]: newSelected }));
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="chat-widget-form-submit-container">
                <button
                  onClick={handleSurveySubmit}
                  className="chat-widget-form-submit"
                  disabled={surveySubmitting}
                >
                  {surveySubmitting ? t.submitting : translateDefault(postChatSurveyConfig.submitButtonText, DEFAULT_POST_CHAT_SURVEY_CONFIG.submitButtonText, t.postChatSubmit)}
                </button>
                <button
                  onClick={() => setCurrentView('chat')}
                  className="chat-widget-form-skip"
                >
                  {t.skip}
                </button>
              </div>
            </div>
          )}

          {/* Survey Thank You View */}
          {currentView === 'survey-thanks' && postChatSurveyConfig && (
            <div className="chat-widget-thanks-view">
              <div className="chat-widget-thanks-icon">✓</div>
              <p className="chat-widget-thanks-message">
                {translateDefault(postChatSurveyConfig.thankYouMessage, DEFAULT_POST_CHAT_SURVEY_CONFIG.thankYouMessage, t.postChatThankYou)}
              </p>
              <button
                onClick={() => {
                  setMessages((prev) => [...prev, {
                    id: `survey_thanks_${Date.now()}`,
                    role: 'assistant' as const,
                    content: translateDefault(postChatSurveyConfig.thankYouMessage, DEFAULT_POST_CHAT_SURVEY_CONFIG.thankYouMessage, t.postChatThankYou),
                    timestamp: new Date(),
                  }]);
                  setCurrentView('chat');
                }}
                className="chat-widget-thanks-back"
              >
                {t.backToChat}
              </button>
            </div>
          )}

          {/* Ticket Form Fallback */}
          {currentView === 'ticket-form' && (() => {
            const tc = { title: "We'll get back to you", description: 'Our AI assistant is currently unavailable. Submit a ticket and we\'ll respond via email.', showPhone: false, showSubject: false, showPriority: false, ...(creditExhaustionConfig as any)?.tickets };
            return (
              <div className="chat-widget-ticket-form" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', color: config.formTitleColor || '#0f172a' }}>{tc.title}</h3>
                <p style={{ fontSize: '13px', color: config.formDescriptionColor || '#6b7280', marginBottom: '16px' }}>{tc.description}</p>
                <FallbackTicketForm chatbotId={chatbotId} config={tc} widgetConfig={config} onSuccess={() => {}} onBack={() => setCurrentView('chat')} />
              </div>
            );
          })()}

          {/* Contact Form Fallback */}
          {currentView === 'contact-form' && (() => {
            const cc = { title: 'Contact Us', description: 'Leave us a message and we\'ll get back to you.', ...(creditExhaustionConfig as any)?.contact_form };
            return (
              <div className="chat-widget-contact-form-wrapper" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', color: config.formTitleColor || '#0f172a' }}>{cc.title}</h3>
                <p style={{ fontSize: '13px', color: config.formDescriptionColor || '#6b7280', marginBottom: '16px' }}>{cc.description}</p>
                <FallbackContactForm chatbotId={chatbotId} widgetConfig={config} onSuccess={() => {}} onBack={() => setCurrentView('chat')} />
              </div>
            );
          })()}

          {/* Purchase Credits Fallback */}
          {currentView === 'purchase-credits' && (() => {
            const pc = { upsellMessage: 'You\'ve used all your credits. Purchase more to continue chatting.', purchaseSuccessMessage: 'Credits added! You can now continue chatting.', packages: [], ...(creditExhaustionConfig as any)?.purchase_credits };
            return (
              <div className="chat-widget-purchase-view" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                <p style={{ fontSize: '14px', color: config.textColor || '#0f172a', marginBottom: '16px' }}>{pc.upsellMessage}</p>
                <FallbackPurchaseCredits chatbotId={chatbotId} packages={creditPackages.length > 0 ? creditPackages : pc.packages} widgetConfig={config} />
              </div>
            );
          })()}

          {/* Help Articles Fallback */}
          {currentView === 'help-articles' && (() => {
            const ha = { searchPlaceholder: 'Search help articles...', emptyStateMessage: 'No help articles available yet.', ...(creditExhaustionConfig as any)?.help_articles };
            return (
              <div className="chat-widget-articles-view" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <FallbackHelpArticles chatbotId={chatbotId} searchPlaceholder={ha.searchPlaceholder} emptyMessage={ha.emptyStateMessage} widgetConfig={config} />
              </div>
            );
          })()}

          {/* Branding */}
          {config.showBranding && (
            <div className="chat-widget-branding">
              {t.poweredBy} <a href="/" target="_blank" rel="noopener noreferrer">VocUI</a>
            </div>
          )}
          </div>{/* close body-wrapper */}
        </div>
      )}
    </>
  );
}

function generateStyles(config: WidgetConfig, isInIframe: boolean, isExpanded: boolean): string {
  const position = config.position || 'bottom-right';
  const [vertical, horizontal] = position.split('-');

  const isFullscreen = isInIframe || isExpanded;

  return `
    .chat-widget-button {
      position: fixed;
      ${vertical}: ${config.offsetY}px;
      ${horizontal}: ${config.offsetX}px;
      width: ${config.buttonSize}px;
      height: ${config.buttonSize}px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 9999;
    }

    .chat-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .chat-widget-container {
      position: fixed;
      ${isFullscreen ? 'top: 0; left: 0; right: 0; bottom: 0;' : `${vertical}: ${config.offsetY}px; ${horizontal}: ${config.offsetX}px;`}
      width: ${isFullscreen ? '100%' : `${config.width}px`};
      height: ${isFullscreen ? '100vh' : `${config.height}px`};
      max-height: ${isFullscreen ? '100vh' : 'calc(100vh - 40px)'};
      background: ${config.backgroundColor};
      border-radius: ${isFullscreen ? '0' : `${config.containerBorderRadius}px`};
      box-shadow: ${isFullscreen ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.15)'};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: ${config.fontFamily};
      font-size: ${config.fontSize}px;
      transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease, right 0.3s ease, bottom 0.3s ease, border-radius 0.3s ease;
    }

    @media (max-width: 768px) {
      .chat-widget-container {
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
    }

    .chat-widget-header {
      background: ${config.primaryColor};
      color: ${config.headerTextColor};
      padding: 12px 10px 12px 16px;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .chat-widget-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .chat-widget-logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .chat-widget-header-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .chat-widget-title {
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
    }

    .chat-widget-status {
      font-size: 12px;
      opacity: 0.9;
      line-height: 1;
    }

    .chat-widget-close {
      background: none;
      border: none;
      color: ${config.headerTextColor};
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: background 0.2s;
      flex-shrink: 0;
      min-width: 32px;
      min-height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
    }

    .chat-widget-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-widget-message {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chat-widget-message-user {
      align-items: flex-end;
    }

    .chat-widget-message-assistant {
      align-items: flex-start;
    }

    .chat-widget-bubble {
      max-width: 80%;
      width: fit-content;
      padding: 12px 16px;
      border-radius: 16px;
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .chat-widget-bubble-user {
      background: ${config.userBubbleColor};
      color: ${config.userBubbleTextColor};
      border-bottom-right-radius: 4px;
    }

    .chat-widget-bubble-assistant {
      background: ${config.botBubbleColor};
      color: ${config.botBubbleTextColor};
      border-bottom-left-radius: 4px;
    }

    .chat-widget-timestamp {
      font-size: 11px;
      color: #9ca3af;
      padding: 0 8px;
    }

    .chat-widget-previous-message {
      opacity: 0.6;
    }

    .chat-widget-session-divider {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      color: #9ca3af;
      font-size: 11px;
      user-select: none;
    }

    .chat-widget-session-divider::before,
    .chat-widget-session-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .chat-widget-session-divider span {
      white-space: nowrap;
    }

    .chat-widget-session-divider-new {
      color: ${config.primaryColor};
    }

    .chat-widget-session-divider-new::before,
    .chat-widget-session-divider-new::after {
      background: ${config.primaryColor};
      opacity: 0.3;
    }

    .chat-widget-history-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      color: #9ca3af;
      font-size: 12px;
    }

    .chat-widget-typing {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }

    .chat-widget-typing span {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .chat-widget-typing span:nth-child(1) { animation-delay: 0s; }
    .chat-widget-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-widget-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    .chat-widget-agent-typing-indicator {
      font-size: 12px;
      color: #9ca3af;
      padding: 2px 4px;
      display: flex;
      align-items: center;
      gap: 1px;
    }

    .chat-widget-agent-typing-dots span {
      animation: agentDotPulse 1.4s infinite ease-in-out;
      font-weight: bold;
    }
    .chat-widget-agent-typing-dots span:nth-child(1) { animation-delay: 0s; }
    .chat-widget-agent-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .chat-widget-agent-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes agentDotPulse {
      0%, 60%, 100% { opacity: 0.3; }
      30% { opacity: 1; }
    }

    .chat-widget-input-container {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-widget-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: ${config.inputBorderRadius}px;
      font-family: inherit;
      font-size: inherit;
      outline: none;
      transition: border-color 0.2s;
      background: ${config.inputBackgroundColor} !important;
      background-color: ${config.inputBackgroundColor} !important;
      color: ${config.inputTextColor} !important;
      -webkit-text-fill-color: ${config.inputTextColor} !important;
      height: 40px;
      line-height: 1.5;
    }

    .chat-widget-input::placeholder {
      color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
      -webkit-text-fill-color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
      opacity: 1 !important;
    }

    .chat-widget-input:focus {
      border-color: ${config.primaryColor};
      background: ${config.inputBackgroundColor} !important;
    }

    .chat-widget-input:disabled {
      opacity: 0.6;
    }

    .chat-widget-send {
      width: 40px;
      height: 40px;
      border-radius: ${config.buttonBorderRadius}%;
      background: ${config.sendButtonColor};
      color: ${config.sendButtonIconColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .chat-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-widget-send:not(:disabled):hover {
      opacity: 0.9;
    }

    .chat-widget-attach-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: transparent;
      color: ${config.inputTextColor || '#6b7280'};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, opacity 0.2s;
      flex-shrink: 0;
      opacity: 0.6;
    }

    .chat-widget-attach-btn:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.05);
      opacity: 1;
    }

    .chat-widget-attach-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .chat-widget-pending-attachments {
      padding: 8px 16px 0;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      border-top: 1px solid #e5e7eb;
    }

    .chat-widget-pending-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      font-size: 12px;
      max-width: 200px;
    }

    .chat-widget-pending-thumb {
      width: 32px;
      height: 32px;
      object-fit: cover;
      border-radius: 4px;
    }

    .chat-widget-pending-file-icon {
      display: flex;
      align-items: center;
      color: #6b7280;
    }

    .chat-widget-pending-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      color: ${config.inputTextColor || '#374151'};
    }

    .chat-widget-pending-remove {
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      display: flex;
      align-items: center;
      padding: 0;
      flex-shrink: 0;
    }

    .chat-widget-pending-remove:hover {
      color: #ef4444;
    }

    .chat-widget-attachments {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chat-widget-attachment-image {
      display: block;
      max-width: 200px;
      border-radius: 8px;
      overflow: hidden;
    }

    .chat-widget-attachment-image img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }

    .chat-widget-attachment-file {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      font-size: 12px;
      transition: background 0.2s;
    }

    .chat-widget-attachment-file:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .chat-widget-attachment-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-widget-branding {
      padding: 8px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }

    .chat-widget-branding a {
      color: ${config.primaryColor};
      text-decoration: none;
    }

    .chat-widget-branding a:hover {
      text-decoration: underline;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    .chat-widget-form-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 0;
      background: ${config.formBackgroundColor || config.backgroundColor};
      height: 100%;
    }

    .chat-widget-form-header {
      padding: 20px 16px 12px;
    }

    .chat-widget-form-title {
      font-size: 16px;
      font-weight: 600;
      color: ${config.formTitleColor || config.textColor} !important;
      margin: 0 0 4px 0;
    }

    .chat-widget-form-desc {
      font-size: 13px;
      color: ${config.formDescriptionColor || '#6b7280'} !important;
      margin: 0;
      line-height: 1.4;
    }

    .chat-widget-form-fields {
      flex: 1;
      padding: 0 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .chat-widget-form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chat-widget-form-label {
      font-size: 13px;
      font-weight: 500;
      color: ${config.formLabelColor || config.textColor} !important;
    }

    .chat-widget-required {
      color: #ef4444;
      margin-left: 2px;
    }

    .chat-widget-form-input,
    .chat-widget-form-select,
    .chat-widget-form-textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid ${config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
      background-color: ${config.formInputBackgroundColor || config.inputBackgroundColor} !important;
      color: ${config.formInputTextColor || config.inputTextColor} !important;
      box-sizing: border-box;
    }

    .chat-widget-form-input::placeholder,
    .chat-widget-form-textarea::placeholder {
      color: ${config.formPlaceholderColor || config.inputPlaceholderColor || '#9ca3b8'} !important;
      opacity: 1 !important;
    }

    .chat-widget-form-select option {
      background-color: ${config.formInputBackgroundColor || config.inputBackgroundColor} !important;
      color: ${config.formInputTextColor || config.inputTextColor} !important;
    }

    .chat-widget-form-textarea {
      min-height: 60px;
      resize: vertical;
    }

    .chat-widget-form-input:focus,
    .chat-widget-form-select:focus,
    .chat-widget-form-textarea:focus {
      border-color: ${config.primaryColor};
      box-shadow: 0 0 0 2px ${config.primaryColor}20;
    }

    .chat-widget-form-field-error .chat-widget-form-input,
    .chat-widget-form-field-error .chat-widget-form-select,
    .chat-widget-form-field-error .chat-widget-form-textarea {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }

    .chat-widget-form-error-message {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }

    .chat-widget-form-field-error .chat-widget-form-label {
      color: #ef4444 !important;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }

    .chat-widget-form-field-error {
      animation: shake 0.4s ease-in-out;
    }

    .chat-widget-form-submit-container {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chat-widget-form-submit {
      width: 100%;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      background: ${config.primaryColor};
      color: ${config.formSubmitButtonTextColor || '#ffffff'};
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .chat-widget-form-submit:hover:not(:disabled) {
      opacity: 0.9;
    }

    .chat-widget-form-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-widget-form-skip {
      width: 100%;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #6b7280;
      font-family: inherit;
      font-size: 13px;
      cursor: pointer;
      transition: color 0.2s;
    }

    .chat-widget-form-skip:hover {
      color: ${config.textColor};
    }

    /* Rating Stars */
    .chat-widget-rating {
      display: flex;
      gap: 4px;
    }

    .chat-widget-rating-star {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #d1d5db;
      padding: 0 2px;
      transition: color 0.15s, transform 0.15s;
      line-height: 1;
    }

    .chat-widget-rating-star:hover,
    .chat-widget-rating-star.active {
      color: #f59e0b;
      transform: scale(1.1);
    }

    /* Choices (radio/checkbox) */
    .chat-widget-choices {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chat-widget-choice {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      color: ${config.textColor};
      transition: border-color 0.2s, background 0.2s;
    }

    .chat-widget-choice:hover {
      border-color: ${config.primaryColor};
      background: ${config.primaryColor}08;
    }

    .chat-widget-choice input {
      accent-color: ${config.primaryColor};
    }

    /* End Chat Button */
    .chat-widget-end-chat {
      padding: 4px 16px 8px;
      text-align: center;
    }

    .chat-widget-end-chat-btn {
      background: none;
      border: none;
      color: #6b7280;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 4px;
      transition: color 0.2s, background 0.2s;
    }

    .chat-widget-end-chat-btn:hover {
      color: ${config.primaryColor};
      background: ${config.primaryColor}10;
    }

    /* Check-in UI */
    .chat-widget-checkin {
      padding: 12px 16px;
      background: ${config.botBubbleColor};
      border-top: 1px solid #e5e7eb;
      animation: checkinSlideUp 0.3s ease-out;
    }

    @keyframes checkinSlideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .chat-widget-checkin-text {
      font-size: 13px;
      color: ${config.textColor};
      margin: 0 0 10px 0;
      text-align: center;
      font-weight: 500;
    }

    .chat-widget-checkin-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .chat-widget-checkin-btn {
      padding: 8px 16px;
      border: 1px solid ${config.formBorderColor || '#e5e7eb'};
      border-radius: 20px;
      background: ${config.backgroundColor};
      color: ${config.textColor};
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-widget-checkin-btn:hover:not(:disabled) {
      border-color: ${config.primaryColor};
      background: ${config.primaryColor}08;
    }

    .chat-widget-checkin-btn:disabled {
      opacity: 0.5;
      cursor: default;
      border-color: ${config.formBorderColor || '#e5e7eb'};
    }

    .chat-widget-checkin-btn-primary {
      background: ${config.primaryColor};
      color: ${config.formSubmitButtonTextColor || '#ffffff'};
      border-color: ${config.primaryColor};
    }

    .chat-widget-checkin-btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      background: ${config.primaryColor};
    }

    .chat-widget-checkin-btn-primary:disabled {
      opacity: 0.5;
      background: ${config.primaryColor};
      color: ${config.formSubmitButtonTextColor || '#ffffff'};
    }

    /* Check-in Actions - buttons below message bubble */
    .chat-widget-checkin-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 6px;
      margin-left: 8px;
    }

    /* Thank You View */
    .chat-widget-thanks-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 16px;
    }

    .chat-widget-thanks-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 600;
    }

    .chat-widget-thanks-message {
      font-size: 15px;
      color: ${config.textColor};
      text-align: center;
      margin: 0;
      line-height: 1.5;
    }

    .chat-widget-thanks-back {
      background: none;
      border: 1px solid #e5e7eb;
      color: #6b7280;
      font-family: inherit;
      font-size: 13px;
      padding: 8px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s;
    }

    .chat-widget-thanks-back:hover {
      border-color: ${config.primaryColor};
      color: ${config.primaryColor};
    }

    /* Feedback buttons — shared base */
    .chat-widget-feedback-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      line-height: 0;
      border-radius: 6px;
      transition: transform 0.15s ease, color 0.15s, opacity 0.15s;
      min-width: 28px;
      min-height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-widget-feedback-btn:active {
      animation: chat-widget-feedback-pop 0.2s ease;
    }
    @keyframes chat-widget-feedback-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.35); }
      100% { transform: scale(1); }
    }

    /* Desktop: hide until hover over message, unless voted */
    @media (hover: hover) and (pointer: fine) {
      .chat-widget-message .chat-widget-feedback-btns:not(.chat-widget-feedback-voted) {
        opacity: 0;
        transition: opacity 0.15s 0.3s;
      }
      .chat-widget-message:hover .chat-widget-feedback-btns {
        opacity: 1;
        transition: opacity 0.15s;
      }
    }

    /* Touch devices: always visible at reduced opacity, full when voted */
    @media (hover: none), (pointer: coarse) {
      .chat-widget-feedback-btns {
        opacity: 0.5;
      }
      .chat-widget-feedback-btns.chat-widget-feedback-voted {
        opacity: 1;
      }
      .chat-widget-feedback-btn {
        min-width: 44px;
        min-height: 44px;
        padding: 10px;
      }
    }

    /* Always show voted feedback at full opacity */
    .chat-widget-feedback-btns.chat-widget-feedback-voted {
      opacity: 1 !important;
    }

    /* Feedback follow-up prompt */
    .chat-widget-feedback-followup {
      position: relative;
      background: ${config.feedbackBackgroundColor || config.botBubbleColor};
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08);
      animation: chat-widget-followup-in 0.2s ease-out;
      min-width: 200px;
    }
    @keyframes chat-widget-followup-in {
      from { opacity: 0; transform: translateY(calc(100% - 6px)) scale(0.97); }
      to { opacity: 1; transform: translateY(100%) scale(1); }
    }
    .chat-widget-feedback-dismiss {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: ${config.feedbackTextColor || config.botBubbleTextColor || '#374151'};
      opacity: 0.4;
      transition: opacity 0.15s, background 0.15s;
      padding: 0;
    }
    .chat-widget-feedback-dismiss:hover {
      opacity: 0.7;
      background: rgba(0, 0, 0, 0.06);
    }
    .chat-widget-feedback-reason-btn {
      background: ${config.feedbackButtonColor || config.backgroundColor};
      color: ${config.feedbackButtonTextColor || config.textColor};
      border: 1px solid transparent;
      border-radius: 16px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .chat-widget-feedback-reason-btn:hover:not(:disabled) {
      border-color: ${config.primaryColor};
      background: ${config.primaryColor}12;
      color: ${config.primaryColor};
    }
    .chat-widget-feedback-reason-btn:active:not(:disabled) {
      background: ${config.primaryColor}25;
      border-color: ${config.primaryColor};
      color: ${config.primaryColor};
      transform: scale(0.96);
    }
    .chat-widget-feedback-reason-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Report / Escalation */
    @media (hover: hover) and (pointer: fine) {
      .chat-widget-msg-row .chat-widget-report-btn {
        opacity: 0;
        transition: opacity 0.15s 0.3s;
      }
      .chat-widget-msg-row:hover .chat-widget-report-btn {
        opacity: 0.5;
        transition: opacity 0.15s;
      }
    }
    @media (hover: none), (pointer: coarse) {
      .chat-widget-msg-row .chat-widget-report-btn {
        opacity: 0.4;
      }
    }

    .chat-widget-report-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 12px;
      margin: -8px;
      color: #9ca3af;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      border-radius: 4px;
      transition: color 0.15s, opacity 0.15s;
      margin-top: -4px;
    }

    .chat-widget-report-btn:hover:not(:disabled) {
      color: ${config.primaryColor};
      opacity: 1 !important;
    }

    .chat-widget-report-btn:disabled {
      cursor: default;
      color: ${config.primaryColor};
      opacity: 0.7 !important;
    }

    .chat-widget-report-form {
      background: ${config.reportBackgroundColor || config.formBackgroundColor || config.backgroundColor} !important;
      border: 1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 10px;
      padding: 12px;
      margin-top: 4px;
      max-width: 90%;
      animation: checkinSlideUp 0.2s ease-out;
    }

    .chat-widget-report-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 2px;
      display: flex;
      align-items: center;
      border-radius: 4px;
    }

    .chat-widget-report-close:hover {
      color: ${config.reportTextColor || config.textColor};
    }

    .chat-widget-report-reasons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 8px;
    }

    .chat-widget-report-reason-btn {
      padding: 6px 8px;
      border: 1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 6px;
      background: ${config.reportReasonButtonColor || config.backgroundColor} !important;
      color: ${config.reportReasonButtonTextColor || config.textColor} !important;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chat-widget-report-reason-btn:hover {
      border-color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
    }

    .chat-widget-report-reason-btn.selected {
      background: ${config.reportReasonSelectedColor || config.primaryColor} !important;
      color: ${config.reportReasonSelectedTextColor || '#ffffff'} !important;
      border-color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
    }

    .chat-widget-report-textarea {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 6px;
      font-family: inherit;
      font-size: 12px;
      outline: none;
      resize: none;
      margin-bottom: 8px;
      background: ${config.reportInputBackgroundColor || config.formInputBackgroundColor || config.inputBackgroundColor} !important;
      background-color: ${config.reportInputBackgroundColor || config.formInputBackgroundColor || config.inputBackgroundColor} !important;
      color: ${config.reportInputTextColor || config.formInputTextColor || config.inputTextColor} !important;
      -webkit-text-fill-color: ${config.reportInputTextColor || config.formInputTextColor || config.inputTextColor} !important;
      box-sizing: border-box;
    }

    .chat-widget-report-textarea::placeholder {
      color: ${config.formPlaceholderColor || config.inputPlaceholderColor || '#9ca3b8'} !important;
      -webkit-text-fill-color: ${config.formPlaceholderColor || config.inputPlaceholderColor || '#9ca3b8'} !important;
      opacity: 1 !important;
    }

    .chat-widget-report-textarea:focus {
      border-color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
    }

    .chat-widget-report-submit {
      width: 100%;
      padding: 7px 12px;
      border: none;
      border-radius: 6px;
      background: ${config.reportSubmitButtonColor || config.primaryColor} !important;
      color: ${config.reportSubmitButtonTextColor || config.formSubmitButtonTextColor || '#ffffff'} !important;
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .chat-widget-report-submit:hover:not(:disabled) {
      opacity: 0.9;
    }

    .chat-widget-report-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-widget-report-success {
      text-align: center;
      color: ${config.reportTextColor || config.textColor};
      font-size: 13px;
      font-weight: 400;
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .chat-widget-report-back-btn {
      background: none;
      border: none;
      color: ${config.primaryColor || '#6366f1'};
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .chat-widget-report-back-btn:hover {
      background: ${config.primaryColor || '#6366f1'}15;
    }

    /* Body wrapper — positioning context for overlays */
    .chat-widget-body-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Handoff confirmation — form layout matching other views */
    .chat-widget-handoff-confirm {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      background: ${config.reportBackgroundColor || config.formBackgroundColor || config.backgroundColor} !important;
      z-index: 5;
    }
    .chat-widget-handoff-confirm .chat-widget-form-title {
      color: ${config.reportTextColor || config.formTitleColor || config.textColor} !important;
    }
    .chat-widget-handoff-confirm .chat-widget-form-desc {
      color: ${config.reportTextColor || config.formDescriptionColor || '#6b7280'} !important;
    }
    .chat-widget-handoff-confirm .chat-widget-form-label {
      color: ${config.reportTextColor || config.formLabelColor || config.textColor} !important;
    }
    .chat-widget-handoff-textarea {
      width: 100%;
      border: 1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      font-family: inherit;
      color: ${config.reportInputTextColor || config.formInputTextColor || config.inputTextColor} !important;
      -webkit-text-fill-color: ${config.reportInputTextColor || config.formInputTextColor || config.inputTextColor} !important;
      background: ${config.reportInputBackgroundColor || config.formInputBackgroundColor || config.inputBackgroundColor} !important;
      resize: none;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .chat-widget-handoff-textarea::placeholder {
      color: ${config.formPlaceholderColor || config.inputPlaceholderColor || '#94a3b8'} !important;
    }
    .chat-widget-handoff-textarea:focus {
      border-color: ${config.reportReasonSelectedColor || config.primaryColor};
      box-shadow: 0 0 0 3px ${config.reportReasonSelectedColor || config.primaryColor}1a;
    }
    .chat-widget-handoff-footer {
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .chat-widget-handoff-cancel {
      width: 100%;
      background: ${config.secondaryButtonColor || 'transparent'};
      border: 1px solid ${config.secondaryButtonBorderColor || config.reportInputBorderColor || '#d1d5db'};
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      color: ${config.secondaryButtonTextColor || config.reportTextColor || config.textColor};
      cursor: pointer;
      transition: background 0.15s;
    }
    .chat-widget-handoff-cancel:hover {
      background: ${config.reportReasonButtonColor || config.secondaryColor || '#f1f5f9'};
    }

    /* Handoff active indicator in header */
    .chat-widget-handoff-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: #22c55e;
      margin-right: 4px;
      position: relative;
    }
    .chat-widget-handoff-indicator::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid ${(config as any).headerBgColor || config.primaryColor || '#6366f1'};
    }

    /* Full-view report panel */
    .chat-widget-report-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: ${config.reportBackgroundColor || config.formBackgroundColor || config.backgroundColor} !important;
    }

    .chat-widget-report-view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 0;
    }

    .chat-widget-report-view-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
    }

    .chat-widget-report-view-body .chat-widget-report-reasons {
      margin-bottom: 12px;
    }

    .chat-widget-report-view-body .chat-widget-report-reason-btn {
      padding: 10px 12px;
      font-size: 13px;
    }

    .chat-widget-report-view-body .chat-widget-report-textarea {
      font-size: 13px;
      padding: 10px 12px;
    }

    .chat-widget-report-view-footer {
      padding: 0 16px 16px;
    }

    .chat-widget-report-view-footer .chat-widget-report-submit {
      font-size: 13px;
      padding: 10px 16px;
    }

    .chat-widget-report-view-success {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }

    /* "Connect to human" separated button */
    .chat-widget-report-human-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      margin-bottom: 12px;
      border: 2px dashed ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'} !important;
      border-radius: 8px;
      background: transparent !important;
      color: ${config.reportTextColor || config.textColor} !important;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .chat-widget-report-human-btn:hover {
      border-color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
      color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
    }

    .chat-widget-report-human-btn.selected {
      border-style: solid;
      border-color: ${config.reportReasonSelectedColor || config.primaryColor} !important;
      background: ${config.reportReasonSelectedColor || config.primaryColor} !important;
      color: ${config.reportReasonSelectedTextColor || '#ffffff'} !important;
    }

    ${sanitizeCSS(config.customCss || '')}
  `;
}
