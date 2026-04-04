/**
 * GET /api/credit-alerts/check
 * Returns the current user's full credit status and alert level.
 * Called by the dashboard on page load and periodically for the credit meter UI.
 * Also records the first crossing of 75% / 90% thresholds per billing period.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCreditStatus } from '@/lib/usage/tracker';
import { APIError, errorResponse } from '@/lib/api/utils';

type AlertLevel = '75' | '90' | '100' | null;

function computeAlertLevel(
  planUsed: number,
  planLimit: number,
  totalAvailable: number
): AlertLevel {
  if (planLimit <= 0) return null;
  if (totalAvailable <= 0) return '100';
  const pct = (planUsed / planLimit) * 100;
  if (pct >= 90) return '90';
  if (pct >= 75) return '75';
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw APIError.unauthorized();
    }

    const adminClient = createAdminClient();

    const status = await getCreditStatus(user.id, adminClient);

    const alertLevel = computeAlertLevel(
      status.plan_credits_used,
      status.plan_credits_limit,
      status.total_available
    );

    // Record threshold crossings (fire-and-forget — never re-set if already set this period)
    if (alertLevel === '90' || alertLevel === '100') {
      void markAlertIfNew(adminClient, user.id, '90');
    } else if (alertLevel === '75') {
      void markAlertIfNew(adminClient, user.id, '75');
    }

    return NextResponse.json({
      plan_credits_limit: status.plan_credits_limit,
      plan_credits_used: status.plan_credits_used,
      plan_credits_remaining: status.plan_credits_remaining,
      purchased_credits: status.purchased_credits,
      bonus_credits: status.bonus_credits,
      total_available: status.total_available,
      auto_topup_enabled: status.auto_topup_enabled,
      period_end: status.period_end,
      plan_slug: status.plan_slug,
      alert_level: alertLevel,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Sets credit_alert_75_sent_at or credit_alert_90_sent_at on the usage row
 * only if it hasn't been set during the current billing period.
 */
async function markAlertIfNew(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any,
  userId: string,
  threshold: '75' | '90'
): Promise<void> {
  try {
    const col =
      threshold === '75' ? 'credit_alert_75_sent_at' : 'credit_alert_90_sent_at';

    const { data: row } = await adminClient
      .from('usage')
      .select(`period_start, ${col}`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() as {
        data: { period_start: string | null; [key: string]: string | null } | null
      };

    if (!row) return;

    const periodStart = row.period_start ? new Date(row.period_start) : null;
    const sentAt = row[col] ? new Date(row[col] as string) : null;

    // Already set this period — skip
    if (sentAt && periodStart && sentAt >= periodStart) return;

    await adminClient
      .from('usage')
      .update({ [col]: new Date().toISOString() })
      .eq('user_id', userId);
  } catch (err) {
    console.error(`[credit-alerts/check] markAlertIfNew(${threshold}) failed:`, err);
  }
}
