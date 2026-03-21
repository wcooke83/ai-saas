/**
 * Telegram Bot Commands
 * Handles bot commands from agents replying in Telegram.
 * Simplified for multi-tenant: each chatbot has its own bot, so commands
 * are scoped to the chatbot the bot belongs to.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramMessage } from './client';
import { resolveHandoff } from './handoff';
import type { TelegramConfig, TelegramMessage } from './types';

export interface CommandResult {
  success: boolean;
  message: string;
}

/**
 * Check if text is a bot command
 */
export function isBotCommand(text: string): boolean {
  return text.trim().startsWith('/');
}

/**
 * Handle a bot command
 */
export async function handleBotCommand(
  config: TelegramConfig,
  chatbotId: string,
  message: TelegramMessage
): Promise<CommandResult> {
  if (!message.text || !message.from) {
    return { success: false, message: 'Invalid command message' };
  }

  const text = message.text.trim();
  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const telegramUserId = message.from.id;
  const telegramUsername = message.from.username || null;

  let result: CommandResult;

  switch (command) {
    case '/start':
    case '/help':
      result = handleHelp();
      break;
    case '/resolve':
      result = await handleResolve(chatbotId, message, args);
      break;
    case '/active':
      result = await handleActive(chatbotId);
      break;
    default:
      result = {
        success: false,
        message: `Unknown command: ${command}. Use /help to see available commands.`,
      };
  }

  // Log command
  const supabase = createAdminClient() as any;
  await supabase.from('telegram_command_log').insert({
    chatbot_id: chatbotId,
    telegram_user_id: telegramUserId,
    telegram_username: telegramUsername,
    command,
    arguments: args,
    success: result.success,
    error_message: result.success ? null : result.message,
  });

  // Send response
  await sendTelegramMessage(config, result.message, {
    replyToMessageId: message.message_id,
  });

  return result;
}

function handleHelp(): CommandResult {
  return {
    success: true,
    message: `📚 Available Commands:

/help - Show this help message
/resolve <conversation_id> - Resolve/close a handoff session
/active - Show active handoff sessions

💡 To respond to a visitor, simply reply to their message thread.`,
  };
}

async function handleResolve(
  chatbotId: string,
  message: TelegramMessage,
  args: string[]
): Promise<CommandResult> {
  let conversationId: string | null = null;

  // Try to get conversation ID from args or from replied message
  if (args.length > 0) {
    conversationId = args[0];
  } else if (message.reply_to_message?.text) {
    const match = message.reply_to_message.text.match(
      /(?:ID:|Conversation:)\s*`?([a-f0-9-]+)`?/
    );
    conversationId = match ? match[1] : null;
  }

  if (!conversationId) {
    return {
      success: false,
      message: 'Please provide a conversation ID or reply to a handoff message.\n\nUsage: /resolve <conversation_id>',
    };
  }

  const resolved = await resolveHandoff(conversationId);
  if (!resolved) {
    return {
      success: false,
      message: 'Failed to resolve handoff. The conversation may not have an active handoff.',
    };
  }

  return {
    success: true,
    message: `✅ Handoff resolved for conversation \`${conversationId}\`.\n\nThe visitor will be returned to AI chat.`,
  };
}

async function handleActive(chatbotId: string): Promise<CommandResult> {
  const supabase = createAdminClient() as any;
  const { data: sessions } = await supabase
    .from('telegram_handoff_sessions')
    .select('conversation_id, status, agent_name, created_at')
    .eq('chatbot_id', chatbotId)
    .in('status', ['pending', 'active'])
    .order('created_at', { ascending: false })
    .limit(10);

  if (!sessions || sessions.length === 0) {
    return {
      success: true,
      message: '✅ No active handoff sessions.',
    };
  }

  const lines = sessions.map((s: any) => {
    const status = s.status === 'pending' ? '⏳ Pending' : '💬 Active';
    const agent = s.agent_name ? ` (${s.agent_name})` : '';
    const time = new Date(s.created_at).toLocaleString();
    return `${status}${agent}\n  ID: \`${s.conversation_id}\`\n  Since: ${time}`;
  });

  return {
    success: true,
    message: `📋 Active Handoff Sessions (${sessions.length}):\n\n${lines.join('\n\n')}`,
  };
}
