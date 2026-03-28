/**
 * Calendar Services API
 * GET  /api/calendar/services - List all EA services
 * POST /api/calendar/services - Create a new EA service
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

const createServiceSchema = z.object({
  name: z.string().min(1).max(100),
  duration: z.number().min(5).max(480),
  price: z.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  attendantsNumber: z.number().optional(),
  availabilitiesType: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    const services = await ea.getServicesFull();
    return successResponse(services);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, createServiceSchema);
    const ea = new EasyAppointmentsAdapter({});
    const service = await ea.createService({
      ...input,
      attendantsNumber: input.attendantsNumber ?? 1,
    });
    return successResponse(service);
  } catch (error) {
    return errorResponse(error);
  }
}
