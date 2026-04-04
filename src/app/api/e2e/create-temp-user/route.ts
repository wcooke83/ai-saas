/**
 * E2E Test Helper: Create a fresh temporary user
 *
 * Creates a brand-new user with no chatbot history so onboarding-checklist
 * tests can verify the checklist displays correctly for new users.
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/create-temp-user
 * Body: { secret }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Generate unique credentials
    const email = `e2e-temp-${Date.now()}@test.local`;
    const password = 'E2eTempUser2026!';

    // 2. Create the user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'E2E Temp Test User' },
    });

    if (createError || !newUser?.user) {
      return NextResponse.json(
        { error: `createUser: ${createError?.message || 'No user returned'}` },
        { status: 500 }
      );
    }

    // 3. Wait for the profile trigger to run
    await new Promise(r => setTimeout(r, 300));

    // 4. Give the user a pro subscription
    const db = createAdminClient();
    await (db as any).from('subscriptions').upsert(
      { user_id: newUser.user.id, plan: 'pro', status: 'active' },
      { onConflict: 'user_id' }
    );

    // 5. Generate a magic link and exchange for session tokens
    const linkResult = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkResult.error || !linkResult.data) {
      return NextResponse.json(
        { error: `generateLink: ${linkResult.error?.message}` },
        { status: 500 }
      );
    }

    const token = linkResult.data.properties?.hashed_token;
    if (!token) {
      return NextResponse.json({ error: 'No hashed_token in generateLink response' }, { status: 500 });
    }

    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: verifyData, error: verifyError } = await anonClient.auth.verifyOtp({
      token_hash: token,
      type: 'magiclink',
    });

    if (verifyError || !verifyData?.session) {
      return NextResponse.json(
        { error: `verifyOtp: ${verifyError?.message}` },
        { status: 500 }
      );
    }

    // 6. Create a fresh chatbot (unpublished, no knowledge sources)
    const chatbotId = crypto.randomUUID();
    const { error: chatbotError } = await (db as any).from('chatbots').insert({
      id: chatbotId,
      user_id: newUser.user.id,
      name: 'E2E Onboarding Test Bot',
      slug: `e2e-onboarding-${chatbotId.slice(0, 8)}`,
      system_prompt: 'You are a test assistant.',
      status: 'active',
      is_published: false,
      widget_config: {},
    });

    if (chatbotError) {
      return NextResponse.json(
        { error: `create chatbot: ${chatbotError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      userId: newUser.user.id,
      chatbotId,
      accessToken: verifyData.session.access_token,
      refreshToken: verifyData.session.refresh_token,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
