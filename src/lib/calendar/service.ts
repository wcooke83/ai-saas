/**
 * Calendar Service Layer
 * Main entry point used by the chatbot and API routes.
 * Handles provider resolution, caching, booking persistence, and webhooks.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { createCalendarProvider } from './provider-factory';
import type {
  CalendarProvider,
  CalendarIntegration,
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  RescheduleRequest,
  TimeSlot,
  EasyAppointmentsConfig,
  BusinessHoursSet,
  BusinessHoursEntry,
  HolidayEntry,
} from './types';
import { EasyAppointmentsAdapter } from './providers/easy-appointments';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class CalendarService {
  /**
   * Get the active calendar integration for a chatbot
   */
  static async getIntegration(chatbotId: string): Promise<CalendarIntegration | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[Calendar] Failed to get integration:', error);
      return null;
    }
    return data as CalendarIntegration | null;
  }

  /**
   * List available services for a chatbot's calendar integration.
   * Used when no service is pre-selected and the chatbot needs to ask the customer.
   */
  static async getServices(chatbotId: string): Promise<Array<{ id: number; name: string; duration: number; price: number; currency: string; description: string | null }>> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) {
      throw new Error('No active calendar integration found for this chatbot');
    }

    const config = integration.config as unknown as EasyAppointmentsConfig;
    const ea = new EasyAppointmentsAdapter(config);
    const services = await ea.getServicesFull();
    return services.map((s) => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      price: s.price,
      currency: s.currency,
      description: s.description,
    }));
  }

  /**
   * Check if this chatbot's calendar integration has a pre-selected service.
   */
  static async hasPreselectedService(chatbotId: string): Promise<boolean> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) return false;
    const config = integration.config as unknown as EasyAppointmentsConfig;
    return !!config.service_id;
  }

  /**
   * Check availability (uses cache when valid)
   * @param serviceIdOverride - Optional service ID override (used when chatbot asks customer to pick a service)
   */
  static async getAvailability(
    chatbotId: string,
    request: AvailabilityRequest,
    serviceIdOverride?: string
  ): Promise<AvailabilityResponse> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) {
      throw new Error('No active calendar integration found for this chatbot');
    }

    // Apply service_id override if provided (dynamic service selection from chat)
    const effectiveConfig = serviceIdOverride
      ? { ...integration.config, service_id: serviceIdOverride }
      : integration.config;

    // Check cache (include service_id in cache key via request)
    const cached = await this.getCachedAvailability(integration.id, request);
    if (cached) {
      return cached;
    }

    // Fetch from provider with effective config
    const adapter = createCalendarProvider(integration.provider, effectiveConfig);
    const availability = await adapter.getAvailability(request);

    // Apply service-scoped business hours and holidays from local config
    const config = effectiveConfig as unknown as EasyAppointmentsConfig;
    const effectiveServiceId = serviceIdOverride || config.service_id;
    const effectiveProviderId = config.provider_id;

    let filteredSlots = availability.slots;

    // Check for service-scoped business hours (provider-scoped are already in EA)
    if (config.business_hours_sets?.length && effectiveServiceId) {
      const resolvedHours = this.resolveBusinessHours(
        config.business_hours_sets,
        effectiveServiceId,
        effectiveProviderId
      );
      if (resolvedHours) {
        filteredSlots = this.filterSlotsByHours(filteredSlots, resolvedHours);
      }
    }

    // Check for service-scoped holidays (provider-scoped are already in EA)
    if (config.holidays?.length) {
      filteredSlots = filteredSlots.filter(slot => {
        const date = slot.start.split('T')[0];
        return !this.isHolidayBlocked(
          config.holidays!,
          date,
          effectiveServiceId,
          effectiveProviderId
        );
      });
    }

    const filteredAvailability: AvailabilityResponse = {
      slots: filteredSlots,
      timezone: availability.timezone,
    };

    // Cache results
    await this.cacheAvailability(integration.id, request, filteredAvailability);

    return filteredAvailability;
  }

  /**
   * Create a booking and persist to calendar_bookings
   * @param serviceIdOverride - Optional service ID override (used when chatbot asks customer to pick a service)
   */
  static async createBooking(
    chatbotId: string,
    sessionId: string,
    request: BookingRequest,
    serviceIdOverride?: string
  ): Promise<BookingResponse> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) {
      throw new Error('No active calendar integration found for this chatbot');
    }

    // Apply service_id override if provided (dynamic service selection from chat)
    const effectiveConfig = serviceIdOverride
      ? { ...integration.config, service_id: serviceIdOverride }
      : integration.config;

    // Re-check availability to prevent double-booking race conditions
    const availability = await this.getAvailability(chatbotId, {
      dateFrom: request.start.split('T')[0],
      dateTo: request.end.split('T')[0],
      timezone: request.attendeeTimezone,
    }, serviceIdOverride);

    const requestedStart = new Date(request.start).getTime();
    const slotAvailable = availability.slots.some(
      (slot) => new Date(slot.start).getTime() === requestedStart
    );

    if (!slotAvailable) {
      throw new Error('The requested time slot is no longer available. Please check availability again.');
    }

    // Create booking via provider with effective config
    const adapter = createCalendarProvider(integration.provider, effectiveConfig);
    const bookingResponse = await adapter.createBooking(request);

    // Get conversation ID from session
    const supabase = createAdminClient();
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .eq('session_id', sessionId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    // Persist booking to database
    const { data: booking, error } = await supabase
      .from('calendar_bookings')
      .insert({
        integration_id: integration.id,
        chatbot_id: chatbotId,
        chat_session_id: conversation?.id || null,
        provider: integration.provider,
        provider_booking_id: bookingResponse.providerBookingId || null,
        status: bookingResponse.status,
        attendee_name: request.attendeeName,
        attendee_email: request.attendeeEmail,
        attendee_timezone: request.attendeeTimezone,
        start_time: bookingResponse.start || request.start,
        end_time: bookingResponse.end || request.end,
        meeting_url: bookingResponse.meetingUrl || null,
        notes: request.notes || null,
        metadata: (request.metadata || {}) as Record<string, string>,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Calendar] Failed to persist booking:', error);
    }

    // Invalidate availability cache for the booking date
    await this.invalidateCache(integration.id, request.start.split('T')[0]);

    return {
      ...bookingResponse,
      id: booking?.id || bookingResponse.id,
    };
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('calendar_bookings')
      .select('*, calendar_integrations(*)')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new Error('Booking not found');
    }

    const integration = (booking as unknown as Record<string, unknown>).calendar_integrations as CalendarIntegration;

    if (booking.provider_booking_id && integration) {
      const adapter = createCalendarProvider(
        integration.provider as CalendarProvider,
        integration.config as Record<string, unknown>
      );
      await adapter.cancelBooking({
        providerBookingId: booking.provider_booking_id,
        reason,
      });
    }

    await supabase
      .from('calendar_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
  }

  /**
   * Reschedule a booking
   */
  static async rescheduleBooking(
    bookingId: string,
    request: RescheduleRequest
  ): Promise<BookingResponse> {
    const supabase = createAdminClient();
    const { data: booking, error } = await supabase
      .from('calendar_bookings')
      .select('*, calendar_integrations(*)')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new Error('Booking not found');
    }

    const integration = (booking as unknown as Record<string, unknown>).calendar_integrations as CalendarIntegration;
    if (!integration) {
      throw new Error('Integration not found for this booking');
    }

    const adapter = createCalendarProvider(
      integration.provider as CalendarProvider,
      integration.config as Record<string, unknown>
    );

    const result = await adapter.rescheduleBooking(request);

    // Update booking in database
    await supabase
      .from('calendar_bookings')
      .update({
        start_time: result.start,
        end_time: result.end,
        status: 'rescheduled',
        provider_booking_id: result.providerBookingId,
        meeting_url: result.meetingUrl || null,
      })
      .eq('id', bookingId);

    return { ...result, id: bookingId };
  }

  // ── Private helpers ──

  /**
   * Resolve which business hours apply for a given service/provider.
   * Priority: both service+provider scoped > service-only > provider-only > global (null)
   * Returns null if no scoped set matches (caller should use global business hours from DB).
   */
  private static resolveBusinessHours(
    sets: BusinessHoursSet[],
    serviceId?: string,
    providerId?: string
  ): BusinessHoursEntry[] | null {
    if (!sets || sets.length === 0) return null;

    let bestMatch: BusinessHoursSet | null = null;
    let bestScore = -1;

    for (const set of sets) {
      const svcMatch = !set.serviceIds?.length || (serviceId && set.serviceIds.includes(serviceId));
      const prvMatch = !set.providerIds?.length || (providerId && set.providerIds.includes(providerId));
      if (!svcMatch || !prvMatch) continue;

      // Score: 2 points for specific service match, 1 point for specific provider match
      let score = 0;
      if (set.serviceIds?.length && serviceId && set.serviceIds.includes(serviceId)) score += 2;
      if (set.providerIds?.length && providerId && set.providerIds.includes(providerId)) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = set;
      }
    }

    return bestMatch ? bestMatch.hours : null;
  }

  /**
   * Check if a date is blocked by a scoped holiday for the given service/provider.
   */
  private static isHolidayBlocked(
    holidays: HolidayEntry[],
    date: string,           // "YYYY-MM-DD"
    serviceId?: string,
    providerId?: string
  ): boolean {
    if (!holidays || holidays.length === 0) return false;

    return holidays.some(h => {
      if (h.date !== date) return false;
      const svcMatch = !h.serviceIds?.length || (serviceId && h.serviceIds.includes(serviceId));
      const prvMatch = !h.providerIds?.length || (providerId && h.providerIds.includes(providerId));
      return svcMatch && prvMatch;
    });
  }

  /**
   * Filter slots to only those within the given business hours.
   */
  private static filterSlotsByHours(
    slots: TimeSlot[],
    hours: BusinessHoursEntry[]
  ): TimeSlot[] {
    return slots.filter(slot => {
      const slotDate = new Date(slot.start);
      const dayOfWeek = slotDate.getUTCDay();
      const entry = hours.find(h => h.dayOfWeek === dayOfWeek);
      if (!entry || !entry.isEnabled) return false;

      // Extract HH:mm from slot start time
      const slotTime = slot.start.split('T')[1]?.slice(0, 5);
      if (!slotTime) return false;

      return slotTime >= entry.startTime && slotTime < entry.endTime;
    });
  }

  private static async getCachedAvailability(
    integrationId: string,
    request: AvailabilityRequest
  ): Promise<AvailabilityResponse | null> {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Get cached slots for the date range
    const { data } = await supabase
      .from('calendar_availability_cache')
      .select('slots')
      .eq('integration_id', integrationId)
      .gte('date', request.dateFrom)
      .lte('date', request.dateTo)
      .gt('expires_at', now);

    if (!data || data.length === 0) return null;

    // Merge all cached slots
    const allSlots: TimeSlot[] = data.flatMap((row) => row.slots as unknown as TimeSlot[]);
    return { slots: allSlots, timezone: request.timezone };
  }

  private static async cacheAvailability(
    integrationId: string,
    request: AvailabilityRequest,
    availability: AvailabilityResponse
  ): Promise<void> {
    const supabase = createAdminClient();
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString();

    // Group slots by date
    const slotsByDate: Record<string, TimeSlot[]> = {};
    for (const slot of availability.slots) {
      const date = slot.start.split('T')[0];
      if (!slotsByDate[date]) slotsByDate[date] = [];
      slotsByDate[date].push(slot);
    }

    // Upsert each date's cache
    const upserts = Object.entries(slotsByDate).map(([date, slots]) => ({
      integration_id: integrationId,
      date,
      slots: JSON.parse(JSON.stringify(slots)),
      fetched_at: new Date().toISOString(),
      expires_at: expiresAt,
    }));

    if (upserts.length > 0) {
      await supabase
        .from('calendar_availability_cache')
        .upsert(upserts, { onConflict: 'integration_id,date' });
    }
  }

  private static async invalidateCache(
    integrationId: string,
    date: string
  ): Promise<void> {
    const supabase = createAdminClient();
    await supabase
      .from('calendar_availability_cache')
      .delete()
      .eq('integration_id', integrationId)
      .eq('date', date);
  }
}
