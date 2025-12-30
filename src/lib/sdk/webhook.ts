/**
 * Webhook Utilities
 * For sending events to external systems
 */

import { createHash, createHmac } from 'crypto';

// ===================
// TYPES
// ===================

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events?: string[];
  retries?: number;
}

export interface WebhookResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  attempts: number;
}

// ===================
// SIGNATURE GENERATION
// ===================

/**
 * Generate webhook signature
 */
export function generateSignature(
  payload: string,
  secret: string,
  timestamp: string
): string {
  const signedPayload = `${timestamp}.${payload}`;
  return createHmac('sha256', secret).update(signedPayload).digest('hex');
}

/**
 * Verify webhook signature (for incoming webhooks)
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string,
  timestamp: string,
  tolerance = 300 // 5 minutes
): boolean {
  // Check timestamp is recent
  const timestampNum = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestampNum) > tolerance) {
    return false;
  }

  // Verify signature
  const expectedSignature = generateSignature(payload, secret, timestamp);
  return timingSafeEqual(signature, expectedSignature);
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  return require('crypto').timingSafeEqual(bufA, bufB);
}

// ===================
// WEBHOOK SENDING
// ===================

/**
 * Send webhook to external URL
 */
export async function sendWebhook(
  config: WebhookConfig,
  event: string,
  data: Record<string, unknown>
): Promise<WebhookResult> {
  const { url, secret, retries = 3 } = config;

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const payloadString = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(payloadString, secret, timestamp);

  let lastError: string | undefined;
  let attempts = 0;

  for (let i = 0; i < retries; i++) {
    attempts++;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': timestamp,
          'X-Webhook-Event': event,
        },
        body: payloadString,
      });

      if (response.ok) {
        return {
          success: true,
          statusCode: response.status,
          attempts,
        };
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`;

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        break;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Exponential backoff
    if (i < retries - 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  return {
    success: false,
    error: lastError,
    attempts,
  };
}

// ===================
// WEBHOOK EVENTS
// ===================

export const WEBHOOK_EVENTS = {
  // Generation events
  'generation.started': 'When a generation request is received',
  'generation.completed': 'When generation finishes successfully',
  'generation.failed': 'When generation fails',

  // Usage events
  'usage.limit_reached': 'When usage limit is reached',
  'usage.threshold_reached': 'When usage hits 80% of limit',

  // Subscription events
  'subscription.created': 'When user subscribes',
  'subscription.updated': 'When subscription changes',
  'subscription.canceled': 'When subscription is canceled',

  // API key events
  'api_key.created': 'When new API key is created',
  'api_key.deleted': 'When API key is deleted',
} as const;

export type WebhookEventType = keyof typeof WEBHOOK_EVENTS;
