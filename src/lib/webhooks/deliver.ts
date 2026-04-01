/**
 * Webhook Delivery System
 * Sends signed webhook payloads with retry logic and delivery tracking.
 */

import { createHmac, randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  WebhookEvent,
  WebhookEnvelope,
  WebhookPayloadMap,
  WebhookSubscription,
  DeliveryResult,
} from './types';
import { validateWebhookURL } from './url-validation';

// ── Constants ──────────────────────────────────────────────────────

const MAX_RETRIES = 4;
const CONNECT_TIMEOUT_MS = 5_000;
const RESPONSE_TIMEOUT_MS = 30_000;
const CIRCUIT_BREAKER_THRESHOLD = 10; // disable after N consecutive failures

// ── Signature ──────────────────────────────────────────────────────

export function signPayload(body: string, secret: string, timestamp: string): string {
  return createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
}

// ── Single Delivery ────────────────────────────────────────────────

export async function deliverWebhook<E extends WebhookEvent>(
  subscription: Pick<WebhookSubscription, 'id' | 'url' | 'secret' | 'failure_count'>,
  event: E,
  chatbotId: string,
  data: WebhookPayloadMap[E],
): Promise<DeliveryResult> {
  const deliveryId = randomUUID();
  const timestamp = new Date().toISOString();

  const envelope: WebhookEnvelope<WebhookPayloadMap[E]> = {
    event,
    chatbot_id: chatbotId,
    timestamp,
    delivery_id: deliveryId,
    version: 'v1',
    data,
  };

  // Defense-in-depth: re-validate URL at delivery time to catch DNS rebinding
  const urlCheck = await validateWebhookURL(subscription.url);
  if (!urlCheck.valid) {
    return {
      success: false,
      error: `URL validation failed: ${urlCheck.error}`,
      attempts: 0,
      deliveryId,
    };
  }

  const body = JSON.stringify(envelope);
  const unixTimestamp = Math.floor(Date.now() / 1000).toString();
  const signature = signPayload(body, subscription.secret, unixTimestamp);

  let lastError: string | undefined;
  let attempts = 0;
  let statusCode: number | undefined;

  for (let i = 0; i < MAX_RETRIES; i++) {
    attempts++;
    const controller = new AbortController();
    const connectTimer = setTimeout(() => controller.abort(), CONNECT_TIMEOUT_MS);
    const responseTimer = setTimeout(() => controller.abort(), RESPONSE_TIMEOUT_MS);

    try {
      const response = await fetch(subscription.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VocUI-Event': event,
          'X-VocUI-Signature': `sha256=${signature}`,
          'X-VocUI-Delivery-ID': deliveryId,
          'X-VocUI-Timestamp': unixTimestamp,
          'User-Agent': 'VocUI-Webhooks/1.0',
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(connectTimer);
      clearTimeout(responseTimer);
      statusCode = response.status;

      if (response.ok) {
        return { success: true, statusCode, attempts, deliveryId };
      }

      lastError = `HTTP ${response.status}`;

      // Don't retry 4xx (client errors) except 429 (rate limited)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        break;
      }
    } catch (error) {
      clearTimeout(connectTimer);
      clearTimeout(responseTimer);
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Exponential backoff: 1s, 2s, 4s, 8s
    if (i < MAX_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }

  return { success: false, statusCode, error: lastError, attempts, deliveryId };
}

// ── Fan-out to All Matching Subscriptions ──────────────────────────

export async function deliverWebhooksForChatbot<E extends WebhookEvent>(
  chatbotId: string,
  userId: string,
  event: E,
  data: WebhookPayloadMap[E],
): Promise<void> {
  const supabase = createAdminClient();

  // Fetch active subscriptions for this user that either:
  //   a) have no chatbot_id (account-wide), or
  //   b) match this chatbot_id
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('id, url, secret, events, failure_count')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!webhooks?.length) return;

  const matching = webhooks.filter((wh) => {
    // Event filter: empty array or null = all events
    const eventMatch = !wh.events?.length || wh.events.includes(event);
    // Circuit breaker: skip endpoints that have been failing
    const belowThreshold = (wh.failure_count ?? 0) < CIRCUIT_BREAKER_THRESHOLD;
    return eventMatch && belowThreshold;
  });

  if (!matching.length) return;

  await Promise.allSettled(
    matching.map(async (wh) => {
      const result = await deliverWebhook(
        { id: wh.id, url: wh.url, secret: wh.secret, failure_count: wh.failure_count ?? 0 },
        event,
        chatbotId,
        data,
      );

      // Update delivery tracking
      await supabase
        .from('webhooks')
        .update({
          last_triggered_at: new Date().toISOString(),
          failure_count: result.success ? 0 : (wh.failure_count ?? 0) + 1,
        })
        .eq('id', wh.id);

      // Log delivery attempt to audit_log
      await supabase.from('audit_log').insert({
        user_id: userId,
        entity_type: 'webhook_delivery',
        entity_id: wh.id,
        action: result.success ? 'delivered' : 'delivery_failed',
        metadata: {
          event,
          chatbot_id: chatbotId,
          delivery_id: result.deliveryId,
          status_code: result.statusCode,
          attempts: result.attempts,
          error: result.error || null,
        },
      });
    }),
  );
}
