import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { StatusComponentRow } from '@/types/status';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('status_components')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[status/components GET] DB error:', error);
      return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
    }

    return NextResponse.json({ components: (data ?? []) as StatusComponentRow[] });
  } catch (err) {
    console.error('[status/components GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
