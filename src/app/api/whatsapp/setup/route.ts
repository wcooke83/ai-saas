/**
 * WhatsApp Setup API
 * POST/DELETE/GET /api/whatsapp/setup
 *
 * Authenticated endpoint for chatbot owners to manage their WhatsApp integration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_WHATSAPP_CONFIG } from '@/lib/whatsapp/types';
import type { WhatsAppConfig } from '@/lib/whatsapp/types';
import { decryptWhatsAppConfig } from '@/lib/whatsapp/crypto';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';
import type { Json } from '@/types/database';

function parseWhatsAppConfig(raw: Json | null): WhatsAppConfig {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};
  const merged = { ...DEFAULT_WHATSAPP_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptWhatsAppConfig(merged) as unknown as WhatsAppConfig;
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
    .select('id, user_id, whatsapp_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  return chatbot ? { ...chatbot, _userId: user.id } : null;
}

async function checkWhatsAppPlanGate(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = sub?.plan || 'free';
  return CHATBOT_PLAN_LIMITS[planSlug]?.whatsappIntegration ?? false;
}

/**
 * POST — Save config and return webhook URL for Meta dashboard
 */
export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Plan gate: require WhatsApp integration permission
    const allowed = await checkWhatsAppPlanGate(chatbot._userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'WhatsApp integration requires a Pro or Agency plan' },
        { status: 403 }
      );
    }

    const config = parseWhatsAppConfig(chatbot.whatsapp_config as Json);
    if (!config.phone_number_id || !config.access_token) {
      return NextResponse.json(
        { error: 'Phone number ID and access token are required. Save your WhatsApp settings first.' },
        { status: 400 }
      );
    }

    if (!config.verify_token) {
      return NextResponse.json(
        { error: 'Verify token is required. Save your WhatsApp settings first.' },
        { status: 400 }
      );
    }

    // Generate webhook URL for the user to configure in Meta dashboard
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: 'Application URL not configured' },
        { status: 500 }
      );
    }

    const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
    const webhookUrl = `${baseUrl}/api/whatsapp/webhook/${chatbot.id}`;

    return NextResponse.json({
      success: true,
      webhook_url: webhookUrl,
      instructions: 'Configure this webhook URL in your Meta App Dashboard under WhatsApp > Configuration > Webhook. Use the verify token you saved in your WhatsApp settings.',
    });
  } catch (error) {
    console.error('[WhatsApp Setup] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE — Clear WhatsApp config
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
      .update({ whatsapp_config: DEFAULT_WHATSAPP_CONFIG as unknown as Json })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[WhatsApp Setup] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to clear config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * GET — Return current config status
 */
export async function GET(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseWhatsAppConfig(chatbot.whatsapp_config as Json);

    // Generate webhook URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    const baseUrl = appUrl
      ? appUrl.startsWith('http') ? appUrl : `https://${appUrl}`
      : null;
    const webhookUrl = baseUrl ? `${baseUrl}/api/whatsapp/webhook/${chatbot.id}` : null;

    return NextResponse.json({
      success: true,
      data: {
        enabled: config.enabled,
        phone_number_id: config.phone_number_id || null,
        display_phone: config.display_phone || null,
        waba_id: config.waba_id || null,
        ai_responses_enabled: config.ai_responses_enabled || false,
        has_access_token: !!config.access_token,
        has_verify_token: !!config.verify_token,
        webhook_url: webhookUrl,
      },
    });
  } catch (error) {
    console.error('[WhatsApp Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
