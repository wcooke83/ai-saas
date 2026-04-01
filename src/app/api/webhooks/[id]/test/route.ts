/**
 * Webhook Test Delivery Endpoint
 * POST /api/webhooks/:id/test
 *
 * Sends a test event to a webhook endpoint so the user can verify
 * their receiver is working. Uses sample payload data and records
 * the delivery attempt in audit_log like a real delivery.
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { deliverWebhook } from '@/lib/webhooks/deliver';
import { SAMPLE_PAYLOADS } from '@/lib/webhooks/sample-data';
import type { WebhookEvent } from '@/lib/webhooks/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch the webhook and verify ownership
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('id, url, secret, events, failure_count')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!webhook) throw APIError.notFound('Webhook not found');

    // Determine which event to test with
    // If the webhook is subscribed to specific events, use the first one;
    // otherwise default to conversation.started
    let testEvent: WebhookEvent = 'conversation.started';

    // Allow caller to specify an event
    let body: { event?: string } = {};
    try {
      body = await req.json();
    } catch {
      // No body is fine -- use defaults
    }

    if (body.event) {
      if (!(body.event in SAMPLE_PAYLOADS)) {
        throw APIError.badRequest(`Unknown event: ${body.event}`);
      }
      testEvent = body.event as WebhookEvent;
    } else if (webhook.events?.length) {
      testEvent = webhook.events[0] as WebhookEvent;
    }

    const samplePayload = SAMPLE_PAYLOADS[testEvent]?.[0];
    if (!samplePayload) {
      throw APIError.internal(`No sample payload for event: ${testEvent}`);
    }

    // Deliver the test webhook
    const result = await deliverWebhook(
      {
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret,
        failure_count: webhook.failure_count ?? 0,
      },
      testEvent,
      samplePayload.chatbot_id,
      samplePayload.data,
    );

    // Log the test delivery to audit_log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      entity_type: 'webhook_delivery',
      entity_id: webhook.id,
      action: result.success ? 'test_delivered' : 'test_delivery_failed',
      metadata: {
        event: testEvent,
        delivery_id: result.deliveryId,
        status_code: result.statusCode,
        attempts: result.attempts,
        error: result.error || null,
        is_test: true,
      },
    });

    return successResponse({
      success: result.success,
      event: testEvent,
      delivery_id: result.deliveryId,
      status_code: result.statusCode,
      attempts: result.attempts,
      error: result.error || null,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
