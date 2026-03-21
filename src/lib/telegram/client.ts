/**
 * Telegram Bot Client
 * Per-chatbot Telegram API wrapper for the live handoff system.
 * Unlike janesblend (single bot token via env), each chatbot has its own bot token.
 */

import type { TelegramConfig, TelegramMessage } from './types';

/**
 * Send a message via Telegram Bot API
 */
export async function sendTelegramMessage(
  config: TelegramConfig,
  text: string,
  options?: {
    chatId?: string;
    replyToMessageId?: number;
    parseMode?: 'Markdown' | 'HTML';
  }
): Promise<TelegramMessage | null> {
  if (!config.bot_token || !config.chat_id) {
    console.error('[Telegram] Bot token or chat ID not configured');
    return null;
  }

  const chatId = options?.chatId || config.chat_id;

  try {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      text,
    };

    if (options?.replyToMessageId) {
      params.reply_to_message_id = options.replyToMessageId;
    }

    if (options?.parseMode) {
      params.parse_mode = options.parseMode;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('[Telegram] API error:', data.description);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('[Telegram] Failed to send message:', error);
    return null;
  }
}

/**
 * Set webhook URL for a chatbot's Telegram bot
 */
export async function setTelegramWebhook(
  config: TelegramConfig,
  webhookUrl: string
): Promise<boolean> {
  if (!config.bot_token) {
    console.error('[Telegram] Bot token not configured');
    return false;
  }

  try {
    const payload: Record<string, unknown> = { url: webhookUrl };
    if (config.webhook_secret) {
      payload.secret_token = config.webhook_secret;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram] setWebhook error:', data.description);
      return false;
    }

    console.log('[Telegram] Webhook set successfully:', webhookUrl);
    return true;
  } catch (error) {
    console.error('[Telegram] Error setting webhook:', error);
    return false;
  }
}

/**
 * Delete webhook for a chatbot's Telegram bot
 */
export async function deleteTelegramWebhook(config: TelegramConfig): Promise<boolean> {
  if (!config.bot_token) return false;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/deleteWebhook`,
      { method: 'POST' }
    );
    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('[Telegram] Error deleting webhook:', error);
    return false;
  }
}

/**
 * Get webhook info for a chatbot's Telegram bot
 */
export async function getTelegramWebhookInfo(config: TelegramConfig): Promise<unknown> {
  if (!config.bot_token) return null;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/getWebhookInfo`
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('[Telegram] Error getting webhook info:', error);
    return null;
  }
}

/**
 * Format a handoff message for Telegram
 */
export function formatHandoffMessage(
  conversationId: string,
  chatbotName: string,
  visitorName: string,
  reason: string,
  recentMessages: Array<{ role: string; content: string }>,
  metadata?: {
    visitorEmail?: string;
    pageUrl?: string;
    details?: string;
  }
): string {
  const header = `🆘 *Live Handoff Request*\n`;
  const bot = `🤖 Chatbot: ${escapeMarkdown(chatbotName)}\n`;
  const visitor = `👤 Visitor: ${escapeMarkdown(visitorName)}\n`;
  const convId = `📋 Conversation: \`${conversationId}\`\n`;
  const reasonLine = `❓ Reason: ${escapeMarkdown(formatReason(reason))}\n`;
  const email = metadata?.visitorEmail
    ? `📧 Email: ${escapeMarkdown(metadata.visitorEmail)}\n`
    : '';
  const page = metadata?.pageUrl
    ? `🔗 Page: ${escapeMarkdown(metadata.pageUrl)}\n`
    : '';
  const details = metadata?.details
    ? `📝 Details: ${escapeMarkdown(metadata.details)}\n`
    : '';

  const separator = '\n━━━━━━━━━━━━━━━━\n';

  // Include last few messages for context
  let contextSection = '';
  if (recentMessages.length > 0) {
    const last5 = recentMessages.slice(-5);
    contextSection =
      '\n💬 *Recent conversation:*\n' +
      last5
        .map((m) => {
          const icon = m.role === 'user' ? '👤' : '🤖';
          const content = m.content.length > 200 ? m.content.substring(0, 200) + '...' : m.content;
          return `${icon} ${escapeMarkdown(content)}`;
        })
        .join('\n') +
      '\n';
  }

  const instructions = '\n💡 Reply to this message to respond to the visitor\\.';

  return `${header}${bot}${visitor}${convId}${reasonLine}${email}${page}${details}${separator}${contextSection}${instructions}`;
}

/**
 * Format follow-up visitor message for Telegram thread
 */
export function formatVisitorMessage(visitorName: string, content: string): string {
  return `👤 *${escapeMarkdown(visitorName)}:*\n\n${escapeMarkdown(content)}`;
}

/**
 * Extract conversation ID from a Telegram message reply
 */
export function extractConversationId(message: TelegramMessage): string | null {
  if (!message.reply_to_message?.text) return null;
  const match = message.reply_to_message.text.match(
    /(?:ID:|Conversation:)\s*`?([a-f0-9-]+)`?/
  );
  return match ? match[1] : null;
}

function formatReason(reason: string): string {
  const map: Record<string, string> = {
    wrong_answer: 'Wrong answer from AI',
    offensive_content: 'Offensive content',
    need_human_help: 'Needs human assistance',
    other: 'Other',
  };
  return map[reason] || reason;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}
