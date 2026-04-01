/**
 * Telegram Handoff Service
 * Core logic for managing live handoff between chat widget and Telegram.
 * Each chatbot has its own Telegram bot config (multi-tenant).
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';
import { sendTelegramMessage, formatHandoffMessage, formatVisitorMessage } from './client';
import type { TelegramConfig, HandoffSession } from './types';
import { DEFAULT_TELEGRAM_CONFIG } from './types';
import { decryptTelegramConfig } from './crypto';
import { emitTypedWebhookEvent } from '@/lib/webhooks/emit';

/**
 * Get the Telegram config for a chatbot
 */
export async function getTelegramConfig(chatbotId: string): Promise<TelegramConfig> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('chatbots')
    .select('telegram_config')
    .eq('id', chatbotId)
    .single();

  if (!data?.telegram_config || typeof data.telegram_config !== 'object' || Array.isArray(data.telegram_config)) return DEFAULT_TELEGRAM_CONFIG;
  const merged = { ...DEFAULT_TELEGRAM_CONFIG, ...(data.telegram_config as Record<string, unknown>) } as unknown as Record<string, unknown>;
  return decryptTelegramConfig(merged) as unknown as TelegramConfig;
}

/**
 * Get the active handoff session for a conversation
 */
export async function getActiveHandoff(conversationId: string): Promise<HandoffSession | null> {
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();

  // Get chatbot + telegram config
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, telegram_config')
    .eq('id', params.chatbotId)
    .single();

  if (!chatbot) {
    return { success: false, error: 'Chatbot not found' };
  }

  const rawConfig = chatbot.telegram_config && typeof chatbot.telegram_config === 'object' && !Array.isArray(chatbot.telegram_config)
    ? chatbot.telegram_config as Record<string, unknown>
    : {};
  const config: TelegramConfig = decryptTelegramConfig({
    ...DEFAULT_TELEGRAM_CONFIG,
    ...rawConfig,
  } as unknown as Record<string, unknown>) as unknown as TelegramConfig;

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

  // Emit handoff.started webhook (need chatbot owner user_id)
  const { data: chatbotOwner } = await supabase
    .from('chatbots')
    .select('user_id')
    .eq('id', params.chatbotId)
    .single();

  if (chatbotOwner?.user_id) {
    emitTypedWebhookEvent(chatbotOwner.user_id, params.chatbotId, 'handoff.started', {
      conversation_id: params.conversationId,
      handoff_id: handoff.id,
      reason: params.reason,
      visitor: {
        name: params.visitorName,
        email: params.visitorEmail,
      },
    }).catch(() => {});
  }

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

  const supabase = createAdminClient();

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
  const supabase = createAdminClient();
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
    metadata: metadata as Json,
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
  const supabase = createAdminClient();

  // Get handoff details before resolving (for webhook)
  const { data: session } = await supabase
    .from('telegram_handoff_sessions')
    .select('id, chatbot_id, agent_name')
    .eq('conversation_id', conversationId)
    .in('status', ['pending', 'active'])
    .single();

  const resolvedAt = new Date().toISOString();

  const { error } = await supabase
    .from('telegram_handoff_sessions')
    .update({
      status: 'resolved',
      resolved_at: resolvedAt,
    })
    .eq('conversation_id', conversationId)
    .in('status', ['pending', 'active']);

  if (error) {
    console.error('[Handoff] Failed to resolve:', error);
    return false;
  }

  // Emit handoff.resolved webhook
  if (session) {
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', session.chatbot_id)
      .single();

    if (chatbot?.user_id) {
      emitTypedWebhookEvent(chatbot.user_id, session.chatbot_id, 'handoff.resolved', {
        conversation_id: conversationId,
        handoff_id: session.id,
        agent_name: session.agent_name,
        resolved_at: resolvedAt,
      }).catch(() => {});

      // Handoff resolution ends the conversation -- emit conversation.ended
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      const { data: convo } = await supabase
        .from('conversations')
        .select('session_id, created_at')
        .eq('id', conversationId)
        .single();

      if (convo) {
        const durationSeconds = convo.created_at
          ? Math.floor((Date.now() - new Date(convo.created_at).getTime()) / 1000)
          : 0;

        emitTypedWebhookEvent(chatbot.user_id, session.chatbot_id, 'conversation.ended', {
          conversation_id: conversationId,
          session_id: convo.session_id || '',
          message_count: count ?? 0,
          duration_seconds: durationSeconds,
        }).catch(() => {});
      }
    }
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
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('telegram_message_mappings')
    .select('chatbot_id, conversation_id')
    .eq('telegram_message_id', replyToMessageId)
    .single();

  if (!data) return null;
  return { chatbotId: data.chatbot_id, conversationId: data.conversation_id };
}

/**
 * Look up conversation by extracting conversation ID from message text
 */
export async function lookupConversationById(
  conversationId: string
): Promise<{ chatbotId: string; conversationId: string } | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('conversations')
    .select('id, chatbot_id')
    .eq('id', conversationId)
    .single();

  if (!data) return null;
  return { chatbotId: data.chatbot_id, conversationId: data.id };
}
