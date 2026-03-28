/**
 * Working Plan Exceptions API (Date Overrides)
 * GET    /api/calendar/providers/:id/working-plan-exceptions - Get all exceptions
 * PUT    /api/calendar/providers/:id/working-plan-exceptions - Set/merge exceptions
 * DELETE /api/calendar/providers/:id/working-plan-exceptions?date=YYYY-MM-DD - Remove one
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const setExceptionsSchema = z.object({
  exceptions: z.record(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
      breaks: z.array(z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/),
        end: z.string().regex(/^\d{2}:\d{2}$/),
      })),
    }).nullable()
  ),
});

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    const exceptions = await ea.getWorkingPlanExceptions(Number(id));
    return successResponse(exceptions);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, setExceptionsSchema);
    const ea = new EasyAppointmentsAdapter({});
    await ea.setWorkingPlanExceptions(Number(id), input.exceptions);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const date = req.nextUrl.searchParams.get('date');
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw APIError.badRequest('date query parameter is required (YYYY-MM-DD)');
    }

    const ea = new EasyAppointmentsAdapter({});
    await ea.removeWorkingPlanException(Number(id), date);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
