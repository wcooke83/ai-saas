import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError } from '@/lib/api/utils';
import type { ComponentStatus, StatusComponentRow } from '@/types/status';

const VALID_STATUSES: ComponentStatus[] = ['operational', 'degraded', 'outage', 'maintenance'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: ComponentStatus };

    if (!VALID_STATUSES.includes(status)) {
      throw APIError.badRequest(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const supabase = createAdminClient();

    const { data, error } = await (supabase as any)
      .from('status_components')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[status/components PATCH] DB error:', error);
      throw APIError.internal('Failed to update component status');
    }

    return NextResponse.json({ component: data as StatusComponentRow });
  } catch (err) {
    return errorResponse(err);
  }
}
