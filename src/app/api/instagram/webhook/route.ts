/**
 * App-level Instagram Webhook Handler
 * GET  /api/instagram/webhook — Meta webhook verification
 * POST /api/instagram/webhook — Incoming DMs, routed by instagram_id
 *
 * IMPORTANT: Always return 200 quickly — Meta retries aggressively on timeouts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyMetaSignature } from '@/lib/meta/signature';
import { decryptInstagramConfig } from '@/lib/instagram/crypto';
import { isInstagramMessageDuplicate } from '@/lib/instagram/rate-limit';
import { handleInstagramMessage } from '@/lib/instagram/chat';
import type { InstagramConfig, InstagramWebhookPayload } from '@/lib/instagram/types';
import { DEFAULT_INSTAGRAM_CONFIG } from '@/lib/instagram/types';

function parseInstagramConfig(raw: unknown): InstagramConfig {
  const obj =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const merged = { ...DEFAULT_INSTAGRAM_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptInstagramConfig(merged) as unknown as InstagramConfig;
}

/**
 * GET — Webhook verification
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode !== 'subscribe' || !token || !challenge) {
    return NextResponse.json({ error: 'Missing verification parameters' }, { status: 400 });
  }

  const verifyToken = process.env.META_INSTAGRAM_VERIFY_TOKEN;
  if (!verifyToken || token !== verifyToken) {
    return NextResponse.json({ error: 'Verify token mismatch' }, { status: 403 });
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

/**
 * POST — Incoming messages
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    const appSecret = process.env.META_INSTAGRAM_APP_SECRET ?? process.env.META_APP_SECRET;
    const signatureHeader = request.headers.get('X-Hub-Signature-256');

    if (!appSecret) {
      console.error('[Instagram Webhook] META_INSTAGRAM_APP_SECRET (or META_APP_SECRET) env var not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifyMetaSignature(rawBody, signatureHeader, appSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: InstagramWebhookPayload = JSON.parse(rawBody);

    if (payload.object !== 'instagram') {
      return NextResponse.json({ ok: true });
    }

    const supabase = createAdminClient();
    const messagePromises: Promise<void>[] = [];

    for (const entry of payload.entry) {
      const igId = entry.id;

      // Look up chatbot once per entry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: chatbotRow } = await (supabase as any)
        .from('chatbots')
        .select('id, instagram_config')
        .filter("instagram_config->>'instagram_id'", 'eq', igId)
        .filter("instagram_config->>'enabled'", 'eq', 'true')
        .single();

      if (!chatbotRow) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = parseInstagramConfig((chatbotRow as any).instagram_config);
      if (!config.enabled) continue;

      for (const event of entry.messaging) {
        if (!event.message) continue;
        if (event.message.is_echo) continue;
        if (!event.message.text) continue;
        if (isInstagramMessageDuplicate(event.message.mid)) continue;

        if (config.ai_responses_enabled) {
          messagePromises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleInstagramMessage((chatbotRow as any).id, config, event).catch((err) => {
              console.error('[Instagram Webhook] AI chat error:', err);
            })
          );
        }
      }
    }

    // Return 200 immediately — Meta requires a response within ~5s or marks the webhook failed.
    // AI processing continues in the background; errors are caught per-promise above.
    Promise.all(messagePromises).catch((err) =>
      console.error('[Instagram Webhook] Background processing error:', err)
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Instagram Webhook] Error:', error);
    return NextResponse.json({ ok: true });
  }
}
