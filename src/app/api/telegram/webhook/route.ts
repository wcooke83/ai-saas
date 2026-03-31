/**
 * Telegram Webhook Handler (Legacy/Shared)
 * POST /api/telegram/webhook
 *
 * Backwards-compatible shared webhook endpoint. New setups use per-chatbot
 * URLs (/api/telegram/webhook/[chatbotId]), but existing bots may still
 * point here. Supports both agent handoff replies and AI chat responses.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TelegramUpdate, TelegramConfig } from '@/lib/telegram/types';
import { DEFAULT_TELEGRAM_CONFIG } from '@/lib/telegram/types';
import type { Json } from '@/types/database';
import { extractConversationId } from '@/lib/telegram/client';
import {
  handleAgentReply,
  lookupConversationFromTelegram,
  lookupConversationById,
  getTelegramConfig,
} from '@/lib/telegram/handoff';
import { handleBotCommand, isBotCommand } from '@/lib/telegram/commands';
import { handleTelegramChat } from '@/lib/telegram/chat';

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    if (!update.message?.text || !update.message.from) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const text = message.text!;
    const from = message.from!;

    // Skip messages from bots (prevent self-reply loops)
    if (from.is_bot) {
      return NextResponse.json({ ok: true });
    }

    // Determine which chatbot this message is for
    let chatbotId: string | null = null;
    let conversationId: string | null = null;

    // Method 1: Check reply-to message mapping
    if (message.reply_to_message) {
      const lookup = await lookupConversationFromTelegram(
        message.chat.id,
        message.reply_to_message.message_id
      );
      if (lookup) {
        chatbotId = lookup.chatbotId;
        conversationId = lookup.conversationId;
      }

      // Method 2: Extract conversation ID from message text
      if (!conversationId) {
        const extractedId = extractConversationId(message);
        if (extractedId) {
          const lookup2 = await lookupConversationById(extractedId);
          if (lookup2) {
            chatbotId = lookup2.chatbotId;
            conversationId = lookup2.conversationId;
          }
        }
      }
    }

    // If we still don't know the chatbot, try to find it by chat_id
    if (!chatbotId) {
      const supabase = createAdminClient();
      const { data: chatbots } = await supabase
        .from('chatbots')
        .select('id, telegram_config')
        .not('telegram_config', 'is', null);

      if (chatbots) {
        for (const cb of chatbots) {
          const raw = cb.telegram_config && typeof cb.telegram_config === 'object' && !Array.isArray(cb.telegram_config) ? cb.telegram_config as Record<string, unknown> : {};
          const config = { ...DEFAULT_TELEGRAM_CONFIG, ...raw } as TelegramConfig;
          if (config.chat_id === String(message.chat.id)) {
            chatbotId = cb.id;
            break;
          }
        }
      }
    }

    if (!chatbotId) {
      console.warn('[Telegram Webhook] Could not determine chatbot for message:', {
        chatId: message.chat.id,
        messageId: message.message_id,
      });
      return NextResponse.json({ ok: true });
    }

    // Get chatbot's telegram config (for sending replies and verifying)
    const config = await getTelegramConfig(chatbotId);

    // Verify webhook secret if configured
    if (config.webhook_secret) {
      const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secretHeader !== config.webhook_secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Handle bot commands
    if (isBotCommand(text)) {
      await handleBotCommand(config, chatbotId, message);
      return NextResponse.json({ ok: true });
    }

    // If this is a reply to a handoff notification, treat as agent reply
    if (conversationId && message.reply_to_message) {
      const agentName = `${from.first_name}${from.last_name ? ` ${from.last_name}` : ''}`;

      const result = await handleAgentReply({
        chatbotId,
        conversationId,
        agentName,
        agentTelegramId: from.id,
        content: text,
      });

      if (!result.success) {
        console.error('[Telegram Webhook] Failed to handle agent reply:', result.error);
      }
      return NextResponse.json({ ok: true });
    }

    // AI bot mode: respond to regular messages if enabled
    if (config.ai_responses_enabled) {
      await handleTelegramChat(chatbotId, config, message).catch((err) => {
        console.error('[Telegram Webhook] AI chat error:', err);
      });
      return NextResponse.json({ ok: true });
    }

    // No AI mode and not a handoff reply — nothing to do
    if (!conversationId) {
      return NextResponse.json({ ok: true });
    }

    // Legacy fallback: treat as agent reply if we found a conversation
    const agentName = `${from.first_name}${from.last_name ? ` ${from.last_name}` : ''}`;

    const result = await handleAgentReply({
      chatbotId,
      conversationId,
      agentName,
      agentTelegramId: from.id,
      content: text,
    });

    if (!result.success) {
      console.error('[Telegram Webhook] Failed to handle agent reply:', result.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook endpoint is active',
  });
}
