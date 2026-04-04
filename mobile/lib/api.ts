import { supabase } from './supabase';
import type {
  AssignmentWithChatbot,
  Chatbot,
  ChatbotUpdatePayload,
  KnowledgeSource,
  AddSourcePayload,
  AnalyticsSummary,
} from './types';

export type HandoffStatus = 'pending' | 'active' | 'resolved';

export interface AgentConversation {
  handoff_id: string;
  conversation_id: string;
  handoff_status: HandoffStatus;
  agent_name: string | null;
  agent_source: string | null;
  handoff_created_at: string;
  resolved_at: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  message_count: number;
  last_message_at: string | null;
  last_message: {
    content: string;
    role: string;
    is_agent: boolean;
    created_at: string;
  } | null;
  language: string | null;
  escalation_reason: string | null;
  escalation_details: string | null;
}

export interface AgentMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ConversationStats {
  pending: number;
  active: number;
  resolved: number;
}

export interface ConversationsResponse {
  conversations: AgentConversation[];
  stats: ConversationStats;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://vocui.com';

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getAgentConversations(
  chatbotId: string,
  status?: HandoffStatus,
  limit = 50,
  offset = 0,
): Promise<ConversationsResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.set('status', status);
  const result = await apiFetch<{ success: boolean; data: ConversationsResponse }>(
    `/api/widget/${chatbotId}/agent-conversations?${params}`,
  );
  return result.data;
}

export async function getConversationMessages(
  chatbotId: string,
  conversationId: string,
): Promise<AgentMessage[]> {
  const result = await apiFetch<{ success: boolean; data: { messages: AgentMessage[] } }>(
    `/api/chatbots/${chatbotId}/conversations?conversationId=${conversationId}`,
  );
  return result.data.messages ?? [];
}

export async function sendAgentReply(
  chatbotId: string,
  conversationId: string,
  content: string,
  agentName: string,
): Promise<void> {
  await apiFetch(`/api/widget/${chatbotId}/agent-reply`, {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, content, agent_name: agentName }),
  });
}

export async function sendAgentAction(
  chatbotId: string,
  conversationId: string,
  action: 'take_over' | 'resolve' | 'return_to_ai',
  agentName: string,
): Promise<void> {
  await apiFetch(`/api/widget/${chatbotId}/agent-actions`, {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, action, agent_name: agentName }),
  });
}

export async function registerPushToken(token: string, platform: string): Promise<void> {
  await apiFetch('/api/mobile/device-tokens', {
    method: 'POST',
    body: JSON.stringify({ token, platform }),
  });
}

export async function deregisterPushToken(token: string): Promise<void> {
  await apiFetch('/api/mobile/device-tokens', {
    method: 'DELETE',
    body: JSON.stringify({ token }),
  });
}

export async function getMyAssignments(): Promise<{ assignments: AssignmentWithChatbot[] }> {
  return apiFetch<{ assignments: AssignmentWithChatbot[] }>('/api/agent/assignments');
}

// ── Settings ────────────────────────────────────────────────────────────────

export async function getChatbot(chatbotId: string): Promise<Chatbot> {
  const result = await apiFetch<{ chatbot: Chatbot }>(`/api/chatbots/${chatbotId}`);
  return result.chatbot;
}

export async function updateChatbot(
  chatbotId: string,
  fields: Partial<ChatbotUpdatePayload>,
): Promise<Chatbot> {
  const result = await apiFetch<{ chatbot: Chatbot }>(`/api/chatbots/${chatbotId}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
  return result.chatbot;
}

// ── Knowledge ────────────────────────────────────────────────────────────────

export async function getKnowledgeSources(
  chatbotId: string,
): Promise<{ sources: KnowledgeSource[] }> {
  return apiFetch<{ sources: KnowledgeSource[] }>(`/api/chatbots/${chatbotId}/knowledge`);
}

export async function addKnowledgeSource(
  chatbotId: string,
  payload: AddSourcePayload,
): Promise<{ source: KnowledgeSource }> {
  return apiFetch<{ source: KnowledgeSource }>(`/api/chatbots/${chatbotId}/knowledge`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateKnowledgeSource(
  chatbotId: string,
  sourceId: string,
  fields: { is_priority?: boolean; action?: 'reprocess' },
): Promise<KnowledgeSource> {
  const result = await apiFetch<{ source: KnowledgeSource }>(
    `/api/chatbots/${chatbotId}/knowledge/${sourceId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(fields),
    },
  );
  return result.source;
}

export async function deleteKnowledgeSource(
  chatbotId: string,
  sourceId: string,
): Promise<void> {
  await apiFetch(`/api/chatbots/${chatbotId}/knowledge/${sourceId}`, {
    method: 'DELETE',
  });
}

// ── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(
  chatbotId: string,
  days = 30,
): Promise<AnalyticsSummary> {
  return apiFetch<AnalyticsSummary>(
    `/api/chatbots/${chatbotId}/analytics?days=${days}`,
  );
}
