import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const jwt = authHeader.slice(7);
  const admin = createAdminClient();
  const { data: { user }, error } = await admin.auth.getUser(jwt);
  if (error || !user) return null;
  return user;
}

const PatchSchema = z.object({
  enabled: z.boolean(),
  start: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
  end: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
  timezone: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify the token belongs to this user before updating
    const { data: existing, error: fetchError } = await admin
      .from('agent_device_tokens' as any)
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    if ((existing as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await admin
      .from('agent_device_tokens' as any)
      .update({ quiet_hours: parsed.data })
      .eq('id', id);

    if (error) {
      console.error('[DeviceTokens] Quiet hours update error:', error);
      return NextResponse.json({ error: 'Failed to update quiet hours' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DeviceTokens] PATCH quiet-hours error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
