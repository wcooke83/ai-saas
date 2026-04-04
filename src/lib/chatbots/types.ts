/**
 * Chatbot Types
 * Types for the white-label AI chatbot builder
 */

import type { Json } from '@/types/database';

// ============================================
// WIDGET CONFIGURATION
// ============================================

export interface WidgetConfig {
  // Positioning
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offsetX: number;
  offsetY: number;

  // Sizing
  width: number;
  height: number;
  buttonSize: number;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  userBubbleColor: string;
  userBubbleTextColor: string;
  botBubbleColor: string;
  botBubbleTextColor: string;
  headerTextColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
  sendButtonColor: string;
  sendButtonIconColor: string;

  // Form Colors (for Pre-Chat Form and Post-Chat Survey)
  formBackgroundColor?: string;
  formTitleColor?: string;
  formDescriptionColor?: string;
  formBorderColor?: string;
  formLabelColor?: string;
  formSubmitButtonTextColor?: string;
  formPlaceholderColor?: string;
  formInputBackgroundColor?: string;
  formInputTextColor?: string;

  // Secondary Button (e.g. "No thanks, start fresh")
  secondaryButtonColor?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBorderColor?: string;

  // Typography
  fontFamily: string;
  fontSize: number;

  // Border Radius
  containerBorderRadius: number;
  inputBorderRadius: number;
  buttonBorderRadius: number;

  // Branding
  showBranding: boolean;
  headerText: string;

  // Behavior
  autoOpen: boolean;
  autoOpenDelay: number;
  soundEnabled: boolean;

  // Escalation / Report Colors
  reportBackgroundColor?: string;
  reportTextColor?: string;
  reportReasonButtonColor?: string;
  reportReasonButtonTextColor?: string;
  reportReasonSelectedColor?: string;
  reportReasonSelectedTextColor?: string;
  reportSubmitButtonColor?: string;
  reportSubmitButtonTextColor?: string;
  reportInputBackgroundColor?: string;
  reportInputTextColor?: string;
  reportInputBorderColor?: string;

  // Feedback Follow-Up Colors
  feedbackBackgroundColor?: string;
  feedbackTextColor?: string;
  feedbackButtonColor?: string;
  feedbackButtonTextColor?: string;

  // Custom CSS
  customCss: string;
}

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  position: 'bottom-right',
  offsetX: 20,
  offsetY: 20,
  width: 380,
  height: 600,
  buttonSize: 60,
  primaryColor: '#0ea5e9',
  secondaryColor: '#f0f9ff',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  userBubbleColor: '#0ea5e9',
  userBubbleTextColor: '#ffffff',
  botBubbleColor: '#f1f5f9',
  botBubbleTextColor: '#0f172a',
  headerTextColor: '#ffffff',
  inputBackgroundColor: '#ffffff',
  inputTextColor: '#0f172a',
  inputPlaceholderColor: '#94a3b8',
  sendButtonColor: '#0ea5e9',
  sendButtonIconColor: '#ffffff',

  // Form Colors (defaults for backward compatibility)
  formBackgroundColor: '#ffffff',
  formTitleColor: '#0f172a',
  formDescriptionColor: '#6b7280',
  formBorderColor: '#e5e7eb',
  formLabelColor: '#0f172a',
  formSubmitButtonTextColor: '#ffffff',
  formPlaceholderColor: '#94a3b8',
  formInputBackgroundColor: '#ffffff',
  formInputTextColor: '#0f172a',

  // Secondary Button defaults
  secondaryButtonColor: 'transparent',
  secondaryButtonTextColor: '#374151',
  secondaryButtonBorderColor: '#d1d5db',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  containerBorderRadius: 16,
  inputBorderRadius: 24,
  buttonBorderRadius: 50,
  showBranding: true,
  headerText: 'Chat with us',
  autoOpen: false,
  autoOpenDelay: 3000,
  soundEnabled: false,
  reportBackgroundColor: '#ffffff',
  reportTextColor: '#0f172a',
  reportReasonButtonColor: '#f1f5f9',
  reportReasonButtonTextColor: '#0f172a',
  reportReasonSelectedColor: '#0ea5e9',
  reportReasonSelectedTextColor: '#ffffff',
  reportSubmitButtonColor: '#0ea5e9',
  reportSubmitButtonTextColor: '#ffffff',
  reportInputBackgroundColor: '#f1f5f9',
  reportInputTextColor: '#0f172a',
  reportInputBorderColor: '#e2e8f0',
  customCss: '',
};

// ============================================
// PRE-CHAT FORM CONFIGURATION
// ============================================

export type PreChatFieldType = 'name' | 'email' | 'phone' | 'company' | 'custom';

export interface PreChatFormField {
  id: string;
  type: PreChatFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select type
}

export interface PreChatFormConfig {
  enabled: boolean;
  title: string;
  description: string;
  fields: PreChatFormField[];
  submitButtonText: string;
}

export const DEFAULT_PRE_CHAT_FORM_CONFIG: PreChatFormConfig = {
  enabled: false,
  title: 'Before we start',
  description: 'Please provide your details so we can assist you better.',
  fields: [
    { id: 'name', type: 'name', label: 'Name', placeholder: 'Your name', required: true },
    { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
  ],
  submitButtonText: 'Start Chat',
};

// ============================================
// POST-CHAT SURVEY CONFIGURATION
// ============================================

export type SurveyQuestionType = 'rating' | 'text' | 'single_choice' | 'multi_choice';

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  label: string;
  required: boolean;
  options?: string[]; // For single_choice and multi_choice
  minRating?: number; // For rating type
  maxRating?: number; // For rating type
}

export interface PostChatSurveyConfig {
  enabled: boolean;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  submitButtonText: string;
  thankYouMessage: string;
}

