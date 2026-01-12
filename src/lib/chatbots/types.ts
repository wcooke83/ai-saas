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

  // Typography
  fontFamily: string;
  fontSize: number;

  // Branding
  showBranding: boolean;
  headerText: string;

  // Behavior
  autoOpen: boolean;
  autoOpenDelay: number;
  soundEnabled: boolean;

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
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  showBranding: true,
  headerText: 'Chat with us',
  autoOpen: false,
  autoOpenDelay: 3000,
  soundEnabled: false,
  customCss: '',
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

  // Widget Configuration
  widget_config: WidgetConfig;

  // Branding
  logo_url: string | null;
  welcome_message: string;
  placeholder_text: string;

  // Status
  status: ChatbotStatus;
  is_published: boolean;

  // Limits
  monthly_message_limit: number;
  messages_this_month: number;

  // Billing
  pricing_type: ChatbotPricingType;
  stripe_product_id: string | null;

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
  widget_config?: WidgetConfig;
  logo_url?: string | null;
  welcome_message?: string;
  placeholder_text?: string;
  status?: ChatbotStatus;
  is_published?: boolean;
  monthly_message_limit?: number;
  pricing_type?: ChatbotPricingType;
}

export interface ChatbotUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  widget_config?: WidgetConfig;
  logo_url?: string | null;
  welcome_message?: string;
  placeholder_text?: string;
  status?: ChatbotStatus;
  is_published?: boolean;
  monthly_message_limit?: number;
  pricing_type?: ChatbotPricingType;
}

// Chatbot with stats for list view
export interface ChatbotWithStats extends Chatbot {
  total_conversations?: number;
  total_messages?: number;
  avg_rating?: number;
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

export interface Conversation {
  id: string;
  chatbot_id: string;
  session_id: string;
  channel: ConversationChannel;
  visitor_id: string | null;
  visitor_metadata: Json;
  status: ConversationStatus;
  message_count: number;
  first_message_at: string | null;
  last_message_at: string | null;
  rating: number | null;
  feedback_text: string | null;
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
  widget_config?: Partial<WidgetConfig>;
  welcome_message?: string;
}

export interface UpdateChatbotRequest {
  name?: string;
  description?: string;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  widget_config?: Partial<WidgetConfig>;
  logo_url?: string;
  welcome_message?: string;
  placeholder_text?: string;
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
- Use the provided context to answer questions when available`,
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
- Use the knowledge base to provide accurate information`,
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
- Guide customers toward solutions that fit their needs`,
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
- Know when to escalate to human support`,
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
- Suggest related questions the user might find helpful`,
  },
];
