/**
 * Calendar Booking API
 * POST /api/calendar/book - Create a booking
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, parseBody } from '@/lib/api/utils';
import { CalendarService } from '@/lib/calendar/service';

const bookingSchema = z.object({
  chatbotId: z.string().uuid(),
  sessionId: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  attendeeName: z.string().min(1).max(200),
  attendeeEmail: z.string().email(),
  attendeeTimezone: z.string().min(1),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const input = await parseBody(req, bookingSchema);

    const booking = await CalendarService.createBooking(
      input.chatbotId,
      input.sessionId,
      {
        start: input.start,
        end: input.end,
        attendeeName: input.attendeeName,
        attendeeEmail: input.attendeeEmail,
        attendeeTimezone: input.attendeeTimezone,
        notes: input.notes,
      }
    );

    return successResponse(booking);
  } catch (error) {
    return errorResponse(error);
  }
}
