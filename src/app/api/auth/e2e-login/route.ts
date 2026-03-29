/**
 * E2E Test Auth Bypass
 *
 * Returns a session (access_token + refresh_token) for a test user.
 * The Playwright test then uses setSession() on the client to establish auth.
 * Only works when E2E_TEST_SECRET env var is set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const E2E_SECRET = process.env.E2E_TEST_SECRET;
const E2E_TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'e2e-test@test.local';

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

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Try to generate a magic link — this fails if user doesn't exist
    let linkResult = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: E2E_TEST_EMAIL,
    });

    // If user doesn't exist, create and retry
    if (linkResult.error) {
      await adminClient.auth.admin.createUser({
        email: E2E_TEST_EMAIL,
        password: 'e2e-test-password-2026',
        email_confirm: true,
        user_metadata: { full_name: 'E2E Test User' },
      });
      await new Promise(r => setTimeout(r, 500));

      linkResult = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: E2E_TEST_EMAIL,
      });
    }

    // Always ensure E2E user has pro subscription so tests can create chatbots etc.
    const { createClient: createAdmin } = await import('@/lib/supabase/admin');
    const db = createAdmin();
    const { data: users } = await adminClient.auth.admin.listUsers();
    const e2eUser = users?.users?.find(u => u.email === E2E_TEST_EMAIL);
    if (e2eUser) {
      await (db as any).from('subscriptions').upsert(
        { user_id: e2eUser.id, plan: 'pro', status: 'active' },
        { onConflict: 'user_id' }
      );
    }

    if (linkResult.error || !linkResult.data) {
      return NextResponse.json({ error: `generateLink: ${linkResult.error?.message}` }, { status: 500 });
    }

    const token = linkResult.data.properties?.hashed_token;
    if (!token) {
      return NextResponse.json({ error: 'No hashed_token' }, { status: 500 });
    }

    // Exchange the OTP for a session using anon key
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: verifyData, error: verifyError } = await anonClient.auth.verifyOtp({
      token_hash: token,
      type: 'magiclink',
    });

    if (verifyError || !verifyData?.session) {
      return NextResponse.json({ error: `verifyOtp: ${verifyError?.message}` }, { status: 500 });
    }

    // Return the tokens — the Playwright test will use setSession() client-side
    return NextResponse.json({
      success: true,
      user_id: verifyData.user!.id,
      email: verifyData.user!.email,
      access_token: verifyData.session.access_token,
      refresh_token: verifyData.session.refresh_token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
