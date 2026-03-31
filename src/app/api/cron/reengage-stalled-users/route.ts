/**
 * Cron: Re-engage Stalled Users
 * POST /api/cron/reengage-stalled-users
 *
 * Finds users who signed up 24–72 hours ago but have no completed knowledge sources,
 * and sends them a nudge email to finish setting up their chatbot.
 *
 * Duplicate-send guard: profiles.reengagement_email_sent is set to true after sending.
 *
 * Protected by CRON_SECRET env var. Call from an external scheduler:
 *   curl -X POST https://your-app/api/cron/reengage-stalled-users \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendReengagementEmail } from '@/lib/email/resend';

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    const now = Date.now();
    const windowStart = new Date(now - 72 * 60 * 60 * 1000).toISOString(); // 72h ago
    const windowEnd = new Date(now - 24 * 60 * 60 * 1000).toISOString();   // 24h ago

    // Find profiles created within the 24–72h window that haven't been sent this email yet
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .gte('created_at', windowStart)
      .lte('created_at', windowEnd)
      .eq('reengagement_email_sent', false);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No eligible users in window', sent: 0, skipped: 0, details: [] });
    }

    console.log(`[Cron:ReengageStalled] Found ${profiles.length} user(s) in 24–72h window`);

    // For each profile, check if they have any completed knowledge sources.
    // Query chatbots owned by these users that have at least one completed source.
    const userIds = profiles.map((p) => p.id);

    const { data: chatbotsWithContent, error: sourcesError } = await supabase
      .from('chatbots')
      .select('user_id, knowledge_sources!inner(id)')
      .in('user_id', userIds)
      .eq('knowledge_sources.status', 'completed');

    if (sourcesError) throw sourcesError;

    // Build a set of user IDs that already have at least one completed source
    const usersWithContent = new Set<string>(
      (chatbotsWithContent ?? []).map((c) => c.user_id)
    );

    // Fetch emails via auth admin API
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (authError) throw authError;

    const emailByUserId = new Map<string, string>(
      authUsers.map((u) => [u.id, u.email ?? ''])
    );

    const sent: Array<{ id: string; email: string }> = [];
    const skipped: Array<{ id: string; reason: string }> = [];

    for (const profile of profiles) {
      if (usersWithContent.has(profile.id)) {
        skipped.push({ id: profile.id, reason: 'has_completed_source' });
        continue;
      }

      const email = emailByUserId.get(profile.id);
      if (!email) {
        skipped.push({ id: profile.id, reason: 'no_email' });
        continue;
      }

      try {
        await sendReengagementEmail(email, profile.full_name ?? undefined);
        await supabase.from('profiles').update({ reengagement_email_sent: true }).eq('id', profile.id);
        sent.push({ id: profile.id, email });
        console.log(`[Cron:ReengageStalled] Sent to ${email}`);
      } catch (err) {
        console.error(`[Cron:ReengageStalled] Failed to send to ${email}:`, err);
        skipped.push({ id: profile.id, reason: 'send_failed' });
      }
    }

    return NextResponse.json({
      message: `Sent ${sent.length} re-engagement email(s), skipped ${skipped.length}`,
      sent: sent.length,
      skipped: skipped.length,
      details: { sent, skipped },
    });
  } catch (err) {
    console.error('[Cron:ReengageStalled] Fatal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
