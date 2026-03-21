/**
 * Telegram Handoff Service
 * Core logic for managing live handoff between chat widget and Telegram.
 * Each chatbot has its own Telegram bot config (multi-tenant).
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramMessage, formatHandoffMessage, formatVisitorMessage } from './client';
import type { TelegramConfig, HandoffSession } from './types';
import { DEFAULT_TELEGRAM_CONFIG } from './types';

/**
 * Get the Telegram config for a chatbot
 */
export async function getTelegramConfig(chatbotId: string): Promise<TelegramConfig> {
  const supabase = createAdminClient() as any;
  const { data } = await supabase
    .from('chatbots')
    .select('telegram_config')
    .eq('id', chatbotId)
    .single();

  if (!data?.telegram_config) return DEFAULT_TELEGRAM_CONFIG;
  return { ...DEFAULT_TELEGRAM_CONFIG, ...data.telegram_config };
}

/**
 * Get the active handoff session for a conversation
 */
export async function getActiveHandoff(conversationId: string): Promise<HandoffSession | null> {
  const supabase = createAdminClient() as any;
  const { data } = await supabase
    .from('telegram_handoff_sessions')
    .select('*')
    .eq('conversation_id', conversationId)
    .in('status', ['pending', 'active'])
    .single();

  return data || null;
}

/**
 * Initiate a live handoff to Telegram
 * Called when a user escalates or requests human help
 */
