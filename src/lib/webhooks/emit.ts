/**
 * Webhook Event Emitter
 * Convenience wrappers that delegate to the delivery system.
 *
 * emitWebhookEvent        — legacy caller-compatible (untyped data)
 * emitTypedWebhookEvent   — fully typed per-event payloads
 */

import { deliverWebhooksForChatbot } from './deliver';
import type { WebhookEvent, WebhookPayloadMap } from './types';

/**
 * Legacy entrypoint — accepts untyped data so existing callers don't break.
 * New code should prefer `emitTypedWebhookEvent`.
 */
export async function emitWebhookEvent(
  userId: string,
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  const chatbotId = (data.chatbot_id as string) || '';
  await deliverWebhooksForChatbot(
    chatbotId,
    userId,
    event as WebhookEvent,
    data as unknown as WebhookPayloadMap[WebhookEvent],
  );
}

/**
 * Typed entrypoint — enforces correct payload shape per event.
 */
export async function emitTypedWebhookEvent<E extends WebhookEvent>(
  userId: string,
  chatbotId: string,
  event: E,
  data: WebhookPayloadMap[E],
): Promise<void> {
  await deliverWebhooksForChatbot(chatbotId, userId, event, data);
}
