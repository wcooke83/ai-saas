/**
 * Calendar Availability API
 * POST /api/calendar/availability - Check available time slots
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, parseBody } from '@/lib/api/utils';
import { CalendarService } from '@/lib/calendar/service';

const availabilitySchema = z.object({
  chatbotId: z.string().uuid(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string().min(1),
  duration: z.number().min(5).max(480).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const input = await parseBody(req, availabilitySchema);

    const availability = await CalendarService.getAvailability(input.chatbotId, {
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      timezone: input.timezone,
      duration: input.duration,
    });

    return successResponse(availability);
  } catch (error) {
    return errorResponse(error);
  }
}
