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

async function getAuthenticatedChatbot(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
  if (!chatbotId) return null;

  const admin = createAdminClient() as any;
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

    const config = { ...DEFAULT_TELEGRAM_CONFIG, ...(chatbot.telegram_config || {}) };
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

    const webhookUrl = `${appUrl.startsWith('http') ? appUrl : `https://${appUrl}`}/api/telegram/webhook`;

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

    const config = { ...DEFAULT_TELEGRAM_CONFIG, ...(chatbot.telegram_config || {}) };
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

    const config = { ...DEFAULT_TELEGRAM_CONFIG, ...(chatbot.telegram_config || {}) };
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
