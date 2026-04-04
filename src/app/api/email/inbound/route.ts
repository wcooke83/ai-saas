/**
 * Postmark Inbound Webhook
 * POST /api/email/inbound?token={POSTMARK_INBOUND_SECRET}
 *
 * Single global endpoint — chatbotId comes from payload.MailboxHash.
 * ALWAYS returns 200 to prevent Postmark retries.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleInboundEmail } from '@/lib/email/inbound-handler';
import type { PostmarkInboundPayload } from '@/lib/email/postmark-types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ok = () => NextResponse.json({ ok: true });

export async function POST(request: NextRequest) {
  try {
    // Security: verify token query param
    const secret = process.env.POSTMARK_INBOUND_SECRET;
    if (secret) {
      const token = request.nextUrl.searchParams.get('token');
      if (token !== secret) {
        // Still return 200 to avoid Postmark retry storms on misconfiguration
        console.warn('[Email:Inbound] Invalid token — dropping request');
        return ok();
      }
    }

    const payload: PostmarkInboundPayload = await request.json();

    // Extract chatbotId from MailboxHash
    const chatbotId = payload.MailboxHash?.trim();
    if (!chatbotId || !UUID_RE.test(chatbotId)) {
      console.warn('[Email:Inbound] Invalid or missing MailboxHash:', chatbotId);
      return ok();
    }

    await handleInboundEmail(chatbotId, payload);
  } catch (error) {
    console.error('[Email:Inbound] Unhandled error:', error);
    // Always 200 — prevents Postmark retries
  }

  return ok();
}
