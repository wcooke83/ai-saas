/**
 * Calendar Provider Management API
 * PUT    /api/calendar/providers/:id - Update a provider
 * DELETE /api/calendar/providers/:id - Delete a provider
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateProviderSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  services: z.array(z.number()).min(1).optional(),
  settings: z.object({
    workingPlan: z.object({
      monday: z.any(),
      tuesday: z.any(),
      wednesday: z.any(),
      thursday: z.any(),
      friday: z.any(),
      saturday: z.any(),
      sunday: z.any(),
    }).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, updateProviderSchema);
    const ea = new EasyAppointmentsAdapter({});
    const provider = await ea.updateProvider(Number(id), input);
    return successResponse(provider);
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
    await ea.deleteProvider(Number(id));
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