export async function initiateHandoff(params: {
  chatbotId: string;
  conversationId: string;
  sessionId: string;
  reason: string;
  details?: string;
  escalationId?: string;
  visitorName?: string;
  visitorEmail?: string;
  pageUrl?: string;
}): Promise<{ success: boolean; handoffId?: string; error?: string }> {
  const supabase = createAdminClient() as any;

  // Get chatbot + telegram config
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, telegram_config')
    .eq('id', params.chatbotId)
    .single();

  if (!chatbot) {
    return { success: false, error: 'Chatbot not found' };
  }

  const config: TelegramConfig = {
    ...DEFAULT_TELEGRAM_CONFIG,
    ...(chatbot.telegram_config || {}),
  };

  if (!config.enabled || !config.bot_token || !config.chat_id) {
    return { success: false, error: 'Telegram handoff not configured' };
  }

  // Check for existing active handoff
  const existing = await getActiveHandoff(params.conversationId);
  if (existing) {
    return { success: true, handoffId: existing.id };
  }

  // Get recent messages for context
  const { data: messages } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', params.conversationId)
    .order('created_at', { ascending: false })
    .limit(10);

  const recentMessages = (messages || []).reverse();

  // Send handoff notification to Telegram
  const messageText = formatHandoffMessage(
    params.conversationId,
    chatbot.name,
    params.visitorName || 'Visitor',
    params.reason,
    recentMessages,
    {
      visitorEmail: params.visitorEmail,
      pageUrl: params.pageUrl,
      details: params.details,
    }
  );

  const telegramMsg = await sendTelegramMessage(config, messageText, {
    parseMode: 'Markdown',
  });

  if (!telegramMsg) {
    return { success: false, error: 'Failed to send Telegram notification' };
  }

  // Store telegram message mapping for threading
  await supabase.from('telegram_message_mappings').upsert(
    {
      chatbot_id: params.chatbotId,
      conversation_id: params.conversationId,
      telegram_message_id: telegramMsg.message_id,
      telegram_chat_id: parseInt(config.chat_id!),
    },
    { onConflict: 'conversation_id' }
  );

  // Create handoff session
  const { data: handoff, error } = await supabase
    .from('telegram_handoff_sessions')
    .insert({
      chatbot_id: params.chatbotId,
      conversation_id: params.conversationId,
      session_id: params.sessionId,
      status: 'pending',
      escalation_id: params.escalationId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[Handoff] Failed to create session:', error);
    return { success: false, error: 'Failed to create handoff session' };
  }

  console.log('[Handoff] Initiated:', {
    handoffId: handoff.id,
    conversationId: params.conversationId,
    telegramMessageId: telegramMsg.message_id,
  });

  return { success: true, handoffId: handoff.id };
}

/**
 * Forward a visitor message to Telegram during active handoff
 */
export async function forwardVisitorMessage(params: {
  chatbotId: string;
  conversationId: string;
  visitorName: string;
  content: string;
}): Promise<boolean> {
  const config = await getTelegramConfig(params.chatbotId);
  if (!config.enabled || !config.bot_token) return false;

  const supabase = createAdminClient() as any;

  // Get the telegram thread message ID
  const { data: mapping } = await supabase
    .from('telegram_message_mappings')
    .select('telegram_message_id')
    .eq('conversation_id', params.conversationId)
    .single();

  const messageText = formatVisitorMessage(params.visitorName, params.content);

  const result = await sendTelegramMessage(config, messageText, {
    replyToMessageId: mapping?.telegram_message_id || undefined,
    parseMode: 'Markdown',
  });

  return result !== null;
}

/**
 * Handle an agent reply — save it as a chat message
 * Supports both Telegram and platform (agent console) sources.
 * When a platform agent replies and Telegram is configured, forwards to Telegram too.
 */
export async function handleAgentReply(params: {
  chatbotId: string;
  conversationId: string;
  agentName: string;
  agentTelegramId?: number;
  agentUserId?: string;
  content: string;
  source?: 'telegram' | 'platform';
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient() as any;
  const source = params.source || 'telegram';

  // Update handoff session to active if pending
  const sessionUpdate: Record<string, unknown> = {
    status: 'active',
    agent_name: params.agentName,
    agent_source: source,
  };
  if (params.agentTelegramId) sessionUpdate.agent_telegram_id = params.agentTelegramId;
  if (params.agentUserId) sessionUpdate.agent_user_id = params.agentUserId;

  await supabase
    .from('telegram_handoff_sessions')
    .update(sessionUpdate)
    .eq('conversation_id', params.conversationId)
    .in('status', ['pending', 'active']);

  // Save the agent's message to the conversation
  const metadata: Record<string, unknown> = {
    is_human_agent: true,
    agent_name: params.agentName,
    source,
  };
  if (params.agentTelegramId) metadata.agent_telegram_id = params.agentTelegramId;
  if (params.agentUserId) metadata.agent_user_id = params.agentUserId;

  const { error } = await supabase.from('messages').insert({
    conversation_id: params.conversationId,
    chatbot_id: params.chatbotId,
    role: 'assistant',
    content: params.content,
    metadata,
  });

  if (error) {
    console.error('[Handoff] Failed to save agent message:', error);
    return { success: false, error: 'Failed to save message' };
  }

  // If platform agent replied and Telegram is configured, forward to Telegram thread
  if (source === 'platform') {
    try {
      const config = await getTelegramConfig(params.chatbotId);
      if (config.enabled && config.bot_token) {
        const { data: mapping } = await supabase
          .from('telegram_message_mappings')
          .select('telegram_message_id')
          .eq('conversation_id', params.conversationId)
          .single();

        if (mapping) {
          await sendTelegramMessage(config, `*${params.agentName}* (platform):\n${params.content}`, {
            replyToMessageId: mapping.telegram_message_id,
            parseMode: 'Markdown',
          });
        }
      }
    } catch (err) {
      // Non-critical — log but don't fail the reply
      console.warn('[Handoff] Failed to forward platform reply to Telegram:', err);
    }
  }

  console.log('[Handoff] Agent reply saved:', {
    conversationId: params.conversationId,
    agentName: params.agentName,
    source,
  });

  return { success: true };
}

/**
 * Resolve a handoff session (agent marks conversation as complete)
 */
export async function resolveHandoff(conversationId: string): Promise<boolean> {
  const supabase = createAdminClient() as any;

  const { error } = await supabase
    .from('telegram_handoff_sessions')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('conversation_id', conversationId)
    .in('status', ['pending', 'active']);

  if (error) {
    console.error('[Handoff] Failed to resolve:', error);
    return false;
  }

  return true;
}

/**
 * Look up which chatbot + conversation a Telegram message belongs to
 * by checking the telegram_message_mappings table
 */
export async function lookupConversationFromTelegram(
  telegramChatId: number,
  replyToMessageId: number
): Promise<{ chatbotId: string; conversationId: string } | null> {
  const supabase = createAdminClient() as any;

  const { data } = await supabase
    .from('telegram_message_mappings')
    .select('chatbot_id, conversation_id')
    .eq('telegram_message_id', replyToMessageId)
    .single();

  return data || null;
}

/**
 * Look up conversation by extracting conversation ID from message text
 */
export async function lookupConversationById(
  conversationId: string
): Promise<{ chatbotId: string; conversationId: string } | null> {
  const supabase = createAdminClient() as any;

  const { data } = await supabase
    .from('conversations')
    .select('id, chatbot_id')
    .eq('id', conversationId)
    .single();

  if (!data) return null;
  return { chatbotId: data.chatbot_id, conversationId: data.id };
}
