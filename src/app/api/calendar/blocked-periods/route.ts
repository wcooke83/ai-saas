/**
 * Calendar Blocked Periods API (Holidays)
 * GET  /api/calendar/blocked-periods - List all blocked periods
 * POST /api/calendar/blocked-periods - Create a blocked period
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

const createBlockedPeriodSchema = z.object({
  name: z.string().min(1).max(100),
  start: z.string().min(1),
  end: z.string().min(1),
  notes: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    const periods = await ea.getBlockedPeriods();
    return successResponse(periods);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, createBlockedPeriodSchema);
    const ea = new EasyAppointmentsAdapter({});
    const period = await ea.createBlockedPeriod(input);
    return successResponse(period);
  } catch (error) {
    return errorResponse(error);
  }
}
