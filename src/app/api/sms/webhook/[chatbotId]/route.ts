/**
 * Per-Chatbot SMS Webhook Handler
 * POST /api/sms/webhook/[chatbotId] — Incoming SMS from Twilio
 *
 * Twilio sends form-encoded POST body (NOT JSON).
 * Always returns HTTP 200 with TwiML XML — non-200 causes Twilio to retry.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decryptSmsConfig } from '@/lib/sms/crypto';
import { verifyTwilioSignature } from '@/lib/sms/signature';
import { isSmsMessageDuplicate } from '@/lib/sms/rate-limit';
import { handleSmsMessage } from '@/lib/sms/chat';
import { DEFAULT_SMS_CONFIG } from '@/lib/sms/types';
import type { SmsConfig } from '@/lib/sms/types';
import type { Json } from '@/types/database';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Escape special XML characters in AI-generated output.
 * Prevents TwiML parse failures on &, <, >, ", '
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function twimlResponse(message: string | null): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}

function parseSmsConfig(raw: Json | null): SmsConfig | null {
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
  if (!obj) return null;
  const merged = { ...DEFAULT_SMS_CONFIG, ...obj };
  return decryptSmsConfig(merged as Record<string, unknown>) as unknown as SmsConfig;
}

async function getSmsConfig(chatbotId: string): Promise<SmsConfig | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('chatbots')
    .select('sms_config')
    .eq('id', chatbotId)
    .single();

  if (!data?.sms_config) return null;
  return parseSmsConfig(data.sms_config as Json);
}

/**
 * POST — Incoming SMS from Twilio
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params;

  // Validate chatbotId format
  if (!UUID_RE.test(chatbotId)) {
    // Still return 200 to avoid Twilio retry loops on bad URLs
    return twimlResponse(null);
  }

  try {
    // Read raw body — Twilio sends form-encoded, NOT JSON
    const rawBody = await request.text();
    const formParams = Object.fromEntries(new URLSearchParams(rawBody)) as Record<string, string>;

    const { MessageSid, From, Body, NumMedia } = formParams;

    // Verify Twilio signature (HMAC-SHA1) before loading any config.
    // AccountSid is not a secret so it is not used as an authentication gate.
    const signature = request.headers.get('X-Twilio-Signature') || '';
    if (!signature) {
      console.warn(`[SMS Webhook] Missing X-Twilio-Signature for chatbot ${chatbotId}`);
      return twimlResponse(null);
    }

    // Load SMS config for this chatbot — needed to get the per-chatbot auth_token
    const config = await getSmsConfig(chatbotId);
    if (!config || !config.enabled) {
      return twimlResponse(null);
    }

    if (!config.auth_token) {
      console.error(`[SMS Webhook] No auth_token configured for chatbot ${chatbotId}`);
      return twimlResponse(null);
    }

    // Reconstruct the URL from NEXT_PUBLIC_APP_URL — NOT request.url (Vercel proxy changes host)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
    const webhookUrl = `${baseUrl}/api/sms/webhook/${chatbotId}`;

    if (!verifyTwilioSignature(config.auth_token, signature, webhookUrl, formParams)) {
      console.warn(`[SMS Webhook] Invalid Twilio signature for chatbot ${chatbotId}`);
      return twimlResponse(null);
    }

    // Deduplicate: Twilio may deliver the same webhook multiple times
    if (MessageSid && isSmsMessageDuplicate(MessageSid)) {
      console.log(`[SMS Webhook] Skipping duplicate message ${MessageSid}`);
      return twimlResponse(null);
    }

    // Skip MMS media-only messages (no text body)
    const numMedia = parseInt(NumMedia || '0', 10);
    if (numMedia > 0 && !Body) {
      return twimlResponse(null);
    }

    if (!config.ai_responses_enabled) {
      return twimlResponse(null);
    }

    // Process through AI pipeline
    const reply = await handleSmsMessage(chatbotId, config, From, Body || '');

    return twimlResponse(reply);
  } catch (error) {
    console.error('[SMS Webhook] Error:', error);
    // Always return 200 to prevent Twilio from retrying
    return twimlResponse(null);
  }
}
