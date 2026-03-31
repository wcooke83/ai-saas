/**
 * Zapier Unsubscribe Endpoint
 * DELETE /api/zapier/unsubscribe
 *
 * Zapier calls this when a user disables a trigger.
 * Expects { id } in the body — the subscription ID returned from /subscribe.
 *
 * Auth: Bearer API key (from api_keys table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAPIKeyStrict } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
    const user = await authenticateAPIKeyStrict(authHeader);

    const body = await req.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Only delete if it belongs to this user
    const { data: existing } = await admin
      .from('webhooks')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const { error } = await admin
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Zapier:Unsubscribe] Delete failed:', error);
      return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Zapier:Unsubscribe] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    const status = message.includes('API key') || message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
