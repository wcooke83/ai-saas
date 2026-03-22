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
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  enabled: false,
  auto_handoff_on_escalation: true,
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

  // CORS / Security
  allowed_origins: string[] | null;

  // RAG Live Fetch
  live_fetch_threshold: number;

  // Timestamps for tracking text/language updates
  custom_text_updated_at: string | null;
  language_updated_at: string | null;

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
  allowed_origins?: string[] | null;
  custom_text_updated_at?: string | null;
  language_updated_at?: string | null;
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
  allowed_origins?: string[] | null;
  live_fetch_threshold?: number;
  custom_text_updated_at?: string | null;
  language_updated_at?: string | null;
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

export type ConversationChannel = 'widget' | 'api' | 'slack';
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
  apiAccess: boolean;
}

export const CHATBOT_PLAN_LIMITS: Record<string, ChatbotPlanLimits> = {
  free: {
    chatbots: 1,
    messagesPerMonth: 100,
    knowledgeSources: 3,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    customBranding: false,
    slackIntegration: false,
    apiAccess: false,
  },
  pro: {
    chatbots: 10,
    messagesPerMonth: 10000,
    knowledgeSources: 50,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    customBranding: true,
    slackIntegration: true,
    apiAccess: true,
  },
  agency: {
    chatbots: -1,
    messagesPerMonth: -1,
    knowledgeSources: -1,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    customBranding: true,
    slackIntegration: true,
    apiAccess: true,
  },
};

// ============================================
// SYSTEM PROMPT TEMPLATES
// ============================================

export interface SystemPromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export const SYSTEM_PROMPT_TEMPLATES: SystemPromptTemplate[] = [
  {
    id: 'helpful-assistant',
    name: 'Helpful Assistant',
    description: 'General-purpose helpful AI assistant',
    prompt: `You are a helpful AI assistant. Your goal is to provide accurate, relevant, and helpful responses to user questions.

Guidelines:
- Be friendly and professional
- If you don't know something, say so honestly
- Provide clear and concise answers
- Ask clarifying questions when needed
- Use the provided context to answer questions when available

Note: Security rules to prevent prompt injection will be automatically added if enabled.`,
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Professional customer support agent',
    prompt: `You are a professional customer support agent. Your role is to help customers with their questions and issues.

Guidelines:
- Be empathetic and patient
- Acknowledge the customer's concerns
- Provide step-by-step solutions when applicable
- Escalate complex issues appropriately
- Always maintain a professional and friendly tone
- Use the knowledge base to provide accurate information

Note: Security rules to prevent prompt injection will be automatically added if enabled.`,
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Helpful sales and product assistant',
    prompt: `You are a knowledgeable sales assistant. Help customers understand products and make informed purchasing decisions.

Guidelines:
- Be helpful without being pushy
- Focus on understanding customer needs
- Highlight relevant product features and benefits
- Answer questions about pricing, features, and availability
- Guide customers toward solutions that fit their needs

Note: Security rules to prevent prompt injection will be automatically added if enabled.`,
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'Technical support specialist',
    prompt: `You are a technical support specialist. Help users troubleshoot issues and understand technical concepts.

Guidelines:
- Ask diagnostic questions to understand the problem
- Provide clear, step-by-step troubleshooting instructions
- Explain technical concepts in accessible language
- Document common issues and solutions
- Know when to escalate to human support

Note: Security rules to prevent prompt injection will be automatically added if enabled.`,
  },
  {
    id: 'faq-bot',
    name: 'FAQ Bot',
    description: 'Answer frequently asked questions',
    prompt: `You are an FAQ assistant. Your primary role is to answer frequently asked questions using the provided knowledge base.

Guidelines:
- Answer questions based on the provided context
- If a question isn't in the knowledge base, politely say you don't have that information
- Keep answers concise and to the point
- Provide links or references when available
- Suggest related questions the user might find helpful

Note: Security rules to prevent prompt injection will be automatically added if enabled.`,
  },
];
