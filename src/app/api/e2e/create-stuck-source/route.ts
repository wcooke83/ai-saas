/**
 * E2E Test Helper: Create a Stuck Knowledge Source
 *
 * Creates a knowledge source with status 'processing' and a backdated created_at
 * to simulate a source that got stuck during processing.
 *
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/create-stuck-source
 * Body: { secret, chatbot_id, minutes_ago?: number, with_partial_chunks?: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const E2E_SECRET = process.env.E2E_TEST_SECRET;

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

  const minutesAgo = body.minutes_ago ?? 30;
  const supabase = createAdminClient();

  try {
    const backdatedTime = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

    // Create a knowledge source stuck in 'processing' with a backdated created_at.
    // The cron checks created_at (not updated_at) because updated_at has a trigger.
    const { data: source, error } = await supabase
      .from('knowledge_sources')
      .insert({
        chatbot_id: chatbotId,
        type: 'text',
        name: `E2E Stuck Source ${Date.now()}`,
        content: 'This is a test source that simulates being stuck in processing.',
        status: 'processing',
        created_at: backdatedTime,
      } as any)
      .select()
      .single();

    if (error || !source) {
      return NextResponse.json({ error: error?.message || 'Failed to create source' }, { status: 500 });
    }

    // Optionally insert some partial chunks to test cleanup
    if (body.with_partial_chunks) {
      await supabase.from('knowledge_chunks').insert({
        source_id: source.id,
        chatbot_id: chatbotId,
        content: 'Partial chunk from stuck processing',
        content_hash: `e2e_stuck_${Date.now()}`,
        embedding: JSON.stringify(new Array(1536).fill(0)),
        chunk_index: 0,
        token_count: 5,
        metadata: {},
      });
    }

    return NextResponse.json({
      success: true,
      source_id: source.id,
      backdated_to: backdatedTime,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
