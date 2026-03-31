/**
 * Zapier Subscribe Endpoint
 * POST /api/zapier/subscribe
 *
 * Zapier calls this with a target_url when a user enables a trigger.
 * We create a webhook subscription and return its ID.
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { WEBHOOK_EVENT_NAMES, type WebhookEvent } from '@/lib/webhooks/types';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    const user = await authenticateAPIKeyStrict(authHeader);

    const body = await req.json();
    const { target_url, event, chatbot_id } = body as {
      target_url: string;
      event?: string;
      chatbot_id?: string;
    };

    if (!target_url || typeof target_url !== 'string') {
      return NextResponse.json({ error: 'target_url is required' }, { status: 400 });
    }

    // Validate event if provided
    const events: WebhookEvent[] = [];
    if (event) {
      if (!WEBHOOK_EVENT_NAMES.includes(event as WebhookEvent)) {
        return NextResponse.json(
          { error: `Invalid event: ${event}. Valid: ${WEBHOOK_EVENT_NAMES.join(', ')}` },
          { status: 400 },
        );
      }
      events.push(event as WebhookEvent);
    }

    // If chatbot_id provided, verify ownership
    if (chatbot_id) {
      const admin = createAdminClient();
      const { data: chatbot } = await admin
        .from('chatbots')
        .select('id')
        .eq('id', chatbot_id)
        .eq('user_id', user.id)
        .single();

      if (!chatbot) {
        return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
      }
    }

    const secret = randomBytes(32).toString('hex');
    const admin = createAdminClient();

    const { data: webhook, error } = await admin
      .from('webhooks')
      .insert({
        user_id: user.id,
        url: target_url,
        secret,
        events: events.length > 0 ? events : null,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Zapier:Subscribe] Insert failed:', error);
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }

    // Zapier expects the subscription ID so it can unsubscribe later
    return NextResponse.json({ id: webhook.id });
  } catch (err) {
    console.error('[Zapier:Subscribe] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
