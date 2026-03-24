/**
 * Calendar Setup API
 * POST /api/calendar/setup - Create/update event type + business hours + provision on Cal.com
 * GET  /api/calendar/setup?chatbotId=xxx - Get current event type + business hours config
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { CalcomAdminAPI, toCalcomDay } from '@/lib/calendar/calcom-admin';
import type { BusinessHoursEntry, EventTypeConfig } from '@/lib/calendar/types';

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
      throw APIError.forbidden();
    }

    // Get active integration
    const { data: integration } = await supabase
      .from('calendar_integrations')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .eq('is_active', true)
      .maybeSingle();

    if (!integration) {
      return successResponse({ eventType: null, businessHours: null });
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
        providerEventTypeId: eventType.provider_event_type_id,
        providerScheduleId: eventType.provider_schedule_id,
      } : null,
      businessHours: businessHours.length > 0 ? businessHours : null,
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
      throw APIError.forbidden();
    }

    // Get or create integration
    let { data: integration } = await supabase
      .from('calendar_integrations')
      .select('id, config')
      .eq('chatbot_id', input.chatbotId)
      .eq('provider', 'hosted_calcom')
      .eq('is_active', true)
      .maybeSingle();

    if (!integration) {
      // Deactivate other integrations, create hosted one
      await supabase
        .from('calendar_integrations')
        .update({ is_active: false })
        .eq('chatbot_id', input.chatbotId);

      const { data: newInt, error } = await supabase
        .from('calendar_integrations')
        .insert({
          chatbot_id: input.chatbotId,
          user_id: user.id,
          provider: 'hosted_calcom',
          is_active: true,
          config: {},
        })
        .select('id, config')
        .single();

      if (error) throw error;
      integration = newInt;
    }

    // Check for existing event type config
    const { data: existingEventType } = await supabase
      .from('calendar_event_types')
      .select('provider_event_type_id, provider_schedule_id')
      .eq('integration_id', integration.id)
      .eq('is_active', true)
      .maybeSingle();

    // Provision on Cal.com
    const calcom = new CalcomAdminAPI();
    const enabledHours = input.businessHours.filter(h => h.isEnabled);

    // Group consecutive days with same hours
    const availabilityBlocks: Array<{ days: string[]; startTime: string; endTime: string }> = [];
    for (const h of enabledHours) {
      const existing = availabilityBlocks.find(
        b => b.startTime === h.startTime && b.endTime === h.endTime
      );
      if (existing) {
        existing.days.push(toCalcomDay(h.dayOfWeek));
      } else {
        availabilityBlocks.push({
          days: [toCalcomDay(h.dayOfWeek)],
          startTime: h.startTime,
          endTime: h.endTime,
        });
      }
    }

    let providerScheduleId = existingEventType?.provider_schedule_id;
    let providerEventTypeId = existingEventType?.provider_event_type_id;

    if (providerScheduleId) {
      // Update existing schedule
      await calcom.updateSchedule(Number(providerScheduleId), {
        name: `${input.eventType.title} Schedule`,
        timeZone: input.eventType.timezone,
        availability: availabilityBlocks,
      });
    } else {
      // Create new schedule
      const schedule = await calcom.createSchedule({
        name: `${input.eventType.title} Schedule`,
        timeZone: input.eventType.timezone,
        isDefault: false,
        availability: availabilityBlocks,
      });
      providerScheduleId = String(schedule.id);
    }

    if (providerEventTypeId) {
      // Update existing event type
      await calcom.updateEventType(Number(providerEventTypeId), {
        title: input.eventType.title,
        slug: input.eventType.slug || input.eventType.title.toLowerCase().replace(/\s+/g, '-'),
        lengthInMinutes: input.eventType.durationMinutes,
        description: input.eventType.description,
        scheduleId: Number(providerScheduleId),
        beforeEventBuffer: input.eventType.bufferBeforeMinutes,
        afterEventBuffer: input.eventType.bufferAfterMinutes,
        minimumBookingNotice: input.eventType.minNoticeHours * 60,
      });
    } else {
      // Create new event type
      const eventType = await calcom.createEventType({
        title: input.eventType.title,
        slug: input.eventType.slug || input.eventType.title.toLowerCase().replace(/\s+/g, '-'),
        lengthInMinutes: input.eventType.durationMinutes,
        description: input.eventType.description,
        scheduleId: Number(providerScheduleId),
        beforeEventBuffer: input.eventType.bufferBeforeMinutes,
        afterEventBuffer: input.eventType.bufferAfterMinutes,
        minimumBookingNotice: input.eventType.minNoticeHours * 60,
      });
      providerEventTypeId = String(eventType.id);
    }

    // Update integration config with provider IDs
    await supabase
      .from('calendar_integrations')
      .update({
        config: {
          ...(integration.config as Record<string, unknown>),
          event_type_id: providerEventTypeId,
          provider_schedule_id: providerScheduleId,
        },
      })
      .eq('id', integration.id);

    // Replace local event type record
    await supabase
      .from('calendar_event_types')
      .delete()
      .eq('integration_id', integration.id);

    await supabase
      .from('calendar_event_types')
      .insert({
        integration_id: integration.id,
        provider_event_type_id: providerEventTypeId,
        provider_schedule_id: providerScheduleId,
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

    // Delete existing and insert fresh (simpler than upsert for 7 rows)
    await supabase
      .from('calendar_business_hours')
      .delete()
      .eq('integration_id', integration.id);

    await supabase
      .from('calendar_business_hours')
      .insert(hoursUpserts);

    return successResponse({
      integration_id: integration.id,
      provider_event_type_id: providerEventTypeId,
      provider_schedule_id: providerScheduleId,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