export const DEFAULT_POST_CHAT_SURVEY_CONFIG: PostChatSurveyConfig = {
  enabled: false,
  title: 'How did we do?',
  description: 'We\'d love your feedback to improve our service.',
  questions: [
    { id: 'rating', type: 'rating', label: 'How would you rate your experience?', required: true, minRating: 1, maxRating: 5 },
    { id: 'feedback', type: 'text', label: 'Any additional feedback?', required: false },
  ],
  submitButtonText: 'Submit Feedback',
  thankYouMessage: 'Thank you for your feedback!',
};

// ============================================
// SURVEY RESPONSES
// ============================================

export interface SurveyResponse {
  [key: string]: unknown;
  id: string;
  chatbot_id: string;
  conversation_id: string | null;
  session_id: string | null;
  responses: Record<string, string | number | string[]>;
  created_at: string;
}

export interface SurveyStats {
  total_responses: number;
  avg_rating: number | null;
  rating_distribution: Record<number, number>;
  rating_count: number;
}

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

export interface FileUploadAllowedTypes {
  images: boolean;
  documents: boolean;
  spreadsheets: boolean;
  archives: boolean;
}

export interface FileUploadConfig {
  enabled: boolean;
  allowed_types: FileUploadAllowedTypes;
  max_file_size_mb: number;
  max_files_per_message: number;
}

export const DEFAULT_FILE_UPLOAD_CONFIG: FileUploadConfig = {
  enabled: false,
  allowed_types: {
    images: true,
    documents: true,
    spreadsheets: false,
    archives: false,
  },
  max_file_size_mb: 10,
  max_files_per_message: 3,
};

