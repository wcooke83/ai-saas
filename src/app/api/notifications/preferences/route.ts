import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_PREFS = [
  'notify_new_ticket',
  'notify_new_escalation',
  'notify_product_updates',
  'notify_usage_alerts',
  'notify_marketing',
] as const;

type PrefKey = (typeof ALLOWED_PREFS)[number];

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(ALLOWED_PREFS.join(', '))
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 });
  }

  return NextResponse.json({ preferences: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Whitelist — only allow updating the 5 notification columns
  const updates: Partial<Record<PrefKey, boolean>> = {};
  for (const key of ALLOWED_PREFS) {
    if (key in body && typeof body[key] === 'boolean') {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid preference keys provided' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select(ALLOWED_PREFS.join(', '))
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }

  return NextResponse.json({ preferences: data });
}
