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

// Per-provider price overrides: provider EA id -> service EA id -> price
export type ProviderServicePriceOverrides = Record<string, Record<string, number>>;

// Easy!Appointments config stored per-integration
export interface EasyAppointmentsConfig {
  service_id?: string;
  provider_id?: string;
  provider_service_prices?: ProviderServicePriceOverrides;
  business_hours_sets?: BusinessHoursSet[];
  holidays?: HolidayEntry[];
}

// Business hours & event type config (local)
export interface BusinessHoursEntry {
  dayOfWeek: number; // 0=Sun, 6=Sat
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isEnabled: boolean;
}

/** A set of business hours optionally scoped to specific services/providers */
export interface BusinessHoursSet {
  id: string;                    // UUID for identification
  label?: string;                // e.g. "Massage Therapy Hours"
  hours: BusinessHoursEntry[];   // 7 entries, same structure as global
  serviceIds?: string[];         // optional, undefined = all services
  providerIds?: string[];        // optional, undefined = all providers
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

/** Duplicate detection key for scoped business hours sets */
export function businessHoursSetKey(set: { serviceIds?: string[]; providerIds?: string[] }): string {
  const sIds = (set.serviceIds || []).sort().join(',');
  const pIds = (set.providerIds || []).sort().join(',');
  return `${sIds}|${pIds}`;
}

/** Duplicate detection key for scoped holidays */
export function holidayKey(h: { date: string; serviceIds?: string[]; providerIds?: string[] }): string {
  const sIds = (h.serviceIds || []).sort().join(',');
  const pIds = (h.providerIds || []).sort().join(',');
  return `${h.date}|${sIds}|${pIds}`;
}

// Calendar tool definitions for AI function calling
export const CALENDAR_TOOLS = [
  {
    name: 'list_services',
    description: 'List available services that can be booked. Use this when the customer wants to book but no specific service has been pre-selected.',
    parameters: {
      type: 'object' as const,
      properties: {},
      required: [] as string[],
    },
  },
  {
    name: 'check_availability',
    description: 'Check available appointment slots for a date range. If a service_id is provided, checks availability for that specific service.',
    parameters: {
      type: 'object' as const,
      properties: {
        date_from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        date_to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        timezone: { type: 'string', description: 'IANA timezone (e.g., America/New_York)' },
        duration_minutes: { type: 'number', description: 'Appointment duration in minutes' },
        service_id: { type: 'string', description: 'Service ID to check availability for (required when no service is pre-configured)' },
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
        service_id: { type: 'string', description: 'Service ID to book (required when no service is pre-configured)' },
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

// ── EA Service (full detail from API) ──

export interface EAService {
  id: number;
  name: string;
  duration: number;        // minutes
  price: number;
  currency: string;
  description: string | null;
  color: string;
  availabilitiesType: string;
  attendantsNumber: number;
  categoryId: number | null;
}

export interface EAServiceCreateInput {
  name: string;
  duration: number;
  price?: number;
  currency?: string;
  description?: string;
  color?: string;
  categoryId?: number | null;
  attendantsNumber?: number;
  availabilitiesType?: string;
}

// ── EA Provider (full detail from API) ──

export interface EAProvider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  notes: string | null;
  services: number[];
  settings: EAProviderSettings;
}

export interface EAProviderSettings {
  username: string;
  password?: string;
  workingPlan: EAWorkingPlan;
  workingPlanExceptions: Record<string, EAWorkingPlanDay | null>;
  notifications: boolean;
  calendarView: string;
}

export interface EAWorkingPlan {
  monday: EAWorkingPlanDay | null;
  tuesday: EAWorkingPlanDay | null;
  wednesday: EAWorkingPlanDay | null;
  thursday: EAWorkingPlanDay | null;
  friday: EAWorkingPlanDay | null;
  saturday: EAWorkingPlanDay | null;
  sunday: EAWorkingPlanDay | null;
}

export interface EAWorkingPlanDay {
  start: string;   // "09:00"
  end: string;     // "17:00"
  breaks: EABreak[];
}

export interface EABreak {
  start: string;   // "12:00"
  end: string;     // "13:00"
}

export interface EAProviderCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  services: number[];
  settings: {
    username: string;
    password: string;
    workingPlan: EAWorkingPlan;
    notifications?: boolean;
  };
}

// ── Blocked Period (from EA /api/v1/blocked_periods) ──

export interface EABlockedPeriod {
  id: number;
  name: string;
  start: string;   // "2026-12-25 00:00:00"
  end: string;     // "2026-12-25 23:59:00"
  notes: string | null;
}

export interface EABlockedPeriodInput {
  name: string;
  start: string;
  end: string;
  notes?: string;
}

// ── Date Override (working_plan_exceptions on provider) ──

export interface DateOverride {
  date: string;            // "YYYY-MM-DD"
  start: string | null;    // "09:00" or null if closed
  end: string | null;      // "13:00" or null if closed
  isClosed: boolean;
  breaks: EABreak[];
  label?: string;
}

// ── Date Override Entry (local chatbot config) ──

export interface DateOverrideEntry {
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  isClosed: boolean;
  label?: string;
  serviceIds?: string[];   // specific services, or undefined/empty = all services
  providerIds?: string[];  // specific providers, or undefined/empty = all providers
}

/** A holiday/blocked date optionally scoped to specific services/providers */
export interface HolidayEntry {
  date: string;                  // "YYYY-MM-DD"
  label?: string;                // e.g. "Christmas Day"
  serviceIds?: string[];         // optional, undefined = all services
  providerIds?: string[];        // optional, undefined = all providers
}

// ── Connection health status ──

export type EAConnectionState =
  | 'connected'
  | 'not_configured'
  | 'unreachable'
  | 'auth_failed'
  | 'not_connected';