// Mapping of type categories to MIME types and extensions
export const FILE_TYPE_MAP: Record<keyof FileUploadAllowedTypes, { mimes: string[]; extensions: string[] }> = {
  images: {
    mimes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  documents: {
    mimes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
  },
  spreadsheets: {
    mimes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    extensions: ['.csv', '.xls', '.xlsx'],
  },
  archives: {
    mimes: ['application/zip'],
    extensions: ['.zip'],
  },
};

// ============================================
// ATTACHMENTS
// ============================================

export interface Attachment {
  url: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

// ============================================
// PROACTIVE MESSAGES CONFIGURATION
// ============================================

export type ProactiveTriggerType =
  | 'page_url'
  | 'time_on_page'
  | 'time_on_site'
  | 'scroll_depth'
  | 'exit_intent'
  | 'page_view_count'
  | 'idle_timeout'
  | 'custom_event';

export type ProactiveDisplayMode = 'bubble' | 'open_widget';

export type ProactiveBubblePosition =
  | 'top-left'
  | 'top-middle'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-middle'
  | 'bottom-right';

export interface ProactiveMessageRule {
  id: string;
  enabled: boolean;
  name: string;
  message: string;
  triggerType: ProactiveTriggerType;
  triggerConfig: Record<string, unknown>;
  displayMode: ProactiveDisplayMode;
  bubblePosition: ProactiveBubblePosition; // Only used when displayMode is 'bubble'
  closeOnNavigate?: boolean; // Close bubble when user navigates away (default: true)
  delay: number;         // ms delay after trigger fires
  maxShowCount: number;  // per visitor session (0 = unlimited)
  priority: number;      // lower = higher priority
}

export interface ProactiveBubbleStyle {
  bgColor: string;
  textColor: string;
  borderColor: string;
  darkBgColor: string;
  darkTextColor: string;
  darkBorderColor: string;
  borderWidth: number;
  borderRadius: number;
  shadow: 'none' | 'sm' | 'md' | 'lg';
  fontSize: number;
  maxWidth: number;
}

export const DEFAULT_BUBBLE_STYLE: ProactiveBubbleStyle = {
  bgColor: '#ffffff',
  textColor: '#0f172a',
  borderColor: '#e2e8f0',
  darkBgColor: '#0f172a',
  darkTextColor: '#f8fafc',
  darkBorderColor: '#334155',
  borderWidth: 1,
  borderRadius: 12,
  shadow: 'md',
  fontSize: 14,
  maxWidth: 280,
};

export interface ProactiveMessagesConfig {
  enabled: boolean;
  rules: ProactiveMessageRule[];
  bubbleStyle?: ProactiveBubbleStyle;
}

export const DEFAULT_PROACTIVE_MESSAGES_CONFIG: ProactiveMessagesConfig = {
  enabled: false,
  rules: [],
  bubbleStyle: DEFAULT_BUBBLE_STYLE,
};

// ============================================
// TRANSCRIPT CONFIGURATION
// ============================================

export type TranscriptEmailMode = 'pre_chat' | 'ask';

export interface TranscriptConfig {
  enabled: boolean;
  email_mode: TranscriptEmailMode;
  /** Show the envelope icon in the chat header */
  show_header_icon: boolean;
  /** Offer transcript via in-chat prompt at end of conversation */
  show_chat_prompt: boolean;
}

export const DEFAULT_TRANSCRIPT_CONFIG: TranscriptConfig = {
  enabled: false,
  email_mode: 'ask',
  show_header_icon: true,
  show_chat_prompt: false,
};

// ============================================
// ESCALATION CONFIGURATION
// ============================================

export type EscalationReason = 'wrong_answer' | 'offensive_content' | 'need_human_help' | 'other';
export type EscalationStatus = 'open' | 'acknowledged' | 'resolved';

export interface EscalationConfig {
  enabled: boolean;
  /** Inactivity timeout in minutes for live agent handoff (0 = disabled). Default: 5 */
  handoff_timeout_minutes?: number;
}

export const DEFAULT_ESCALATION_CONFIG: EscalationConfig = {
  enabled: false,
  handoff_timeout_minutes: 5,
};

// ============================================
// FEEDBACK CONFIGURATION
// ============================================

export type FeedbackReason = 'incorrect' | 'not_relevant' | 'too_vague' | 'other';

export interface FeedbackConfig {
  /** Enable the thumbs-down follow-up prompt asking why */
  follow_up_enabled: boolean;
}

export const DEFAULT_FEEDBACK_CONFIG: FeedbackConfig = {
  follow_up_enabled: false,
};

// ============================================
// LIVE HANDOFF CONFIGURATION
// ============================================

export interface LiveHandoffConfig {
  enabled: boolean;
  /** Show handoff button only when agents are online. Default: true */
  require_agent_online?: boolean;
  /** Inactivity timeout in minutes for live agent handoff (0 = disabled). Default: 5 */
  handoff_timeout_minutes?: number;
}

export const DEFAULT_LIVE_HANDOFF_CONFIG: LiveHandoffConfig = {
  enabled: false,
  require_agent_online: true,
  handoff_timeout_minutes: 5,
};

// ============================================
// TELEGRAM HANDOFF CONFIGURATION
// ============================================

export interface TelegramConfig {
  enabled: boolean;
  bot_token?: string;
  chat_id?: string;
  webhook_secret?: string;
  auto_handoff_on_escalation?: boolean;
  ai_responses_enabled?: boolean;
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  enabled: false,
  auto_handoff_on_escalation: true,
  ai_responses_enabled: false,
};

export interface WhatsAppConfig {
  enabled: boolean;
  phone_number_id?: string;
  access_token?: string;
  ai_responses_enabled?: boolean;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

export interface TeamsConfig {
  enabled: boolean;
  app_id?: string;
  app_secret?: string;
  bot_name?: string;
  ai_responses_enabled?: boolean;
}

export const DEFAULT_TEAMS_CONFIG: TeamsConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

export interface DiscordConfig {
  enabled: boolean;
  application_id?: string;
  bot_token?: string;
  public_key?: string;
  ai_responses_enabled?: boolean;
}

export const DEFAULT_DISCORD_CONFIG: DiscordConfig = {
  enabled: false,
  ai_responses_enabled: false,
};

export interface Escalation {
  [key: string]: unknown;
  id: string;
  chatbot_id: string;
  conversation_id: string | null;
  session_id: string | null;
  message_id: string | null;
  reason: EscalationReason;
  details: string | null;
  status: EscalationStatus;
  created_at: string;
  updated_at: string;
}

// ============================================
// CREDIT EXHAUSTION FALLBACK
// ============================================

export type CreditExhaustionMode = 'tickets' | 'contact_form' | 'purchase_credits' | 'help_articles';

export interface TicketFallbackConfig {
  title: string;
  description: string;
  showPhone: boolean;
  showSubject: boolean;
  showPriority: boolean;
  customFields: PreChatFormField[];
  autoReplyTemplate: string;
  adminNotificationEmail: string;
  ticketReferencePrefix: string;
}

export interface ContactFormFallbackConfig {
  title: string;
  description: string;
  adminNotificationEmail: string;
  autoReplyEnabled: boolean;
  autoReplyText: string;
}

export interface CreditPackageConfig {
  id: string;
  name: string;
  creditAmount: number;
  priceCents: number;
  stripePriceId: string;
}

export interface PurchaseCreditsFallbackConfig {
  selectedPackageId: string | null;
  maxAutoTopupsPerMonth: number;
}

export interface HelpArticlesFallbackConfig {
  searchPlaceholder: string;
  emptyStateMessage: string;
}

export interface CreditExhaustionConfig {
  tickets: TicketFallbackConfig;
  contact_form: ContactFormFallbackConfig;
  purchase_credits: PurchaseCreditsFallbackConfig;
  help_articles: HelpArticlesFallbackConfig;
}

export const DEFAULT_CREDIT_EXHAUSTION_CONFIG: CreditExhaustionConfig = {
  tickets: {
    title: "We'll get back to you",
    description: 'Our AI assistant is currently unavailable. Submit a ticket and we\'ll respond via email.',
    showPhone: false,
    showSubject: false,
    showPriority: false,
    customFields: [],
    autoReplyTemplate: 'Hi {{name}},\n\nWe\'ve received your ticket ({{ticketId}}). Our team will review it and respond as soon as possible.\n\nSubject: {{subject}}',
    adminNotificationEmail: '',
    ticketReferencePrefix: 'TKT-',
  },
  contact_form: {
    title: 'Contact Us',
    description: 'Our AI assistant is currently unavailable. Leave us a message and we\'ll get back to you.',
    adminNotificationEmail: '',
    autoReplyEnabled: true,
    autoReplyText: 'Thank you for reaching out. We\'ll get back to you soon.',
  },
  purchase_credits: {
    selectedPackageId: null,
    maxAutoTopupsPerMonth: 3,
  },
  help_articles: {
    searchPlaceholder: 'Search help articles...',
    emptyStateMessage: 'No help articles are available yet. Please check back later.',
  },
};

// ============================================
// CHATBOT
// ============================================

export type ChatbotStatus = 'draft' | 'active' | 'paused' | 'archived';
export type ChatbotPricingType = 'included' | 'per_chatbot';

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;

  // AI Configuration
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  enable_prompt_protection: boolean;

  // Language
  language: string;

  // Memory
  memory_enabled: boolean;
  memory_days: number;

  // Session
  session_ttl_hours: number;

  // Widget Configuration
  widget_config: WidgetConfig;

  // Branding
  logo_url: string | null;
  welcome_message: string;
  placeholder_text: string;

  // Pre-Chat Form & Post-Chat Survey
  pre_chat_form_config: PreChatFormConfig;
  post_chat_survey_config: PostChatSurveyConfig;

  // Status
  status: ChatbotStatus;
  is_published: boolean;

  // Limits
  monthly_message_limit: number;
  messages_this_month: number;

  // Billing
  pricing_type: ChatbotPricingType;
  stripe_product_id: string | null;

  // File Uploads
  file_upload_config: FileUploadConfig;

  // Proactive Messages
  proactive_messages_config: ProactiveMessagesConfig;

  // Transcript
  transcript_config: TranscriptConfig;

  // Escalation Reporting
  escalation_config?: EscalationConfig;

  // Feedback
  feedback_config?: FeedbackConfig;

  // Live Handoff
  live_handoff_config?: LiveHandoffConfig;

  // Telegram Handoff
  telegram_config?: TelegramConfig;

  // WhatsApp
  whatsapp_config?: WhatsAppConfig;

  // Microsoft Teams
  teams_config?: TeamsConfig;

  // Discord
  discord_config?: DiscordConfig;

  // Credit Exhaustion Fallback
  credit_exhaustion_mode: CreditExhaustionMode;
  credit_exhaustion_config: CreditExhaustionConfig;

  // CORS / Security
  allowed_origins: string[] | null;

  // RAG Live Fetch
  live_fetch_threshold: number;

  // Timestamps for tracking text/language updates
  custom_text_updated_at: string | null;
  language_updated_at: string | null;

  // Activation tracking (optional — added via migration, not in generated types until db:gen-types)
  widget_reviewed_at?: string | null;
  first_conversation_at?: string | null;

  // Onboarding wizard tracking
  onboarding_step?: number | null;
  first_knowledge_source_at?: string | null;
  first_knowledge_ready_at?: string | null;

  created_at: string;
  updated_at: string;
}

export interface ChatbotInsert {
  user_id: string;
  name: string;
  slug: string;
  description?: string | null;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  enable_prompt_protection?: boolean;
  language?: string;
  memory_enabled?: boolean;
  memory_days?: number;
  session_ttl_hours?: number;
  widget_config?: WidgetConfig;
  logo_url?: string | null;
  welcome_message?: string;
  placeholder_text?: string;
  pre_chat_form_config?: PreChatFormConfig;
  post_chat_survey_config?: PostChatSurveyConfig;
  status?: ChatbotStatus;
  is_published?: boolean;
  monthly_message_limit?: number;
  pricing_type?: ChatbotPricingType;
  file_upload_config?: FileUploadConfig;
  proactive_messages_config?: ProactiveMessagesConfig;
  transcript_config?: TranscriptConfig;
  escalation_config?: EscalationConfig;
  feedback_config?: FeedbackConfig;
  live_handoff_config?: LiveHandoffConfig;
  telegram_config?: TelegramConfig;
  whatsapp_config?: WhatsAppConfig;
  credit_exhaustion_mode?: CreditExhaustionMode;
  credit_exhaustion_config?: CreditExhaustionConfig;
  allowed_origins?: string[] | null;
  custom_text_updated_at?: string | null;
  language_updated_at?: string | null;
  onboarding_step?: number | null;
}

export interface ChatbotUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  enable_prompt_protection?: boolean;
  language?: string;
  memory_enabled?: boolean;
  memory_days?: number;
  session_ttl_hours?: number;
  widget_config?: WidgetConfig;
  logo_url?: string | null;
  welcome_message?: string;
  placeholder_text?: string;
  pre_chat_form_config?: PreChatFormConfig;
  post_chat_survey_config?: PostChatSurveyConfig;
  status?: ChatbotStatus;
  is_published?: boolean;
  monthly_message_limit?: number;
  pricing_type?: ChatbotPricingType;
  file_upload_config?: FileUploadConfig;
  proactive_messages_config?: ProactiveMessagesConfig;
  transcript_config?: TranscriptConfig;
  escalation_config?: EscalationConfig;
  feedback_config?: FeedbackConfig;
  live_handoff_config?: LiveHandoffConfig;
  telegram_config?: TelegramConfig;
  whatsapp_config?: WhatsAppConfig;
  teams_config?: TeamsConfig;
  discord_config?: DiscordConfig;
  credit_exhaustion_mode?: CreditExhaustionMode;
  credit_exhaustion_config?: CreditExhaustionConfig;
  allowed_origins?: string[] | null;
  live_fetch_threshold?: number;
  custom_text_updated_at?: string | null;
  language_updated_at?: string | null;
  onboarding_step?: number | null;
  widget_reviewed_at?: string | null;
}

// Chatbot with stats for list view
export interface ChatbotWithStats extends Chatbot {
  total_conversations?: number;
  total_messages?: number;
  avg_rating?: number;
  agents_online?: number;
}

// ============================================
// KNOWLEDGE SOURCES
// ============================================

export type KnowledgeSourceType = 'document' | 'url' | 'qa_pair' | 'text';
export type KnowledgeSourceStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface KnowledgeSource {
  id: string;
  chatbot_id: string;
  type: KnowledgeSourceType;
  name: string;

  // Source-specific data
  content: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  url: string | null;

  // Q&A specific
  question: string | null;
  answer: string | null;

  // Processing status
  status: KnowledgeSourceStatus;
  error_message: string | null;
  chunks_count: number;

  // Priority flag — chunks always included in AI context
  is_priority: boolean;

  // Embedding model tracking
  embedding_provider: string | null;
  embedding_model: string | null;

  // Metadata
  metadata: Json;

  created_at: string;
  updated_at: string;
}

export interface KnowledgeSourceInsert {
  chatbot_id: string;
  type: KnowledgeSourceType;
  name: string;
  content?: string | null;
  file_path?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  url?: string | null;
  question?: string | null;
  answer?: string | null;
  metadata?: Json;
}

// ============================================
// KNOWLEDGE CHUNKS
// ============================================

export interface KnowledgeChunk {
  id: string;
  source_id: string;
  chatbot_id: string;
  content: string;
  embedding: number[] | null;
  chunk_index: number;
  token_count: number | null;
  metadata: Json;
  created_at: string;
}

export interface KnowledgeChunkInsert {
  source_id: string;
  chatbot_id: string;
  content: string;
  embedding?: number[];
  chunk_index: number;
  token_count?: number;
  metadata?: Json;
}

// Search result from vector similarity
export interface KnowledgeChunkMatch {
  id: string;
  content: string;
  similarity: number;
  metadata: Json;
}

// ============================================
// CONVERSATIONS
// ============================================

export type ConversationChannel = 'widget' | 'api' | 'slack' | 'telegram' | 'whatsapp' | 'discord' | 'teams' | 'zapier';
export type ConversationStatus = 'active' | 'closed' | 'archived';

export interface ConversationMemory {
  id: string;
  chatbot_id: string;
  visitor_id: string;
  key_facts: string[];
  summary: string | null;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  chatbot_id: string;
  session_id: string;
  channel: ConversationChannel;
  visitor_id: string | null;
  visitor_metadata: Json;
  status: ConversationStatus;
  summary: string | null;
  language: string | null;
  message_count: number;
  first_message_at: string | null;
  last_message_at: string | null;
  rating: number | null;
  feedback_text: string | null;
  sentiment_score: number | null;
  sentiment_label: string | null;
  sentiment_summary: string | null;
  sentiment_analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SentimentLabel = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
export type LoyaltyTrend = 'improving' | 'stable' | 'declining';

export interface VisitorLoyalty {
  id: string;
  chatbot_id: string;
  visitor_id: string;
  loyalty_score: number;
  loyalty_trend: LoyaltyTrend;
  total_sessions: number;
  avg_sentiment: number;
  last_sentiment_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationInsert {
  chatbot_id: string;
  session_id: string;
  channel?: ConversationChannel;
  visitor_id?: string | null;
  visitor_metadata?: Json;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// ============================================
// MESSAGES
// ============================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  chatbot_id: string;
  role: MessageRole;
  content: string;
  model: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  latency_ms: number | null;
  context_chunks: Json | null;
  metadata: Json | null;
  thumbs_up: boolean | null;
  attachments: Attachment[] | null;
  created_at: string;
}

export interface MessageInsert {
  conversation_id: string;
  chatbot_id: string;
  role: MessageRole;
  content: string;
  model?: string | null;
  tokens_input?: number | null;
  tokens_output?: number | null;
  latency_ms?: number | null;
  context_chunks?: Json | null;
  metadata?: Json | null;
  attachments?: Attachment[] | null;
}

// ============================================
// CHATBOT API KEYS
// ============================================

export interface ChatbotAPIKey {
  id: string;
  chatbot_id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes: string[];
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface ChatbotAPIKeyInsert {
  chatbot_id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes?: string[];
  rate_limit?: number;
  expires_at?: string | null;
}

// With the actual key (only returned on creation)
export interface ChatbotAPIKeyWithSecret extends ChatbotAPIKey {
  key: string;
}

// ============================================
// SLACK INTEGRATIONS
// ============================================

export interface SlackIntegration {
  id: string;
  chatbot_id: string;
  user_id: string;
  team_id: string;
  team_name: string | null;
  bot_token: string;
  bot_user_id: string | null;
  channel_ids: string[] | null;
  mention_only: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SlackIntegrationInsert {
  chatbot_id: string;
  user_id: string;
  team_id: string;
  team_name?: string | null;
  bot_token: string;
  bot_user_id?: string | null;
  channel_ids?: string[] | null;
  mention_only?: boolean;
}

// ============================================
// ANALYTICS
// ============================================

export interface ChatbotAnalytics {
  id: string;
  chatbot_id: string;
  date: string;
  conversations_count: number;
  messages_count: number;
  unique_visitors: number;
  avg_messages_per_conversation: number | null;
  avg_response_time_ms: number | null;
  thumbs_up_count: number;
  thumbs_down_count: number;
  top_questions: Json;
  created_at: string;
}

// Aggregated analytics for dashboard
export interface ChatbotAnalyticsSummary {
  total_conversations: number;
  total_messages: number;
  unique_visitors: number;
  avg_messages_per_conversation: number;
  satisfaction_rate: number; // percentage
  daily_data: Array<{
    date: string;
    conversations: number;
    messages: number;
  }>;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateChatbotRequest {
  name: string;
  description?: string;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  enable_prompt_protection?: boolean;
  language?: string;
  memory_enabled?: boolean;
  memory_days?: number;
  widget_config?: Partial<WidgetConfig>;
  welcome_message?: string;
  pre_chat_form_config?: PreChatFormConfig;
  post_chat_survey_config?: PostChatSurveyConfig;
  file_upload_config?: Partial<FileUploadConfig>;
  proactive_messages_config?: ProactiveMessagesConfig;
}

export interface UpdateChatbotRequest {
  name?: string;
  description?: string;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  enable_prompt_protection?: boolean;
  language?: string;
  memory_enabled?: boolean;
  memory_days?: number;
  session_ttl_hours?: number;
  widget_config?: Partial<WidgetConfig>;
  logo_url?: string;
  welcome_message?: string;
  placeholder_text?: string;
  pre_chat_form_config?: PreChatFormConfig;
  post_chat_survey_config?: PostChatSurveyConfig;
  file_upload_config?: Partial<FileUploadConfig>;
  proactive_messages_config?: ProactiveMessagesConfig;
  status?: ChatbotStatus;
}

export interface ChatRequest {
  message: string;
  stream?: boolean;
  session_id?: string;
  visitor_id?: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  message_id: string;
  model: string;
  tokens_used: number;
}

export interface AddKnowledgeRequest {
  type: KnowledgeSourceType;
  name?: string;
  content?: string; // For text type
  url?: string; // For url type
  question?: string; // For qa_pair type
  answer?: string; // For qa_pair type
}

// ============================================
// PLAN LIMITS
// ============================================

export interface ChatbotPlanLimits {
  chatbots: number; // -1 for unlimited
  messagesPerMonth: number; // -1 for unlimited
  knowledgeSources: number; // -1 for unlimited
  maxFileSize: number; // in bytes
  customBranding: boolean;
  slackIntegration: boolean;
  telegramIntegration: boolean;
  whatsappIntegration: boolean;
  discordIntegration: boolean;
  teamsIntegration: boolean;
  apiAccess: boolean;
}

/**
 * @deprecated Use `getPlanLimits(planSlug)` from `@/lib/chatbots/plan-limits` instead.
 * Plan limits are now driven by the `subscription_plans` table in the database.
 * This constant is retained only to avoid breaking any unreachable references during the migration.
 */
export const CHATBOT_PLAN_LIMITS: Record<string, ChatbotPlanLimits> = {
  free: {
    chatbots: 1,
    messagesPerMonth: 100,
    knowledgeSources: 3,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    customBranding: false,
    slackIntegration: false,
    telegramIntegration: false,
    whatsappIntegration: false,
    discordIntegration: false,
    teamsIntegration: false,
    apiAccess: false,
  },
  pro: {
    chatbots: 10,
    messagesPerMonth: 10000,
    knowledgeSources: 50,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    customBranding: true,
    slackIntegration: true,
    telegramIntegration: true,
    whatsappIntegration: true,
    discordIntegration: true,
    teamsIntegration: true,
    apiAccess: true,
  },
  agency: {
    chatbots: -1,
    messagesPerMonth: -1,
    knowledgeSources: -1,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    customBranding: true,
    slackIntegration: true,
    telegramIntegration: true,
    whatsappIntegration: true,
    discordIntegration: true,
    teamsIntegration: true,
    apiAccess: true,
  },
};

// ============================================
// SYSTEM PROMPT TEMPLATES
// ============================================

export type TemplateCategory = 'general' | 'sales' | 'support' | 'engagement';

export interface SystemPromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category?: TemplateCategory;
  tags?: ('popular' | 'new')[];
  icon?: string;
}

export const SYSTEM_PROMPT_TEMPLATE_CATEGORIES: Record<string, { label: string; description: string }> = {
  general: { label: 'General', description: 'All-purpose chatbot templates' },
  sales: { label: 'Sales & Revenue', description: 'Drive leads, bookings, and conversions' },
  support: { label: 'Support', description: 'Resolve issues and retain customers' },
  engagement: { label: 'Engagement', description: 'Onboard, educate, and re-engage visitors' },
};

export const SYSTEM_PROMPT_TEMPLATES: SystemPromptTemplate[] = [
  // ────────────────────────────────────────────
  // GENERAL
  // ────────────────────────────────────────────
  {
    id: 'helpful-assistant',
    name: 'Helpful Assistant',
    description: 'Friendly general-purpose assistant that guides visitors toward action',
    category: 'general',
    tags: ['popular'],
    icon: 'MessageCircle',
    prompt: `You are a friendly, knowledgeable assistant for this business. Your goal is to help visitors get answers quickly and guide them toward the right next step.

## How to engage
- Open with warmth and curiosity. Ask what brought them here today.
- Answer questions directly, then follow up: "Does that help? Is there anything else on your mind?"
- When you solve their question, suggest a natural next step: exploring a related topic, checking out a feature, or connecting with the team.

## Conversation principles
- Match the visitor's tone. Casual if they're casual, professional if they're formal.
- Keep responses to 1-3 sentences. Expand only when the visitor asks for detail.
- If you don't know something, say so honestly and offer to connect them with someone who does.
- Ask one question at a time. Never stack multiple questions in a single message.
- After answering 2-3 questions, gently ask if they'd like to take the next step (sign up, book a call, get a quote, etc.).`,
  },
  {
    id: 'faq-bot',
    name: 'FAQ Bot',
    description: 'Concise answers with smart follow-ups to reduce support tickets',
    category: 'general',
    icon: 'HelpCircle',
    prompt: `You are a concise FAQ assistant. Your primary goal is to answer questions accurately and reduce the need for visitors to contact support.

## How to answer
- Give the direct answer first, then add brief context only if needed.
- If a question has related follow-ups that people commonly ask, proactively address the most likely one: "By the way, people also often ask about [X] — [brief answer]."
- Keep answers to 1-3 sentences unless the topic requires more detail.

## When you don't have the answer
- Never guess or fabricate information.
- Say specifically what you can help with: "I don't have details on that, but I can help with [related topics]. Would any of those be useful?"
- Offer to connect them with the team for questions outside your scope.

## Engagement
- After answering, ask "Did that answer your question?" to confirm resolution.
- If a visitor asks 3+ questions, offer: "Would it be easier to speak with someone on the team directly?"
- Track what they've asked — don't repeat information they've already received.`,
  },

  // ────────────────────────────────────────────
  // SALES & REVENUE
  // ────────────────────────────────────────────
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Consultative selling — discover needs, present value, guide to purchase',
    category: 'sales',
    tags: ['popular'],
    icon: 'TrendingUp',
    prompt: `You are a consultative sales assistant. Your goal is to understand what visitors need and guide them toward the right solution — not to push products.

## Conversation flow
1. DISCOVER: Start by understanding their situation. "What are you looking to solve?" or "What brought you here today?" Listen first.
2. QUALIFY: Through natural conversation, understand their key need, timeline, and any constraints. Never ask these as a checklist.
3. RECOMMEND: Based on what you learned, recommend a specific solution. Always frame as: what it does for them (benefit), not just what it is (feature). "Since you mentioned [need], [product/plan] would [specific outcome]."
4. HANDLE CONCERNS: If they hesitate, ask what's holding them back. Address the real concern:
   - Price: reframe as investment vs. cost of the problem continuing
   - Timing: "What would need to change for this to be the right time?"
   - Comparison: acknowledge alternatives, differentiate on what matters to them
   - Trust: offer proof — case studies, guarantees, free trials
5. GUIDE TO ACTION: When they seem ready, make the next step easy: "Want me to get you set up?" or "I can walk you through the options — which sounds closer to what you need?"

## Principles
- Be helpful first. Earn the right to recommend by adding value before asking for anything.
- One question at a time. Never overwhelm.
- If someone says "just browsing," respect it: "No pressure — happy to answer any questions that come up."
- Confident but never pushy. If they say no twice, offer a lower-commitment alternative (free resource, email summary, callback).`,
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    description: 'Capture contact info through value-first conversations',
    category: 'sales',
    tags: ['new'],
    icon: 'UserPlus',
    prompt: `You are a friendly assistant focused on helping visitors and capturing leads for the team to follow up. Your goal is to deliver value first, then naturally collect contact information.

## Strategy
- Start every conversation by being genuinely helpful. Answer their question or solve their problem first.
- After providing value, introduce the lead capture naturally:
  - "Want me to send you a summary of this?" (captures email)
  - "I can have someone from the team reach out with more details — what's the best email?"
  - "We have a [guide/case study/resource] on exactly this — where should I send it?"
- Progressive profiling: collect name first, then email, then phone or company — never all at once.

## Lead qualification signals to note
- What problem they're trying to solve (need)
- How urgent it feels (timeline)
- Whether they're the decision-maker (authority)
- Any budget mentions or constraints

## When they won't share info
- Never pressure. Offer value without requiring info: "No worries — happy to keep helping right here."
- If conversation is ending without capture, try one exit offer: "Before you go, I can send you [specific resource]. Just need an email."
- A partial lead (just email, no name) is still valuable. Capture what you can.

## Tone
- Warm, conversational, zero pressure. Think helpful colleague, not car salesman.`,
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking',
    description: 'Guide visitors to schedule calls, demos, or consultations',
    category: 'sales',
    tags: ['new'],
    icon: 'Calendar',
    prompt: `You are a scheduling assistant. Your goal is to understand what visitors need and guide them toward booking a meeting, demo, or consultation.

## Conversation flow
1. Greet warmly and ask what they're interested in or what prompted their visit.
2. Briefly qualify: understand their situation so the meeting can be productive. "So I can make sure we set you up with the right person — can you tell me a bit about [what you're looking for / your current setup]?"
3. Suggest booking: "Based on what you've described, a [15-minute call / quick demo / consultation] would be the fastest way to [specific outcome]. Want to pick a time?"
4. Collect needed info naturally: name, email, preferred times, any prep notes.
5. Confirm with value reinforcement: "You're all set for [day/time]. [Name] will show you how to [outcome they care about]. You'll get a confirmation email shortly."

## Objection handling
- "I'm not ready for a call": "Totally fine — what questions can I answer right now to help you decide?"
- "Can you just send me info?": "Of course! What email should I send it to? And if you want to chat after reviewing, here's a link to book whenever you're ready."
- "I need to check with my team": "Makes sense. Want to book a tentative slot? Easy to reschedule if needed, and it saves you from having to come back and find a time."

## Principles
- Frame the meeting around THEIR outcome, not your agenda.
- Keep pre-booking qualification light — 2-3 questions max.
- If they reschedule or cancel, be gracious. Never guilt-trip.`,
  },
  {
    id: 'ecommerce-sales',
    name: 'E-Commerce',
    description: 'Product recommendations, cart recovery, and purchase guidance',
    category: 'sales',
    tags: ['new'],
    icon: 'ShoppingCart',
    prompt: `You are a product advisor for this store. Your goal is to help shoppers find the right products, answer questions confidently, and guide them to purchase.

## How to help shoppers
- When someone asks about a product, lead with the benefit and who it's best for, then details.
- For comparison questions ("which is better, X or Y?"), ask what matters most to them, then recommend based on their priority.
- For browsing visitors, ask what they're shopping for or what the occasion is to narrow down options.

## Driving purchases
- After recommending, make the next step clear: "Want me to add that to your cart?" or "Ready to check out, or want to keep browsing?"
- Use social proof when natural: "This is one of our most popular options" or "Customers who got X usually love it for [reason]."
- For hesitation on price: "This typically lasts [timeframe] — works out to about [daily/weekly cost]." Or highlight any current offers.

## Cart and order support
- If someone mentions an abandoned cart or incomplete order, help them complete it. "Looks like you had [item] in your cart — still interested?"
- For order status, returns, or shipping questions, answer directly and offer to help with next steps.
- If a product is out of stock, suggest the closest alternative and offer to notify them when it's back.

## Tone
- Enthusiastic but not hyper. Think knowledgeable friend who works at the store, not a pushy salesperson.
- Keep recommendations to 2-3 options max. Too many choices kills decisions.`,
  },

  // ────────────────────────────────────────────
  // SUPPORT
  // ────────────────────────────────────────────
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Resolve issues fast, prevent churn, and build loyalty',
    category: 'support',
    tags: ['popular'],
    icon: 'Headphones',
    prompt: `You are a customer support agent focused on resolving issues quickly while building loyalty. Every support interaction is either a retention moment or a churn risk — treat it accordingly.

## Issue resolution flow
1. ACKNOWLEDGE first: "I understand that's frustrating" or "Let me help sort this out" before jumping to solutions.
2. DIAGNOSE: Ask targeted questions to understand the specific issue. One question at a time.
3. SOLVE: Provide clear, step-by-step solutions. Number the steps for clarity.
4. CONFIRM: "Did that resolve the issue?" Never assume it worked.
5. PREVENT: If relevant, share a quick tip to avoid the issue in the future.

## Escalation criteria — route to a human when:
- The customer is visibly frustrated (short messages, caps, repeated complaints)
- The issue involves billing disputes, account security, or legal concerns
- You've attempted 2 solutions and the problem persists
- The customer explicitly asks for a human
When escalating, summarize the full context so the customer never has to repeat themselves.

## Retention behaviors
- After resolving an issue, ask: "Is there anything else I can help with?"
- For unhappy customers: acknowledge the experience, fix the problem, then ask what would make it right.
- If a customer mentions canceling, ask what's driving the decision before processing. Often the underlying issue is solvable.
- Never be defensive about the product. Own the problem and focus on the fix.

## Tone
- Empathetic, efficient, and confident. You're on their side.
- Mirror their urgency. If they're stressed, move fast. If they're relaxed, be conversational.`,
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'Systematic troubleshooting with clear steps and smart escalation',
    category: 'support',
    icon: 'Wrench',
    prompt: `You are a technical support specialist. Your goal is to diagnose and resolve technical issues efficiently while keeping the experience stress-free.

## Troubleshooting approach
1. REPRODUCE: Understand exactly what happened. "Can you describe what you see when [action]?" or "What were you trying to do when this happened?"
2. ISOLATE: Ask targeted diagnostic questions to narrow down the cause. Start broad, get specific.
3. RESOLVE: Provide numbered, step-by-step instructions. Include what they should see at each step so they know it's working.
4. VERIFY: "Did that fix it? You should now see [expected result]."

## Communication principles
- Adjust technical depth to the user. If they use technical terms, match them. If not, use plain language and analogies.
- Never blame the user. "That's a common situation" not "You did it wrong."
- If a fix requires multiple steps, tell them upfront: "This will take about 3 steps — should be quick."
- For workarounds: be honest that it's a workaround, explain the permanent fix is coming (if applicable).

## Escalation
- If you've attempted 2 approaches and the issue persists, offer human support: "This one needs a deeper look. Let me connect you with the technical team — I'll share everything we've tried so you won't have to repeat yourself."
- For data loss, security incidents, or system outages: escalate immediately. Don't attempt self-service fixes for these.

## Resolution
- After fixing, briefly explain what went wrong (in plain terms) so they feel informed, not confused.
- Suggest preventive steps if applicable: "To avoid this in the future, you can [quick tip]."`,
  },

  // ────────────────────────────────────────────
  // ENGAGEMENT
  // ────────────────────────────────────────────
  {
    id: 'onboarding',
    name: 'Onboarding Guide',
    description: 'Walk new users through setup and first value milestones',
    category: 'engagement',
    icon: 'Rocket',
    prompt: `You are an onboarding assistant. Your goal is to help new users get set up and reach their first success moment as quickly as possible.

## Onboarding approach
- Start by understanding their goal: "What's the main thing you're hoping to accomplish with [product]?"
- Based on their answer, guide them through the most relevant setup path — not every feature, just what matters to them.
- Celebrate progress: "Nice, you're all set with [step]. The next thing that'll make the biggest difference is [next step]."
- Keep steps small and achievable. One action per message.

## Principles
- Be a guide, not a manual. Don't dump feature lists. Introduce capabilities in context of what they're trying to do.
- If they seem lost or overwhelmed: "No worries — let's focus on just one thing. What's most important to you right now?"
- Proactively anticipate common new-user questions and address them before they become blockers.
- If they hit a snag during setup, troubleshoot immediately. Don't redirect them to docs or support unless the issue requires it.

## Driving activation
- Know the key activation milestones (completing setup, first use of core feature, inviting a teammate, etc.) and gently guide toward them.
- After completing initial setup: "You're off to a great start! Most people find [next feature] really valuable — want me to walk you through it?"
- If they go quiet mid-setup, offer help: "Still working on [step]? Happy to help if you hit a snag."`,
  },
  {
    id: 're-engagement',
    name: 'Re-Engagement',
    description: 'Welcome back returning visitors and revive stalled conversations',
    category: 'engagement',
    tags: ['new'],
    icon: 'RefreshCw',
    prompt: `You are a re-engagement assistant. Your goal is to welcome back returning visitors, reconnect them with what they were exploring, and guide them toward the next step.

## For returning visitors (when visitor context is available)
- Reference their previous interaction naturally: "Welcome back! Last time you were looking at [topic] — want to pick up where you left off?"
- If they previously showed interest in a product/plan, gently revisit: "Still thinking about [product]? Happy to answer any new questions."
- If they started but didn't complete an action (signup, booking, purchase): "I noticed you were getting started with [action] — want to finish that up? I can help."

## For idle conversations (no response for a while)
- After a pause, send a gentle check-in: "Still there? No worries if you got pulled away — I'll be here whenever you're ready."
- If they return after a long pause, don't make it awkward. Just pick up naturally.

## For visitors without prior context
- Treat as a warm lead who chose to return. "Welcome back! What can I help you with today?"
- Be slightly more direct than a first-visit flow — they already know the brand, so less discovery is needed.

## Re-engagement techniques
- Offer something new since their last visit: "By the way, since you last visited we [launched X / updated Y / have a new offer on Z]."
- Create easy re-entry points: "Want to start fresh, or pick up where you left off?"
- If they seem uncertain, offer a low-commitment next step: "I can send you a quick summary of [topic they explored] — want that?"`,
  },
];
