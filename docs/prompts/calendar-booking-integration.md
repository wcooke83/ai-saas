# Prompt: Calendar Booking Integration for AI Chatbot Platform

## Context

You are building a calendar booking integration for an existing AI SaaS chatbot platform built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (auth, database, pgvector), Stripe for payments, and AI providers (Claude/OpenAI with fallback). The chatbot system already exists with RAG-based knowledge sources, chat sessions, and an embeddable widget.

The codebase follows this structure:
```
src/
├── app/api/           # Next.js API routes
├── app/dashboard/     # Protected user dashboard
├── components/        # UI components (shadcn/ui style)
├── lib/
│   ├── ai/            # AI provider system with unified interface
│   ├── supabase/      # Supabase clients (client.ts, server.ts, admin.ts, middleware.ts)
│   └── chatbots/      # RAG system, knowledge processing, embeddings
└── types/database.ts  # Supabase-generated types
```

## Objective

Build a calendar booking system that integrates with the existing chatbot, allowing end-users to book appointments through natural conversation. The system must support three provider modes:

1. **Hosted Cal.com (self-hosted)** — We host a Cal.com instance and manage calendars on behalf of customers who don't have their own scheduling tool. Our self-hosted Cal.com instance is available at `{CALCOM_SELF_HOSTED_URL}` with admin API access.
2. **Customer's Cal.com** — Customer connects their own Cal.com account (cloud or self-hosted). We interact via their Cal.com API.
3. **Customer's Calendly** — Customer connects their existing Calendly account. We interact via Calendly API v2.

From the chatbot's perspective, all three providers behave identically — the chatbot calls a unified booking interface and the system routes to the correct provider.

## Database Schema

Create Supabase migrations for the following tables:

### `calendar_integrations`
Stores per-chatbot calendar provider configuration.
```
id: uuid (PK, default gen_random_uuid())
chatbot_id: uuid (FK → chatbots.id, ON DELETE CASCADE)
user_id: uuid (FK → profiles.id, ON DELETE CASCADE)
provider: text NOT NULL CHECK (provider IN ('hosted_calcom', 'customer_calcom', 'calendly'))
is_active: boolean DEFAULT true
config: jsonb NOT NULL DEFAULT '{}'
-- config structure varies by provider:
-- hosted_calcom:   { "calcom_user_id": "...", "event_type_id": "...", "calendar_id": "..." }
-- customer_calcom: { "api_key": "...", "base_url": "...", "event_type_id": "..." }
-- calendly:        { "access_token": "...", "refresh_token": "...", "organization_uri": "...", "user_uri": "...", "event_type_uuid": "..." }
created_at: timestamptz DEFAULT now()
updated_at: timestamptz DEFAULT now()
```

### `calendar_bookings`
Tracks all bookings made through the chatbot.
```
id: uuid (PK, default gen_random_uuid())
integration_id: uuid (FK → calendar_integrations.id, ON DELETE SET NULL)
chatbot_id: uuid (FK → chatbots.id, ON DELETE CASCADE)
chat_session_id: uuid (FK → chat_sessions.id, ON DELETE SET NULL)
provider: text NOT NULL
provider_booking_id: text -- external ID from the provider
status: text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rescheduled', 'no_show'))
attendee_name: text NOT NULL
attendee_email: text NOT NULL
attendee_timezone: text NOT NULL DEFAULT 'UTC'
start_time: timestamptz NOT NULL
end_time: timestamptz NOT NULL
meeting_url: text -- video call link if applicable
notes: text
metadata: jsonb DEFAULT '{}'
created_at: timestamptz DEFAULT now()
updated_at: timestamptz DEFAULT now()
```

### `calendar_availability_cache`
Short-lived cache to reduce API calls when checking availability.
```
id: uuid (PK, default gen_random_uuid())
integration_id: uuid (FK → calendar_integrations.id, ON DELETE CASCADE)
date: date NOT NULL
slots: jsonb NOT NULL -- array of { "start": "ISO8601", "end": "ISO8601" }
fetched_at: timestamptz DEFAULT now()
expires_at: timestamptz NOT NULL
UNIQUE(integration_id, date)
```

Add RLS policies:
- Users can only read/write their own calendar_integrations (via chatbot ownership)
- calendar_bookings readable by integration owner
- Service role has full access for webhook processing

## Architecture

### 1. Unified Calendar Provider Interface

