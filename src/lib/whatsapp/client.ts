/**
 * WhatsApp Cloud API Client
 * Per-chatbot WhatsApp API wrapper for sending messages.
 * Uses the Meta Cloud API v21.0.
 */

import type { WhatsAppConfig, WhatsAppSendMessagePayload } from './types';

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';
const WHATSAPP_MAX_MSG_LENGTH = 4000; // Leave margin under 4096 hard limit

/**
 * Split text into chunks at the nearest newline or space boundary.
 * Uses 4000 char limit to leave margin under WhatsApp's 4096 hard limit.
 */
export function splitWhatsAppMessage(text: string, maxLength = WHATSAPP_MAX_MSG_LENGTH): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLength) {
    let splitIdx = remaining.lastIndexOf('\n', maxLength);
    if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(' ', maxLength);
    if (splitIdx <= 0) splitIdx = maxLength;

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

/**
 * Send a text message via WhatsApp Cloud API.
 * Automatically splits messages exceeding the 4096 char limit.
 */
export async function sendWhatsAppMessage(
  config: WhatsAppConfig,
  to: string,
  text: string
): Promise<boolean> {
  if (!config.phone_number_id || !config.access_token) {
    console.error('[WhatsApp] Phone number ID or access token not configured');
    return false;
  }

  const chunks = splitWhatsAppMessage(text);

  for (const chunk of chunks) {
    try {
      const payload: WhatsAppSendMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: false, body: chunk },
      };

      const response = await fetch(
        `${GRAPH_API_BASE}/${config.phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('[WhatsApp] API error:', response.status, data);
        return false;
      }
    } catch (error) {
      console.error('[WhatsApp] Failed to send message:', error);
      return false;
    }
  }

  return true;
}

/**
 * Mark an incoming message as read.
 * Sends blue check marks to the sender — good UX signal.
 */
export async function markAsRead(
  config: WhatsAppConfig,
  messageId: string
): Promise<void> {
  if (!config.phone_number_id || !config.access_token) return;

  try {
    await fetch(
      `${GRAPH_API_BASE}/${config.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.access_token}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        }),
      }
    );
  } catch {
    // Best-effort, don't fail on read receipts
  }
}
