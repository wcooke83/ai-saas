/**
 * Chatbot API Helpers
 * Server-side functions for chatbot CRUD operations
 */

import { createClient as createServerClient } from '@/lib/supabase/server';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';
import type {
  Chatbot,
  ChatbotInsert,
  ChatbotUpdate,
  ChatbotWithStats,
  KnowledgeSource,
  KnowledgeSourceInsert,
  Conversation,
  ConversationWithMessages,
  Message,
  MessageInsert,
  ChatbotAPIKey,
  ChatbotAPIKeyInsert,
  ChatbotAPIKeyWithSecret,
  ChatbotAnalytics,
  ChatbotAnalyticsSummary,
} from './types';
import { getPlanLimits, FREE_PLAN_LIMITS } from './plan-limits';
import crypto from 'crypto';

// The SSR createServerClient generic signature differs from @supabase/supabase-js createClient,
// so we cast to the canonical TypedSupabaseClient to keep table/RPC inference working.
async function createClient(): Promise<TypedSupabaseClient> {
  return await createServerClient() as unknown as TypedSupabaseClient;
}

// DB-level insert/update types for tables where custom types have typed Json fields
type DbChatbotInsert = Database['public']['Tables']['chatbots']['Insert'];
type DbChatbotUpdate = Database['public']['Tables']['chatbots']['Update'];
type DbKnowledgeSourceInsert = Database['public']['Tables']['knowledge_sources']['Insert'];
type DbKnowledgeSourceUpdate = Database['public']['Tables']['knowledge_sources']['Update'];
type DbMessageInsert = Database['public']['Tables']['messages']['Insert'];
type DbApiKeyInsert = Database['public']['Tables']['chatbot_api_keys']['Insert'];

// ============================================
// CHATBOT CRUD
// ============================================

export async function getChatbots(userId: string): Promise<Chatbot[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Chatbot[];
}

export async function getChatbotsWithStats(userId: string): Promise<ChatbotWithStats[]> {
  const supabase = await createClient();

  const { data: chatbots, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!chatbots) return [];

  const chatbotIds = (chatbots as unknown as Chatbot[]).map((c: Chatbot) => c.id);

  // Agent presence is now handled client-side via Supabase Realtime Presence
  // on `agent-presence:${chatbotId}` channels — no DB query needed here.

  // Get conversation + message counts in a single RPC (2 scans instead of 2N queries)
  const statsMap: Record<string, { conversations: number; messages: number }> = {};
  // RPC defined in pending migration; cast to bypass type check until db:gen-types is re-run
  const { data: statsRows } = await (supabase.rpc as Function)('get_chatbot_stats', {
    p_chatbot_ids: chatbotIds,
  }) as { data: Array<{ chatbot_id: string; conversation_count: number; message_count: number }> | null };
  if (statsRows) {
    for (const row of statsRows) {
      statsMap[row.chatbot_id] = {
        conversations: Number(row.conversation_count) || 0,
        messages: Number(row.message_count) || 0,
      };
    }
  }

  return (chatbots as unknown as Chatbot[]).map((chatbot: Chatbot) => ({
    ...chatbot,
    total_conversations: statsMap[chatbot.id]?.conversations || 0,
    total_messages: statsMap[chatbot.id]?.messages || 0,
    agents_online: 0, // Updated client-side via Realtime Presence
  })) as unknown as ChatbotWithStats[];
}

export async function getChatbot(chatbotId: string): Promise<Chatbot | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', chatbotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Chatbot;
}

export async function getChatbotBySlug(userId: string, slug: string): Promise<Chatbot | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Chatbot;
}

export async function createChatbot(chatbot: ChatbotInsert): Promise<Chatbot> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .insert(chatbot as unknown as DbChatbotInsert)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Chatbot;
}

export async function updateChatbot(chatbotId: string, updates: ChatbotUpdate): Promise<Chatbot> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .update(updates as unknown as DbChatbotUpdate)
    .eq('id', chatbotId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Chatbot;
}

export async function deleteChatbot(chatbotId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('chatbots')
    .delete()
    .eq('id', chatbotId);

  if (error) throw error;
}

export async function publishChatbot(chatbotId: string, currentStatus?: string): Promise<Chatbot> {
  const updates: ChatbotUpdate = { is_published: true };
  // Transition out of draft on first publish, but don't touch status otherwise
  if (currentStatus === 'draft') {
    updates.status = 'active';
  }
  return updateChatbot(chatbotId, updates);
}

export async function unpublishChatbot(chatbotId: string): Promise<Chatbot> {
  return updateChatbot(chatbotId, {
    is_published: false,
  });
}

// ============================================
// SLUG GENERATION
// ============================================

export function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);

  // If the name was entirely special characters, fall back to a random slug
  if (!slug) {
    return `chatbot-${crypto.randomUUID().substring(0, 8)}`;
  }

  return slug;
}

