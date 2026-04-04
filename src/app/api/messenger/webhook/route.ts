/**
 * App-level Messenger Webhook Handler
 * GET  /api/messenger/webhook — Meta webhook verification
 * POST /api/messenger/webhook — Incoming messages, routed by page_id
 *
 * IMPORTANT: Always return 200 quickly — Meta retries aggressively on timeouts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyMetaSignature } from '@/lib/meta/signature';
import { decryptMessengerConfig } from '@/lib/messenger/crypto';
import { isMessengerMessageDuplicate } from '@/lib/messenger/rate-limit';
import { handleMessengerMessage } from '@/lib/messenger/chat';
import type { MessengerConfig, MessengerWebhookPayload } from '@/lib/messenger/types';
import { DEFAULT_MESSENGER_CONFIG } from '@/lib/messenger/types';

function parseMessengerConfig(raw: unknown): MessengerConfig {
  const obj =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const merged = { ...DEFAULT_MESSENGER_CONFIG, ...obj } as unknown as Record<string, unknown>;
  return decryptMessengerConfig(merged) as unknown as MessengerConfig;
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

  const verifyToken = process.env.META_MESSENGER_VERIFY_TOKEN;
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

    const appSecret = process.env.META_MESSENGER_APP_SECRET ?? process.env.META_APP_SECRET;
    const signatureHeader = request.headers.get('X-Hub-Signature-256');

    if (!appSecret) {
      console.error('[Messenger Webhook] META_MESSENGER_APP_SECRET (or META_APP_SECRET) env var not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifyMetaSignature(rawBody, signatureHeader, appSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: MessengerWebhookPayload = JSON.parse(rawBody);

    if (payload.object !== 'page') {
      return NextResponse.json({ ok: true });
    }

    const supabase = createAdminClient();
    const messagePromises: Promise<void>[] = [];

    for (const entry of payload.entry) {
      const pageId = entry.id;

      // Look up chatbot once per entry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: chatbotRow } = await (supabase as any)
        .from('chatbots')
        .select('id, messenger_config')
        .filter("messenger_config->>'page_id'", 'eq', pageId)
        .filter("messenger_config->>'enabled'", 'eq', 'true')
        .single();

      if (!chatbotRow) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = parseMessengerConfig((chatbotRow as any).messenger_config);
      if (!config.enabled) continue;

      for (const event of entry.messaging) {
        // Skip delivery/read receipts (no message property)
        if (!event.message) continue;
        // Skip echo messages
        if (event.message.is_echo) continue;
        // Skip non-text messages
        if (!event.message.text) continue;
        // Dedup by mid
        if (isMessengerMessageDuplicate(event.message.mid)) continue;

        if (config.ai_responses_enabled) {
          messagePromises.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleMessengerMessage((chatbotRow as any).id, config, event).catch((err) => {
              console.error('[Messenger Webhook] AI chat error:', err);
            })
          );
        }
      }
    }

    // Return 200 immediately — Meta requires a response within ~5s or marks the webhook failed.
    // AI processing continues in the background; errors are caught per-promise above.
    Promise.all(messagePromises).catch((err) =>
      console.error('[Messenger Webhook] Background processing error:', err)
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Messenger Webhook] Error:', error);
    return NextResponse.json({ ok: true });
  }
}
