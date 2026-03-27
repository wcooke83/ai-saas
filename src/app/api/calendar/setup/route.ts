/**
 * Calendar Setup API
 * POST /api/calendar/setup - Create/update event type + business hours for Easy!Appointments
 * GET  /api/calendar/setup?chatbotId=xxx - Get current event type + business hours config
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';
import type { BusinessHoursEntry } from '@/lib/calendar/types';

const businessHoursSchema = z.array(z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isEnabled: z.boolean(),
}));

const eventTypeSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  durationMinutes: z.number().min(5).max(480),
  bufferBeforeMinutes: z.number().min(0).max(120),
  bufferAfterMinutes: z.number().min(0).max(120),
  minNoticeHours: z.number().min(0).max(168),
  maxDaysAhead: z.number().min(1).max(365),
  timezone: z.string(),
});

const setupSchema = z.object({
  chatbotId: z.string().uuid(),
  eventType: eventTypeSchema,
  businessHours: businessHoursSchema,
  serviceId: z.string().optional(),
  providerId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
    if (!chatbotId) throw APIError.badRequest('chatbotId is required');

    const supabase = createAdminClient();

    // Verify ownership
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Get active integration
    const { data: integration } = await supabase
      .from('calendar_integrations')
      .select('id, config')
      .eq('chatbot_id', chatbotId)
      .eq('is_active', true)
      .maybeSingle();

    if (!integration) {
      // No integration yet — still fetch EA services/providers so the user can create one
      let services: Array<{ id: number; name: string; duration: number }> = [];
      let providers: Array<{ id: number; firstName: string; lastName: string }> = [];
      try {
        const ea = new EasyAppointmentsAdapter({});
        [services, providers] = await Promise.all([ea.getServices(), ea.getProviders()]);
      } catch {
        // EA might not be configured
      }
      return successResponse({ eventType: null, businessHours: null, services, providers });
    }

    // Get event type and business hours
    const [eventTypeResult, businessHoursResult] = await Promise.all([
      supabase
        .from('calendar_event_types')
        .select('*')
        .eq('integration_id', integration.id)
        .eq('is_active', true)
        .maybeSingle(),
      supabase
        .from('calendar_business_hours')
        .select('*')
        .eq('integration_id', integration.id)
        .order('day_of_week'),
    ]);

    const eventType = eventTypeResult.data;
    const businessHours: BusinessHoursEntry[] = (businessHoursResult.data || []).map((row: Record<string, unknown>) => ({
      dayOfWeek: row.day_of_week as number,
      startTime: (row.start_time as string).slice(0, 5),
      endTime: (row.end_time as string).slice(0, 5),
      isEnabled: row.is_enabled as boolean,
    }));

    // Fetch available services and providers from EA
    let services: Array<{ id: number; name: string; duration: number }> = [];
    let providers: Array<{ id: number; firstName: string; lastName: string }> = [];
    try {
      const ea = new EasyAppointmentsAdapter({});
      [services, providers] = await Promise.all([ea.getServices(), ea.getProviders()]);
    } catch {
      // EA might not be configured yet
    }

    const config = integration.config as Record<string, unknown>;

    return successResponse({
      eventType: eventType ? {
        title: eventType.title,
        slug: eventType.slug,
        description: eventType.description,
        durationMinutes: eventType.duration_minutes,
        bufferBeforeMinutes: eventType.buffer_before_minutes,
        bufferAfterMinutes: eventType.buffer_after_minutes,
        minNoticeHours: eventType.min_notice_hours,
        maxDaysAhead: eventType.max_days_ahead,
        timezone: eventType.timezone,
      } : null,
      businessHours: businessHours.length > 0 ? businessHours : null,
      serviceId: config.service_id || null,
      providerId: config.provider_id || null,
      services,
      providers,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, setupSchema);
    const supabase = createAdminClient();

    // Verify ownership
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', input.chatbotId)
      .single();

    if (!chatbot || chatbot.user_id !== user.id) {
      throw APIError.notFound('Chatbot not found');
    }

    // Validate EA connection
    const ea = new EasyAppointmentsAdapter({
      service_id: input.serviceId,
      provider_id: input.providerId,
    });
    const validation = await ea.validateConfig();
    if (!validation.valid) {
      throw APIError.badRequest(validation.error || 'Easy!Appointments connection failed');
    }

    // Get or create integration
    let { data: integration } = await supabase
      .from('calendar_integrations')
      .select('id, config')
      .eq('chatbot_id', input.chatbotId)
      .eq('provider', 'easy_appointments')
      .eq('is_active', true)
      .maybeSingle();

    if (!integration) {
      // Deactivate other integrations, create new one
      await supabase
        .from('calendar_integrations')
        .update({ is_active: false })
        .eq('chatbot_id', input.chatbotId);

      const { data: newInt, error } = await supabase
        .from('calendar_integrations')
        .insert({
          chatbot_id: input.chatbotId,
          user_id: user.id,
          provider: 'easy_appointments',
          is_active: true,
          config: {
            service_id: input.serviceId || null,
            provider_id: input.providerId || null,
          },
        })
        .select('id, config')
        .single();

      if (error) throw error;
      integration = newInt;
    } else {
      // Update config with service/provider IDs
      await supabase
        .from('calendar_integrations')
        .update({
          config: {
            service_id: input.serviceId || null,
            provider_id: input.providerId || null,
          },
        })
        .eq('id', integration.id);
    }

    // Replace local event type record
    await supabase
      .from('calendar_event_types')
      .delete()
      .eq('integration_id', integration.id);

    await supabase
      .from('calendar_event_types')
      .insert({
        integration_id: integration.id,
        title: input.eventType.title,
        slug: input.eventType.slug || input.eventType.title.toLowerCase().replace(/\s+/g, '-'),
        description: input.eventType.description || null,
        duration_minutes: input.eventType.durationMinutes,
        buffer_before_minutes: input.eventType.bufferBeforeMinutes,
        buffer_after_minutes: input.eventType.bufferAfterMinutes,
        min_notice_hours: input.eventType.minNoticeHours,
        max_days_ahead: input.eventType.maxDaysAhead,
        timezone: input.eventType.timezone,
        is_active: true,
      });

    // Upsert business hours
    const hoursUpserts = input.businessHours.map(h => ({
      integration_id: integration!.id,
      day_of_week: h.dayOfWeek,
      start_time: h.startTime,
      end_time: h.endTime,
      is_enabled: h.isEnabled,
    }));

    await supabase
      .from('calendar_business_hours')
      .delete()
      .eq('integration_id', integration.id);

    await supabase
      .from('calendar_business_hours')
      .insert(hoursUpserts);

    return successResponse({
      integration_id: integration.id,
      service_id: input.serviceId,
      provider_id: input.providerId,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
