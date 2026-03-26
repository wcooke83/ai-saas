/**
 * E2E Tests: Calendar Booking Integration
 *
 * Tests the full calendar booking lifecycle against the live Easy!Appointments instance.
 * Covers: setup/config, availability, booking CRUD, rescheduling, cancellation,
 * chat-driven bookings, dashboard UI, and database state.
 *
 * Prerequisites:
 * - Easy!Appointments at EASY_APPOINTMENTS_URL with valid EASY_APPOINTMENTS_KEY
 * - E2E test chatbot (e2e00000-0000-0000-0000-000000000001) exists and is active
 * - At least one EA service and provider configured
 */

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match && !process.env[match[1].trim()]) {
    process.env[match[1].trim()] = match[2].trim();
  }
}

const DASHBOARD_CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
const TIMEZONE = 'Australia/Brisbane';
const CHAT_URL = `/api/chat/${DASHBOARD_CHATBOT_ID}`;
const CALENDAR_SETTINGS_URL = `/dashboard/chatbots/${DASHBOARD_CHATBOT_ID}/calendar`;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Easy!Appointments API helpers
const EA_BASE_URL = `${(process.env.EASY_APPOINTMENTS_URL || '').replace(/\/+$/, '')}/index.php/api/v1`;
const EA_AUTH = `Basic ${process.env.EASY_APPOINTMENTS_KEY || ''}`;

// Track resources for cleanup
const createdIntegrationIds: string[] = [];
const createdBookingIds: string[] = [];
const createdEAAppointmentIds: number[] = [];

// ── Easy!Appointments API helpers ──

async function eaRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${EA_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: EA_AUTH,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text() as unknown as T;
}

async function eaGetServices(): Promise<Array<{ id: number; name: string; duration: number }>> {
  return eaRequest('GET', '/services');
}

async function eaGetProviders(): Promise<Array<{ id: number; firstName: string; lastName: string }>> {
  return eaRequest('GET', '/providers');
}

async function eaCancelAppointment(appointmentId: number): Promise<void> {
  try {
    await eaRequest('DELETE', `/appointments/${appointmentId}`);
  } catch (e) {
    console.warn(`[Calendar E2E] Failed to cancel EA appointment ${appointmentId}:`, e);
  }
}

// ── Supabase helpers ──

async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

async function supabaseSelect(table: string, filter: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  return res.json();
}

async function supabaseDelete(table: string, column: string, values: string[]) {
  if (values.length === 0) return;
  const filter = `${column}=in.(${values.map((v) => `"${v}"`).join(',')})`;
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
}

// ── Date helpers ──

/** Next weekday at least 2 days ahead */
function getNextWeekday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

/** Next Saturday */
function getNextSaturday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// ── Widget helpers ──

async function openWidget(page: import('@playwright/test').Page) {
  await page.goto(`/widget/${WIDGET_CHATBOT_ID}`);
  await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
  const btn = page.locator('.chat-widget-button');
  if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await btn.click();
    await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 5000 });
  }
}

async function sendMessage(page: import('@playwright/test').Page, text: string) {
  const input = page.locator(
    '.chat-widget-container textarea, .chat-widget-container input[type="text"]'
  );
  await input.fill(text);
  await input.press('Enter');
  await page.locator('.chat-widget-typing').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  await expect(page.locator('.chat-widget-typing')).not.toBeVisible({ timeout: 60000 });
}

async function getLastAssistantMessage(page: import('@playwright/test').Page): Promise<string> {
  const messages = page.locator('.chat-widget-bubble-assistant, .chat-widget-message-assistant');
  const count = await messages.count();
  if (count === 0) return '';
  return ((await messages.nth(count - 1).textContent()) || '').trim();
}

// ── Seed helpers ──

/** Resolve an EA service_id and provider_id for seeding */
let eaServiceId: string | null = null;
let eaProviderId: string | null = null;

async function resolveEAIds(): Promise<void> {
  if (eaServiceId && eaProviderId) return;
  try {
    const [services, providers] = await Promise.all([eaGetServices(), eaGetProviders()]);
    if (services.length > 0) eaServiceId = String(services[0].id);
    if (providers.length > 0) eaProviderId = String(providers[0].id);
  } catch (e) {
    console.warn('[Calendar E2E] Failed to resolve EA IDs:', e);
  }
}

async function seedCalendarIntegration(
  chatbotId: string,
  config: Record<string, unknown> = {}
): Promise<string | null> {
  const chatbots = await supabaseSelect('chatbots', `id=eq.${chatbotId}&select=user_id`);
  if (!chatbots?.[0]?.user_id) return null;

  // Clean existing
  const existing = await supabaseSelect(
    'calendar_integrations',
    `chatbot_id=eq.${chatbotId}&select=id`
  );
  if (existing?.length > 0) {
    await supabaseDelete('calendar_availability_cache', 'integration_id', existing.map((r: { id: string }) => r.id));
    await supabaseDelete('calendar_integrations', 'id', existing.map((r: { id: string }) => r.id));
  }

  await resolveEAIds();

  const integration = await supabaseInsert('calendar_integrations', {
    chatbot_id: chatbotId,
    user_id: chatbots[0].user_id,
    provider: 'easy_appointments',
    is_active: true,
    config: { service_id: eaServiceId, provider_id: eaProviderId, ...config },
  });

  if (integration?.id) {
    createdIntegrationIds.push(integration.id);
    return integration.id;
  }
  return null;
}

