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

const PostSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android']),
  chatbot_ids: z.array(z.string().uuid()).optional(),
});

const DeleteSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { token, platform, chatbot_ids } = parsed.data;
    const admin = createAdminClient();

    const { data, error } = await admin
      .from('agent_device_tokens' as any)
      .upsert(
        {
          user_id: user.id,
          token,
          platform,
          chatbot_ids: chatbot_ids ?? null,
          is_active: true,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,token' }
      )
      .select('id')
      .single();

    if (error) {
      console.error('[DeviceTokens] Upsert error:', error);
      return NextResponse.json({ error: 'Failed to register token' }, { status: 500 });
    }

    return NextResponse.json({ id: (data as { id: string }).id });
  } catch (err) {
    console.error('[DeviceTokens] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = DeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('agent_device_tokens' as any)
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('token', parsed.data.token);

    if (error) {
      console.error('[DeviceTokens] Deregister error:', error);
      return NextResponse.json({ error: 'Failed to deregister token' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DeviceTokens] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
