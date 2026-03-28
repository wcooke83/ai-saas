/**
 * Easy!Appointments Adapter
 * Uses the Easy!Appointments REST API v1 with Basic Auth.
 * Credentials from env: EASY_APPOINTMENTS_URL, EASY_APPOINTMENTS_KEY (Base64-encoded credentials)
 */

import type {
  CalendarProviderAdapter,
  AvailabilityRequest,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  CancelRequest,
  RescheduleRequest,
  EasyAppointmentsConfig,
  EAService,
  EAServiceCreateInput,
  EAProvider,
  EAProviderCreateInput,
  EABlockedPeriod,
  EABlockedPeriodInput,
  EAWorkingPlanDay,
} from '../types';

export class EasyAppointmentsAdapter implements CalendarProviderAdapter {
  private baseUrl: string;
  private authHeader: string;
  private config: EasyAppointmentsConfig;

  constructor(config: EasyAppointmentsConfig) {
    const url = (process.env.EASY_APPOINTMENTS_URL || '').replace(/\/+$/, '');
    this.baseUrl = `${url}/index.php/api/v1`;
    const key = process.env.EASY_APPOINTMENTS_KEY || '';
    this.authHeader = `Basic ${key}`;
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
        Authorization: this.authHeader,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      throw new Error(`Easy!Appointments API error ${res.status}: ${text}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return res.text() as unknown as T;
  }

  async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    const duration = request.duration || 30;
    const allSlots: { start: string; end: string }[] = [];

    // EA returns available hours for one date at a time
    const startDate = new Date(request.dateFrom + 'T00:00:00Z');
    const endDate = new Date(request.dateTo + 'T00:00:00Z');

    for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      const params = new URLSearchParams({ date: dateStr });
      if (this.config.provider_id) params.set('providerId', this.config.provider_id);
      if (this.config.service_id) params.set('serviceId', this.config.service_id);

      try {
        const hours = await this.request<string[]>(
          'GET',
          `/availabilities?${params.toString()}`
        );

        // EA returns array of available hour strings like ["09:00", "09:30", "10:00"]
        if (Array.isArray(hours)) {
          for (const hour of hours) {
            const startISO = `${dateStr}T${hour}:00`;
            const endISO = new Date(
              new Date(startISO).getTime() + duration * 60000
            ).toISOString();

            allSlots.push({ start: new Date(startISO).toISOString(), end: endISO });
          }
        }
      } catch (err) {
        // Skip dates with no availability or errors
        console.warn(`[EasyAppointments] Failed to get availability for ${dateStr}:`, err);
      }
    }

    return { slots: allSlots, timezone: request.timezone };
  }

  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    // Find or create customer
    const customerId = await this.findOrCreateCustomer(
      request.attendeeName,
      request.attendeeEmail,
      request.attendeeTimezone
    );

    // Format datetimes for EA (YYYY-MM-DD HH:mm:ss)
    const startFormatted = this.toEADatetime(request.start);
    const endFormatted = this.toEADatetime(request.end);

    const appointmentBody: Record<string, unknown> = {
      start: startFormatted,
      end: endFormatted,
      notes: request.notes || '',
      customerId,
    };
    if (this.config.provider_id) appointmentBody.providerId = Number(this.config.provider_id);
    if (this.config.service_id) appointmentBody.serviceId = Number(this.config.service_id);

    const appointment = await this.request<{
      id: number;
      start: string;
      end: string;
    }>('POST', '/appointments', appointmentBody);

    return {
      id: String(appointment.id),
      providerBookingId: String(appointment.id),
      status: 'confirmed',
      start: this.fromEADatetime(appointment.start),
      end: this.fromEADatetime(appointment.end),
      attendeeName: request.attendeeName,
      attendeeEmail: request.attendeeEmail,
    };
  }

  async cancelBooking(request: CancelRequest): Promise<{ success: boolean }> {
    await this.request('DELETE', `/appointments/${request.providerBookingId}`);
    return { success: true };
  }

  async rescheduleBooking(request: RescheduleRequest): Promise<BookingResponse> {
    const startFormatted = this.toEADatetime(request.newStart);
    const endFormatted = this.toEADatetime(request.newEnd);

    // Get existing appointment to preserve customer info
    const existing = await this.request<{
      id: number;
      customerId: number;
      providerId: number;
      serviceId: number;
    }>('GET', `/appointments/${request.providerBookingId}`);

    const updated = await this.request<{
      id: number;
      start: string;
      end: string;
    }>('PUT', `/appointments/${request.providerBookingId}`, {
      start: startFormatted,
      end: endFormatted,
      customerId: existing.customerId,
      providerId: existing.providerId,
      serviceId: existing.serviceId,
    });

    return {
      id: String(updated.id),
      providerBookingId: String(updated.id),
      status: 'confirmed',
      start: this.fromEADatetime(updated.start),
      end: this.fromEADatetime(updated.end),
      attendeeName: '',
      attendeeEmail: '',
    };
  }

  async validateConfig(): Promise<{ valid: boolean; error?: string }> {
    const url = process.env.EASY_APPOINTMENTS_URL;
    if (!url) {
      return { valid: false, error: 'EASY_APPOINTMENTS_URL not configured' };
    }
    if (!process.env.EASY_APPOINTMENTS_KEY) {
      return { valid: false, error: 'EASY_APPOINTMENTS_KEY not configured' };
    }

    try {
      await this.request('GET', '/services');
      return { valid: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      return { valid: false, error: message };
    }
  }

  /** Fetch available services from EA */
  async getServices(): Promise<Array<{ id: number; name: string; duration: number }>> {
    const services = await this.request<Array<{
      id: number;
      name: string;
      duration: number;
    }>>('GET', '/services');
    return services;
  }

  /** Fetch available providers from EA */
  async getProviders(): Promise<Array<{ id: number; firstName: string; lastName: string }>> {
    const providers = await this.request<Array<{
      id: number;
      firstName: string;
      lastName: string;
    }>>('GET', '/providers');
    return providers;
  }

  // ── Services CRUD ──

  async getServicesFull(): Promise<EAService[]> {
    return this.request<EAService[]>('GET', '/services');
  }

  async createService(input: EAServiceCreateInput): Promise<EAService> {
    return this.request<EAService>('POST', '/services', input);
  }

  async updateService(id: number, input: Partial<EAServiceCreateInput>): Promise<EAService> {
    return this.request<EAService>('PUT', `/services/${id}`, input);
  }

  async deleteService(id: number): Promise<void> {
    await this.request('DELETE', `/services/${id}`);
  }

  // ── Providers CRUD ──

  async getProvidersFull(): Promise<EAProvider[]> {
    return this.request<EAProvider[]>('GET', '/providers');
  }

  async getProvider(id: number): Promise<EAProvider> {
    return this.request<EAProvider>('GET', `/providers/${id}`);
  }

  async createProvider(input: EAProviderCreateInput): Promise<EAProvider> {
    return this.request<EAProvider>('POST', '/providers', input);
  }

  async updateProvider(id: number, input: Record<string, unknown>): Promise<EAProvider> {
    return this.request<EAProvider>('PUT', `/providers/${id}`, input);
  }

  async deleteProvider(id: number): Promise<void> {
    await this.request('DELETE', `/providers/${id}`);
  }

  // ── Blocked Periods (Holidays) ──

  async getBlockedPeriods(): Promise<EABlockedPeriod[]> {
    return this.request<EABlockedPeriod[]>('GET', '/blocked_periods');
  }

  async createBlockedPeriod(input: EABlockedPeriodInput): Promise<EABlockedPeriod> {
    return this.request<EABlockedPeriod>('POST', '/blocked_periods', input);
  }

  async deleteBlockedPeriod(id: number): Promise<void> {
    await this.request('DELETE', `/blocked_periods/${id}`);
  }

  // ── Working Plan Exceptions (Date Overrides) ──

  async getWorkingPlanExceptions(providerId: number): Promise<Record<string, EAWorkingPlanDay | null>> {
    const provider = await this.getProvider(providerId);
    return provider.settings.workingPlanExceptions || {};
  }

  async setWorkingPlanExceptions(
    providerId: number,
    exceptions: Record<string, EAWorkingPlanDay | null>
  ): Promise<void> {
    const provider = await this.getProvider(providerId);
    const merged = { ...provider.settings.workingPlanExceptions, ...exceptions };
    await this.request('PUT', `/providers/${providerId}`, {
      settings: { ...provider.settings, workingPlanExceptions: merged },
    });
  }

  async removeWorkingPlanException(providerId: number, date: string): Promise<void> {
    const provider = await this.getProvider(providerId);
    const exceptions = { ...provider.settings.workingPlanExceptions };
    delete exceptions[date];
    await this.request('PUT', `/providers/${providerId}`, {
      settings: { ...provider.settings, workingPlanExceptions: exceptions },
    });
  }

  // ── Private helpers ──

  private async findOrCreateCustomer(
    name: string,
    email: string,
    timezone: string
  ): Promise<number> {
    // Search for existing customer by email
    try {
      const customers = await this.request<Array<{
        id: number;
        email: string;
      }>>('GET', `/customers?q=${encodeURIComponent(email)}`);

      const existing = customers.find(
        (c) => c.email?.toLowerCase() === email.toLowerCase()
      );
      if (existing) return existing.id;
    } catch {
      // Search failed, create new
    }

    // Split name into first/last
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || name;
    const lastName = parts.slice(1).join(' ') || '';

    const customer = await this.request<{ id: number }>('POST', '/customers', {
      firstName,
      lastName,
      email,
      timezone,
    });

    return customer.id;
  }

  /** Convert ISO 8601 to EA format: "YYYY-MM-DD HH:mm:ss" */
  private toEADatetime(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  /** Convert EA datetime "YYYY-MM-DD HH:mm:ss" to ISO 8601 */
  private fromEADatetime(ea: string): string {
    return new Date(ea.replace(' ', 'T')).toISOString();
  }
}