export async function generateUniqueSlug(userId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await getChatbotBySlug(userId, slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================
// KNOWLEDGE SOURCES
// ============================================

export async function getKnowledgeSources(chatbotId: string): Promise<KnowledgeSource[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as KnowledgeSource[];
}

export async function getKnowledgeSource(sourceId: string): Promise<KnowledgeSource | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('id', sourceId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as KnowledgeSource;
}

export async function createKnowledgeSource(source: KnowledgeSourceInsert): Promise<KnowledgeSource> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('knowledge_sources')
    .insert(source as unknown as DbKnowledgeSourceInsert)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as KnowledgeSource;
}

export async function updateKnowledgeSourceStatus(
  sourceId: string,
  status: KnowledgeSource['status'],
  errorMessage?: string,
  chunksCount?: number
): Promise<void> {
  const supabase = await createClient();

  const updates: Record<string, unknown> = { status };
  if (errorMessage !== undefined) updates.error_message = errorMessage;
  if (chunksCount !== undefined) updates.chunks_count = chunksCount;

  const { error } = await supabase
    .from('knowledge_sources')
    .update(updates as unknown as DbKnowledgeSourceUpdate)
    .eq('id', sourceId);

  if (error) throw error;
}

export async function updateKnowledgeSource(
  sourceId: string,
  updates: Record<string, unknown>
): Promise<KnowledgeSource> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('knowledge_sources')
    .update(updates as unknown as DbKnowledgeSourceUpdate)
    .eq('id', sourceId)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as KnowledgeSource;
}

export async function deleteKnowledgeSource(sourceId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('knowledge_sources')
    .delete()
    .eq('id', sourceId);

  if (error) throw error;
}

// ============================================
// CONVERSATIONS
// ============================================

export async function getConversations(
  chatbotId: string,
  options: {
    limit?: number;
    offset?: number;
    status?: Conversation['status'];
    channel?: Conversation['channel'];
  } = {}
): Promise<{ conversations: Conversation[]; total: number }> {
  const supabase = await createClient();
  const { limit = 20, offset = 0, status, channel } = options;

  let query = supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (channel) query = query.eq('channel', channel);

  const { data, error, count } = await query;

  if (error) throw error;
  return {
    conversations: (data || []) as unknown as Conversation[],
    total: count || 0,
  };
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Conversation;
}

export async function getConversationWithMessages(conversationId: string): Promise<ConversationWithMessages | null> {
  const supabase = await createClient();

  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError) {
    if (convError.code === 'PGRST116') return null;
    throw convError;
  }

  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgError) throw msgError;

  return {
    ...(conversation as Conversation),
    messages: (messages || []) as unknown as Message[],
  };
}

export async function getOrCreateConversation(
  chatbotId: string,
  sessionId: string,
  channel: Conversation['channel'] = 'widget',
  visitorId?: string,
  supabaseClient?: TypedSupabaseClient
): Promise<Conversation> {
  const supabase = supabaseClient || await createClient();

  // Single DB round trip via RPC
  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    p_chatbot_id: chatbotId,
    p_session_id: sessionId,
    p_channel: channel as string,
    p_visitor_id: visitorId,
  });

  if (error) throw error;
  return data as unknown as Conversation;
}

// ============================================
// MESSAGES
// ============================================

export async function getMessages(conversationId: string, supabaseClient?: TypedSupabaseClient, columns: string = 'id, role, content, created_at'): Promise<Message[]> {
  const supabase = supabaseClient || await createClient();

  const { data, error } = await supabase
    .from('messages')
    .select(columns)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  // Reverse to chronological order (fetched newest-first so LIMIT keeps the latest 50)
  return ((data || []) as unknown as Message[]).reverse();
}

export async function createMessage(message: MessageInsert, supabaseClient?: TypedSupabaseClient): Promise<Message> {
  const supabase = supabaseClient || await createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert(message as unknown as DbMessageInsert)
    .select()
    .single();

  if (error) throw error;

  // Increment conversation counter (chatbot counter is now handled atomically in the chat route)
  void Promise.resolve(supabase.rpc('increment_conversation_messages', {
    p_conversation_id: message.conversation_id,
  })).then(({ error }: { error: any }) => { if (error) console.warn('Failed to increment conversation messages:', error); })
    .catch(() => { /* fire-and-forget */ });

  return data as unknown as Message;
}

export async function updateMessageFeedback(messageId: string, thumbsUp: boolean): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('messages')
    .update({ thumbs_up: thumbsUp })
    .eq('id', messageId);

  if (error) throw error;
}

// ============================================
// CHATBOT API KEYS
// ============================================

export async function getChatbotAPIKeys(chatbotId: string): Promise<ChatbotAPIKey[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('chatbot_api_keys')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as ChatbotAPIKey[];
}

export async function createChatbotAPIKey(
  chatbotId: string,
  userId: string,
  name: string
): Promise<ChatbotAPIKeyWithSecret> {
  const supabase = await createClient();

  // Generate a secure API key
  const key = `cb_${crypto.randomBytes(24).toString('base64url')}`;
  const keyPrefix = key.substring(0, 12);
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  const insert: ChatbotAPIKeyInsert = {
    chatbot_id: chatbotId,
    user_id: userId,
    name,
    key_prefix: keyPrefix,
    key_hash: keyHash,
  };

  const { data, error } = await supabase
    .from('chatbot_api_keys')
    .insert(insert as unknown as DbApiKeyInsert)
    .select()
    .single();

  if (error) throw error;

  return {
    ...(data as unknown as ChatbotAPIKey),
    key,
  };
}