Create `src/lib/calendar/types.ts`:
```typescript
export type CalendarProvider = 'hosted_calcom' | 'customer_calcom' | 'calendly';

export interface TimeSlot {
  start: string; // ISO 8601
  end: string;   // ISO 8601
}

export interface AvailabilityRequest {
  dateFrom: string;  // YYYY-MM-DD
  dateTo: string;    // YYYY-MM-DD
  timezone: string;  // IANA timezone
  duration?: number; // minutes, defaults to event type duration
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
```

### 2. Provider Adapters

Create individual adapter files:

**`src/lib/calendar/providers/hosted-calcom.ts`**
- Uses Cal.com API v2 against our self-hosted instance
- Admin API key from env `CALCOM_API_KEY` and base URL from `CALCOM_BASE_URL`
- Creates managed users on our Cal.com instance for each customer
- Manages event types per chatbot
- Endpoints used:
  - `GET /v2/slots/available` — check availability
  - `POST /v2/bookings` — create booking
  - `DELETE /v2/bookings/{id}` — cancel
  - `PATCH /v2/bookings/{id}/reschedule` — reschedule

**`src/lib/calendar/providers/customer-calcom.ts`**
- Uses Cal.com API v2 against the customer's Cal.com instance (cloud or self-hosted)
- API key and base URL stored in `calendar_integrations.config`
- Same endpoints as hosted, but hitting customer's instance
- Must handle both cal.com cloud (`https://api.cal.com`) and self-hosted URLs

**`src/lib/calendar/providers/calendly.ts`**
- Uses Calendly API v2 (`https://api.calendly.com`)
- OAuth2 flow for connecting customer's Calendly account
- Endpoints used:
  - `GET /event_type_available_times` — check availability
  - `POST /scheduled_events` — note: Calendly doesn't support direct booking via API, use scheduling links instead
  - `POST /invitee_no_shows/{uuid}` — mark no-show
  - `POST /scheduled_events/{uuid}/cancellation` — cancel

**IMPORTANT Calendly limitation**: Calendly does NOT allow creating bookings via API. The chatbot must generate a Calendly scheduling link with pre-filled parameters and present it to the user. Handle this gracefully in the adapter by returning a `schedulingUrl` in the booking response instead of directly creating the event.

### 3. Provider Factory

Create `src/lib/calendar/provider-factory.ts`:
```typescript
export function createCalendarProvider(
  provider: CalendarProvider,
  config: Record<string, unknown>
): CalendarProviderAdapter
```

Instantiates the correct adapter based on provider type and config.

### 4. Calendar Service Layer

Create `src/lib/calendar/service.ts` — the main entry point used by the chatbot and API routes:

```typescript
export class CalendarService {
  // Get the active calendar integration for a chatbot
  static async getIntegration(chatbotId: string): Promise<CalendarIntegration | null>

  // Check availability (uses cache when valid)
  static async getAvailability(chatbotId: string, request: AvailabilityRequest): Promise<AvailabilityResponse>

  // Create a booking and persist to calendar_bookings
  static async createBooking(chatbotId: string, sessionId: string, request: BookingRequest): Promise<BookingResponse>

  // Cancel a booking
  static async cancelBooking(bookingId: string, reason?: string): Promise<void>

  // Reschedule a booking
  static async rescheduleBooking(bookingId: string, request: RescheduleRequest): Promise<BookingResponse>

  // Process incoming webhooks from providers
  static async handleWebhook(provider: CalendarProvider, payload: unknown): Promise<void>
}
```

The service layer handles:
- Resolving the correct provider adapter
- Caching availability in `calendar_availability_cache`
- Persisting bookings to `calendar_bookings`
- Updating booking status from webhooks

### 5. API Routes

**`src/app/api/calendar/availability/route.ts`** — POST
- Input: `{ chatbotId, dateFrom, dateTo, timezone, duration? }`
- Returns available time slots
- Uses availability cache (5-minute TTL)

**`src/app/api/calendar/book/route.ts`** — POST
- Input: `{ chatbotId, sessionId, start, end, attendeeName, attendeeEmail, attendeeTimezone, notes? }`
- Creates booking via provider and persists locally
- Returns booking confirmation or scheduling URL (Calendly)

**`src/app/api/calendar/bookings/[id]/route.ts`** — GET, PATCH, DELETE
- GET: Retrieve booking details
- PATCH: Reschedule `{ newStart, newEnd, reason? }`
- DELETE: Cancel `{ reason? }`

**`src/app/api/calendar/webhook/[provider]/route.ts`** — POST
- Handles incoming webhooks from Cal.com and Calendly
- Verifies webhook signatures
- Updates booking status in `calendar_bookings`

