/**
 * Per-Chatbot Telegram Webhook Handler
 * POST /api/telegram/webhook/[chatbotId]
 *
 * Each chatbot gets its own webhook URL so we can immediately identify
 * which chatbot an incoming Telegram update belongs to — no table scan needed.
 *
 * Supports both AI chat responses (ai_responses_enabled) and the existing
 * agent handoff flow. Both can coexist: the bot responds to messages normally,
 * and users can still escalate to humans via commands.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TelegramUpdate } from '@/lib/telegram/types';
import {
  handleAgentReply,
  lookupConversationFromTelegram,
  lookupConversationById,
  getTelegramConfig,
} from '@/lib/telegram/handoff';
import { extractConversationId } from '@/lib/telegram/client';
import { handleBotCommand, isBotCommand } from '@/lib/telegram/commands';
import { handleTelegramChat } from '@/lib/telegram/chat';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

  try {
    const update: TelegramUpdate = await request.json();

    if (!update.message?.text || !update.message.from) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const text = message.text!;
    const from = message.from!;

    // Load telegram config (decrypts bot token)
    const config = await getTelegramConfig(chatbotId);

    // Verify webhook secret if configured
    if (config.webhook_secret) {
      const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secretHeader !== config.webhook_secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Prevent responding to the bot's own messages
    // (Telegram bots don't normally receive their own messages, but guard anyway)
    if (from.is_bot) {
      return NextResponse.json({ ok: true });
    }

    // --- Bot commands are always handled regardless of mode ---
    if (isBotCommand(text)) {
      await handleBotCommand(config, chatbotId, message);
      return NextResponse.json({ ok: true });
    }

    // --- Check if this is a reply to a handoff notification ---
    let conversationId: string | null = null;

    if (message.reply_to_message) {
      const lookup = await lookupConversationFromTelegram(
        message.chat.id,
        message.reply_to_message.message_id
      );
      if (lookup) {
        conversationId = lookup.conversationId;
      }

      if (!conversationId) {
        const extractedId = extractConversationId(message);
        if (extractedId) {
          const lookup2 = await lookupConversationById(extractedId);
          if (lookup2) {
            conversationId = lookup2.conversationId;
          }
        }
      }
    }

    // If the message is a reply to a handoff notification, treat as agent reply
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

    // --- AI bot mode: respond to regular messages ---
    if (config.ai_responses_enabled) {
      // Fire-and-forget: return 200 immediately, process in background
      // Use waitUntil if available (Vercel/edge), otherwise just don't await
      const chatPromise = handleTelegramChat(chatbotId, config, message).catch((err) => {
        console.error('[Telegram Webhook] AI chat error:', err);
      });

      // In Node.js runtime, we need to await to keep the process alive
      // (unlike edge runtime which supports waitUntil)
      await chatPromise;

      return NextResponse.json({ ok: true });
    }

    // --- Fallback: no AI mode, not a handoff reply ---
    // This is a regular message in a group where only handoff is configured
    // Nothing to do
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