export async function deleteChatbotAPIKey(keyId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('chatbot_api_keys')
    .delete()
    .eq('id', keyId);

  if (error) throw error;
}

interface APIKeyValidation {
  chatbot_id: string;
  user_id: string;
  expires_at: string | null;
  is_active: boolean;
}

export async function validateChatbotAPIKey(key: string): Promise<{ chatbotId: string; userId: string } | null> {
  const supabase = await createClient();

  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  const { data, error } = await supabase
    .from('chatbot_api_keys')
    .select('chatbot_id, user_id, expires_at, is_active')
    .eq('key_hash', keyHash)
    .single();

  if (error || !data) return null;

  const keyData = data as APIKeyValidation;
  if (!keyData.is_active) return null;
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) return null;

  // Update last used
  await supabase
    .from('chatbot_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', keyHash);

  return {
    chatbotId: keyData.chatbot_id,
    userId: keyData.user_id,
  };
}

// ============================================
// ANALYTICS
// ============================================

export async function getChatbotAnalytics(
  chatbotId: string,
  days: number = 30
): Promise<ChatbotAnalytics[]> {
  const supabase = await createClient();

  // Aggregate latest data before fetching (runs the DB function that
  // rolls up chat_sessions / chat_messages into chatbot_analytics).
  const { createClient: createAdmin } = await import('@/lib/supabase/admin');
  const admin = createAdmin();
  const today = new Date().toISOString().split('T')[0];
  try { await admin.rpc('aggregate_chatbot_analytics', { p_date: today }); } catch { /* ignore */ }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('chatbot_analytics')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as ChatbotAnalytics[];
}

export async function getChatbotAnalyticsSummary(
  chatbotId: string,
  days: number = 30
): Promise<ChatbotAnalyticsSummary> {
  const analytics = await getChatbotAnalytics(chatbotId, days);

  const totals = analytics.reduce(
    (acc, day) => ({
      conversations: acc.conversations + day.conversations_count,
      messages: acc.messages + day.messages_count,
      visitors: acc.visitors + day.unique_visitors,
      thumbsUp: acc.thumbsUp + day.thumbs_up_count,
      thumbsDown: acc.thumbsDown + day.thumbs_down_count,
    }),
    { conversations: 0, messages: 0, visitors: 0, thumbsUp: 0, thumbsDown: 0 }
  );

  const totalFeedback = totals.thumbsUp + totals.thumbsDown;

  return {
    total_conversations: totals.conversations,
    total_messages: totals.messages,
    unique_visitors: totals.visitors,
    avg_messages_per_conversation: totals.conversations > 0
      ? Math.round((totals.messages / totals.conversations) * 10) / 10
      : 0,
    satisfaction_rate: totalFeedback > 0
      ? Math.round((totals.thumbsUp / totalFeedback) * 100)
      : 0,
    daily_data: analytics.map((day) => ({
      date: day.date,
      conversations: day.conversations_count,
      messages: day.messages_count,
    })),
  };
}

// ============================================
// PLAN LIMITS
// ============================================

export async function getChatbotCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('chatbots')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}

export async function checkChatbotLimit(userId: string, plan: string): Promise<boolean> {
  const limits = await getPlanLimits(plan).catch(() => FREE_PLAN_LIMITS);
  if (limits.chatbots === -1) return true;

  const count = await getChatbotCount(userId);
  return count < limits.chatbots;
}

export async function getKnowledgeSourceCount(chatbotId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('knowledge_sources')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId);

  if (error) throw error;
  return count || 0;
}

export async function checkKnowledgeSourceLimit(chatbotId: string, plan: string): Promise<boolean> {
  const limits = await getPlanLimits(plan).catch(() => FREE_PLAN_LIMITS);
  if (limits.knowledgeSources === -1) return true;

  const count = await getKnowledgeSourceCount(chatbotId);
  return count < limits.knowledgeSources;
}

// ============================================
// OWNERSHIP CHECK
// ============================================

export async function checkChatbotOwnership(
  chatbotId: string,
  userId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<boolean> {
  const supabase = supabaseClient || await createClient();

  const { data, error } = await supabase
    .from('chatbots')
    .select('id')
    .eq('id', chatbotId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }
  return true;
}

// ============================================
// LEADS
// ============================================

export async function getLeadBySession(
  chatbotId: string,
  sessionId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<{ id: string; form_data: Record<string, string> } | null> {
  const supabase = supabaseClient || await createClient();

  const { data, error } = await supabase
    .from('chatbot_leads')
    .select('id, form_data')
    .eq('chatbot_id', chatbotId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as { id: string; form_data: Record<string, string> };
}
