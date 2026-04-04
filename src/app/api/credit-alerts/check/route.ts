import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCreditBalance } from '@/lib/usage/tracker';
import { sendCreditAlert75Email, sendCreditAlert90Email } from '@/lib/email/resend';
import { APIError, errorResponse, successResponse } from '@/lib/api/utils';
import { authenticate } from '@/lib/auth/session';

/**
 * GET /api/credit-alerts/check
 * Returns the current credit status for the authenticated user — used by the
 * dashboard UI to decide which warning banner to show.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const balance = await getCreditBalance(user.id);

    if (balance.isUnlimited) {
      return successResponse({ alertLevel: null, available: -1, isUnlimited: true });
    }

    const total = balance.totalAvailable;
    const planAllocation = balance.planAllocation;

    let alertLevel: '75' | '90' | '100' | null = null;
    if (total <= 0) {
      alertLevel = '100';
    } else if (planAllocation > 0) {
      const percentUsed = Math.round((balance.planUsed / planAllocation) * 100);
      if (percentUsed >= 90) alertLevel = '90';
      else if (percentUsed >= 75) alertLevel = '75';
    }

    return successResponse({ alertLevel, available: total, isUnlimited: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body as { userId?: string };

    if (!userId) {
      throw APIError.badRequest('userId is required');
    }

    const supabase = createAdminClient();

    // Get credit balance
    const balance = await getCreditBalance(userId);

    // Skip unlimited plans
    if (balance.isUnlimited) {
      return NextResponse.json({ checked: true, alertSent: null });
    }

    const percentUsed = Math.round((balance.planUsed / balance.planAllocation) * 100);

    // Skip if below 75%
    if (percentUsed < 75) {
      return NextResponse.json({ checked: true, alertSent: null });
    }

    // Get user email
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
    if (authError || !authData.user?.email) {
      throw APIError.notFound('User not found');
    }

    const email = authData.user.email;
    const emailLocalPart = email.split('@')[0];
    const firstName = emailLocalPart.charAt(0).toUpperCase() + emailLocalPart.slice(1);

    // Get usage row for alert tracking columns
    const { data: usageRow } = await (supabase as any)
      .from('usage')
      .select('period_start, credit_alert_75_sent_at, credit_alert_90_sent_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() as { data: { period_start: string | null; credit_alert_75_sent_at: string | null; credit_alert_90_sent_at: string | null } | null };

    const periodStart = usageRow?.period_start ? new Date(usageRow.period_start) : null;

    const alert90SentAt = usageRow?.credit_alert_90_sent_at
      ? new Date(usageRow.credit_alert_90_sent_at)
      : null;
    const alert75SentAt = usageRow?.credit_alert_75_sent_at
      ? new Date(usageRow.credit_alert_75_sent_at)
      : null;

    const alert90AlreadySent =
      alert90SentAt !== null && periodStart !== null && alert90SentAt >= periodStart;
    const alert75AlreadySent =
      alert75SentAt !== null && periodStart !== null && alert75SentAt >= periodStart;

    if (percentUsed >= 90 && !alert90AlreadySent) {
      await sendCreditAlert90Email(email, firstName);
      await (supabase as any)
        .from('usage')
        .update({ credit_alert_90_sent_at: new Date().toISOString() })
        .eq('user_id', userId);
      return NextResponse.json({ checked: true, alertSent: '90' });
    }

    if (percentUsed >= 75 && !alert75AlreadySent) {
      await sendCreditAlert75Email(email, firstName);
      await (supabase as any)
        .from('usage')
        .update({ credit_alert_75_sent_at: new Date().toISOString() })
        .eq('user_id', userId);
      return NextResponse.json({ checked: true, alertSent: '75' });
    }

    return NextResponse.json({ checked: true, alertSent: null });
  } catch (error) {
    return errorResponse(error);
  }
}
