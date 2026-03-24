/**
 * Calendar Webhook Handler
 * POST /api/calendar/webhook/:provider - Receive webhooks from Cal.com and Calendly
 */

import { NextRequest } from 'next/server';
import { CalendarService } from '@/lib/calendar/service';
import type { CalendarProvider } from '@/lib/calendar/types';
import { createHmac } from 'crypto';

interface RouteParams {
  params: Promise<{ provider: string }>;
}

function verifyCalcomSignature(payload: string, signature: string | null): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  return signature === expected;
}

function verifyCalendlySignature(payload: string, signature: string | null): boolean {
  const key = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!key || !signature) return false;

  const expected = createHmac('sha256', key).update(payload).digest('hex');
  return signature === expected;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { provider } = await params;

  const validProviders: CalendarProvider[] = ['hosted_calcom', 'customer_calcom', 'calendly'];
  // Normalize: webhook URLs use 'calcom' for both hosted and customer
  const normalizedProvider = provider === 'calcom' ? 'hosted_calcom' : provider as CalendarProvider;

  if (!validProviders.includes(normalizedProvider)) {
    return new Response('Invalid provider', { status: 400 });
  }

  try {
    const rawBody = await req.text();

    // Verify webhook signatures
    if (normalizedProvider === 'hosted_calcom' || normalizedProvider === 'customer_calcom') {
      const signature = req.headers.get('x-cal-signature-256');
      if (!verifyCalcomSignature(rawBody, signature)) {
        console.warn('[Calendar:Webhook] Invalid Cal.com signature');
        return new Response('Invalid signature', { status: 401 });
      }
    } else if (normalizedProvider === 'calendly') {
      const signature = req.headers.get('calendly-webhook-signature');
      if (!verifyCalendlySignature(rawBody, signature)) {
        console.warn('[Calendar:Webhook] Invalid Calendly signature');
        return new Response('Invalid signature', { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log(`[Calendar:Webhook] Received ${provider} webhook:`, payload.triggerEvent || payload.event);

    await CalendarService.handleWebhook(normalizedProvider, payload);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('[Calendar:Webhook] Error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
