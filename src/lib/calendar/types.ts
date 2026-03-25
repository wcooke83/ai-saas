/**
 * Calendar Booking Integration Types
 * Unified interface for Easy!Appointments provider
 */

export type CalendarProvider = 'easy_appointments';

export interface TimeSlot {
  start: string; // ISO 8601
  end: string;   // ISO 8601
}

export interface AvailabilityRequest {
  dateFrom: string;  // YYYY-MM-DD
  dateTo: string;    // YYYY-MM-DD
  timezone: string;  // IANA timezone
  duration?: number; // minutes, defaults to service duration
}

export interface AvailabilityResponse {
  slots: TimeSlot[];
  timezone: string;
}

export interface BookingRequest {
  start: string;         // ISO 8601
  end: string;           // ISO 8601
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface BookingResponse {
  id: string;
  providerBookingId: string;
  status: 'confirmed' | 'pending';
  start: string;
  end: string;
  meetingUrl?: string;
  attendeeName: string;
  attendeeEmail: string;
}

export interface CancelRequest {
  providerBookingId: string;
  reason?: string;
}

export interface RescheduleRequest {
  providerBookingId: string;
  newStart: string;
  newEnd: string;
  reason?: string;
}

export interface CalendarProviderAdapter {
  getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse>;
  createBooking(request: BookingRequest): Promise<BookingResponse>;
  cancelBooking(request: CancelRequest): Promise<{ success: boolean }>;
  rescheduleBooking(request: RescheduleRequest): Promise<BookingResponse>;
  validateConfig(): Promise<{ valid: boolean; error?: string }>;
}

// Database row types
export interface CalendarIntegration {
  id: string;
  chatbot_id: string;
  user_id: string;
  provider: CalendarProvider;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CalendarBooking {
  id: string;
  integration_id: string | null;
  chatbot_id: string;
  chat_session_id: string | null;
  provider: string;
  provider_booking_id: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'no_show';
  attendee_name: string;
  attendee_email: string;
  attendee_timezone: string;
  start_time: string;
  end_time: string;
  meeting_url: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CalendarAvailabilityCache {
  id: string;
  integration_id: string;
  date: string;
  slots: TimeSlot[];
  fetched_at: string;
  expires_at: string;
}

// Easy!Appointments config stored per-integration
export interface EasyAppointmentsConfig {
  service_id?: string;
  provider_id?: string;
}

// Business hours & event type config (local)
export interface BusinessHoursEntry {
  dayOfWeek: number; // 0=Sun, 6=Sat
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isEnabled: boolean;
}

export interface EventTypeConfig {
  title: string;
  slug: string;
  description?: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  minNoticeHours: number;
  maxDaysAhead: number;
  timezone: string;
}

export const DEFAULT_BUSINESS_HOURS: BusinessHoursEntry[] = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isEnabled: false },
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isEnabled: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isEnabled: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isEnabled: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isEnabled: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isEnabled: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isEnabled: false },
];

export const DEFAULT_EVENT_TYPE: EventTypeConfig = {
  title: 'Appointment',
  slug: 'appointment',
  durationMinutes: 30,
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  minNoticeHours: 1,
  maxDaysAhead: 30,
  timezone: 'UTC',
};

// Chat message content types for calendar
export type CalendarMessageContent =
  | { type: 'availability'; slots: TimeSlot[]; timezone: string; duration: number }
  | { type: 'booking_confirmation'; booking: BookingResponse };

// Calendar tool definitions for AI function calling
export const CALENDAR_TOOLS = [
  {
    name: 'check_availability',
    description: 'Check available appointment slots for a date range',
    parameters: {
      type: 'object' as const,
      properties: {
        date_from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        date_to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        timezone: { type: 'string', description: 'IANA timezone (e.g., America/New_York)' },
        duration_minutes: { type: 'number', description: 'Appointment duration in minutes' },
      },
      required: ['date_from', 'date_to', 'timezone'],
    },
  },
  {
    name: 'create_booking',
    description: 'Book an appointment at a specific time',
    parameters: {
      type: 'object' as const,
      properties: {
        start_time: { type: 'string', description: 'Start time in ISO 8601 format' },
        end_time: { type: 'string', description: 'End time in ISO 8601 format' },
        attendee_name: { type: 'string' },
        attendee_email: { type: 'string' },
        attendee_timezone: { type: 'string' },
        notes: { type: 'string', description: 'Any notes or context for the appointment' },
      },
      required: ['start_time', 'end_time', 'attendee_name', 'attendee_email', 'attendee_timezone'],
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancel an existing booking',
    parameters: {
      type: 'object' as const,
      properties: {
        booking_id: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['booking_id'],
    },
  },
  {
    name: 'reschedule_booking',
    description: 'Reschedule an existing booking to a new time',
    parameters: {
      type: 'object' as const,
      properties: {
        booking_id: { type: 'string' },
        new_start_time: { type: 'string' },
        new_end_time: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['booking_id', 'new_start_time', 'new_end_time'],
    },
  },
] as const;
