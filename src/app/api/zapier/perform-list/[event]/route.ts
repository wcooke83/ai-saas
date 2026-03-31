/**
 * Zapier Perform List Endpoint
 * GET /api/zapier/perform-list/:event
 *
 * Returns sample payloads for a given event type.
 * Zapier uses this to populate field mappings in the trigger editor.
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { WEBHOOK_EVENT_NAMES, type WebhookEvent } from '@/lib/webhooks/types';
import { SAMPLE_PAYLOADS } from '@/lib/webhooks/sample-data';

interface RouteParams {
  params: Promise<{ event: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    await authenticateAPIKeyStrict(authHeader);

    const { event } = await params;

    if (!WEBHOOK_EVENT_NAMES.includes(event as WebhookEvent)) {
      return NextResponse.json(
        { error: `Unknown event: ${event}. Valid: ${WEBHOOK_EVENT_NAMES.join(', ')}` },
        { status: 400 },
      );
    }

    const samples = SAMPLE_PAYLOADS[event as WebhookEvent] ?? [];

    // Zapier expects an array of objects
    return NextResponse.json(samples);
  } catch (err) {
    console.error('[Zapier:PerformList] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
