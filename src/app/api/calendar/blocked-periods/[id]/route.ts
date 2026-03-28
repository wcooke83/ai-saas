/**
 * Calendar Blocked Period Management API
 * DELETE /api/calendar/blocked-periods/:id - Delete a blocked period
 */

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    await ea.deleteBlockedPeriod(Number(id));
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
