/**
 * Cron: Regenerate Articles
 * POST /api/cron/regenerate-articles
 *
 * Finds chatbots with non-manual article_schedule (or per-prompt schedules) that are
 * due for regeneration, then regenerates their articles and embeds them as knowledge chunks.
 *
 * Supports per-prompt scheduling: prompts with schedule != 'inherit' use their own interval
 * instead of the chatbot-level default.
 *
 * Protected by CRON_SECRET env var. Call from an external scheduler (e.g. Vercel Cron,
 * GitHub Actions, or a simple crontab) with:
 *   curl -X POST https://your-app/api/cron/regenerate-articles \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateHelpArticles } from '@/lib/chatbots/articles';

const SCHEDULE_INTERVALS: Record<string, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

function isDue(lastGen: string | null, interval: number, now: number): boolean {
  const lastGenTime = lastGen ? new Date(lastGen).getTime() : 0;
  return now - lastGenTime >= interval;
}

export async function POST(req: NextRequest) {
  // Auth check
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optional: scope the run to a single chatbot (useful for testing and manual triggers)
  const { searchParams } = new URL(req.url);
  const scopedChatbotId = searchParams.get('chatbot_id') ?? undefined;

  const supabase = createAdminClient();
  const now = Date.now();
  const results: Array<{
    chatbot_id: string;
    name: string;
    schedule: string;
    articles: number;
    chunks: number;
    prompts_run: number;
    error?: string;
  }> = [];

  try {
    // Find all chatbots — we need to check both chatbot-level and per-prompt schedules
    // If chatbot_id query param is provided, scope the run to that chatbot only.
    let query = supabase
      .from('chatbots')
      .select('id, name, article_schedule, article_last_generated_at');
    if (scopedChatbotId) {
      query = query.eq('id', scopedChatbotId);
    }
    const { data: chatbots, error } = await query;

    if (error) throw error;
    if (!chatbots || chatbots.length === 0) {
      return NextResponse.json({ message: 'No chatbots found', processed: 0 });
    }

    for (const chatbot of chatbots) {
      const chatbotSchedule = (chatbot.article_schedule as string) || 'manual';

      // Fetch prompts with their individual schedules
      // schedule + last_generated_at added via migration — select * and cast
      const { data: rawPrompts } = await supabase
        .from('article_extraction_prompts')
        .select('*')
        .eq('chatbot_id', chatbot.id)
        .eq('enabled', true);

      if (!rawPrompts || rawPrompts.length === 0) continue;

      const prompts = rawPrompts as Array<{
        id: string;
        enabled: boolean;
        schedule?: string;
        last_generated_at?: string | null;
      }>;

      // Determine which prompts are due for regeneration
      const duePromptIds: string[] = [];

      for (const prompt of prompts) {
        const promptSchedule = (prompt.schedule as string) || 'inherit';
        const effectiveSchedule = promptSchedule === 'inherit' ? chatbotSchedule : promptSchedule;

        if (effectiveSchedule === 'manual') continue;

        const interval = SCHEDULE_INTERVALS[effectiveSchedule];
        if (!interval) continue;

        // Use per-prompt last_generated_at if available, fall back to chatbot-level
        const lastGen = prompt.last_generated_at || chatbot.article_last_generated_at;
        if (isDue(lastGen, interval, now)) {
          duePromptIds.push(prompt.id);
        }
      }

      if (duePromptIds.length === 0) {
        console.log(`[Cron:Articles] Skipping "${chatbot.name}" (${chatbot.id}) — no prompts due`);
        continue;
      }

      const isFullRegen = duePromptIds.length === prompts.length;
      console.log(
        `[Cron:Articles] Regenerating for "${chatbot.name}" (${chatbot.id}), ` +
        `${isFullRegen ? 'full' : `${duePromptIds.length}/${prompts.length} prompts`}, ` +
        `default_schedule=${chatbotSchedule}`
      );

      try {
        // If all prompts are due, do a full regen (more efficient — cleans up old sources)
        // Otherwise, do selective regen for just the due prompts
        const result = isFullRegen
          ? await generateHelpArticles(chatbot.id)
          : await generateHelpArticles(chatbot.id, duePromptIds);

        results.push({
          chatbot_id: chatbot.id,
          name: chatbot.name,
          schedule: chatbotSchedule,
          articles: result.count,
          chunks: result.chunksCreated,
          prompts_run: duePromptIds.length,
        });
        console.log(
          `[Cron:Articles] Done "${chatbot.name}": ${result.count} articles, ` +
          `${result.chunksCreated} chunks, ${duePromptIds.length} prompts`
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[Cron:Articles] Failed for "${chatbot.name}":`, message);
        results.push({
          chatbot_id: chatbot.id,
          name: chatbot.name,
          schedule: chatbotSchedule,
          articles: 0,
          chunks: 0,
          prompts_run: 0,
          error: message,
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} chatbot(s)`,
      processed: results.length,
      results,
    });
  } catch (err) {
    console.error('[Cron:Articles] Fatal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
