/**
 * E2E Test Helper: Reset rate limits
 * Only works when E2E_TEST_SECRET env var is set.
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

  const supabase = createAdminClient();
  const prefix = body.prefix || 'ticket:';

  const { error } = await supabase
    .from('chat_rate_limits')
    .delete()
    .like('key', `${prefix}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
