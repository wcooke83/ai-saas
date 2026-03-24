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
} from './types';

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
   * Check availability (uses cache when valid)
   */
  static async getAvailability(
    chatbotId: string,
    request: AvailabilityRequest
  ): Promise<AvailabilityResponse> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) {
      throw new Error('No active calendar integration found for this chatbot');
    }

    // Check cache
    const cached = await this.getCachedAvailability(integration.id, request);
    if (cached) {
      return cached;
    }

    // Fetch from provider
    const adapter = createCalendarProvider(integration.provider, integration.config);
    const availability = await adapter.getAvailability(request);

    // Cache results
    await this.cacheAvailability(integration.id, request, availability);

    return availability;
  }

  /**
   * Create a booking and persist to calendar_bookings
   */
  static async createBooking(
    chatbotId: string,
    sessionId: string,
    request: BookingRequest
  ): Promise<BookingResponse> {
    const integration = await this.getIntegration(chatbotId);
    if (!integration) {
      throw new Error('No active calendar integration found for this chatbot');
    }

    // Re-check availability to prevent double-booking race conditions
    const availability = await this.getAvailability(chatbotId, {
      dateFrom: request.start.split('T')[0],
      dateTo: request.end.split('T')[0],
      timezone: request.attendeeTimezone,
    });

    const requestedStart = new Date(request.start).getTime();
    const slotAvailable = availability.slots.some(
      (slot) => new Date(slot.start).getTime() === requestedStart
    );

    if (!slotAvailable) {
      throw new Error('The requested time slot is no longer available. Please check availability again.');
    }

    // Create booking via provider
    const adapter = createCalendarProvider(integration.provider, integration.config);
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

  /**
   * Process incoming webhooks from providers
   */
  static async handleWebhook(
    provider: CalendarProvider,
    payload: Record<string, unknown>
  ): Promise<void> {
    const supabase = createAdminClient();

    switch (provider) {
      case 'hosted_calcom':
      case 'customer_calcom':
        await this.handleCalcomWebhook(supabase, payload);
        break;
      case 'calendly':
        await this.handleCalendlyWebhook(supabase, payload);
        break;
    }
  }

  // ── Private helpers ──

  private static async handleCalcomWebhook(
    supabase: ReturnType<typeof createAdminClient>,
    payload: Record<string, unknown>
  ): Promise<void> {
    const triggerEvent = payload.triggerEvent as string;
    const bookingPayload = payload.payload as Record<string, unknown> | undefined;
    if (!bookingPayload) return;

    const uid = bookingPayload.uid as string;
    if (!uid) return;

    switch (triggerEvent) {
      case 'BOOKING_CREATED':
        await supabase
          .from('calendar_bookings')
          .update({ status: 'confirmed' })
          .eq('provider_booking_id', uid);
        break;
      case 'BOOKING_CANCELLED':
        await supabase
          .from('calendar_bookings')
          .update({ status: 'cancelled' })
          .eq('provider_booking_id', uid);
        break;
      case 'BOOKING_RESCHEDULED': {
        const newStart = bookingPayload.startTime as string;
        const newEnd = bookingPayload.endTime as string;
        const update: Record<string, unknown> = { status: 'rescheduled' };
        if (newStart) update.start_time = newStart;
        if (newEnd) update.end_time = newEnd;
        await supabase
          .from('calendar_bookings')
          .update(update)
          .eq('provider_booking_id', uid);
        break;
      }
    }
  }

  private static async handleCalendlyWebhook(
    supabase: ReturnType<typeof createAdminClient>,
    payload: Record<string, unknown>
  ): Promise<void> {
    const event = payload.event as string;
    const eventPayload = payload.payload as Record<string, unknown> | undefined;
    if (!eventPayload) return;

    const scheduledEvent = eventPayload.scheduled_event as Record<string, unknown> | undefined;
    const eventUri = (scheduledEvent?.uri || eventPayload.uri) as string;
    if (!eventUri) return;

    // Extract UUID from the Calendly URI
    const eventUuid = eventUri.split('/').pop();
    if (!eventUuid) return;

    switch (event) {
      case 'invitee.created': {
        const invitee = eventPayload.invitee || eventPayload;
        const inviteeData = invitee as Record<string, unknown>;
        const startTime = scheduledEvent?.start_time as string;
        const endTime = scheduledEvent?.end_time as string;

        // Try to find a pending Calendly booking and update it
        await supabase
          .from('calendar_bookings')
          .update({
            status: 'confirmed',
            provider_booking_id: eventUuid,
            start_time: startTime || undefined,
            end_time: endTime || undefined,
            attendee_email: (inviteeData.email as string) || undefined,
            attendee_name: (inviteeData.name as string) || undefined,
          })
          .eq('provider', 'calendly')
          .eq('status', 'pending')
          .eq('attendee_email', (inviteeData.email as string) || '');
        break;
      }
      case 'invitee.canceled':
        await supabase
          .from('calendar_bookings')
          .update({ status: 'cancelled' })
          .eq('provider_booking_id', eventUuid);
        break;
    }
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
