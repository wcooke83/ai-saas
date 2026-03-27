/**
 * E2E Test Admin Toggle
 *
 * Sets or clears is_admin on the e2e test user's profile.
 * Only works in non-production when E2E_TEST_SECRET is set.
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

  const isAdmin = body.is_admin === true;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Look up user by email in profiles table
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id')
      .eq('email', E2E_TEST_EMAIL)
      .maybeSingle();

    if (profileError || !profile) {
      // Fallback: look up via auth.users
      const { data: listData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const authUser = listData?.users?.find(u => u.email === E2E_TEST_EMAIL);
      if (!authUser) {
        return NextResponse.json(
          { error: `E2E test user not found (${E2E_TEST_EMAIL}), profileError: ${profileError?.message}` },
          { status: 404 },
        );
      }
      // Update using the auth user id
      const { error: updateError } = await adminClient
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', authUser.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, is_admin: isAdmin, user_id: authUser.id });
    }

    // Update profiles.is_admin
    const { error } = await adminClient
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', profile.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, is_admin: isAdmin, user_id: profile.id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