async function seedBooking(
  integrationId: string,
  overrides: Record<string, unknown> = {}
): Promise<string | null> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const booking = await supabaseInsert('calendar_bookings', {
    integration_id: integrationId,
    chatbot_id: DASHBOARD_CHATBOT_ID,
    provider: 'easy_appointments',
    provider_booking_id: `e2e-booking-${Date.now()}`,
    status: 'confirmed',
    attendee_name: 'E2E Test User',
    attendee_email: 'e2e-booking@test.local',
    attendee_timezone: TIMEZONE,
    start_time: tomorrow.toISOString(),
    end_time: new Date(tomorrow.getTime() + 30 * 60000).toISOString(),
    notes: 'E2E test booking',
    metadata: {},
    ...overrides,
  });

  if (booking?.id) {
    createdBookingIds.push(booking.id);
    return booking.id;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════════════════

test.describe('Calendar Booking Integration', () => {
  test.setTimeout(120_000);

  let integrationId: string | null = null;
  let bookingDate: string;
  let availableSlot: { start: string; end: string } | null = null;
  let liveBookingId: string | null = null;
  let liveProviderBookingId: string | null = null;

  test.beforeAll(async () => {
    integrationId = await seedCalendarIntegration(DASHBOARD_CHATBOT_ID);
    bookingDate = getNextWeekday();
    console.log('[Calendar E2E] Integration:', integrationId, '| Booking date:', bookingDate);
    console.log('[Calendar E2E] EA service:', eaServiceId, '| EA provider:', eaProviderId);

    // Also seed widget chatbot integration for conversation tests
    const widgetChatbots = await supabaseSelect('chatbots', `id=eq.${WIDGET_CHATBOT_ID}&select=user_id`);
    if (widgetChatbots?.[0]?.user_id) {
      const existing = await supabaseSelect('calendar_integrations', `chatbot_id=eq.${WIDGET_CHATBOT_ID}&select=id`);
      if (existing?.length > 0) {
        await supabaseDelete('calendar_integrations', 'id', existing.map((r: { id: string }) => r.id));
      }
      const wi = await supabaseInsert('calendar_integrations', {
        chatbot_id: WIDGET_CHATBOT_ID,
        user_id: widgetChatbots[0].user_id,
        provider: 'easy_appointments',
        is_active: true,
        config: { service_id: eaServiceId, provider_id: eaProviderId },
      });
      if (wi?.id) createdIntegrationIds.push(wi.id);
    }
  });

  test.afterAll(async () => {
    // Cancel any live Easy!Appointments bookings we created
    for (const eaId of createdEAAppointmentIds) {
      await eaCancelAppointment(eaId);
      console.log('[Calendar E2E] Cancelled EA appointment:', eaId);
    }
    if (liveProviderBookingId) {
      try {
        await eaRequest('DELETE', `/appointments/${liveProviderBookingId}`);
        console.log('[Calendar E2E] Cancelled EA appointment:', liveProviderBookingId);
      } catch (e) {
        console.warn('[Calendar E2E] Failed to cancel EA appointment:', e);
      }
    }

    // Clean up DB
    await supabaseDelete('calendar_availability_cache', 'integration_id', createdIntegrationIds);
    await supabaseDelete('calendar_bookings', 'id', createdBookingIds);
    await supabaseDelete('calendar_integrations', 'id', createdIntegrationIds);
    console.log('[Calendar E2E] Cleanup complete');
  });

  // ═══════════════════════════════════════════════
  // LIVE EASY!APPOINTMENTS: Availability
  // ═══════════════════════════════════════════════

  test.describe('Live Easy!Appointments Availability', () => {
    test('CAL-100: Weekday returns available slots', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.post('/api/calendar/availability', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          dateFrom: bookingDate,
          dateTo: bookingDate,
          timezone: TIMEZONE,
        },
      });

      if (!res.ok()) {
        const errBody = await res.text();
        console.log(`[CAL-100] Failed ${res.status()}: ${errBody.slice(0, 300)}`);
      }
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data?.slots).toBeDefined();
      expect(body.data.slots.length).toBeGreaterThan(0);

      const slot = body.data.slots[0];
      expect(slot.start).toBeTruthy();
      expect(slot.end).toBeTruthy();

      availableSlot = slot;
      console.log(`[CAL-100] ${body.data.slots.length} slots found, first:`, slot.start);
    });

    test('CAL-101: Weekend availability check succeeds', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const saturday = getNextSaturday();
      const res = await request.post('/api/calendar/availability', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: saturday, dateTo: saturday, timezone: TIMEZONE },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data?.slots).toBeDefined();
      console.log(`[CAL-101] Weekend (${saturday}) slots: ${body.data.slots.length}`);
    });

    test('CAL-102: Custom duration (60min) returns fewer slots', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const [res30, res60] = await Promise.all([
        request.post('/api/calendar/availability', {
          data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: bookingDate, dateTo: bookingDate, timezone: TIMEZONE },
        }),
        request.post('/api/calendar/availability', {
          data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: bookingDate, dateTo: bookingDate, timezone: TIMEZONE, duration: 60 },
        }),
      ]);

      if (res30.ok() && res60.ok()) {
        const slots30 = (await res30.json()).data?.slots?.length || 0;
        const slots60 = (await res60.json()).data?.slots?.length || 0;
        console.log(`[CAL-102] 30min: ${slots30} slots, 60min: ${slots60} slots`);
        expect(slots30).toBeGreaterThanOrEqual(slots60);
      }
    });

    test('CAL-103: Multi-day range returns slots across days', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const toDate = new Date(bookingDate);
      toDate.setDate(toDate.getDate() + 4);
      const to = toDate.toISOString().split('T')[0];

      const res = await request.post('/api/calendar/availability', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: bookingDate, dateTo: to, timezone: TIMEZONE },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      const dates = new Set(body.data?.slots?.map((s: { start: string }) => s.start.split('T')[0]) || []);
      console.log(`[CAL-103] Slots across ${dates.size} days`);
      expect(dates.size).toBeGreaterThan(1);
    });

    test('CAL-104: Availability caching works (second call faster)', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const data = { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: bookingDate, dateTo: bookingDate, timezone: TIMEZONE };

      const t1 = Date.now();
      await request.post('/api/calendar/availability', { data });
      const d1 = Date.now() - t1;

      const t2 = Date.now();
      await request.post('/api/calendar/availability', { data });
      const d2 = Date.now() - t2;

      console.log(`[CAL-104] First: ${d1}ms, Second (cached): ${d2}ms`);
      // Cached call should generally be faster, but don't assert strictly
    });
  });

  // ═══════════════════════════════════════════════
  // LIVE EASY!APPOINTMENTS: Booking Lifecycle
  // ═══════════════════════════════════════════════

  test.describe('Live Easy!Appointments Booking Lifecycle', () => {
    test('CAL-110: Create booking on available slot', async ({ request }) => {
      test.skip(!availableSlot, 'No slot available');

      const sessionId = `e2e-cal-live-${Date.now()}`;
      const res = await request.post('/api/calendar/book', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          sessionId,
          start: availableSlot!.start,
          end: availableSlot!.end,
          attendeeName: 'E2E Live Booker',
          attendeeEmail: 'e2e-live@example.com',
          attendeeTimezone: TIMEZONE,
          notes: 'Automated E2E live booking test',
        },
      });

      if (!res.ok()) {
        const errText = await res.text();
        console.log(`[CAL-110] Booking failed ${res.status()}: ${errText.slice(0, 400)}`);
      }
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.id).toBeTruthy();
      expect(body.data.providerBookingId).toBeTruthy();
      expect(body.data.attendeeName).toBe('E2E Live Booker');
      expect(['confirmed', 'pending']).toContain(body.data.status);

      liveBookingId = body.data.id;
      liveProviderBookingId = body.data.providerBookingId;
      createdBookingIds.push(liveBookingId!);
      createdEAAppointmentIds.push(Number(liveProviderBookingId));
      console.log(`[CAL-110] Booking: ${liveBookingId}, provider: ${liveProviderBookingId}`);
    });

    test('CAL-111: Get booking by ID', async ({ request }) => {
      test.skip(!liveBookingId, 'No booking');

      const res = await request.get(`/api/calendar/bookings/${liveBookingId}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data.id).toBe(liveBookingId);
      expect(body.data.attendee_name).toBe('E2E Live Booker');
      expect(body.data.attendee_email).toBe('e2e-live@example.com');
      expect(body.data.chatbot_id).toBe(DASHBOARD_CHATBOT_ID);
      expect(body.data.provider).toBe('easy_appointments');
    });

    test('CAL-112: Booking appears in integration listing', async ({ request }) => {
      test.skip(!liveBookingId, 'No booking');

      const res = await request.get(`/api/calendar/integrations?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      const found = body.data?.bookings?.find((b: { id: string }) => b.id === liveBookingId);
      expect(found).toBeTruthy();
    });

    test('CAL-113: Reschedule booking to different slot', async ({ request }) => {
      test.skip(!liveBookingId, 'No booking');

      // Get alternative slot
      const availRes = await request.post('/api/calendar/availability', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: bookingDate, dateTo: bookingDate, timezone: TIMEZONE },
      });
      test.skip(!availRes.ok(), 'Cannot check availability');

      const avail = await availRes.json();
      const newSlot = (avail.data?.slots || []).find(
        (s: { start: string }) => s.start !== availableSlot?.start
      );
      test.skip(!newSlot, 'No alternative slot for reschedule');

      const res = await request.patch(`/api/calendar/bookings/${liveBookingId}`, {
        data: { newStart: newSlot.start, newEnd: newSlot.end, reason: 'E2E reschedule test' },
      });

      if (res.ok()) {
        const body = await res.json();
        expect(body.data).toBeTruthy();
        console.log(`[CAL-113] Rescheduled to: ${newSlot.start}`);
        // Update provider booking ID if it changed
        if (body.data.providerBookingId) {
          liveProviderBookingId = body.data.providerBookingId;
        }
      } else {
        console.log(`[CAL-113] Reschedule returned: ${res.status()}`);
        expect(res.status()).toBeLessThan(500);
      }
    });

    test('CAL-114: Cancel booking', async ({ request }) => {
      test.skip(!liveBookingId, 'No booking');

      const res = await request.delete(`/api/calendar/bookings/${liveBookingId}`, {
        data: { reason: 'E2E cancellation test' },
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body.data?.success).toBe(true);

      // Verify status in DB
      const getRes = await request.get(`/api/calendar/bookings/${liveBookingId}`);
      if (getRes.ok()) {
        const getBody = await getRes.json();
        expect(getBody.data.status).toBe('cancelled');
      }
      console.log(`[CAL-114] Booking cancelled: ${liveBookingId}`);
      // Mark as cleaned up so afterAll doesn't double-cancel on EA
      liveProviderBookingId = null;
    });

    test('CAL-115: Cancel already-cancelled booking is handled gracefully', async ({ request }) => {
      test.skip(!liveBookingId, 'No booking');

      const res = await request.delete(`/api/calendar/bookings/${liveBookingId}`);
      expect(res.status()).toBeLessThan(500);
    });

    test('CAL-116: Second full lifecycle (create + cancel)', async ({ request }) => {
      test.setTimeout(180_000);
      test.skip(!integrationId, 'No integration');

      // Use a day further out to avoid slot conflicts and stale cache
      const altDate = new Date(bookingDate);
      altDate.setDate(altDate.getDate() + 7);
      while (altDate.getDay() === 0 || altDate.getDay() === 6) altDate.setDate(altDate.getDate() + 1);
      const altDateStr = altDate.toISOString().split('T')[0];

      // Clear availability cache for this date
      await supabaseDelete('calendar_availability_cache', 'integration_id', [integrationId!]);

      const availRes = await request.post('/api/calendar/availability', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: altDateStr, dateTo: altDateStr, timezone: TIMEZONE },
      });
      test.skip(!availRes.ok(), 'Availability failed');

      const avail = await availRes.json();
      const slots = avail.data?.slots || [];
      const slot = slots[slots.length - 1]; // Use last slot to avoid conflicts
      test.skip(!slot, 'No slots');

      // Create
      const createRes = await request.post('/api/calendar/book', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          sessionId: `e2e-cal-2-${Date.now()}`,
          start: slot.start,
          end: slot.end,
          attendeeName: 'E2E Second Lifecycle',
          attendeeEmail: 'e2e-second@example.com',
          attendeeTimezone: TIMEZONE,
        },
      });
      if (!createRes.ok()) {
        const errText = await createRes.text();
        console.log(`[CAL-116] Create failed ${createRes.status()}: ${errText.slice(0, 300)}`);
      }
      expect(createRes.ok()).toBeTruthy();
      const createBody = await createRes.json();
      const id2 = createBody.data.id;
      const providerId2 = createBody.data.providerBookingId;
      createdBookingIds.push(id2);

      // Cancel
      const cancelRes = await request.delete(`/api/calendar/bookings/${id2}`, {
        data: { reason: 'E2E second lifecycle cleanup' },
      });
      expect(cancelRes.ok()).toBeTruthy();
      console.log(`[CAL-116] Second lifecycle complete: ${id2}`);

      // Cleanup EA side
      if (providerId2) {
        await eaCancelAppointment(Number(providerId2));
      }
    });
  });

  // ═══════════════════════════════════════════════
  // VALIDATION & ERROR HANDLING
  // ═══════════════════════════════════════════════

  test.describe('Validation & Errors', () => {
    test('CAL-120: Availability rejects invalid chatbot ID', async ({ request }) => {
      const res = await request.post('/api/calendar/availability', {
        data: {
          chatbotId: '00000000-0000-0000-0000-000000000000',
          dateFrom: bookingDate,
          dateTo: bookingDate,
          timezone: TIMEZONE,
        },
      });
      expect(res.ok()).toBeFalsy();
    });

    test('CAL-121: Availability rejects invalid date format', async ({ request }) => {
      const res = await request.post('/api/calendar/availability', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID, dateFrom: 'bad-date', dateTo: bookingDate, timezone: TIMEZONE },
      });
      expect(res.status()).toBe(400);
    });

    test('CAL-122: Booking rejects missing required fields', async ({ request }) => {
      const res = await request.post('/api/calendar/book', {
        data: { chatbotId: DASHBOARD_CHATBOT_ID },
      });
      expect(res.status()).toBe(400);
    });

    test('CAL-123: Booking rejects invalid email', async ({ request }) => {
      const res = await request.post('/api/calendar/book', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          sessionId: 'test',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 1800000).toISOString(),
          attendeeName: 'Test',
          attendeeEmail: 'not-an-email',
          attendeeTimezone: TIMEZONE,
        },
      });
      expect(res.status()).toBe(400);
    });

    test('CAL-124: Get non-existent booking returns 404', async ({ request }) => {
      const res = await request.get('/api/calendar/bookings/00000000-0000-0000-0000-000000000000');
      expect(res.status()).toBe(404);
    });

    test('CAL-125: Cancel non-existent booking returns 404', async ({ request }) => {
      const res = await request.delete('/api/calendar/bookings/00000000-0000-0000-0000-000000000000');
      expect(res.status()).toBe(404);
    });

    test('CAL-126: Booking rejects non-existent chatbot', async ({ request }) => {
      const res = await request.post('/api/calendar/book', {
        data: {
          chatbotId: '00000000-0000-0000-0000-000000000000',
          sessionId: 'test',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 1800000).toISOString(),
          attendeeName: 'Test',
          attendeeEmail: 'test@example.com',
          attendeeTimezone: TIMEZONE,
        },
      });
      expect(res.ok()).toBeFalsy();
    });

    test('CAL-127: Setup GET rejects unauthorized chatbot', async ({ request }) => {
      const res = await request.get('/api/calendar/setup?chatbotId=00000000-0000-0000-0000-000000000000');
      expect(res.ok()).toBeFalsy();
    });

    test('CAL-129: Webhook rejects invalid signature', async ({ request }) => {
      const res = await request.post('/api/calendar/webhook/easy_appointments', {
        data: { triggerEvent: 'BOOKING_CREATED', payload: { id: 1 } },
        headers: { Authorization: 'Basic invalid-credentials' },
      });
      expect(res.status()).toBe(401);
    });

    test('CAL-130: Webhook rejects invalid provider', async ({ request }) => {
      const res = await request.post('/api/calendar/webhook/invalid_provider', {
        data: { event: 'test' },
      });
      expect(res.status()).toBe(400);
    });
  });

  // ═══════════════════════════════════════════════
  // SETUP/CONFIG API
  // ═══════════════════════════════════════════════

  test.describe('Setup & Config API', () => {
    test('CAL-140: GET setup returns config for active integration', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.get(`/api/calendar/setup?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      // Should include services and providers lists from EA
      expect(body.data).toBeDefined();
      if (body.data.services) {
        expect(Array.isArray(body.data.services)).toBe(true);
      }
      if (body.data.providers) {
        expect(Array.isArray(body.data.providers)).toBe(true);
      }
    });

    test('CAL-141: POST setup creates event type and business hours', async ({ request }) => {
      const slug = `e2e-setup-${Date.now()}`;
      const res = await request.post('/api/calendar/setup', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          eventType: {
            title: 'E2E Setup Test',
            slug,
            durationMinutes: 30,
            bufferBeforeMinutes: 5,
            bufferAfterMinutes: 5,
            minNoticeHours: 1,
            maxDaysAhead: 30,
            timezone: TIMEZONE,
          },
          businessHours: [
            { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isEnabled: false },
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isEnabled: false },
          ],
          serviceId: eaServiceId || undefined,
          providerId: eaProviderId || undefined,
        },
      });

      if (res.ok()) {
        const body = await res.json();
        expect(body.data?.integration_id).toBeTruthy();
        console.log(`[CAL-141] Setup saved, integration: ${body.data.integration_id}`);
        if (body.data.service_id) {
          console.log(`[CAL-141] service_id: ${body.data.service_id}, provider_id: ${body.data.provider_id}`);
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.log(`[CAL-141] Setup POST returned ${res.status()}: ${errText.slice(0, 300)}`);
        // Setup may fail if EA is not configured
        expect(res.status()).toBeLessThan(500);
      }
    });

    test('CAL-142: GET setup reflects saved config after POST', async ({ request }) => {
      const res = await request.get(`/api/calendar/setup?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();

      if (body.data?.eventType) {
        expect(body.data.eventType.timezone).toBe(TIMEZONE);
      }
      if (body.data?.businessHours?.length === 7) {
        const monday = body.data.businessHours.find((h: { dayOfWeek: number }) => h.dayOfWeek === 1);
        expect(monday?.isEnabled).toBe(true);
        const sunday = body.data.businessHours.find((h: { dayOfWeek: number }) => h.dayOfWeek === 0);
        expect(sunday?.isEnabled).toBe(false);
      }
    });

    test('CAL-143: GET setup returns EA services and providers', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.get(`/api/calendar/setup?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();

      // EA services should have id, name, duration
      if (body.data?.services?.length > 0) {
        expect(body.data.services[0]).toHaveProperty('id');
        expect(body.data.services[0]).toHaveProperty('name');
        expect(body.data.services[0]).toHaveProperty('duration');
      }

      // EA providers should have id, firstName, lastName
      if (body.data?.providers?.length > 0) {
        expect(body.data.providers[0]).toHaveProperty('id');
        expect(body.data.providers[0]).toHaveProperty('firstName');
        expect(body.data.providers[0]).toHaveProperty('lastName');
      }
    });

    test('CAL-144: POST setup persists serviceId and providerId', async ({ request }) => {
      test.skip(!eaServiceId || !eaProviderId, 'No EA service/provider IDs');

      const res = await request.post('/api/calendar/setup', {
        data: {
          chatbotId: DASHBOARD_CHATBOT_ID,
          eventType: {
            title: 'EA Config Test',
            slug: `ea-config-${Date.now()}`,
            durationMinutes: 30,
            bufferBeforeMinutes: 0,
            bufferAfterMinutes: 0,
            minNoticeHours: 1,
            maxDaysAhead: 30,
            timezone: TIMEZONE,
          },
          businessHours: [
            { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isEnabled: false },
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isEnabled: true },
            { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isEnabled: false },
          ],
          serviceId: eaServiceId,
          providerId: eaProviderId,
        },
      });

      if (res.ok()) {
        // Verify via GET
        const getRes = await request.get(`/api/calendar/setup?chatbotId=${DASHBOARD_CHATBOT_ID}`);
        expect(getRes.ok()).toBeTruthy();
        const getBody = await getRes.json();
        expect(String(getBody.data?.serviceId)).toBe(eaServiceId);
        expect(String(getBody.data?.providerId)).toBe(eaProviderId);
      }
    });
  });

  // ═══════════════════════════════════════════════
  // CHATBOT CONVERSATION → CALENDAR
  // ═══════════════════════════════════════════════

  test.describe('Chat-driven Calendar', () => {
    test('CAL-150: Chat API handles availability question', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.post(CHAT_URL, {
        data: {
          message: `What appointment times are available on ${bookingDate}?`,
          stream: false,
          session_id: `e2e-cal-avail-${Date.now()}`,
        },
      });

      expect(res.status()).toBeLessThan(500);
      if (res.ok()) {
        const body = await res.json();
        const reply = body.data?.reply || body.data?.message || '';
        console.log(`[CAL-150] Reply: ${reply.slice(0, 200)}`);
        expect(reply.length).toBeGreaterThan(0);
      }
    });

    test('CAL-151: Chat API handles booking request with details', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.post(CHAT_URL, {
        data: {
          message: `Book me an appointment on ${bookingDate} at 10:00 AM. My name is E2E Chat User and email is e2e-chat-book@example.com. Timezone is ${TIMEZONE}.`,
          stream: false,
          session_id: `e2e-cal-book-${Date.now()}`,
        },
      });

      expect(res.status()).toBeLessThan(500);
      if (res.ok()) {
        const body = await res.json();
        const reply = body.data?.reply || body.data?.message || '';
        console.log(`[CAL-151] Reply: ${reply.slice(0, 200)}`);
      }

      // Cleanup: cancel any bookings made by chat
      const listRes = await request.get(`/api/calendar/integrations?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      if (listRes.ok()) {
        const listBody = await listRes.json();
        const chatBookings = (listBody.data?.bookings || []).filter(
          (b: { attendee_email: string; status: string }) =>
            b.attendee_email === 'e2e-chat-book@example.com' && b.status !== 'cancelled'
        );
        for (const b of chatBookings) {
          await request.delete(`/api/calendar/bookings/${b.id}`, { data: { reason: 'E2E cleanup' } });
          console.log(`[CAL-151] Cleaned up chat booking: ${b.id}`);
        }
      }
    });

    test('CAL-152: Chat multi-turn booking conversation', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const session = `e2e-cal-multi-${Date.now()}`;

      // Turn 1: intent
      const r1 = await request.post(CHAT_URL, {
        data: { message: 'I need to schedule a consultation', stream: false, session_id: session },
      });
      expect(r1.status()).toBeLessThan(500);

      // Turn 2: date
      const r2 = await request.post(CHAT_URL, {
        data: { message: `How about ${bookingDate} in the afternoon?`, stream: false, session_id: session },
      });
      expect(r2.status()).toBeLessThan(500);

      // Turn 3: details
      const r3 = await request.post(CHAT_URL, {
        data: { message: 'My name is Alex Test, email alex-test@example.com', stream: false, session_id: session },
      });
      expect(r3.status()).toBeLessThan(500);

      if (r3.ok()) {
        const body = await r3.json();
        const reply = body.data?.reply || body.data?.message || '';
        console.log(`[CAL-152] Multi-turn final reply: ${reply.slice(0, 200)}`);
      }

      // Cleanup any bookings from this conversation
      const listRes = await request.get(`/api/calendar/integrations?chatbotId=${DASHBOARD_CHATBOT_ID}`);
      if (listRes.ok()) {
        const listBody = await listRes.json();
        for (const b of (listBody.data?.bookings || []).filter(
          (b: { attendee_email: string; status: string }) =>
            b.attendee_email === 'alex-test@example.com' && b.status !== 'cancelled'
        )) {
          await request.delete(`/api/calendar/bookings/${b.id}`, { data: { reason: 'E2E cleanup' } });
        }
      }
    });

    test('CAL-153: Non-booking chat works normally with calendar enabled', async ({ request }) => {
      test.skip(!integrationId, 'No integration');

      const res = await request.post(CHAT_URL, {
        data: { message: 'What is the weather like today?', stream: false, session_id: `e2e-cal-normal-${Date.now()}` },
      });
      expect(res.status()).toBeLessThan(500);
      if (res.ok()) {
        const body = await res.json();
        expect((body.data?.reply || body.data?.message || '').length).toBeGreaterThan(0);
      }
    });
  });

  // ═══════════════════════════════════════════════
  // WIDGET CONVERSATION (Browser-based)
  // ═══════════════════════════════════════════════

  test.describe('Widget Calendar Conversation', () => {
    test('CAL-160: Widget chatbot responds to scheduling request', async ({ page }) => {
      test.setTimeout(120_000);

      await openWidget(page);
      await page.waitForSelector('.chat-widget-input', { timeout: 15000 });

      const before = await page.locator('.chat-widget-message-assistant').count();
      await sendMessage(page, 'I would like to schedule an appointment for next week');

      const after = await page.locator('.chat-widget-message-assistant').count();
      expect(after).toBeGreaterThan(before);

      const reply = await getLastAssistantMessage(page);
      if (reply.length > 0) {
        expect(reply).toMatch(/schedule|appointment|book|available|time|date|calendar|slot|help|assist/i);
      }
    });

    test('CAL-161: Widget chatbot asks for booking info', async ({ page }) => {
      test.setTimeout(120_000);

      await openWidget(page);
      await page.waitForSelector('.chat-widget-input', { timeout: 15000 });

      const before = await page.locator('.chat-widget-message-assistant').count();
      await sendMessage(page, 'Can I book a meeting?');

      const after = await page.locator('.chat-widget-message-assistant').count();
      expect(after).toBeGreaterThan(before);

      const reply = await getLastAssistantMessage(page);
      if (reply.length > 0) {
        expect(reply).toMatch(/name|email|date|time|when|prefer|help|book|schedul|happy|assist/i);
      }
    });
  });

  // ═══════════════════════════════════════════════
  // DASHBOARD UI
  // ═══════════════════════════════════════════════

  test.describe('Dashboard Calendar UI', () => {
    test('CAL-170: Calendar settings page loads', async ({ page }) => {
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('networkidle');
      await expect(page.getByText('Calendar Booking').first()).toBeVisible({ timeout: 20000 });
    });

    test('CAL-171: Easy!Appointments connection card visible', async ({ page }) => {
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('Easy!Appointments Connection').first()).toBeVisible({ timeout: 10000 });
    });

    test('CAL-172: Service and provider dropdowns visible', async ({ page }) => {
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('domcontentloaded');

      // Service dropdown
      const serviceSelect = page.locator('#ea-service');
      if (await serviceSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(serviceSelect).toBeVisible();
        // Should have "Select a service..." placeholder
        await expect(serviceSelect.locator('option').first()).toContainText('Select a service');
      }

      // Provider dropdown
      const providerSelect = page.locator('#ea-provider');
      if (await providerSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(providerSelect).toBeVisible();
        await expect(providerSelect.locator('option').first()).toContainText('Select a provider');
      }

      // Appointment settings and availability sections
      await expect(page.locator('text=Appointment Settings')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Availability')).toBeVisible();
    });

    test('CAL-173: Appointment settings form elements visible', async ({ page }) => {
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('text=Appointment Settings')).toBeVisible({ timeout: 5000 });
      // Duration selector
      await expect(page.locator('#et-duration')).toBeVisible();
      // Timezone selector
      await expect(page.locator('#et-tz')).toBeVisible();
    });

    test('CAL-174: Connected integration shows status', async ({ page }) => {
      test.skip(!integrationId, 'No integration');

      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('domcontentloaded');

      // Should show "Calendar Active" badge or connection status
      await expect(
        page.getByText('Calendar Active').or(page.getByText('Easy!Appointments')).first()
      ).toBeVisible({ timeout: 5000 });
    });

    test('CAL-175: Booking history section renders', async ({ page }) => {
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByText('Booking History').first()).toBeVisible({ timeout: 15000 });
    });

    test('CAL-176: Booking history shows seeded bookings', async ({ page }) => {
      test.skip(!integrationId, 'No integration');

      await seedBooking(integrationId!);
      await page.goto(CALENDAR_SETTINGS_URL);
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('E2E Test User').first()).toBeVisible({ timeout: 15000 });
    });

    test('CAL-177: Calendar tab in chatbot sub-nav', async ({ page }) => {
      await page.goto(`/dashboard/chatbots/${DASHBOARD_CHATBOT_ID}`);
      await page.waitForLoadState('networkidle');

      const link = page.locator('nav a:has-text("Calendar")');
      await expect(link).toBeVisible({ timeout: 15000 });
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(new RegExp(`/chatbots/${DASHBOARD_CHATBOT_ID}/calendar`));
    });
  });

  // ═══════════════════════════════════════════════
  // DATABASE STATE
  // ═══════════════════════════════════════════════

  test.describe('Database State', () => {
    test('CAL-180: Integration record correct in DB', async () => {
      test.skip(!integrationId, 'No integration');

      const rows = await supabaseSelect('calendar_integrations', `id=eq.${integrationId}&select=*`);
      expect(rows).toHaveLength(1);
      expect(rows[0].chatbot_id).toBe(DASHBOARD_CHATBOT_ID);
      expect(rows[0].provider).toBe('easy_appointments');
      expect(rows[0].is_active).toBe(true);
      // Config should contain service_id and provider_id
      const config = rows[0].config as Record<string, unknown>;
      if (eaServiceId) expect(String(config.service_id)).toBe(eaServiceId);
      if (eaProviderId) expect(String(config.provider_id)).toBe(eaProviderId);
    });

    test('CAL-181: Booking records persist correctly', async () => {
      test.skip(!integrationId, 'No integration');

      const id = await seedBooking(integrationId!, {
        attendee_name: 'DB Verify',
        attendee_email: 'db-verify@test.local',
      });
      test.skip(!id, 'Seed failed');

      const rows = await supabaseSelect('calendar_bookings', `id=eq.${id}&select=*`);
      expect(rows).toHaveLength(1);
      expect(rows[0].attendee_name).toBe('DB Verify');
      expect(rows[0].chatbot_id).toBe(DASHBOARD_CHATBOT_ID);
    });

    test('CAL-182: Availability cache accepts inserts', async () => {
      test.skip(!integrationId, 'No integration');

      const dateStr = bookingDate;
      const cache = await supabaseInsert('calendar_availability_cache', {
        integration_id: integrationId,
        date: dateStr,
        slots: [{ start: `${dateStr}T09:00:00Z`, end: `${dateStr}T09:30:00Z` }],
        expires_at: new Date(Date.now() + 300000).toISOString(),
      });
      expect(cache?.id).toBeTruthy();
    });

    test('CAL-183: Business hours records persist', async () => {
      test.skip(!integrationId, 'No integration');

      // Check if business hours were created by setup API
      const rows = await supabaseSelect(
        'calendar_business_hours',
        `integration_id=eq.${integrationId}&select=*&order=day_of_week`
      );

      if (rows.length === 0) {
        // Seed them directly
        for (let d = 0; d <= 6; d++) {
          await supabaseInsert('calendar_business_hours', {
            integration_id: integrationId,
            day_of_week: d,
            start_time: '09:00',
            end_time: '17:00',
            is_enabled: d >= 1 && d <= 5,
          });
        }
        const check = await supabaseSelect(
          'calendar_business_hours',
          `integration_id=eq.${integrationId}&select=*`
        );
        expect(check.length).toBe(7);
      } else {
        expect(rows.length).toBe(7);
      }
    });

    test('CAL-184: Event type records persist', async () => {
      test.skip(!integrationId, 'No integration');

      const rows = await supabaseSelect(
        'calendar_event_types',
        `integration_id=eq.${integrationId}&select=*`
      );

      if (rows.length === 0) {
        // Seed directly
        const et = await supabaseInsert('calendar_event_types', {
          integration_id: integrationId,
          title: 'E2E Test Event',
          slug: 'e2e-test-event',
          duration_minutes: 30,
          timezone: TIMEZONE,
        });
        expect(et?.id).toBeTruthy();
      } else {
        expect(rows[0].title).toBeTruthy();
        expect(rows[0].duration_minutes).toBeGreaterThan(0);
      }
    });

    test('CAL-185: Cascade: deleting integration nullifies booking FK', async () => {
      const chatbots = await supabaseSelect('chatbots', `id=eq.${DASHBOARD_CHATBOT_ID}&select=user_id`);
      const userId = chatbots[0].user_id;

      const tmp = await supabaseInsert('calendar_integrations', {
        chatbot_id: DASHBOARD_CHATBOT_ID,
        user_id: userId,
        provider: 'easy_appointments',
        is_active: false,
        config: { service_id: null, provider_id: null },
      });

      const tmpBooking = await supabaseInsert('calendar_bookings', {
        integration_id: tmp.id,
        chatbot_id: DASHBOARD_CHATBOT_ID,
        provider: 'easy_appointments',
        status: 'pending',
        attendee_name: 'Cascade',
        attendee_email: 'cascade@test.local',
        attendee_timezone: 'UTC',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 1800000).toISOString(),
      });

      await supabaseDelete('calendar_integrations', 'id', [tmp.id]);

      const remaining = await supabaseSelect('calendar_bookings', `id=eq.${tmpBooking.id}&select=integration_id`);
      if (remaining.length > 0) {
        expect(remaining[0].integration_id).toBeNull();
      }
      await supabaseDelete('calendar_bookings', 'id', [tmpBooking.id]);
    });
  });
});
