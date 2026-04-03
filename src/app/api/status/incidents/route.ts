import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError } from '@/lib/api/utils';
import type { StatusIncidentRow, UpdateStatus } from '@/types/status';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = req.nextUrl;

    const active = searchParams.get('active') === 'true';
    const maintenance = searchParams.get('maintenance') === 'true';
    const resolved = searchParams.get('resolved') === 'true';

    let query = (supabase as any).from('status_incidents').select('*');

    if (active) {
      query = query.is('resolved_at', null).eq('is_maintenance', false);
    } else if (maintenance) {
      query = query.eq('is_maintenance', true).gt('scheduled_end', new Date().toISOString());
    } else if (resolved) {
      query = query
        .not('resolved_at', 'is', null)
        .eq('is_maintenance', false)
        .order('resolved_at', { ascending: false })
        .limit(20);
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (!resolved) {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('[status/incidents GET] DB error:', error);
      return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
    }

    return NextResponse.json({ incidents: (data ?? []) as StatusIncidentRow[] });
  } catch (err) {
    console.error('[status/incidents GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    const {
      title,
      affected_components,
      initial_message,
      initial_status,
      is_maintenance,
      scheduled_start,
      scheduled_end,
    } = body as {
      title: string;
      affected_components: string[];
      initial_message?: string;
      initial_status?: UpdateStatus;
      is_maintenance: boolean;
      scheduled_start?: string;
      scheduled_end?: string;
    };

    if (!title?.trim()) {
      throw APIError.badRequest('Title is required');
    }
    if (!Array.isArray(affected_components)) {
      throw APIError.badRequest('affected_components must be an array');
    }
    if (!is_maintenance && !initial_message?.trim()) {
      throw APIError.badRequest('initial_message is required for incidents');
    }
    if (!is_maintenance && !initial_status) {
      throw APIError.badRequest('initial_status is required for incidents');
    }

    const supabase = createAdminClient();

    const incidentPayload: Record<string, unknown> = {
      title,
      affected_components,
      is_maintenance,
      status: is_maintenance ? 'monitoring' : (initial_status!.toLowerCase() as string),
      started_at: new Date().toISOString(),
    };

    if (is_maintenance) {
      if (!scheduled_start || !scheduled_end) {
        throw APIError.badRequest('scheduled_start and scheduled_end are required for maintenance');
      }
      incidentPayload.scheduled_start = scheduled_start;
      incidentPayload.scheduled_end = scheduled_end;
    }

    const { data: incident, error: incidentError } = await (supabase as any)
      .from('status_incidents')
      .insert(incidentPayload)
      .select()
      .single();

    if (incidentError) {
      console.error('[status/incidents POST] DB error creating incident:', incidentError);
      throw APIError.internal('Failed to create incident');
    }

    // For non-maintenance incidents, insert the initial update
    if (!is_maintenance && initial_message && initial_status) {
      const { error: updateError } = await (supabase as any)
        .from('status_incident_updates')
        .insert({
          incident_id: incident.id,
          message: initial_message,
          status: initial_status,
        });

      if (updateError) {
        console.error('[status/incidents POST] DB error creating initial update:', updateError);
        // Don't fail the whole request — incident was created
      }
    }

    return NextResponse.json({ incident: incident as StatusIncidentRow }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
