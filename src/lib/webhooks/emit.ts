/**
 * Webhook Event Emitter
 * Looks up active webhook subscriptions for a user and dispatches matching events.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendWebhook } from '@/lib/sdk/webhook';

export async function emitWebhookEvent(
  userId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createAdminClient();

  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('id, url, secret, events, failure_count')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!webhooks?.length) return;

  // Match webhooks subscribed to this event (empty events array = subscribe to all)
  const matching = webhooks.filter(
    (wh) => !wh.events?.length || wh.events.includes(event)
  );

  if (!matching.length) return;

  await Promise.allSettled(
    matching.map(async (wh) => {
      const result = await sendWebhook(
        { url: wh.url, secret: wh.secret },
        event,
        data
      );

      await supabase
        .from('webhooks')
        .update({
          last_triggered_at: new Date().toISOString(),
          failure_count: result.success ? 0 : (wh.failure_count ?? 0) + 1,
        })
        .eq('id', wh.id);
    })
  );
}
