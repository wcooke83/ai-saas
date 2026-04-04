/**
 * Push notification dispatch for handoff escalations.
 * Called fire-and-forget after a handoff session is created.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendPushNotifications, type ExpoPushMessage } from './expo';

export interface HandoffPushParams {
  chatbotId: string;
  handoffId: string;
  conversationId: string;
  visitorName?: string;
  reason: string;
  chatbotName: string;
}

interface DeviceToken {
  id: string;
  token: string;
  user_id: string;
  chatbot_ids: string[] | null;
  quiet_hours: QuietHours | null;
}

interface QuietHours {
  enabled: boolean;
  start: string;   // "HH:MM" 24h
  end: string;     // "HH:MM" 24h
  timezone: string;
}

/**
 * Returns true if the current time is within the quiet hours window.
 * Handles overnight ranges (e.g. 22:00 → 07:00).
 */
export function isInQuietHours(qh: QuietHours): boolean {
  if (!qh.enabled) return false;

  let now: Date;
  try {
    now = new Date(
      new Date().toLocaleString('en-US', { timeZone: qh.timezone })
    );
  } catch {
    now = new Date();
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = qh.start.split(':').map(Number);
  const [endH, endM] = qh.end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Same-day range e.g. 08:00 → 20:00
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Overnight range e.g. 22:00 → 07:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

/**
 * Dispatch push notifications to all eligible agents when a handoff is created.
 * Export as fire-and-forget — caller wraps in .catch(() => {}).
 */
export async function dispatchHandoffPushNotifications(
  params: HandoffPushParams
): Promise<void> {
  const supabase = createAdminClient();

  // Get chatbot owner
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('user_id')
    .eq('id', params.chatbotId)
    .single();

  if (!chatbot?.user_id) {
    console.warn('[Push] No chatbot owner found for chatbot:', params.chatbotId);
    return;
  }

  const recipientIds = [chatbot.user_id];

  // Collect eligible tokens across all recipients
  const eligibleTokens: DeviceToken[] = [];

  for (const userId of recipientIds) {
    const { data: tokens } = await supabase
      .from('agent_device_tokens' as any)
      .select('id, token, user_id, chatbot_ids, quiet_hours')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!tokens) continue;

    for (const row of tokens as DeviceToken[]) {
      // Filter by chatbot scope if set
      if (row.chatbot_ids && row.chatbot_ids.length > 0) {
        if (!row.chatbot_ids.includes(params.chatbotId)) continue;
      }

      // Filter by quiet hours
      if (row.quiet_hours && isInQuietHours(row.quiet_hours)) continue;

      eligibleTokens.push(row);
    }
  }

  if (eligibleTokens.length === 0) {
    console.log('[Push] No eligible tokens for handoff:', params.handoffId);
    return;
  }

  // Get pending handoff count for badge (all pending handoffs for this chatbot's owner)
  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('id')
    .eq('user_id', chatbot.user_id);

  const chatbotIds = (chatbots ?? []).map((c: { id: string }) => c.id);

  let pendingCount = 0;
  if (chatbotIds.length > 0) {
    const { count } = await supabase
      .from('telegram_handoff_sessions')
      .select('id', { count: 'exact', head: true })
      .in('chatbot_id', chatbotIds)
      .eq('status', 'pending');
    pendingCount = count ?? 0;
  }

  // Build messages
  const body = params.visitorName
    ? `${params.visitorName} needs help`
    : 'A visitor needs help';

  const messages: ExpoPushMessage[] = eligibleTokens.map((t) => ({
    to: t.token,
    title: 'New conversation',
    body,
    data: {
      screen: 'handoff',
      handoff_id: params.handoffId,
      conversation_id: params.conversationId,
      chatbot_id: params.chatbotId,
      chatbot_name: params.chatbotName,
    },
    badge: pendingCount,
    sound: 'default',
    channelId: 'handoffs',
    priority: 'high',
  }));

  const tickets = await sendPushNotifications(messages);

  // Log DeviceNotRegistered errors to audit_log
  const failedTokenIds: string[] = [];
  tickets.forEach((ticket, idx) => {
    if (
      ticket.status === 'error' &&
      ticket.details?.error === 'DeviceNotRegistered'
    ) {
      const tokenRow = eligibleTokens[idx];
      if (tokenRow) failedTokenIds.push(tokenRow.id);
    }
  });

  if (failedTokenIds.length > 0) {
    const { error: auditError } = await supabase.from('audit_log').insert(
      failedTokenIds.map((tokenId) => ({
        user_id: chatbot.user_id,
        action: 'push_delivery_failed',
        entity_type: 'push_delivery',
        entity_id: tokenId,
        metadata: {
          reason: 'DeviceNotRegistered',
          handoff_id: params.handoffId,
          chatbot_id: params.chatbotId,
        } as any,
      }))
    );
    if (auditError) {
      console.error('[Push] Failed to write audit log:', auditError);
    }
  }

  console.log('[Push] Handoff notifications dispatched:', {
    handoffId: params.handoffId,
    sent: messages.length,
    failed: failedTokenIds.length,
  });
}
