/**
 * Chatbot API Helpers
 * Server-side functions for chatbot CRUD operations
 */

import { createClient } from '@/lib/supabase/server';
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
import { CHATBOT_PLAN_LIMITS } from './types';
import crypto from 'crypto';

// Type helper for Supabase queries on chatbot tables (not in auto-generated types yet)
type SupabaseAny = any;

// ============================================
// CHATBOT CRUD
// ============================================

export async function getChatbots(userId: string): Promise<Chatbot[]> {
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Chatbot[];
}

export async function getChatbotsWithStats(userId: string): Promise<ChatbotWithStats[]> {
  const supabase = await createClient() as SupabaseAny;

  const { data: chatbots, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!chatbots) return [];

  // Get stats for each chatbot
  const chatbotsWithStats = await Promise.all(
    (chatbots as Chatbot[]).map(async (chatbot: Chatbot) => {
      const { count: conversationCount } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbot.id);

      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('chatbot_id', chatbot.id);

      return {
        ...chatbot,
        total_conversations: conversationCount || 0,
        total_messages: messageCount || 0,
      };
    })
  );

  return chatbotsWithStats as ChatbotWithStats[];
}

export async function getChatbot(chatbotId: string): Promise<Chatbot | null> {
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('chatbots')
    .select('*')
    .eq('id', chatbotId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Chatbot;
}

export async function getChatbotBySlug(userId: string, slug: string): Promise<Chatbot | null> {
  const supabase = await createClient() as SupabaseAny;

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
  return data as Chatbot;
}

export async function createChatbot(chatbot: ChatbotInsert): Promise<Chatbot> {
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('chatbots')
    .insert(chatbot)
    .select()
    .single();

  if (error) throw error;
  return data as Chatbot;
}

export async function updateChatbot(chatbotId: string, updates: ChatbotUpdate): Promise<Chatbot> {
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('chatbots')
    .update(updates)
    .eq('id', chatbotId)
    .select()
    .single();

  if (error) throw error;
  return data as Chatbot;
}

export async function deleteChatbot(chatbotId: string): Promise<void> {
  const supabase = await createClient() as SupabaseAny;

  const { error } = await supabase
    .from('chatbots')
    .delete()
    .eq('id', chatbotId);

  if (error) throw error;
}

export async function publishChatbot(chatbotId: string): Promise<Chatbot> {
  return updateChatbot(chatbotId, {
    status: 'active',
    is_published: true,
  });
}

export async function unpublishChatbot(chatbotId: string): Promise<Chatbot> {
  return updateChatbot(chatbotId, {
    status: 'paused',
    is_published: false,
  });
}

// ============================================
// SLUG GENERATION
// ============================================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
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
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as KnowledgeSource[];
}

export async function getKnowledgeSource(sourceId: string): Promise<KnowledgeSource | null> {
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('knowledge_sources')
    .insert(source)
    .select()
    .single();

  if (error) throw error;
  return data as KnowledgeSource;
}

export async function updateKnowledgeSourceStatus(
  sourceId: string,
  status: KnowledgeSource['status'],
  errorMessage?: string,
  chunksCount?: number
): Promise<void> {
  const supabase = await createClient() as SupabaseAny;

  const updates: Record<string, unknown> = { status };
  if (errorMessage !== undefined) updates.error_message = errorMessage;
  if (chunksCount !== undefined) updates.chunks_count = chunksCount;

  const { error } = await supabase
    .from('knowledge_sources')
    .update(updates)
    .eq('id', sourceId);

  if (error) throw error;
}

export async function deleteKnowledgeSource(sourceId: string): Promise<void> {
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;
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
    conversations: (data || []) as Conversation[],
    total: count || 0,
  };
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;

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
    messages: (messages || []) as Message[],
  };
}

export async function getOrCreateConversation(
  chatbotId: string,
  sessionId: string,
  channel: Conversation['channel'] = 'widget',
  visitorId?: string,
  supabaseClient?: SupabaseAny
): Promise<Conversation> {
  const supabase = supabaseClient || await createClient() as SupabaseAny;

  // Try to find existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .eq('session_id', sessionId)
    .eq('status', 'active')
    .single();

  if (existing) return existing as Conversation;

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      chatbot_id: chatbotId,
      session_id: sessionId,
      channel,
      visitor_id: visitorId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
}

// ============================================
// MESSAGES
// ============================================

export async function getMessages(conversationId: string, supabaseClient?: SupabaseAny): Promise<Message[]> {
  const supabase = supabaseClient || await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Message[];
}

export async function createMessage(message: MessageInsert, supabaseClient?: SupabaseAny): Promise<Message> {
  const supabase = supabaseClient || await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;

  // Increment conversation message count (ignore errors - non-critical)
  try {
    await supabase.rpc('increment_conversation_messages', {
      p_conversation_id: message.conversation_id,
    });
  } catch (e) {
    console.warn('Failed to increment conversation messages:', e);
  }

  // Increment chatbot monthly message count (ignore errors - non-critical)
  try {
    await supabase.rpc('increment_chatbot_messages', {
      p_chatbot_id: message.chatbot_id,
    });
  } catch (e) {
    console.warn('Failed to increment chatbot messages:', e);
  }

  return data as Message;
}

export async function updateMessageFeedback(messageId: string, thumbsUp: boolean): Promise<void> {
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('chatbot_api_keys')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ChatbotAPIKey[];
}

export async function createChatbotAPIKey(
  chatbotId: string,
  userId: string,
  name: string
): Promise<ChatbotAPIKeyWithSecret> {
  const supabase = await createClient() as SupabaseAny;

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
    .insert(insert)
    .select()
    .single();

  if (error) throw error;

  return {
    ...(data as ChatbotAPIKey),
    key,
  };
}

export async function deleteChatbotAPIKey(keyId: string): Promise<void> {
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;

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
  const supabase = await createClient() as SupabaseAny;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('chatbot_analytics')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return (data || []) as ChatbotAnalytics[];
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
  const supabase = await createClient() as SupabaseAny;

  const { count, error } = await supabase
    .from('chatbots')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}

export async function checkChatbotLimit(userId: string, plan: string): Promise<boolean> {
  const limits = CHATBOT_PLAN_LIMITS[plan] || CHATBOT_PLAN_LIMITS.free;
  if (limits.chatbots === -1) return true;

  const count = await getChatbotCount(userId);
  return count < limits.chatbots;
}

export async function getKnowledgeSourceCount(chatbotId: string): Promise<number> {
  const supabase = await createClient() as SupabaseAny;

  const { count, error } = await supabase
    .from('knowledge_sources')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId);

  if (error) throw error;
  return count || 0;
}

export async function checkKnowledgeSourceLimit(chatbotId: string, plan: string): Promise<boolean> {
  const limits = CHATBOT_PLAN_LIMITS[plan] || CHATBOT_PLAN_LIMITS.free;
  if (limits.knowledgeSources === -1) return true;

  const count = await getKnowledgeSourceCount(chatbotId);
  return count < limits.knowledgeSources;
}
