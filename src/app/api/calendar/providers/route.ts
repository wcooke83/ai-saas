/**
 * Calendar Providers API
 * GET  /api/calendar/providers - List all EA providers
 * POST /api/calendar/providers - Create a new EA provider
 */

import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

const workingPlanDaySchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  breaks: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
  })),
}).nullable();

const workingPlanSchema = z.object({
  monday: workingPlanDaySchema,
  tuesday: workingPlanDaySchema,
  wednesday: workingPlanDaySchema,
  thursday: workingPlanDaySchema,
  friday: workingPlanDaySchema,
  saturday: workingPlanDaySchema,
  sunday: workingPlanDaySchema,
});

const createProviderSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  services: z.array(z.number()).min(1),
  settings: z.object({
    workingPlan: workingPlanSchema,
    notifications: z.boolean().optional(),
  }),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    const providers = await ea.getProvidersFull();
    return successResponse(providers);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, createProviderSchema);
    const username = `provider_${randomBytes(6).toString('hex')}`;
    const password = randomBytes(16).toString('hex');
    const payload = {
      ...input,
      settings: {
        ...input.settings,
        username,
        password,
      },
    };
    const ea = new EasyAppointmentsAdapter({});
    const provider = await ea.createProvider(payload);
    return successResponse(provider);
  } catch (error) {
    return errorResponse(error);
  }
}
