import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError } from '@/lib/api/utils';
import type { StatusIncidentUpdateRow, StatusIncidentRow, UpdateStatus } from '@/types/status';

const VALID_UPDATE_STATUSES: UpdateStatus[] = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    const body = await req.json();
    const { message, status } = body as { message: string; status: UpdateStatus };

    if (!message?.trim()) {
      throw APIError.badRequest('message is required');
    }
    if (!VALID_UPDATE_STATUSES.includes(status)) {
      throw APIError.badRequest(`Invalid status. Must be one of: ${VALID_UPDATE_STATUSES.join(', ')}`);
    }

    const supabase = createAdminClient();

    // Insert the update row
    const { data: update, error: updateError } = await (supabase as any)
      .from('status_incident_updates')
      .insert({
        incident_id: id,
        message,
        status,
      })
      .select()
      .single();

    if (updateError) {
      console.error('[status/incidents/updates POST] DB error inserting update:', updateError);
      throw APIError.internal('Failed to add update');
    }

    // Update the incident status
    const incidentUpdate: Record<string, unknown> = {
      status: status.toLowerCase(),
      updated_at: new Date().toISOString(),
    };

    if (status === 'Resolved') {
      incidentUpdate.resolved_at = new Date().toISOString();
    }

    const { data: incident, error: incidentError } = await (supabase as any)
      .from('status_incidents')
      .update(incidentUpdate)
      .eq('id', id)
      .select()
      .single();

    if (incidentError) {
      console.error('[status/incidents/updates POST] DB error updating incident:', incidentError);
      // Update was inserted; don't fail the request
    }

    return NextResponse.json(
      { update: update as StatusIncidentUpdateRow, incident: incident as StatusIncidentRow | null },
      { status: 201 }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
