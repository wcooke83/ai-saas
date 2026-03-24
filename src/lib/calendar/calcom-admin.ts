/**
 * Cal.com Admin API
 * Manages event types and schedules on the hosted Cal.com instance
 * so users never need to access Cal.com directly.
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface CalcomScheduleInput {
  name: string;
  timeZone: string;
  isDefault?: boolean;
  availability?: Array<{
    days: string[]; // Day names: "Monday", "Tuesday", etc.
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
  }>;
}

export interface CalcomEventTypeInput {
  title: string;
  slug: string;
  lengthInMinutes: number;
  description?: string;
  scheduleId?: number;
  beforeEventBuffer?: number;
  afterEventBuffer?: number;
  minimumBookingNotice?: number; // minutes
}

export class CalcomAdminAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.CALCOM_BASE_URL || '';
    this.apiKey = process.env.CALCOM_API_KEY || '';
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
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
      throw new Error(`Cal.com Admin API ${res.status}: ${text}`);
    }

    return res.json();
  }

  // ── Schedules ──

  async createSchedule(input: CalcomScheduleInput): Promise<{ id: number }> {
    const data = await this.request<{ data: { id: number } }>('POST', '/api/v2/schedules', input);
    return { id: data.data.id };
  }

  async updateSchedule(id: number, input: Partial<CalcomScheduleInput>): Promise<void> {
    await this.request('PATCH', `/api/v2/schedules/${id}`, input);
  }

  async getSchedule(id: number): Promise<CalcomScheduleInput & { id: number }> {
    const data = await this.request<{ data: CalcomScheduleInput & { id: number } }>(
      'GET', `/api/v2/schedules/${id}`
    );
    return data.data;
  }

  // ── Event Types ──

  async createEventType(input: CalcomEventTypeInput): Promise<{ id: number; slug: string }> {
    const data = await this.request<{ data: { id: number; slug: string } }>(
      'POST', '/api/v2/event-types', input
    );
    return { id: data.data.id, slug: data.data.slug };
  }

  async updateEventType(id: number, input: Partial<CalcomEventTypeInput>): Promise<void> {
    await this.request('PATCH', `/api/v2/event-types/${id}`, input);
  }

  async getEventType(id: number): Promise<CalcomEventTypeInput & { id: number }> {
    const data = await this.request<{ data: CalcomEventTypeInput & { id: number } }>(
      'GET', `/api/v2/event-types/${id}`
    );
    return data.data;
  }

  async deleteEventType(id: number): Promise<void> {
    await this.request('DELETE', `/api/v2/event-types/${id}`);
  }
}

/**
 * Convert our 0-6 (Sun-Sat) day index to Cal.com day name
 */
export function toCalcomDay(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] || 'Monday';
}
