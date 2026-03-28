/**
 * Calendar Service Management API
 * PUT    /api/calendar/services/:id - Update a service
 * DELETE /api/calendar/services/:id - Delete a service
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  duration: z.number().min(5).max(480).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  attendantsNumber: z.number().optional(),
  availabilitiesType: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, updateServiceSchema);
    const ea = new EasyAppointmentsAdapter({});
    const service = await ea.updateService(Number(id), input);
    return successResponse(service);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    await ea.deleteService(Number(id));
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
