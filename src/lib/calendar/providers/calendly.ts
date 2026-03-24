/**
 * Calendly Adapter
 * Uses Calendly API v2 (https://api.calendly.com).
 * OAuth2 flow for connecting customer's Calendly account.
 *
 * IMPORTANT: Calendly does NOT allow creating bookings via API.
 * The adapter returns a schedulingUrl for the user to complete booking on Calendly.
 */

import type {
  CalendarProviderAdapter,
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  CancelRequest,
  RescheduleRequest,
  CalendlyConfig,
} from '../types';

const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_AUTH_BASE = 'https://auth.calendly.com';

export class CalendlyAdapter implements CalendarProviderAdapter {
  private config: CalendlyConfig;

  constructor(config: CalendlyConfig) {
    this.config = config;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = path.startsWith('http') ? path : `${CALENDLY_API_BASE}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.access_token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      throw new Error(`Calendly API error ${res.status}: ${text}`);
    }

    return res.json();
  }

  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    if (!this.config.event_type_uuid) {
      throw new Error('Event type UUID not configured');
    }

    // Calendly uses event_type URI for availability
    const eventTypeUri = `${CALENDLY_API_BASE}/event_types/${this.config.event_type_uuid}`;

    const params = new URLSearchParams({
      event_type: eventTypeUri,
      start_time: `${request.dateFrom}T00:00:00.000Z`,
      end_time: `${request.dateTo}T23:59:59.999Z`,
    });

    const data = await this.request<{
      collection: Array<{
        start_time: string;
        status: string;
        invitees_remaining: number;
      }>;
    }>('GET', `/event_type_available_times?${params.toString()}`);

    const duration = request.duration || 30;
    const slots = (data.collection || [])
      .filter((slot) => slot.status === 'available' && slot.invitees_remaining > 0)
      .map((slot) => ({
        start: slot.start_time,
        end: new Date(
          new Date(slot.start_time).getTime() + duration * 60000
        ).toISOString(),
      }));

    return { slots, timezone: request.timezone };
  }

  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    // Calendly does NOT support direct booking via API.
    // Generate a scheduling link with pre-filled parameters instead.
    if (!this.config.event_type_uuid) {
      throw new Error('Event type UUID not configured');
    }

    // Build scheduling URL with pre-filled info
    const params = new URLSearchParams({
      name: request.attendeeName,
      email: request.attendeeEmail,
    });
    if (request.notes) {
      params.set('a1', request.notes); // Calendly uses a1, a2 etc. for custom answers
    }

    // Get the event type's scheduling URL
    const eventType = await this.request<{
      resource: {
        scheduling_url: string;
        name: string;
      };
    }>('GET', `/event_types/${this.config.event_type_uuid}`);

    const schedulingUrl = `${eventType.resource.scheduling_url}?${params.toString()}`;

    // Return a pending booking with the scheduling URL
    // The actual booking will be confirmed via webhook when user completes on Calendly
    return {
      id: `calendly-pending-${Date.now()}`,
      providerBookingId: '',
      status: 'pending',
      start: request.start,
      end: request.end,
      schedulingUrl,
      attendeeName: request.attendeeName,
      attendeeEmail: request.attendeeEmail,
    };
  }

  async cancelBooking(request: CancelRequest): Promise<{ success: boolean }> {
    if (!request.providerBookingId) {
      return { success: false };
    }

    // Calendly cancel endpoint uses the event UUID
    await this.request(
      'POST',
      `/scheduled_events/${request.providerBookingId}/cancellation`,
      { reason: request.reason || 'Cancelled via chatbot' }
    );
    return { success: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rescheduleBooking(_request: RescheduleRequest): Promise<BookingResponse> {
    // Calendly doesn't support rescheduling via API either
    // Return a new scheduling link for the user
    throw new Error(
      'Calendly does not support rescheduling via API. Please cancel and create a new booking.'
    );
  }

  async validateConfig(): Promise<{ valid: boolean; error?: string }> {
    if (!this.config.access_token) {
      return { valid: false, error: 'Access token is required. Please connect your Calendly account.' };
    }

    try {
      const data = await this.request<{ resource: { uri: string; name: string } }>(
        'GET',
        '/users/me'
      );
      if (!data.resource?.uri) {
        return { valid: false, error: 'Invalid response from Calendly' };
      }
      return { valid: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      return { valid: false, error: message };
    }
  }
}

// OAuth helpers for Calendly connection flow

export function getCalendlyAuthUrl(state: string): string {
  const clientId = process.env.CALENDLY_CLIENT_ID;
  const redirectUri = process.env.CALENDLY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Calendly OAuth not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
  });

  return `${CALENDLY_AUTH_BASE}/oauth/authorize?${params.toString()}`;
}

export async function exchangeCalendlyCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}> {
  const clientId = process.env.CALENDLY_CLIENT_ID;
  const clientSecret = process.env.CALENDLY_CLIENT_SECRET;
  const redirectUri = process.env.CALENDLY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Calendly OAuth not configured');
  }

  const res = await fetch(`${CALENDLY_AUTH_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Calendly token exchange failed: ${text}`);
  }

  return res.json();
}

export async function refreshCalendlyToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = process.env.CALENDLY_CLIENT_ID;
  const clientSecret = process.env.CALENDLY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Calendly OAuth not configured');
  }

  const res = await fetch(`${CALENDLY_AUTH_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to refresh Calendly token');
  }

  return res.json();
}
