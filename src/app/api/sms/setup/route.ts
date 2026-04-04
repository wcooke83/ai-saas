/**
 * SMS Setup API
 * GET/POST/DELETE /api/sms/setup
 *
 * Authenticated endpoint for chatbot owners to manage their Twilio SMS integration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_SMS_CONFIG } from '@/lib/sms/types';
import type { SmsConfig } from '@/lib/sms/types';
import { decryptSmsConfig } from '@/lib/sms/crypto';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';
import type { Json } from '@/types/database';

const ACCOUNT_SID_RE = /^AC[0-9a-f]{32}$/;
const E164_RE = /^\+[1-9]\d{1,14}$/;

function parseSmsConfig(raw: Json | null): SmsConfig {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};
  const merged = { ...DEFAULT_SMS_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptSmsConfig(merged) as unknown as SmsConfig;
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
    .select('id, user_id, sms_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  return chatbot ? { ...chatbot, _userId: user.id } : null;
}

async function checkSmsPlanGate(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = sub?.plan || 'free';
  return CHATBOT_PLAN_LIMITS[planSlug]?.smsIntegration ?? false;
}

/**
 * GET — Return current SMS config status
 */
export async function GET(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseSmsConfig(chatbot.sms_config as Json);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    const baseUrl = appUrl
      ? appUrl.startsWith('http') ? appUrl : `https://${appUrl}`
      : null;
    const webhookUrl = baseUrl ? `${baseUrl}/api/sms/webhook/${chatbot.id}` : null;

    return NextResponse.json({
      success: true,
      data: {
        connected: config.enabled && !!config.account_sid && !!config.phone_number,
        phone_number: config.phone_number || null,
        has_auth_token: !!config.auth_token,
        ai_responses_enabled: config.ai_responses_enabled || false,
        webhook_url: webhookUrl,
      },
    });
  } catch (error) {
    console.error('[SMS Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * POST — Save config and return webhook URL for Twilio console
 */
export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Plan gate: require SMS integration permission
    const allowed = await checkSmsPlanGate(chatbot._userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'SMS integration requires a Pro or Agency plan' },
        { status: 403 }
      );
    }

    const config = parseSmsConfig(chatbot.sms_config as Json);

    // Validate required fields
    if (!config.account_sid) {
      return NextResponse.json(
        { error: 'Account SID is required. Save your SMS settings first.' },
        { status: 400 }
      );
    }

    if (!ACCOUNT_SID_RE.test(config.account_sid)) {
      return NextResponse.json(
        { error: 'Account SID must match format: AC followed by 32 hex characters.' },
        { status: 400 }
      );
    }

    if (!config.auth_token) {
      return NextResponse.json(
        { error: 'Auth Token is required. Save your SMS settings first.' },
        { status: 400 }
      );
    }

    if (!config.phone_number) {
      return NextResponse.json(
        { error: 'Phone number is required. Save your SMS settings first.' },
        { status: 400 }
      );
    }

    if (!E164_RE.test(config.phone_number)) {
      return NextResponse.json(
        { error: 'Phone number must be in E.164 format, e.g. +14155551234.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: 'Application URL not configured' },
        { status: 500 }
      );
    }

    const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
    const webhookUrl = `${baseUrl}/api/sms/webhook/${chatbot.id}`;

    return NextResponse.json({
      success: true,
      webhook_url: webhookUrl,
      instructions: 'Configure this webhook URL in your Twilio Console under Phone Numbers > Active Numbers > Messaging Configuration.',
    });
  } catch (error) {
    console.error('[SMS Setup] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE — Clear SMS config
 */
export async function DELETE(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('chatbots')
      .update({ sms_config: DEFAULT_SMS_CONFIG as unknown as Json })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[SMS Setup] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to clear config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SMS Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
