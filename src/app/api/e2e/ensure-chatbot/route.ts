/**
 * E2E Test Helper: Ensure a chatbot exists with a specific ID
 *
 * Upserts a chatbot row so e2e tests can rely on a known chatbot ID.
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/ensure-chatbot
 * Body: { secret, chatbot_id, is_published?: boolean }
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

  const supabase = createAdminClient();

  // Look up the e2e test user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'e2e-test@test.local')
    .single();

  if (!profile?.id) {
    return NextResponse.json({ error: 'E2E test user not found' }, { status: 404 });
  }

  const { data, error } = await (supabase as any)
    .from('chatbots')
    .upsert({
      id: chatbotId,
      user_id: profile.id,
      name: body.name || 'E2E Test Bot',
      slug: body.slug || `e2e-test-bot-${chatbotId.slice(0, 8)}`,
      system_prompt: body.system_prompt || 'You are a helpful test assistant for E2E testing. Keep answers brief.',
      status: 'active',
      is_published: body.is_published ?? true,
      monthly_message_limit: body.monthly_message_limit ?? 1000,
      messages_this_month: 0,
    }, { onConflict: 'id' })
    .select('id, name, is_published, status')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, chatbot: data });
}
