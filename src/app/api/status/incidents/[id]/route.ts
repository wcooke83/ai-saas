import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError } from '@/lib/api/utils';
import type { StatusIncidentRow } from '@/types/status';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    const body = await req.json();
    const { title, affected_components, scheduled_start, scheduled_end } = body as {
      title?: string;
      affected_components?: string[];
      scheduled_start?: string | null;
      scheduled_end?: string | null;
    };

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title;
    if (affected_components !== undefined) updates.affected_components = affected_components;
    if (scheduled_start !== undefined) updates.scheduled_start = scheduled_start;
    if (scheduled_end !== undefined) updates.scheduled_end = scheduled_end;

    const supabase = createAdminClient();

    const { data, error } = await (supabase as any)
      .from('status_incidents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[status/incidents PUT] DB error:', error);
      throw APIError.internal('Failed to update incident');
    }

    return NextResponse.json({ incident: data as StatusIncidentRow });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await (supabase as any)
      .from('status_incidents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[status/incidents DELETE] DB error:', error);
      throw APIError.internal('Failed to delete incident');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
