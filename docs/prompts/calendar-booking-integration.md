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

Build a calendar booking system that integrates with the existing chatbot, allowing end-users to book appointments through natural conversation. The system uses **Easy!Appointments** as its scheduling backend.

Easy!Appointments is a self-hosted appointment scheduling application with a REST API v1. It manages services, providers, customers, and appointments.

## Environment Variables

```
EASY_APPOINTMENTS_URL=https://cal.vocui.com    # Easy!Appointments instance URL
EASY_APPOINTMENTS_KEY=...                       # Base64-encoded Basic Auth credentials
```

Auth header: `Authorization: Basic ${EASY_APPOINTMENTS_KEY}`

## Database Schema

### `calendar_integrations`
Stores per-chatbot calendar provider configuration.
```
id: uuid (PK, default gen_random_uuid())
chatbot_id: uuid (FK → chatbots.id, ON DELETE CASCADE)
user_id: uuid (FK → profiles.id, ON DELETE CASCADE)
provider: text NOT NULL CHECK (provider IN ('easy_appointments'))
is_active: boolean DEFAULT true
config: jsonb NOT NULL DEFAULT '{}'
-- config structure: { "service_id": "...", "provider_id": "..." }
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
provider_booking_id: text -- EA appointment ID
status: text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rescheduled', 'no_show'))
attendee_name: text NOT NULL
attendee_email: text NOT NULL
attendee_timezone: text NOT NULL DEFAULT 'UTC'
start_time: timestamptz NOT NULL
end_time: timestamptz NOT NULL
meeting_url: text
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

## Architecture

### 1. Unified Calendar Provider Interface

`src/lib/calendar/types.ts`:
```typescript
export type CalendarProvider = 'easy_appointments';

export interface CalendarProviderAdapter {
  getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse>;
  createBooking(request: BookingRequest): Promise<BookingResponse>;
  cancelBooking(request: CancelRequest): Promise<{ success: boolean }>;
  rescheduleBooking(request: RescheduleRequest): Promise<BookingResponse>;
  validateConfig(): Promise<{ valid: boolean; error?: string }>;
}
```

### 2. Easy!Appointments Adapter

`src/lib/calendar/providers/easy-appointments.ts`
- Uses EA REST API v1 at `${EASY_APPOINTMENTS_URL}/index.php/api/v1`
- Auth: `Authorization: Basic ${EASY_APPOINTMENTS_KEY}`
- Key endpoints:
  - `GET /availabilities?providerId=X&serviceId=Y&date=YYYY-MM-DD` — returns array of hour strings
  - `POST /appointments` — create appointment (requires customerId, providerId, serviceId)
  - `PUT /appointments/:id` — reschedule
  - `DELETE /appointments/:id` — cancel
  - `GET /services` — list available services
  - `GET /providers` — list available providers
  - `GET /customers?q=email` — search customers by email
  - `POST /customers` — create customer

Booking flow:
1. Find or create customer by email via `/customers`
2. Create appointment via `/appointments` with customerId, providerId, serviceId

### 3. Provider Factory

`src/lib/calendar/provider-factory.ts` — instantiates the Easy!Appointments adapter.

### 4. Calendar Service Layer

`src/lib/calendar/service.ts` — main entry point:
- Resolves the correct provider adapter
- Caches availability in `calendar_availability_cache` (5-min TTL)
- Persists bookings to `calendar_bookings`
- Re-checks availability before booking to prevent double-booking

### 5. API Routes

- `POST /api/calendar/availability` — check available time slots
- `POST /api/calendar/book` — create a booking (rate-limited: 10/IP/15min)
- `GET/PATCH/DELETE /api/calendar/bookings/:id` — manage bookings
- `GET /api/calendar/integrations?chatbotId=xxx` — get integration + bookings
- `DELETE /api/calendar/integrations?id=xxx` — disconnect
- `GET /api/calendar/setup?chatbotId=xxx` — get config + EA services/providers
- `POST /api/calendar/setup` — create/update integration with event type, business hours, EA service/provider IDs
- `POST /api/calendar/webhook/easy_appointments` — optional webhook endpoint for EA status sync

### 6. Chatbot Integration

When a chatbot has an active calendar integration, AI tools are available:
- `check_availability` — check slots for a date range
- `create_booking` — book an appointment
- `cancel_booking` — cancel a booking
- `reschedule_booking` — reschedule a booking

Tool handler: `src/lib/chatbots/tools/calendar-handler.ts`

### 7. Dashboard UI

Calendar settings page at `src/app/dashboard/chatbots/[id]/calendar/page.tsx`:
- Easy!Appointments service and provider dropdowns (populated from EA API)
- Appointment settings (duration, buffer, notice period, max days ahead)
- Business hours editor
- Connection status with test button
- Booking history table

### 8. Chat Widget Updates

- `src/components/widget/calendar-slots.tsx` — renders available time slots as interactive elements
- `src/components/widget/booking-confirmation.tsx` — booking confirmation card with add-to-calendar (.ics)

## Key Considerations

- **Rate limiting**: Cache availability aggressively (5-min TTL) to reduce EA API calls.
- **Timezone handling**: Always store in UTC, convert for display. The chatbot should detect timezone from conversation context or ask explicitly.
- **Error handling**: Show friendly messages in the chat when EA is unavailable.
- **Concurrent booking prevention**: Re-check availability immediately before confirming to prevent double-booking race conditions.
- **Customer management**: The adapter automatically finds or creates EA customers by email to avoid duplicates.
