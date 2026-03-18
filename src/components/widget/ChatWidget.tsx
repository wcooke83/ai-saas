'use client';

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { MessageSquare, X, Send, ThumbsUp, ThumbsDown, Loader2, MessageCircle, Paperclip, FileIcon, Download, XCircle, Mail, Check, Expand, Shrink } from 'lucide-react';
import type { WidgetConfig, Chatbot, PreChatFormConfig, PostChatSurveyConfig, PreChatFormField, ProactiveMessagesConfig, FileUploadConfig, Attachment, TranscriptConfig } from '@/lib/chatbots/types';
import { getTranslations, translateDefault } from '@/lib/chatbots/translations';
import { DEFAULT_PRE_CHAT_FORM_CONFIG, DEFAULT_POST_CHAT_SURVEY_CONFIG, DEFAULT_FILE_UPLOAD_CONFIG, FILE_TYPE_MAP } from '@/lib/chatbots/types';
import type { FileUploadAllowedTypes } from '@/lib/chatbots/types';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  checkInActions?: CheckInAction[];
  clickedAction?: string;
  attachments?: Attachment[];
}

type WidgetView = 'pre-chat-form' | 'verify-email' | 'chat' | 'survey' | 'survey-thanks';

/**
 * Lightweight markdown-to-HTML renderer for chat bubbles.
 * Handles: **bold**, *italic*, line breaks, - bullet lists, numbered lists.
 */
function renderMarkdown(text: string): string {
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
  memoryEnabled?: boolean;
  userData?: Record<string, string> | null;
  userContext?: Record<string, unknown> | null;
}

