/**
 * Calendar Webhook Handler
 * POST /api/calendar/webhook/easy_appointments - Receive webhooks from Easy!Appointments
 *
 * Note: Easy!Appointments doesn't have built-in webhook support by default.
 * This endpoint can be used with custom webhook plugins or external triggers
 * to sync booking status changes.
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ provider: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { provider } = await params;

  if (provider !== 'easy_appointments') {
    return new Response('Invalid provider', { status: 400 });
  }

  try {
    const payload = await req.json();
    console.log('[Calendar:Webhook] Received Easy!Appointments webhook:', payload.event || payload.type);

    const supabase = createAdminClient();
    const appointmentId = String(payload.appointmentId || payload.id || '');
    if (!appointmentId) {
      return new Response('Missing appointment ID', { status: 400 });
    }

    const event = payload.event || payload.type || '';

    switch (event) {
      case 'appointment_created':
      case 'created':
        await supabase
          .from('calendar_bookings')
          .update({ status: 'confirmed' })
          .eq('provider_booking_id', appointmentId);
        break;
      case 'appointment_cancelled':
      case 'cancelled':
      case 'deleted':
        await supabase
          .from('calendar_bookings')
          .update({ status: 'cancelled' })
          .eq('provider_booking_id', appointmentId);
        break;
      case 'appointment_updated':
      case 'updated': {
        const update: Record<string, unknown> = { status: 'rescheduled' };
        if (payload.start) update.start_time = payload.start;
        if (payload.end) update.end_time = payload.end;
        await supabase
          .from('calendar_bookings')
          .update(update)
          .eq('provider_booking_id', appointmentId);
        break;
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('[Calendar:Webhook] Error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
