/**
 * Email Setup API
 * GET  /api/email/setup?chatbot_id={id} — return current email config
 * POST /api/email/setup?chatbot_id={id} — enable email integration
 * DELETE /api/email/setup?chatbot_id={id} — disable email integration
 *
 * Authenticated endpoint for chatbot owners.
 * No external API calls — Postmark is configured once at platform level.
 *
 * Note: email_config column is not yet in the generated DB types (needs db:gen-types
 * after migration runs). We use `any` casts until then.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DEFAULT_EMAIL_CONFIG } from '@/lib/email/email-types';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';

const INBOUND_DOMAIN = process.env.POSTMARK_INBOUND_DOMAIN || 'inbound.vocui.com';

function getInboundAddress(chatbotId: string): string {
  return `${chatbotId}@${INBOUND_DOMAIN}`;
}

async function getAuthenticatedChatbot(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const chatbotId = req.nextUrl.searchParams.get('chatbot_id');
  if (!chatbotId) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any;
  const { data: chatbot } = await admin
    .from('chatbots')
    .select('id, user_id, email_config')
    .eq('id', chatbotId)
    .eq('user_id', user.id)
    .single();

  if (!chatbot) return null;
  return { id: chatbot.id as string, user_id: chatbot.user_id as string, email_config: chatbot.email_config, _userId: user.id };
}

async function checkEmailPlanGate(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();
  const planSlug = sub?.plan || 'free';
  return CHATBOT_PLAN_LIMITS[planSlug]?.emailIntegration ?? false;
}

function parseEmailConfig(raw: unknown): Record<string, unknown> {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : {};
  return { ...DEFAULT_EMAIL_CONFIG, ...obj };
}

/**
 * GET — Return current email config
 */
export async function GET(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = parseEmailConfig(chatbot.email_config);

    return NextResponse.json({
      success: true,
      data: {
        enabled: config.enabled,
        ai_responses_enabled: config.ai_responses_enabled ?? true,
        reply_name: config.reply_name || null,
        email_address: config.enabled ? getInboundAddress(chatbot.id) : null,
      },
    });
  } catch (error) {
    console.error('[Email Setup] GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * POST — Enable email integration
 */
export async function POST(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allowed = await checkEmailPlanGate(chatbot._userId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Email integration requires a Pro or Agency plan' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const replyName: string | undefined = typeof body.reply_name === 'string' ? body.reply_name : undefined;
    const aiResponsesEnabled: boolean = body.ai_responses_enabled !== false;

    const emailAddress = getInboundAddress(chatbot.id);
    const newConfig: Record<string, unknown> = {
      enabled: true,
      email_address: emailAddress,
      ai_responses_enabled: aiResponsesEnabled,
    };
    if (replyName !== undefined) {
      newConfig.reply_name = replyName;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;
    const { error } = await admin
      .from('chatbots')
      .update({ email_config: newConfig })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[Email Setup] POST DB error:', error);
      return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        enabled: true,
        email_address: emailAddress,
        ai_responses_enabled: aiResponsesEnabled,
        reply_name: replyName || null,
      },
    });
  } catch (error) {
    console.error('[Email Setup] POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * DELETE — Disable email integration
 */
export async function DELETE(req: NextRequest) {
  try {
    const chatbot = await getAuthenticatedChatbot(req);
    if (!chatbot) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;
    const { error } = await admin
      .from('chatbots')
      .update({ email_config: DEFAULT_EMAIL_CONFIG })
      .eq('id', chatbot.id);

    if (error) {
      console.error('[Email Setup] DELETE error:', error);
      return NextResponse.json({ error: 'Failed to clear config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Email Setup] DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