export function ChatWidget({ chatbotId, chatbot, config, preChatFormConfig, postChatSurveyConfig, language = 'en', fileUploadConfig, proactiveMessagesConfig, transcriptConfig, memoryEnabled = false, userData, userContext }: ChatWidgetProps) {
  const [activeLanguage, setActiveLanguage] = useState(language);
  const t = getTranslations(activeLanguage);
  const tRef = useRef(t);
  tRef.current = t;
  const hasUserData = !!(userData && userData.id);
  const showPreChat = preChatFormConfig?.enabled === true && !hasUserData;
  const showPostChat = postChatSurveyConfig?.enabled === true;

  const [currentView, setCurrentView] = useState<WidgetView>(showPreChat ? 'pre-chat-form' : 'chat');
  const [isOpen, setIsOpen] = useState(config.autoOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const [visitorId, setVisitorId] = useState(() => {
    if (typeof window === 'undefined') return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const stored = localStorage.getItem(`chatbot_visitor_${chatbotId}`);
    if (stored) return stored;
    const newId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(`chatbot_visitor_${chatbotId}`, newId);
    return newId;
  });

  // File upload state
  const uploadConfig = fileUploadConfig || DEFAULT_FILE_UPLOAD_CONFIG;
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transcript state
  const transcriptEnabled = transcriptConfig?.enabled === true;
  const [transcriptEmail, setTranscriptEmail] = useState('');
  const [transcriptSending, setTranscriptSending] = useState(false);
  const [transcriptSent, setTranscriptSent] = useState(false);
  const [transcriptError, setTranscriptError] = useState('');
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);

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

    const file = files[0];
    // Reset input so same file can be selected again
    e.target.value = '';

    // Validate file size
    const maxBytes = uploadConfig.max_file_size_mb * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(t.fileTooLarge.replace('{size}', String(uploadConfig.max_file_size_mb)));
      return;
    }

    // Validate file type
    const allowedMimes: string[] = [];
    for (const [category, cfg] of Object.entries(FILE_TYPE_MAP)) {
      if (uploadConfig.allowed_types[category as keyof FileUploadAllowedTypes]) {
        allowedMimes.push(...cfg.mimes);
      }
    }
    if (!allowedMimes.includes(file.type)) {
      alert(t.fileTypeNotAllowed);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', sessionId);

      const response = await fetch(`/api/widget/${chatbotId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error?.message || t.uploadFailed);
      }

      const data = await response.json();
      const attachment: Attachment = data.data;
      setPendingAttachments((prev) => [...prev, attachment]);
    } catch (err) {
      alert(err instanceof Error ? err.message : t.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  }, [chatbotId, sessionId, uploadConfig, t]);

  const removePendingAttachment = useCallback((index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Re-translate check-in/follow-up messages when language changes mid-conversation
  useEffect(() => {
    setMessages((prev) => {
      let changed = false;
      const updated = prev.map((msg) => {
        if (msg.id.startsWith('checkin_resolved-check_')) {
          changed = true;
          return {
            ...msg,
            content: t.checkInQuestion,
            checkInActions: msg.checkInActions?.map((a) => ({
              ...a,
              label: a.action === 'resolved-yes' ? t.checkInYes : a.action === 'resolved-no' ? t.checkInNo : a.label,
            })),
          };
        }
        if (msg.id.startsWith('checkin_survey-suggest_')) {
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
        if (msg.id.startsWith('followup_')) {
          changed = true;
          return { ...msg, content: t.followUp };
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
  const [preChatFormData, setPreChatFormData] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [surveyResponses, setSurveyResponses] = useState<Record<string, unknown>>({});
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [checkInState, setCheckInState] = useState<'idle' | 'waiting' | 'shown' | 'suggesting-survey'>('idle');
  const checkInTimerRef = useRef<NodeJS.Timeout | null>(null);
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
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
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
        const newMessages: Message[] = [];
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
          // Prepend older messages
          setHistoryMessages((prev) => [...newMessages, ...prev]);
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

  // Helper to convert field label to placeholder name (e.g., "Company Name" -> "company_name")
  const getPlaceholderName = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  // Helper to process welcome message with any placeholders from form data
  const processWelcomeMessage = useCallback((message: string): string => {
    if (!preChatFormConfig || !preChatFormData) return message;

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
      return value !== undefined ? value : match;
    });

    return processedMessage;
  }, [preChatFormConfig, preChatFormData]);

  // Add welcome message on first open (after pre-chat form if enabled)
  useEffect(() => {
    // Only show welcome message when:
    // 1. Widget is open
    // 2. No messages yet
    // 3. Welcome message exists
    // 4. Either no pre-chat form, or pre-chat form was submitted (currentView === 'chat')
    const shouldShowWelcome = isOpen && 
      messages.length === 0 && 
      chatbot.welcome_message &&
      (!showPreChat || currentView === 'chat');
    
    if (shouldShowWelcome) {
      const processedMessage = processWelcomeMessage(chatbot.welcome_message);
      const welcomeMessage: Message = {
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

  const sendMessage = useCallback(async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || isLoading) return;

    // Capture input value before clearing
    const messageContent = input.trim();
    
    // Clear input immediately
    setInput('');

    // Wait for any pending proactive message save to complete first
    if (pendingProactiveSaveRef.current) {
      console.log('[ChatWidget] Waiting for proactive message save to complete before sending...');
      await pendingProactiveSaveRef.current;
    }

    // Clear any pending check-in when user sends a message
    if (checkInTimerRef.current) {
      clearTimeout(checkInTimerRef.current);
      checkInTimerRef.current = null;
    }
    if (checkInState !== 'idle') {
      setCheckInState('idle');
    }

    // Capture and clear pending attachments
    const messageAttachments = [...pendingAttachments];
    setPendingAttachments([]);

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent || (messageAttachments.length > 0 ? `[${messageAttachments.map(a => a.file_name).join(', ')}]` : ''),
      timestamp: new Date(),
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: sessionId,
          visitor_id: visitorId,
          stream: false,
          ...(userData ? { user_data: userData } : {}),
          ...(userContext ? { user_context: userContext } : {}),
          ...(messageAttachments.length > 0 ? { attachments: messageAttachments } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Update active language if it changed (e.g., user requested language switch)
      if (data.data.language && data.data.language !== activeLanguage) {
        setActiveLanguage(data.data.language);
      }

      const assistantMessage: Message = {
        id: data.data.message_id || `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Trigger check-in after assistant responds (if post-chat survey is enabled and not already completed)
      if (showPostChat && !surveyCompleted && checkInState === 'idle') {
        const userMessageCount = messages.filter(m => m.role === 'user').length;
        // Only show check-in after at least 1 user message
        if (userMessageCount >= 1) {
          setCheckInState('waiting');
          checkInTimerRef.current = setTimeout(() => {
            addCheckInMessage('resolved-check');
          }, 20000); // 20 seconds of inactivity
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: t.errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chatbotId, sessionId, visitorId, userData, userContext, t, activeLanguage, showPostChat, surveyCompleted, checkInState, messages, pendingAttachments]);

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
    } catch {
      setTranscriptError(t.emailTranscriptFailed);
    } finally {
      setTranscriptSending(false);
    }
  }, [transcriptEmail, chatbotId, sessionId, t]);

  // Generate CSS from config
  const styles = generateStyles(config, isInIframe, isExpanded);

  // Add check-in message to conversation
  // Uses tRef to always get current translations, even from stale setTimeout closures
  const addCheckInMessage = useCallback((type: 'resolved-check' | 'survey-suggest') => {
    const currentT = tRef.current;
    const content = type === 'resolved-check'
      ? currentT.checkInQuestion
      : currentT.surveyPrompt;

    const checkInActions: CheckInAction[] = type === 'resolved-check'
      ? [
          { label: currentT.checkInYes, action: 'resolved-yes', primary: true },
          { label: currentT.checkInNo, action: 'resolved-no' },
        ]
      : [
          { label: currentT.surveyYes, action: 'survey-yes', primary: true },
          { label: currentT.surveyNo, action: 'survey-no' },
        ];

    const checkInMessage: Message = {
      id: `checkin_${type}_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      checkInActions,
    };

    setMessages((prev) => [...prev, checkInMessage]);
    setCheckInState(type === 'resolved-check' ? 'shown' : 'suggesting-survey');
  }, []);

  // Handle check-in button clicks
  const handleCheckInClick = useCallback((action: string, messageId: string) => {
    // Mark this message's clicked action to disable all buttons
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, clickedAction: action } : msg
      )
    );

    switch (action) {
      case 'resolved-yes':
        // User is satisfied — offer transcript if enabled, then suggest survey
        if (transcriptEnabled && !transcriptSent) {
          setTimeout(() => {
            const currentT = tRef.current;
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
          }, 300);
        } else {
          setTimeout(() => addCheckInMessage('survey-suggest'), 300);
        }
        break;
      case 'resolved-no':
        // User has more questions, add follow-up and let them continue
        setCheckInState('idle');
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: `followup_${Date.now()}`,
            role: 'assistant',
            content: tRef.current.followUp,
            timestamp: new Date(),
          }]);
        }, 300);
        break;
      case 'survey-yes':
        // Go to survey
        setSurveyCompleted(true);
        setCheckInState('idle');
        setCurrentView('survey');
        break;
      case 'survey-no':
        // Dismiss with thanks
        setCheckInState('idle');
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
        // User wants transcript — trigger the email flow
        handleTranscriptClick();
        // Then suggest survey after a short delay
        setTimeout(() => addCheckInMessage('survey-suggest'), 500);
        break;
      case 'transcript-skip':
        // User skipped transcript, suggest survey
        setTimeout(() => addCheckInMessage('survey-suggest'), 300);
        break;
    }
  }, [addCheckInMessage, t, transcriptEnabled, transcriptSent, handleTranscriptClick]);

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
              const freshId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
              console.log('[ChatWidget] Proactive session without userData — using fresh visitorId:', freshId);
              setVisitorId(freshId);
              visitorIdRef.current = freshId;
            }
            
            // Skip pre-chat form and show chat to display the proactive message immediately
            if (currentView === 'pre-chat-form') {
              setCurrentView('chat');
            }
            
            // Add to UI immediately
            const proactiveMsg: Message = {
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
                <span className="chat-widget-status">{t.online}</span>
              </div>
            </div>
            {transcriptEnabled && currentView === 'chat' && (
              <button
                onClick={handleTranscriptClick}
                className="chat-widget-close"
                aria-label={t.emailTranscript}
                title={t.emailTranscript}
                style={{ marginRight: 4 }}
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
                style={{ marginRight: 4 }}
              >
                {isExpanded ? <Shrink size={18} /> : <Expand size={18} />}
              </button>
            )}
            <button
              onClick={() => {
                console.log('[ChatWidget] Close button clicked');
                console.log('[ChatWidget] In iframe:', window.self !== window.top);
                console.log('[ChatWidget] Widget ID:', widgetId);
                
                // If in iframe, notify parent and let parent decide what to do
                if (window.self !== window.top) {
                  const message = {
                    type: 'close-chat-widget',
                    widgetId: widgetId
                  };
                  console.log('[ChatWidget] Sending message to parent:', message);
                  try {
                    window.parent.postMessage(message, '*');
                    console.log('[ChatWidget] Message sent successfully');
                  } catch (error) {
                    console.error('[ChatWidget] Error sending message:', error);
                  }
                } else {
                  console.log('[ChatWidget] Not in iframe, setting isOpen to false');
                  setIsOpen(false);
                }
              }}
              className="chat-widget-close"
              aria-label={t.closeAriaLabel}
            >
              <X size={20} />
            </button>
          </div>

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
                    {field.type === 'select' ? (
                      <select
                        value={preChatFormData[field.id] || ''}
                        onChange={(e) => {
                          setPreChatFormData((prev) => ({ ...prev, [field.id]: e.target.value }));
                          clearFieldError(field.id);
                        }}
                        className="chat-widget-form-select"
                        disabled={isPreChatSubmitting}
                      >
                        <option value="">{field.placeholder || t.selectDefault}</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={preChatFormData[field.id] || ''}
                        onChange={(e) => {
                          setPreChatFormData((prev) => ({ ...prev, [field.id]: e.target.value }));
                          clearFieldError(field.id);
                        }}
                        placeholder={field.placeholder}
                        className="chat-widget-form-textarea"
                        disabled={isPreChatSubmitting}
                      />
                    ) : (
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
                      />
                    )}
                    {fieldErrors[field.id] && (
                      <span className="chat-widget-form-error-message">{fieldErrors[field.id]}</span>
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
              {/* Messages */}
              <div className="chat-widget-messages" ref={messagesContainerRef}>
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
                {/* Current session messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-widget-message chat-widget-message-${message.role}`}
                  >
                    <div className={`chat-widget-bubble chat-widget-bubble-${message.role}`}>
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
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="chat-widget-attachments">
                          {message.attachments.map((att, i) => (
                            att.file_type.startsWith('image/') ? (
                              <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="chat-widget-attachment-image">
                                <img src={att.url} alt={att.file_name} />
                              </a>
                            ) : (
                              <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="chat-widget-attachment-file">
                                <FileIcon size={16} />
                                <span className="chat-widget-attachment-name">{att.file_name}</span>
                                <Download size={14} />
                              </a>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Check-in action buttons */}
                    {message.checkInActions && message.checkInActions.length > 0 && (
                      <div className="chat-widget-checkin-actions">
                        {message.checkInActions.map((action) => (
                          <button
                            key={action.action}
                            type="button"
                            disabled={!!message.clickedAction}
                            className={`chat-widget-checkin-btn ${action.primary ? 'chat-widget-checkin-btn-primary' : ''}`}
                            onClick={() => handleCheckInClick(action.action, message.id)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="chat-widget-timestamp">
                      {message.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                    </div>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Transcript Email Input */}
              {showTranscriptInput && (
                <div className="chat-widget-input-container" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                  <div style={{ fontSize: 'inherit', color: config.inputTextColor, fontWeight: 500 }}>
                    {t.transcriptPrompt}
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
                      onClick={() => setShowTranscriptInput(false)}
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
                        aria-label="Remove"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="chat-widget-input-container">
                {/* Hidden file input */}
                {uploadConfig.enabled && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedMimes}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                )}
                {/* Attach button */}
                {uploadConfig.enabled && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isLoading}
                    className="chat-widget-attach-btn"
                    aria-label={t.attachFile}
                    title={t.attachFile}
                  >
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Disable all check-in buttons if user starts typing
                    if (checkInState === 'shown' || checkInState === 'suggesting-survey') {
                      setCheckInState('idle');
                      if (checkInTimerRef.current) {
                        clearTimeout(checkInTimerRef.current);
                        checkInTimerRef.current = null;
                      }
                      // Mark all check-in messages as clicked to disable their buttons
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.checkInActions ? { ...msg, clickedAction: 'typing' } : msg
                        )
                      );
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={activeLanguage !== language ? t.typePlaceholder : (chatbot.placeholder_text || t.typePlaceholder)}
                  className="chat-widget-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={(!input.trim() && pendingAttachments.length === 0) || isLoading}
                  className="chat-widget-send"
                  aria-label={t.sendAriaLabel}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </>
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
                onClick={() => setCurrentView('chat')}
                className="chat-widget-thanks-back"
              >
                {t.backToChat}
              </button>
            </div>
          )}

          {/* Branding */}
          {config.showBranding && (
            <div className="chat-widget-branding">
              {t.poweredBy} <a href="/" target="_blank" rel="noopener noreferrer">AI SaaS</a>
            </div>
          )}
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
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-widget-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
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
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      flex-shrink: 0;
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
      padding: 12px 16px;
      border-radius: 16px;
      line-height: 1.5;
      word-wrap: break-word;
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

    ${config.customCss || ''}
  `;
}
