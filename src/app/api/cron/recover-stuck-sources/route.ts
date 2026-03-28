/**
 * Cron: Recover Stuck Knowledge Sources
 * POST /api/cron/recover-stuck-sources
 *
 * Finds knowledge sources stuck in 'processing' for more than 15 minutes,
 * marks them as 'failed', and cleans up any partial chunks.
 *
 * Protected by CRON_SECRET env var. Call from an external scheduler:
 *   curl -X POST https://your-app/api/cron/recover-stuck-sources \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const STUCK_THRESHOLD_MINUTES = 15;

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
    const cutoff = new Date(Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000).toISOString();

    // Find sources stuck in 'processing' longer than threshold.
    // Uses created_at because updated_at has a BEFORE UPDATE trigger that
    // auto-sets it to now() on every update, making it unreliable for age checks.
    const { data: stuckSources, error: fetchError } = await supabase
      .from('knowledge_sources')
      .select('id, chatbot_id, name, created_at')
      .eq('status', 'processing')
      .lt('created_at', cutoff);

    if (fetchError) throw fetchError;

    if (!stuckSources || stuckSources.length === 0) {
      return NextResponse.json({ message: 'No stuck sources found', recovered: 0 });
    }

    console.log(`[Cron:RecoverStuck] Found ${stuckSources.length} stuck source(s)`);

    const recovered: Array<{ id: string; name: string; chatbot_id: string; partial_chunks_deleted: number }> = [];

    for (const source of stuckSources) {
      // Delete partial chunks for this source
      const { count } = await supabase
        .from('knowledge_chunks')
        .delete({ count: 'exact' })
        .eq('source_id', source.id);

      // Mark as failed
      await supabase
        .from('knowledge_sources')
        .update({
          status: 'failed',
          error_message: `Processing timed out after ${STUCK_THRESHOLD_MINUTES} minutes. Click reprocess to try again.`,
        })
        .eq('id', source.id);

      recovered.push({
        id: source.id,
        name: source.name,
        chatbot_id: source.chatbot_id,
        partial_chunks_deleted: count || 0,
      });

      console.log(
        `[Cron:RecoverStuck] Recovered "${source.name}" (${source.id}), deleted ${count || 0} partial chunks`
      );
    }

    return NextResponse.json({
      message: `Recovered ${recovered.length} stuck source(s)`,
      recovered: recovered.length,
      details: recovered,
    });
  } catch (err) {
    console.error('[Cron:RecoverStuck] Fatal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
