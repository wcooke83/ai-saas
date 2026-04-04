/**
 * Instagram Setup API
 * GET/POST/DELETE /api/instagram/setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_INSTAGRAM_CONFIG } from '@/lib/instagram/types';
import type { InstagramConfig } from '@/lib/instagram/types';
import { decryptInstagramConfig } from '@/lib/instagram/crypto';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';

function parseInstagramConfig(raw: unknown): InstagramConfig {
  const obj =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const merged = { ...DEFAULT_INSTAGRAM_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptInstagramConfig(merged) as unknown as InstagramConfig;
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
    .select('id, user_id, instagram_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return chatbot ? { ...(chatbot as any), _userId: user.id } : null;
}

async function checkInstagramPlanGate(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = sub?.plan || 'free';
  return CHATBOT_PLAN_LIMITS[planSlug]?.instagramIntegration ?? false;
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
    const config = parseInstagramConfig((chatbot as any).instagram_config);
    const baseUrl = getBaseUrl();
    const webhookUrl = baseUrl ? `${baseUrl}/api/instagram/webhook` : null;

    return NextResponse.json({
      success: true,
      data: {
        enabled: config.enabled,
        instagram_id: config.instagram_id || null,
        username: config.username || null,
        ai_responses_enabled: config.ai_responses_enabled || false,
        has_access_token: !!config.access_token,
        webhook_url: webhookUrl,
      },
    });
  } catch (error) {
    console.error('[Instagram Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allowed = await checkInstagramPlanGate(chatbot._userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Instagram integration requires a Pro or Agency plan' },
        { status: 403 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = parseInstagramConfig((chatbot as any).instagram_config);
    if (!config.instagram_id || !config.access_token) {
      return NextResponse.json(
        { error: 'Instagram ID and access token are required. Save your Instagram settings first.' },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      return NextResponse.json({ error: 'Application URL not configured' }, { status: 500 });
    }

    const webhookUrl = `${baseUrl}/api/instagram/webhook`;

    return NextResponse.json({
      success: true,
      webhook_url: webhookUrl,
      instructions:
        'Configure this webhook URL in your Meta App Dashboard under Instagram > Configuration > Webhooks.',
    });
  } catch (error) {
    console.error('[Instagram Setup] POST error:', error);
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
      .update({ instagram_config: DEFAULT_INSTAGRAM_CONFIG })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[Instagram Setup] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to clear config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Instagram Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
