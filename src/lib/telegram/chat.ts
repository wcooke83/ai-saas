/**
 * Telegram AI Chat Handler
 * Processes incoming Telegram messages through the shared executeChat() pipeline,
 * mirroring the pattern used by the Slack integration.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendTelegramMessage } from './client';
import { checkTelegramRateLimit } from './rate-limit';
import type { TelegramMessage, TelegramConfig } from './types';

/**
 * Handle an incoming Telegram message with AI-powered responses.
 *
 * Called when ai_responses_enabled is true and the message is not a
 * bot command or a reply to a handoff notification.
 */
export async function handleTelegramChat(
  chatbotId: string,
  config: TelegramConfig,
  message: TelegramMessage
): Promise<void> {
  const supabase = createAdminClient();
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, is_published')
    .eq('id', chatbotId)
    .single();

  if (!chatbot || !chatbot.is_published) return;

  if (!message.text || !message.from) return;

  // Rate limit per user
  const rateLimit = checkTelegramRateLimit(chatbotId, message.from.id);
  if (!rateLimit.allowed) {
    await sendTelegramMessage(
      config,
      `Please wait ${rateLimit.retryAfterSeconds}s before sending another message.`,
      {
        chatId: String(message.chat.id),
        replyToMessageId: message.message_id,
      }
    );
    return;
  }

  let text = message.text.trim();
  if (!text) return;

  // In group chats, only respond when @mentioned
  const chatType = message.chat.type;
  if (chatType === 'group' || chatType === 'supergroup') {
    // Use exact bot username when available, fall back to heuristic regex
    const mentionPattern = config.bot_username
      ? new RegExp(`@${config.bot_username}\\b`, 'i')
      : /@\w+bot\b/i;
    if (!mentionPattern.test(text)) return;
    // Strip the @mention from the message
    text = text.replace(mentionPattern, '').trim();
    if (!text) return;
  }

  // Each Telegram user gets their own session per chat
  const sessionId = `telegram_${message.chat.id}_${message.from.id}`;
  const visitorId = message.from.id.toString();

  try {
    const result = await executeChat({
      chatbotId,
      message: text,
      sessionId,
      channel: 'telegram',
      visitorId,
      stream: false,
    });

    // When a handoff is active, executeChat returns empty content after forwarding
    // the message to the support group — don't send an empty reply to the user.
    if (result.handoffActive) return;

    // Send response via Telegram (auto-splits long messages)
    await sendTelegramMessage(config, result.content, {
      chatId: String(message.chat.id),
      replyToMessageId: message.message_id,
    });
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      console.warn(
        `[Telegram:Limit] Chatbot "${chatbot.name || chatbotId}" hit monthly message limit`
      );
      await sendTelegramMessage(config, 'This chatbot has reached its monthly message limit. Please contact the chatbot owner.', {
        chatId: String(message.chat.id),
        replyToMessageId: message.message_id,
      });
      return;
    }
    // Re-throw unexpected errors so the caller can log them
    throw error;
  }
}