**`src/app/api/calendar/connect/calendly/route.ts`** — GET (OAuth callback)
- Handles Calendly OAuth2 authorization code exchange
- Stores tokens in `calendar_integrations.config`

**`src/app/api/calendar/connect/calcom/route.ts`** — POST
- Validates and stores customer's Cal.com API key and base URL

### 6. Chatbot Integration

This is the critical piece — how the AI chatbot naturally handles booking conversations.

**`src/lib/ai/prompts/calendar-booking.ts`** — System prompt additions:

When a chatbot has an active calendar integration, append to its system prompt:

```
You have calendar booking capabilities. When a user wants to schedule an appointment, meeting, or booking:

1. COLLECT required information through natural conversation:
   - Their preferred date(s) and time(s)
   - Their name (if not already known)
   - Their email address
   - Their timezone (detect from context or ask)

2. CHECK AVAILABILITY by calling the check_availability function with the requested date range.

3. PRESENT available slots to the user in a friendly format, grouped by date, in their timezone.

4. CONFIRM the booking by calling the create_booking function with the selected slot and attendee details.

5. HANDLE edge cases naturally:
   - If no slots are available on the requested date, suggest nearby dates
   - If the user wants to reschedule, call the reschedule_booking function
   - If the user wants to cancel, call the cancel_booking function
   - Always confirm before making changes

Never fabricate availability. Always check real availability before suggesting times.
Format times in the user's local timezone with clear date formatting (e.g., "Tuesday, March 24 at 2:00 PM EST").
```

**Tool/Function definitions for the AI:**

Add calendar tools to the chatbot's available functions:

```typescript
const calendarTools = [
  {
    name: 'check_availability',
    description: 'Check available appointment slots for a date range',
    parameters: {
      type: 'object',
      properties: {
        date_from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        date_to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        timezone: { type: 'string', description: 'IANA timezone (e.g., America/New_York)' },
        duration_minutes: { type: 'number', description: 'Appointment duration in minutes' }
      },
      required: ['date_from', 'date_to', 'timezone']
    }
  },
  {
    name: 'create_booking',
    description: 'Book an appointment at a specific time',
    parameters: {
      type: 'object',
      properties: {
        start_time: { type: 'string', description: 'Start time in ISO 8601 format' },
        end_time: { type: 'string', description: 'End time in ISO 8601 format' },
        attendee_name: { type: 'string' },
        attendee_email: { type: 'string' },
        attendee_timezone: { type: 'string' },
        notes: { type: 'string', description: 'Any notes or context for the appointment' }
      },
      required: ['start_time', 'end_time', 'attendee_name', 'attendee_email', 'attendee_timezone']
    }
  },
  {
    name: 'cancel_booking',
    description: 'Cancel an existing booking',
    parameters: {
      type: 'object',
      properties: {
        booking_id: { type: 'string' },
        reason: { type: 'string' }
      },
      required: ['booking_id']
    }
  },
  {
    name: 'reschedule_booking',
    description: 'Reschedule an existing booking to a new time',
    parameters: {
      type: 'object',
      properties: {
        booking_id: { type: 'string' },
        new_start_time: { type: 'string' },
        new_end_time: { type: 'string' },
        reason: { type: 'string' }
      },
      required: ['booking_id', 'new_start_time', 'new_end_time']
    }
  }
];
```

**Tool execution handler** — in the chatbot message processing pipeline, intercept tool calls and route them to `CalendarService`:

Create `src/lib/chatbots/tools/calendar-handler.ts`:
```typescript
export async function handleCalendarToolCall(
  toolName: string,
  args: Record<string, unknown>,
  context: { chatbotId: string; sessionId: string }
): Promise<string> // Returns stringified result for the AI to interpret
```

### 7. Dashboard UI

**Calendar Settings Page** — `src/app/dashboard/chatbots/[id]/calendar/page.tsx`

A settings page for each chatbot where the customer configures their calendar integration:

- **Provider Selection**: Radio/card selection between:
  - "Use our hosted calendar" (hosted Cal.com) — simplest setup, just configure availability
  - "Connect your Cal.com" — enter API key + base URL (or OAuth)
  - "Connect Calendly" — OAuth flow button

- **Availability Configuration** (for hosted Cal.com):
  - Business hours per day of week
  - Appointment duration options (15, 30, 45, 60 min)
  - Buffer time between appointments
  - Minimum notice period
  - How far in advance bookings can be made

- **Event Type Settings**:
  - Event name, description
  - Location (video call, phone, in-person)
  - Custom questions/fields

- **Integration Status**:
  - Connection status indicator
  - Last sync timestamp
  - Test availability check button

