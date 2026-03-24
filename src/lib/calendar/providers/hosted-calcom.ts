/**
 * Hosted Cal.com Adapter
 * Uses Cal.com API v2 against our self-hosted instance.
 * Admin API key from env CALCOM_API_KEY, base URL from CALCOM_BASE_URL.
 */

import type {
  CalendarProviderAdapter,
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  CancelRequest,
  RescheduleRequest,
  HostedCalcomConfig,
} from '../types';

export class HostedCalcomAdapter implements CalendarProviderAdapter {
  private baseUrl: string;
  private apiKey: string;
  private config: HostedCalcomConfig;

  constructor(config: HostedCalcomConfig) {
    this.baseUrl = process.env.CALCOM_BASE_URL || '';
    this.apiKey = process.env.CALCOM_API_KEY || '';
    this.config = config;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'cal-api-version': '2024-06-14',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      throw new Error(`Cal.com API error ${res.status}: ${text}`);
    }

    return res.json();
  }

  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      startTime: `${request.dateFrom}T00:00:00.000Z`,
      endTime: `${request.dateTo}T23:59:59.999Z`,
      timeZone: request.timezone,
    });

    if (this.config.event_type_id) {
      params.set('eventTypeId', this.config.event_type_id);
    }
    if (request.duration) {
      params.set('duration', String(request.duration));
    }

    const data = await this.request<{ data: { slots: Record<string, Array<{ time: string }>> } }>(
      'GET',
      `/api/v2/slots/available?${params.toString()}`
    );

    // Cal.com returns slots grouped by date: { "2026-03-24": [{ time: "..." }] }
    const slots = Object.values(data.data?.slots || {})
      .flat()
      .map((slot) => ({
        start: slot.time,
        end: new Date(
          new Date(slot.time).getTime() + (request.duration || 30) * 60000
        ).toISOString(),
      }));

    return { slots, timezone: request.timezone };
  }

  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    const data = await this.request<{
      data: {
        id: number;
        uid: string;
        status: string;
        startTime: string;
        endTime: string;
        metadata?: { videoCallUrl?: string };
      };
    }>('POST', '/api/v2/bookings', {
      eventTypeId: this.config.event_type_id ? Number(this.config.event_type_id) : undefined,
      start: request.start,
      timeZone: request.attendeeTimezone,
      language: 'en',
      metadata: request.metadata || {},
      responses: {
        name: request.attendeeName,
        email: request.attendeeEmail,
      },
    });

    const booking = data.data;
    return {
      id: booking.uid,
      providerBookingId: booking.uid,
      status: booking.status === 'ACCEPTED' ? 'confirmed' : 'pending',
      start: booking.startTime,
      end: booking.endTime,
      meetingUrl: booking.metadata?.videoCallUrl,
      attendeeName: request.attendeeName,
      attendeeEmail: request.attendeeEmail,
    };
  }

  async cancelBooking(request: CancelRequest): Promise<{ success: boolean }> {
    await this.request('DELETE', `/api/v2/bookings/${request.providerBookingId}`, {
      cancellationReason: request.reason,
    });
    return { success: true };
  }

  async rescheduleBooking(request: RescheduleRequest): Promise<BookingResponse> {
    const data = await this.request<{
      data: {
        id: number;
        uid: string;
        status: string;
        startTime: string;
        endTime: string;
        metadata?: { videoCallUrl?: string };
        attendees?: Array<{ name: string; email: string }>;
      };
    }>('PATCH', `/api/v2/bookings/${request.providerBookingId}/reschedule`, {
      start: request.newStart,
      end: request.newEnd,
      rescheduleReason: request.reason,
    });

    const booking = data.data;
    const attendee = booking.attendees?.[0];
    return {
      id: booking.uid,
      providerBookingId: booking.uid,
      status: booking.status === 'ACCEPTED' ? 'confirmed' : 'pending',
      start: booking.startTime,
      end: booking.endTime,
      meetingUrl: booking.metadata?.videoCallUrl,
      attendeeName: attendee?.name || '',
      attendeeEmail: attendee?.email || '',
    };
  }

  async validateConfig(): Promise<{ valid: boolean; error?: string }> {
    if (!this.baseUrl) {
      return { valid: false, error: 'CALCOM_BASE_URL not configured' };
    }
    if (!this.apiKey) {
      return { valid: false, error: 'CALCOM_API_KEY not configured' };
    }

    try {
      await this.request('GET', '/api/v2/me');
      return { valid: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      return { valid: false, error: message };
    }
  }
}
