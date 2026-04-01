/**
 * Per-Chatbot WhatsApp Webhook Handler
 * GET  /api/whatsapp/webhook/[chatbotId] — Meta webhook verification
 * POST /api/whatsapp/webhook/[chatbotId] — Incoming messages
 *
 * Each chatbot gets its own webhook URL so we can immediately identify
 * which chatbot an incoming WhatsApp message belongs to.
 *
 * IMPORTANT: Always return 200 quickly — Meta retries aggressively on timeouts.
 */

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decryptWhatsAppConfig } from '@/lib/whatsapp/crypto';
import { markAsRead } from '@/lib/whatsapp/client';
import { handleWhatsAppMessage } from '@/lib/whatsapp/chat';
import type {
  WhatsAppConfig,
  WhatsAppWebhookPayload,
  WhatsAppChangeValue,
} from '@/lib/whatsapp/types';
import type { Json } from '@/types/database';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Verify Meta's X-Hub-Signature-256 HMAC header against the raw request body.
 * Uses timing-safe comparison to prevent timing attacks.
 */
function verifyWhatsAppSignature(rawBody: string, signatureHeader: string, appSecret: string): boolean {
  const expected = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex');

  const expectedPrefixed = `sha256=${expected}`;

  // Both values must be the same length for timingSafeEqual
  if (signatureHeader.length !== expectedPrefixed.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader, 'utf8'),
    Buffer.from(expectedPrefixed, 'utf8')
  );
}

function parseWhatsAppConfig(raw: Json | null): WhatsAppConfig | null {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
  if (!obj) return null;
  return decryptWhatsAppConfig(obj) as unknown as WhatsAppConfig;
}

async function getWhatsAppConfig(chatbotId: string): Promise<WhatsAppConfig | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('chatbots')
    .select('whatsapp_config')
    .eq('id', chatbotId)
    .single();

  if (!data?.whatsapp_config) return null;
  return parseWhatsAppConfig(data.whatsapp_config as Json);
}

/**
 * GET — Webhook verification
 * Meta sends: hub.mode=subscribe, hub.verify_token=<token>, hub.challenge=<challenge>
 * We must return the challenge value as plain text if the verify_token matches.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode !== 'subscribe' || !token || !challenge) {
    return NextResponse.json(
      { error: 'Missing verification parameters' },
      { status: 400 }
    );
  }

  const config = await getWhatsAppConfig(chatbotId);
  if (!config || !config.verify_token) {
    return NextResponse.json(
      { error: 'WhatsApp not configured for this chatbot' },
      { status: 404 }
    );
  }

  if (token !== config.verify_token) {
    return NextResponse.json(
      { error: 'Verify token mismatch' },
      { status: 403 }
    );
  }

  // Return the challenge as plain text (required by Meta)
  return new NextResponse(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

/**
 * POST — Incoming messages
 * Process webhook events from Meta's WhatsApp Cloud API.
 * Returns 200 immediately, processes messages async.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

  // Validate chatbotId is a valid UUID
  if (!UUID_RE.test(chatbotId)) {
    return NextResponse.json({ error: 'Invalid chatbot ID' }, { status: 400 });
  }

  try {
    // Read raw body for HMAC verification before parsing JSON
    const rawBody = await request.text();

    // Verify Meta's HMAC signature
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    const signatureHeader = request.headers.get('X-Hub-Signature-256');

    if (!appSecret) {
      console.error('[WhatsApp Webhook] WHATSAPP_APP_SECRET env var not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifyWhatsAppSignature(rawBody, signatureHeader, appSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: WhatsAppWebhookPayload = JSON.parse(rawBody);

    // Validate payload structure
    if (payload.object !== 'whatsapp_business_account') {
      return NextResponse.json({ ok: true });
    }

    const config = await getWhatsAppConfig(chatbotId);
    if (!config || !config.enabled) {
      return NextResponse.json({ ok: true });
    }

    // Process each entry/change
    const messagePromises: Promise<void>[] = [];

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') continue;

        const value: WhatsAppChangeValue = change.value;

        // Skip status updates (delivery receipts, read receipts, etc.)
        if (!value.messages || value.messages.length === 0) continue;

        for (const message of value.messages) {
          // Only handle text messages for now
          if (message.type !== 'text') continue;

          // Find contact info for this sender
          const contact = value.contacts?.find((c) => c.wa_id === message.from);

          // Mark as read (fire-and-forget)
          markAsRead(config, message.id).catch(() => {});

          if (config.ai_responses_enabled) {
            // Process in background — await to keep Node.js process alive
            messagePromises.push(
              handleWhatsAppMessage(chatbotId, config, message, contact).catch((err) => {
                console.error('[WhatsApp Webhook] AI chat error:', err);
              })
            );
          }
        }
      }
    }

    // Await all message processing (Node.js runtime needs this)
    await Promise.all(messagePromises);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    // Always return 200 to prevent Meta from retrying
    return NextResponse.json({ ok: true });
  }
}
