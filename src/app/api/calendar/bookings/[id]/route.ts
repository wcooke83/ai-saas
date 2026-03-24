/**
 * Calendar Booking Management API
 * GET /api/calendar/bookings/:id - Get booking details
 * PATCH /api/calendar/bookings/:id - Reschedule booking
 * DELETE /api/calendar/bookings/:id - Cancel booking
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { CalendarService } from '@/lib/calendar/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('calendar_bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !booking) throw APIError.notFound('Booking not found');

    // Verify ownership via chatbot
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', booking.chatbot_id)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Booking not found');
    }

    return successResponse(booking);
  } catch (error) {
    return errorResponse(error);
  }
}

const rescheduleSchema = z.object({
  newStart: z.string().min(1),
  newEnd: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    // Verify ownership
    const supabase = createAdminClient();
    const { data: booking } = await supabase
      .from('calendar_bookings')
      .select('chatbot_id, provider_booking_id')
      .eq('id', id)
      .single();

    if (!booking) throw APIError.notFound('Booking not found');

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', booking.chatbot_id)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Booking not found');
    }

    const input = await parseBody(req, rescheduleSchema);

    const result = await CalendarService.rescheduleBooking(id, {
      providerBookingId: booking.provider_booking_id || '',
      newStart: input.newStart,
      newEnd: input.newEnd,
      reason: input.reason,
    });

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    // Verify ownership
    const supabase = createAdminClient();
    const { data: booking } = await supabase
      .from('calendar_bookings')
      .select('chatbot_id')
      .eq('id', id)
      .single();

    if (!booking) throw APIError.notFound('Booking not found');

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', booking.chatbot_id)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Booking not found');
    }

    let reason: string | undefined;
    try {
      const body = await req.json();
      reason = body?.reason;
    } catch {
      // No body is fine for DELETE
    }

    await CalendarService.cancelBooking(id, reason);

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