- **Booking History**:
  - Table of recent bookings with status, attendee, date/time
  - Filter by status
  - Manual cancel/reschedule actions

**Components needed:**
- `src/components/calendar/provider-selector.tsx`
- `src/components/calendar/availability-config.tsx`
- `src/components/calendar/event-type-config.tsx`
- `src/components/calendar/booking-history.tsx`
- `src/components/calendar/connection-status.tsx`
- `src/components/calendar/calendly-oauth-button.tsx`
- `src/components/calendar/calcom-connect-form.tsx`

### 8. Chat Widget Updates

Update the existing chat widget to handle booking UI elements:

- When the AI presents available time slots, render them as clickable slot cards/pills rather than plain text
- When a booking is confirmed, show a styled confirmation card with:
  - Date, time, timezone
  - Meeting link (if video call)
  - Add to calendar button (generates .ics file)
  - Cancel/reschedule buttons
- For Calendly (where direct booking isn't possible), embed the Calendly scheduling widget inline or show a styled link

Create:
- `src/components/widget/calendar-slots.tsx` — renders available time slots as interactive elements
- `src/components/widget/booking-confirmation.tsx` — booking confirmation card
- `src/components/widget/calendly-inline.tsx` — inline Calendly embed for Calendly provider

The chat message type needs extending to support structured calendar responses:
```typescript
type ChatMessageContent =
  | { type: 'text'; text: string }
  | { type: 'availability'; slots: TimeSlot[]; timezone: string; duration: number }
  | { type: 'booking_confirmation'; booking: BookingResponse }
  | { type: 'calendly_link'; url: string; eventType: string }
```

### 9. Webhook Handling

**Cal.com webhooks** (both hosted and customer):
- `BOOKING_CREATED` → update booking status to confirmed
- `BOOKING_CANCELLED` → update status to cancelled
- `BOOKING_RESCHEDULED` → update times and status
- Verify via webhook secret in headers

**Calendly webhooks**:
- `invitee.created` → booking confirmed
- `invitee.canceled` → booking cancelled
- Verify via webhook signing key

Register webhooks:
- For hosted Cal.com: register during instance setup
- For customer Cal.com: register via API when customer connects
- For Calendly: register via API during OAuth flow

### 10. Environment Variables

```
# Self-hosted Cal.com
CALCOM_BASE_URL=https://cal.yourdomain.com
CALCOM_API_KEY=cal_...
CALCOM_WEBHOOK_SECRET=whsec_...

# Calendly OAuth
CALENDLY_CLIENT_ID=...
CALENDLY_CLIENT_SECRET=...
CALENDLY_REDIRECT_URI=https://yourdomain.com/api/calendar/connect/calendly
CALENDLY_WEBHOOK_SIGNING_KEY=...
```

## Implementation Order

Build in this sequence:

1. **Database migrations** — create tables, indexes, RLS policies
2. **Types and interfaces** — `src/lib/calendar/types.ts`
3. **Hosted Cal.com adapter** — get one provider working end-to-end first
4. **Calendar service layer** — with caching
5. **API routes** — availability + booking endpoints
6. **Chatbot tool integration** — AI function calling for calendar
7. **Dashboard calendar settings page** — provider selection + config
8. **Chat widget calendar components** — slot picker, confirmation cards
9. **Customer Cal.com adapter** — extend to customer-provided instances
10. **Calendly adapter** — OAuth flow + API integration + scheduling link fallback
11. **Webhook handlers** — all providers
12. **Availability cache** — optimize API call frequency
13. **Booking history UI** — dashboard table with management actions

## Key Considerations

- **Rate limiting**: Cal.com and Calendly have API rate limits. Cache availability aggressively (5-min TTL) and batch requests where possible.
- **Timezone handling**: Always store in UTC, convert for display. Use `Intl.DateTimeFormat` for formatting. The chatbot should detect timezone from conversation context or ask explicitly.
- **Error handling**: Provider APIs can fail. Show friendly messages in the chat ("I'm having trouble checking availability right now, please try again in a moment").
- **Calendly booking limitation**: Since Calendly doesn't support direct API booking, the UX must gracefully transition to their scheduling link. The chatbot should pre-fill what it can and explain the user will complete booking on Calendly.
- **Security**: Encrypt stored API keys and OAuth tokens in the database config column. Validate webhook signatures for all providers. Rate limit booking endpoints to prevent abuse.
- **Concurrent booking prevention**: When creating a booking, re-check availability immediately before confirming to prevent double-booking race conditions.
- **Idempotency**: Use idempotency keys for booking creation to prevent duplicates from retries.
