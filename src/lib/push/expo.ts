/**
 * Expo Push Notification Service (EPNS) wrapper
 * Sends push notifications via the Expo Push API.
 */

import { createAdminClient } from '@/lib/supabase/admin';

export interface ExpoPushMessage {
  to: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: 'default' | null;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

export interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: {
    error?: 'DeviceNotRegistered' | 'MessageTooBig' | 'MessageRateExceeded' | 'MismatchSenderId' | 'InvalidCredentials';
  };
}

interface ExpoApiResponse {
  data: ExpoPushTicket[];
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const BATCH_SIZE = 100;

/**
 * Send push notifications via EPNS in batches of 100.
 * Returns all tickets in the same order as messages.
 * Automatically marks DeviceNotRegistered tokens as inactive.
 */
export async function sendPushNotifications(
  messages: ExpoPushMessage[]
): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return [];

  const allTickets: ExpoPushTicket[] = [];

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      console.error('[Push] EPNS request failed:', response.status, await response.text());
      // Fill batch slots with error tickets so indices align
      for (const msg of batch) {
        allTickets.push({ status: 'error', message: `HTTP ${response.status}` });
        void msg; // suppress unused warning
      }
      continue;
    }

    const json: ExpoApiResponse = await response.json();
    const tickets = json.data ?? [];
    allTickets.push(...tickets);

    // Handle DeviceNotRegistered immediately
    const inactiveTokens: string[] = [];
    tickets.forEach((ticket, idx) => {
      if (
        ticket.status === 'error' &&
        ticket.details?.error === 'DeviceNotRegistered'
      ) {
        const token = batch[idx]?.to;
        if (token) inactiveTokens.push(token);
      }
    });

    if (inactiveTokens.length > 0) {
      await markTokensInactive(inactiveTokens);
    }
  }

  return allTickets;
}

async function markTokensInactive(tokens: string[]): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('agent_device_tokens' as any)
      .update({ is_active: false })
      .in('token', tokens);

    if (error) {
      console.error('[Push] Failed to mark tokens inactive:', error);
    } else {
      console.log('[Push] Marked tokens inactive (DeviceNotRegistered):', tokens.length);
    }
  } catch (err) {
    console.error('[Push] markTokensInactive error:', err);
  }
}
