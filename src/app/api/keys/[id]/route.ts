import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, allowed_domains } = body;

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Name must be a non-empty string' }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (allowed_domains !== undefined) {
      if (allowed_domains !== null) {
        if (!Array.isArray(allowed_domains)) {
          return NextResponse.json({ error: 'allowed_domains must be an array or null' }, { status: 400 });
        }
        if (!allowed_domains.every((d: unknown) => typeof d === 'string')) {
          return NextResponse.json({ error: 'allowed_domains must contain only strings' }, { status: 400 });
        }
        // Normalize domains: trim, lowercase, remove empty
        updates.allowed_domains = allowed_domains
          .map((d: string) => d.trim().toLowerCase())
          .filter((d: string) => d.length > 0);
      } else {
        updates.allowed_domains = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await (supabase as any)
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, name, key_prefix, scopes, allowed_domains, last_used_at, expires_at, created_at')
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}
