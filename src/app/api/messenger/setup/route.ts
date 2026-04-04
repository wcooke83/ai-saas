/**
 * Messenger Setup API
 * GET/POST/DELETE /api/messenger/setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_MESSENGER_CONFIG } from '@/lib/messenger/types';
import type { MessengerConfig } from '@/lib/messenger/types';
import { decryptMessengerConfig } from '@/lib/messenger/crypto';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';

function parseMessengerConfig(raw: unknown): MessengerConfig {
  const obj =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const merged = { ...DEFAULT_MESSENGER_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptMessengerConfig(merged) as unknown as MessengerConfig;
}

async function getAuthenticatedChatbot(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
  if (!chatbotId) return null;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: chatbot } = await (admin as any)
    .from('chatbots')
    .select('id, user_id, messenger_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return chatbot ? { ...(chatbot as any), _userId: user.id } : null;
}

async function checkMessengerPlanGate(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = sub?.plan || 'free';
  return CHATBOT_PLAN_LIMITS[planSlug]?.messengerIntegration ?? false;
}

function getBaseUrl(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (!appUrl) return null;
  return appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
}

export async function GET(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = parseMessengerConfig((chatbot as any).messenger_config);
    const baseUrl = getBaseUrl();
    const webhookUrl = baseUrl ? `${baseUrl}/api/messenger/webhook` : null;

    return NextResponse.json({
      success: true,
      data: {
        enabled: config.enabled,
        page_id: config.page_id || null,
        page_name: config.page_name || null,
        ai_responses_enabled: config.ai_responses_enabled || false,
        has_access_token: !!config.access_token,
        webhook_url: webhookUrl,
      },
    });
  } catch (error) {
    console.error('[Messenger Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allowed = await checkMessengerPlanGate(chatbot._userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Messenger integration requires a Pro or Agency plan' },
        { status: 403 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = parseMessengerConfig((chatbot as any).messenger_config);
    if (!config.page_id || !config.access_token) {
      return NextResponse.json(
        { error: 'Page ID and access token are required. Save your Messenger settings first.' },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      return NextResponse.json({ error: 'Application URL not configured' }, { status: 500 });
    }

    const webhookUrl = `${baseUrl}/api/messenger/webhook`;

    return NextResponse.json({
      success: true,
      webhook_url: webhookUrl,
      instructions:
        'Configure this webhook URL in your Meta App Dashboard under Messenger > Configuration > Webhooks.',
    });
  } catch (error) {
    console.error('[Messenger Setup] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any)
      .from('chatbots')
      .update({ messenger_config: DEFAULT_MESSENGER_CONFIG })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[Messenger Setup] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to clear config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Messenger Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
