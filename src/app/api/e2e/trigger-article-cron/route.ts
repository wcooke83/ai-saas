/**
 * E2E Test Helper: Backdate Article Timestamps
 *
 * Backdates article_last_generated_at on a chatbot (and its prompts) so the
 * real cron endpoint considers them "due" for regeneration.
 *
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/trigger-article-cron
 * Body: { secret, chatbot_id, schedule? }
 *
 * This does NOT run regeneration — call the real cron endpoint after this.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const E2E_SECRET = process.env.E2E_TEST_SECRET;

const SCHEDULE_INTERVALS: Record<string, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  if (!E2E_SECRET) {
    return NextResponse.json({ error: 'E2E testing not enabled' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.secret !== E2E_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  const chatbotId = body.chatbot_id;
  if (!chatbotId) {
    return NextResponse.json({ error: 'chatbot_id required' }, { status: 400 });
  }

  const schedule = body.schedule || 'daily';
  if (!SCHEDULE_INTERVALS[schedule]) {
    return NextResponse.json({ error: `Invalid schedule: ${schedule}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    // Get current state so we can return it for restore
    const { data: chatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('id, name, article_schedule, article_last_generated_at')
      .eq('id', chatbotId)
      .single();

    if (fetchError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Backdate last_generated_at so the schedule interval is exceeded
    const backdatedTime = new Date(
      Date.now() - SCHEDULE_INTERVALS[schedule] - 60 * 60 * 1000,
    ).toISOString();

    await supabase
      .from('chatbots')
      .update({ article_last_generated_at: backdatedTime })
      .eq('id', chatbotId);

    // Also backdate per-prompt last_generated_at for enabled prompts
    await supabase
      .from('article_extraction_prompts')
      .update({ last_generated_at: backdatedTime })
      .eq('chatbot_id', chatbotId)
      .eq('enabled', true);

    return NextResponse.json({
      success: true,
      original_schedule: chatbot.article_schedule,
      original_last_generated: chatbot.article_last_generated_at,
      backdated_to: backdatedTime,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
