/**
 * Telegram Setup API
 * POST/DELETE/GET /api/telegram/setup
 *
 * Authenticated endpoint for chatbot owners to manage their Telegram webhook.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  setTelegramWebhook,
  deleteTelegramWebhook,
  getTelegramWebhookInfo,
} from '@/lib/telegram/client';
import { DEFAULT_TELEGRAM_CONFIG } from '@/lib/telegram/types';
import type { TelegramConfig } from '@/lib/telegram/types';
import { decryptTelegramConfig } from '@/lib/telegram/crypto';
import type { Json } from '@/types/database';

function parseTelegramConfig(raw: Json | null): TelegramConfig {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const merged = { ...DEFAULT_TELEGRAM_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptTelegramConfig(merged) as unknown as TelegramConfig;
}

async function getAuthenticatedChatbot(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
  if (!chatbotId) return null;

  const admin = createAdminClient();
  const { data: chatbot } = await admin
    .from('chatbots')
    .select('id, user_id, telegram_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  return chatbot || null;
}

/**
 * POST - Set webhook URL
 */
export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseTelegramConfig(chatbot.telegram_config);
    if (!config.bot_token) {
      return NextResponse.json(
        { error: 'Bot token not configured. Save your Telegram settings first.' },
        { status: 400 }
      );
    }

    // Auto-generate webhook URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: 'Application URL not configured' },
        { status: 500 }
      );
    }

    const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
    const webhookUrl = `${baseUrl}/api/telegram/webhook/${chatbot.id}`;

    const success = await setTelegramWebhook(config, webhookUrl);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to set Telegram webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, webhook_url: webhookUrl });
  } catch (error) {
    console.error('[Telegram Setup] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE - Remove webhook
 */
export async function DELETE(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseTelegramConfig(chatbot.telegram_config);
    if (!config.bot_token) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 400 });
    }

    const success = await deleteTelegramWebhook(config);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('[Telegram Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * GET - Get webhook info
 */
export async function GET(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseTelegramConfig(chatbot.telegram_config);
    if (!config.bot_token) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 400 });
    }

    const info = await getTelegramWebhookInfo(config);
    return NextResponse.json({ success: true, data: info });
  } catch (error) {
    console.error('[Telegram Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
