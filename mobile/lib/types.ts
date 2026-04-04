export interface Chatbot {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused' | string;
  slug: string;
  is_published: boolean | null;
  welcome_message: string | null;
  placeholder_text: string | null;
  language: string | null;
  system_prompt: string | null;
  model: string | null;
  temperature: number | null;
  max_tokens: number | null;
  memory_enabled: boolean | null;
  memory_days: number | null;
  enable_prompt_protection: boolean | null;
  created_at: string | null;
}

export interface ChatbotUpdatePayload {
  name?: string;
  description?: string;
  status?: 'draft' | 'active' | 'paused';
  welcome_message?: string;
  placeholder_text?: string;
  language?: string;
  system_prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  memory_enabled?: boolean;
  memory_days?: number;
  enable_prompt_protection?: boolean;
}

export interface KnowledgeSource {
  id: string;
  chatbot_id: string;
  name: string;
  type: 'url' | 'text' | 'qa_pair' | 'pdf' | 'docx' | string;
  status: 'processing' | 'ready' | 'error' | 'pending' | string | null;
  is_priority: boolean | null;
  chunk_count: number | null;
  error_message: string | null;
  created_at: string | null;
}

export type AddSourcePayload =
  | { type: 'url'; url: string; name?: string; crawl?: boolean; maxPages?: number }
  | { type: 'text'; content: string; name?: string }
  | { type: 'qa_pair'; question: string; answer: string };

export interface AssignmentWithChatbot {
  id: string;
  chatbot_id: string;
  chatbot_name: string;
  chatbot_description: string | null;
  chatbot_status: string;
  can_handle_conversations: true;
  can_modify_settings: boolean;
  can_manage_knowledge: boolean;
  can_view_analytics: boolean;
}

export interface AnalyticsSummary {
  total_conversations: number;
  total_messages: number;
  unique_visitors: number;
  avg_messages_per_conversation: number;
  satisfaction_rate: number | null;
  daily_data: Array<{ date: string; conversations: number; messages: number }>;
}
