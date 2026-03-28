# Calendar Settings Page - Complete Rebuild Plan

**Route:** `/dashboard/chatbots/[id]/calendar`
**Date:** 2026-03-28
**Scope:** Full rebuild addressing every finding from the UX audit, plus new services/providers/holidays/ad-hoc-hours management via EA API

---

## Table of Contents

1. [Page Architecture Overview](#1-page-architecture-overview)
2. [File Structure](#2-file-structure)
3. [New Types](#3-new-types)
4. [New API Routes](#4-new-api-routes)
5. [EA Adapter Changes](#5-ea-adapter-changes)
6. [Tab 1: Connection & Services](#6-tab-1-connection--services)
7. [Tab 2: Scheduling](#7-tab-2-scheduling)
8. [Tab 3: Booking History](#8-tab-3-booking-history)
9. [Shared Components](#9-shared-components)
10. [State Management](#10-state-management)
11. [Unsaved Changes Tracking](#11-unsaved-changes-tracking)
12. [Error Handling & Loading States](#12-error-handling--loading-states)
13. [Accessibility](#13-accessibility)
14. [Migration Considerations](#14-migration-considerations)
15. [Audit Finding Cross-Reference](#15-audit-finding-cross-reference)

---

## 1. Page Architecture Overview

### Layout: Tabbed Interface

The page uses three top-level tabs. Configuration lives in Tabs 1 and 2. Read-only history lives in Tab 3. This separates the visual hierarchy between configuration and activity (audit 5l) and keeps the page scannable.

```
+------------------------------------------------------------------+
| ChatbotPageHeader: "Calendar Booking"     [Calendar Active badge] |
+------------------------------------------------------------------+
| ConnectionStatus (always rendered, even when null) [audit 5b]    |
+------------------------------------------------------------------+
| [ Connection & Services ]  [ Scheduling ]  [ Booking History ]   |
|------------------------------------------------------------------|
|                                                                  |
|  (tab content rendered here)                                     |
|                                                                  |
+------------------------------------------------------------------+
| Sticky Save Bar (visible when isDirty, tabs 1-2 only) [audit 5c]|
+------------------------------------------------------------------+
```

### Why Tabs Over Stacked Cards

- The current page stacks 5+ cards vertically, burying the save button at an ambiguous position.
- Tabs reduce scrolling, group related settings, and provide a natural place for the save bar at the bottom.
- The existing `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` components in `src/components/ui/tabs.tsx` are used directly.

---

## 2. File Structure

### New and Modified Files

```
src/
  app/(authenticated)/dashboard/chatbots/[id]/calendar/
    page.tsx                          # Rebuilt page (orchestrator)

  components/calendar/
    connection-status.tsx             # Modified: always renders, disconnect dialog
    service-manager.tsx               # NEW: CRUD for EA services
    provider-manager.tsx              # NEW: CRUD for EA providers
    business-hours-editor.tsx         # Modified: helper text, copy-from-any-day
    event-type-config.tsx             # Modified: tooltips, expanded durations, combobox tz
    holidays-manager.tsx              # NEW: blocked dates / holidays
    date-overrides-manager.tsx        # NEW: ad-hoc hours for specific dates
    booking-history.tsx               # Modified: search, date filter
    sticky-save-bar.tsx               # NEW: reusable sticky save bar

  app/api/calendar/
    setup/route.ts                    # Modified: accept holidays + date overrides
    services/route.ts                 # NEW: CRUD proxy to EA /api/v1/services
    providers/route.ts                # NEW: CRUD proxy to EA /api/v1/providers
    providers/[id]/working-plan-exceptions/route.ts  # NEW: ad-hoc hours
    blocked-periods/route.ts          # NEW: CRUD proxy to EA /api/v1/blocked_periods
    availability/route.ts             # Modified: filter out blocked dates + overrides

  lib/calendar/
    types.ts                          # Modified: new types added
    providers/easy-appointments.ts    # Modified: new methods for CRUD
    service.ts                        # Modified: availability filtering
```

---

## 3. New Types

Add to `src/lib/calendar/types.ts`:

```ts
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
  services: number[];            // service IDs this provider handles
  settings: EAProviderSettings;
}

export interface EAProviderSettings {
  username: string;
  password?: string;
  workingPlan: EAWorkingPlan;
  workingPlanExceptions: Record<string, EAWorkingPlanDay | null>;
  // null value means "closed that day"
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
  label?: string;          // local-only label for UI display
}

// ── Connection health status ──

export type EAConnectionState =
  | 'connected'        // EA configured and reachable
  | 'not_configured'   // env vars missing
  | 'unreachable'      // env vars set but EA server not responding
  | 'auth_failed'      // credentials invalid
  | 'not_connected';   // no integration record exists
```

---

## 4. New API Routes

### 4.1 `GET/POST /api/calendar/services`

**File:** `src/app/api/calendar/services/route.ts`

```
GET  /api/calendar/services
     Response: { data: EAService[] }

POST /api/calendar/services
     Body: EAServiceCreateInput
     Response: { data: EAService }
```

**Logic:**
- Authenticate user.
- Proxy to `EA /api/v1/services` via adapter.
- No chatbot ownership check needed -- services are system-wide in EA.

### 4.2 `PUT/DELETE /api/calendar/services/[id]`

**File:** `src/app/api/calendar/services/[id]/route.ts`

```
PUT    /api/calendar/services/:id
       Body: Partial<EAServiceCreateInput>
       Response: { data: EAService }

DELETE /api/calendar/services/:id
       Response: { data: { success: true } }
```

### 4.3 `GET/POST /api/calendar/providers`

**File:** `src/app/api/calendar/providers/route.ts`

```
GET  /api/calendar/providers
     Response: { data: EAProvider[] }

POST /api/calendar/providers
     Body: EAProviderCreateInput
     Response: { data: EAProvider }
```

### 4.4 `PUT/DELETE /api/calendar/providers/[id]`

**File:** `src/app/api/calendar/providers/[id]/route.ts`

```
PUT    /api/calendar/providers/:id
       Body: Partial<EAProviderCreateInput>
       Response: { data: EAProvider }

DELETE /api/calendar/providers/:id
       Response: { data: { success: true } }
```

### 4.5 `PUT /api/calendar/providers/[id]/working-plan-exceptions`

**File:** `src/app/api/calendar/providers/[id]/working-plan-exceptions/route.ts`

```
PUT /api/calendar/providers/:id/working-plan-exceptions
    Body: { exceptions: Record<string, EAWorkingPlanDay | null> }
    Response: { data: { success: true } }
```

**Logic:**
- Reads the current provider via `GET /api/v1/providers/:id`.
- Merges `settings.workingPlanExceptions` with incoming exceptions.
- PUTs the full provider back to EA.
- A `null` value for a date key means "closed all day."
- A `{ start, end, breaks }` value means "custom hours."

### 4.6 `GET/POST /api/calendar/blocked-periods`

**File:** `src/app/api/calendar/blocked-periods/route.ts`

```
GET  /api/calendar/blocked-periods
     Response: { data: EABlockedPeriod[] }

POST /api/calendar/blocked-periods
     Body: EABlockedPeriodInput
     Response: { data: EABlockedPeriod }
```

### 4.7 `DELETE /api/calendar/blocked-periods/[id]`

**File:** `src/app/api/calendar/blocked-periods/[id]/route.ts`

```
DELETE /api/calendar/blocked-periods/:id
       Response: { data: { success: true } }
```

### 4.8 Modified: `GET /api/calendar/setup`

**Changes to existing file `src/app/api/calendar/setup/route.ts`:**

Add a `connectionState` field to the response that distinguishes between:
- `not_configured` -- EASY_APPOINTMENTS_URL or EASY_APPOINTMENTS_KEY missing
- `unreachable` -- env vars present but validation fails
- `connected` -- validation passes

```ts
// In the GET handler, before fetching services:
const ea = new EasyAppointmentsAdapter({});
const validation = await ea.validateConfig();

let connectionState: string;
if (!process.env.EASY_APPOINTMENTS_URL || !process.env.EASY_APPOINTMENTS_KEY) {
  connectionState = 'not_configured';
} else if (!validation.valid) {
  connectionState = 'unreachable';
} else {
  connectionState = 'connected';
}

// Include in response:
return successResponse({
  connectionState,
  eventType: ...,
  businessHours: ...,
  serviceId: ...,
  providerId: ...,
  services,
  providers,
});
```

This addresses audit finding 4d.

---

## 5. EA Adapter Changes

**File:** `src/lib/calendar/providers/easy-appointments.ts`

### New Methods to Add

```ts
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

async updateProvider(id: number, input: Partial<EAProviderCreateInput>): Promise<EAProvider> {
  return this.request<EAProvider>('PUT', `/providers/${id}`, input);
}

async deleteProvider(id: number): Promise<void> {
  await this.request('DELETE', `/providers/${id}`);
}

// ── Blocked Periods (system-wide holidays) ──

async getBlockedPeriods(): Promise<EABlockedPeriod[]> {
  return this.request<EABlockedPeriod[]>('GET', '/blocked_periods');
}

async createBlockedPeriod(input: EABlockedPeriodInput): Promise<EABlockedPeriod> {
  return this.request<EABlockedPeriod>('POST', '/blocked_periods', input);
}

async deleteBlockedPeriod(id: number): Promise<void> {
  await this.request('DELETE', `/blocked_periods/${id}`);
}

// ── Working Plan Exceptions (ad-hoc hours per provider) ──

async getWorkingPlanExceptions(
  providerId: number
): Promise<Record<string, EAWorkingPlanDay | null>> {
  const provider = await this.getProvider(providerId);
  return provider.settings?.workingPlanExceptions || {};
}

async setWorkingPlanExceptions(
  providerId: number,
  exceptions: Record<string, EAWorkingPlanDay | null>
): Promise<void> {
  const provider = await this.getProvider(providerId);
  const merged = {
    ...provider.settings.workingPlanExceptions,
    ...exceptions,
  };
  await this.updateProvider(providerId, {
    settings: {
      ...provider.settings,
      workingPlanExceptions: merged,
    },
  } as Partial<EAProviderCreateInput>);
}

async removeWorkingPlanException(
  providerId: number,
  date: string
): Promise<void> {
  const provider = await this.getProvider(providerId);
  const exceptions = { ...provider.settings.workingPlanExceptions };
  delete exceptions[date];
  await this.updateProvider(providerId, {
    settings: {
      ...provider.settings,
      workingPlanExceptions: exceptions,
    },
  } as Partial<EAProviderCreateInput>);
}
```

### Existing Methods: Keep As-Is

The existing `getServices()`, `getProviders()`, `getAvailability()`, `createBooking()`, etc. remain unchanged. The new `getServicesFull()` and `getProvidersFull()` return the full EA objects (with all fields), while the original lightweight methods continue to work for backward compatibility.

---

## 6. Tab 1: Connection & Services

### 6.1 Connection Status Card (Modified)

**File:** `src/components/calendar/connection-status.tsx`

**Changes:**
- Always rendered by parent (remove `{integration && ...}` guard) [audit 5b].
- When `connectionState === 'not_configured'`: show distinct message [audit 4d]:
  ```
  Easy!Appointments is not configured. Contact your administrator to set up
  the EASY_APPOINTMENTS_URL and EASY_APPOINTMENTS_KEY environment variables.
  ```
- When `connectionState === 'unreachable'`: show error with retry button.
- When `connectionState === 'not_connected'` (no integration row): show "Not connected" with setup guidance.
- Disconnect flow uses `ConfirmDialog` component instead of inline confirmation [audit 5k]:
  ```
  Title: "Disconnect Calendar?"
  Description: "You have {n} active bookings. Disconnecting will not cancel
  them, but the chatbot will no longer be able to create new bookings."
  Variant: warning
  ```

**Props change:**
```ts
interface ConnectionStatusProps {
  integration: CalendarIntegration | null;
  connectionState: EAConnectionState;
  activeBookingCount: number;
  onDisconnect: () => void;
  onTest: () => void;
  testing?: boolean;
}
```

**UI wireframe (connected state):**
```
+------------------------------------------------------------------+
| [checkmark]  Connected to Easy!Appointments   [Active badge]     |
|              Connected Mar 15, 2026                               |
|                                        [Test]  [Disconnect]      |
+------------------------------------------------------------------+
```

**UI wireframe (not_configured state):**
```
+------------------------------------------------------------------+
| [AlertCircle amber]                                              |
| Easy!Appointments is not configured. Contact your administrator  |
| to set up the EASY_APPOINTMENTS_URL and EASY_APPOINTMENTS_KEY    |
| environment variables.                                           |
+------------------------------------------------------------------+
```

### 6.2 Service Manager

**File:** `src/components/calendar/service-manager.tsx`

**Component:** `ServiceManager`

**Props:**
```ts
interface ServiceManagerProps {
  services: EAService[];
  selectedServiceId: string;
  onSelectService: (id: string) => void;
  onServicesChange: () => void;      // trigger refetch
  connectionState: EAConnectionState;
}
```

**UI Layout:**

```
+------------------------------------------------------------------+
| Services                                                         |
| Select or create services that your chatbot can book.            |
|   [i] Services define what can be booked (e.g., Consultation,    |
|       Demo). Each service has a duration and optional price.     |
|------------------------------------------------------------------|
|                                                                  |
|  Active Service: [Select dropdown .............. v]              |
|    [i] The service from your EA instance that this chatbot       |
|        will book. Each service has a predefined duration.        |
|                                                                  |
|  [+ Add Service]                                                 |
|                                                                  |
|  Existing Services:                                              |
|  +------------------------------------------------------------+ |
|  | Consultation    30 min   $50     [Edit] [Delete]            | |
|  | Quick Check-in  15 min   $0      [Edit] [Delete]            | |
|  | Demo            60 min   $0      [Edit] [Delete]            | |
|  +------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

**"Add Service" inline form (appears when button clicked):**
```
+------------------------------------------------------------------+
|  Name: [____________________]                                    |
|  Duration: [30 v] min     Price: [$__.__]   Currency: [USD v]    |
|  Description: [_____________________________________________]    |
|                                              [Cancel]  [Create]  |
+------------------------------------------------------------------+
```

**"Edit Service" dialog:**
Uses `Dialog` component. Same fields as create, pre-populated.

**Empty state (no services, EA connected):**
```
+------------------------------------------------------------------+
| [AlertCircle amber]                                              |
| No services found. Create your first service to allow your       |
| chatbot to accept bookings.                                      |
|                                                [+ Add Service]   |
+------------------------------------------------------------------+
```

**Empty state (EA not configured):**
```
+------------------------------------------------------------------+
| [AlertCircle amber]                                              |
| Easy!Appointments is not configured. Services cannot be managed  |
| until the connection is established.                             |
+------------------------------------------------------------------+
```

**Tooltips:**

| Element | Tooltip Text |
|---------|-------------|
| "Active Service" label | The service type from your Easy!Appointments instance that this chatbot will book. Each service has a predefined duration set in Easy!Appointments. |
| "Duration" in create/edit form | How long each appointment of this type lasts, in minutes. |
| "Price" in create/edit form | The price charged for this service. Set to 0 for free services. |
| "Description" in create/edit form | An optional description shown to customers in the booking flow. |

**Data flow:**
- `GET /api/calendar/services` on mount.
- `POST /api/calendar/services` on create.
- `PUT /api/calendar/services/:id` on edit.
- `DELETE /api/calendar/services/:id` on delete (with `ConfirmDialog`).
- After any mutation, call `onServicesChange()` to refetch.
- The selected service ID is tracked in parent state and saved with `POST /api/calendar/setup`.

**Validation rules:**
- Name: required, 1-100 chars.
- Duration: required, 5-480 min.
- Price: optional, >= 0.

**Duration mismatch warning [audit 4c]:**
When a service is selected and its duration differs from `eventTypeConfig.durationMinutes`:
```
[AlertCircle amber]
This service is 30 min in Easy!Appointments, but your appointment duration
is set to 45 min below. These should typically match.
```

### 6.3 Provider Manager

**File:** `src/components/calendar/provider-manager.tsx`

**Component:** `ProviderManager`

**Props:**
```ts
interface ProviderManagerProps {
  providers: EAProvider[];
  services: EAService[];         // for the service assignment checkboxes
  selectedProviderId: string;
  onSelectProvider: (id: string) => void;
  onProvidersChange: () => void;
  connectionState: EAConnectionState;
}
```

**UI Layout:**
```
+------------------------------------------------------------------+
| Providers                                                        |
| Select or create providers (staff) who handle bookings.          |
|   [i] Providers are the staff members or resources who handle    |
|       the bookings. Each provider has their own working hours.   |
|------------------------------------------------------------------|
|                                                                  |
|  Active Provider: [Select dropdown .............. v]             |
|    [i] The staff member from your EA instance who will handle    |
|        these bookings. Leave empty to auto-assign to any         |
|        available provider.                                       |
|                                                                  |
|  [+ Add Provider]                                                |
|                                                                  |
|  Existing Providers:                                             |
|  +------------------------------------------------------------+ |
|  | Jane Smith    jane@co.com    2 services  [Edit] [Delete]    | |
|  | John Doe      john@co.com    1 service   [Edit] [Delete]    | |
|  +------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

**"Add Provider" dialog:**
```
+------------------------------------------------------------------+
| Add Provider                                           [X close] |
|------------------------------------------------------------------|
| First Name: [________]    Last Name: [________]                  |
| Email: [________________________]                                |
| Phone: [________________________] (optional)                     |
|                                                                  |
| Services this provider handles:                                  |
| [x] Consultation (30 min)                                        |
| [x] Quick Check-in (15 min)                                      |
| [ ] Demo (60 min)                                                |
|                                                                  |
| Login Credentials (for EA admin access):                         |
| Username: [________]    Password: [________]                     |
|   [i] These are the provider's login credentials for the         |
|       Easy!Appointments admin panel.                             |
|                                                                  |
| Default Working Hours:                                           |
| (Reuses BusinessHoursEditor component, mapped to EAWorkingPlan)  |
|                                                                  |
|                                          [Cancel]  [Create]      |
+------------------------------------------------------------------+
```

**Empty state (no providers, EA connected):**
```
+------------------------------------------------------------------+
| [AlertCircle amber]                                              |
| No providers found. Providers (staff members) are needed to      |
| assign bookings. Create your first provider to get started.      |
|                                              [+ Add Provider]    |
+------------------------------------------------------------------+
```

**Data flow:**
- `GET /api/calendar/providers` on mount.
- `POST /api/calendar/providers` on create.
- `PUT /api/calendar/providers/:id` on edit.
- `DELETE /api/calendar/providers/:id` on delete (with `ConfirmDialog`).

**Validation rules:**
- First name: required, 1-50 chars.
- Last name: required, 1-50 chars.
- Email: required, valid email format.
- At least one service must be selected.
- Username: required, 3-50 chars.
- Password: required on create, optional on edit (keep existing).

---

## 7. Tab 2: Scheduling

This tab contains four Cards stacked vertically: Appointment Settings, Business Hours, Date Overrides, and Holidays.

### 7.1 Appointment Settings (Modified EventTypeConfigForm)

**File:** `src/components/calendar/event-type-config.tsx`

**Changes from current:**

1. **Add tooltips to every field** [audit 3a, 3d]:

   Import `Tooltip` and `Info` icon. Wrap each `<Label>` in a flex container with tooltip.

   | Field | Tooltip Text |
   |-------|-------------|
   | Appointment Name | The name shown to customers when booking. For example: "Consultation", "Demo", "Support Call". |
   | Duration | How long each appointment lasts. The chatbot will only offer time slots that fit this duration within your available hours. |
   | Description | An optional description shown to customers before they confirm a booking. Use this to set expectations about the appointment. |
   | Buffer Before | Minutes of padding added before each appointment. Use this to allow preparation time. A 15-minute buffer before a 10:00 appointment means the previous slot ends at 9:45. |
   | Buffer After | Minutes of padding added after each appointment. Use this to allow wrap-up time or breaks between appointments. |
   | Minimum Notice | The minimum number of hours in advance a customer must book. Set to 1 to prevent same-hour bookings, or 24 to require next-day booking. |
   | Max Days Ahead | How far into the future customers can book. Set to 30 to allow bookings up to one month out, or 7 for one week. |
   | Timezone | The timezone used for all appointment times. Make sure this matches your business location. Customer-facing times are converted automatically. |

   Pattern per field:
   ```tsx
   <div className="flex items-center gap-2">
     <Label htmlFor="et-buffer-before">Buffer Before (min)</Label>
     <Tooltip content="Minutes of padding added before each appointment. Use this to allow preparation time. A 15-minute buffer before a 10:00 appointment means the previous slot ends at 9:45.">
       <Info className="w-4 h-4 text-secondary-400 cursor-help" />
     </Tooltip>
   </div>
   ```

2. **Expand duration options** [audit 5e]:
   ```ts
   const DURATION_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120, 180, 240];
   ```

3. **Replace timezone selector with combobox** [audit 5d]:

   Remove the two-part search + `<select size={6}>`. Replace with a single `Input` that:
   - Shows the current timezone as its value (e.g., "America/New_York").
   - On focus or typing, opens a dropdown panel of filtered timezones below the input.
   - Selecting an option sets the value and closes the dropdown.
   - Show current timezone as a `Badge` above the input: `Timezone: America/New_York`.
   - Auto-detect on first load is already handled -- keep that logic.

   **Combobox wireframe:**
   ```
   Timezone: America/New_York (badge)
   [America/New_Y____________ v]
     +------------------------------+
     | America/New_York             |
     | America/North_Dakota/Center  |
     +------------------------------+
   ```

   Implementation: a `div` with `relative` positioning. The dropdown is an `absolute` positioned `ul` with `max-h-48 overflow-y-auto`. Keyboard navigation with `ArrowUp`, `ArrowDown`, `Enter`, `Escape`.

4. **Use design-system `Select` component** [audit 5h]:
   Replace inline `<select>` for duration with the `Select` from `@/components/ui/select`.

### 7.2 Business Hours Editor (Modified)

**File:** `src/components/calendar/business-hours-editor.tsx`

**Changes:**

1. **Add helper text** [audit 3c]:
   ```tsx
   <div className="space-y-3">
     <div className="flex items-center justify-between">
       <Label className="text-sm font-medium">Business Hours</Label>
       <button ...>Copy to all weekdays</button>
     </div>
     <p className="text-xs text-secondary-500">
       Set the hours your business accepts bookings for each day of the week.
       Disabled days will show as unavailable to customers.
     </p>
     ...
   ```

2. **Rename "Copy Mon to weekdays" to "Copy to all weekdays"** [audit 5i]:
   - Change button text to "Copy to all weekdays".
   - Instead of always copying from Monday, use the first enabled weekday as source.
   - If no weekday is enabled, show toast: "Enable at least one weekday first."

   ```ts
   const copyWeekdayHours = () => {
     const source = value.find(h => h.dayOfWeek >= 1 && h.dayOfWeek <= 5 && h.isEnabled);
     if (!source) {
       toast.error('Enable at least one weekday first');
       return;
     }
     onChange(
       value.map(h =>
         h.dayOfWeek >= 1 && h.dayOfWeek <= 5
           ? { ...h, startTime: source.startTime, endTime: source.endTime, isEnabled: true }
           : h
       )
     );
     toast.success(`${DAY_NAMES[source.dayOfWeek]} hours copied to all weekdays`);
   };
   ```

3. **Use design-system `Select` for time dropdowns** [audit 5h]:
   Replace inline `selectClasses` with the `Select` component from `@/components/ui/select`.

### 7.3 Holidays Manager (New)

**File:** `src/components/calendar/holidays-manager.tsx`

**Component:** `HolidaysManager`

**Props:**
```ts
interface HolidaysManagerProps {
  connectionState: EAConnectionState;
}
```

This component manages its own state by fetching directly from the EA blocked_periods API. It does not participate in the parent's "unsaved changes" tracking because holidays are saved immediately to EA (each add/delete is an individual API call, not a batch save).

**UI Layout:**
```
+------------------------------------------------------------------+
| Holidays & Blocked Dates                                         |
| Block specific dates when your business is closed. The chatbot   |
| will not offer any booking slots on these dates.                 |
|------------------------------------------------------------------|
|                                                                  |
|  Add a holiday or blocked date:                                  |
|  Date: [YYYY-MM-DD picker]   Label: [________________]          |
|                                              [+ Add Blocked Date]|
|                                                                  |
|  Blocked Dates:                                                  |
|  +------------------------------------------------------------+ |
|  | Dec 25, 2026   Christmas Day                       [Delete] | |
|  | Jan 1, 2027    New Year's Day                      [Delete] | |
|  | Mar 15, 2027   Team Offsite                        [Delete] | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [AlertCircle amber info]                                        |
|  Blocked dates are system-wide and apply to all providers.       |
|  For provider-specific time off, use Date Overrides below.       |
|                                                                  |
+------------------------------------------------------------------+
```

**Data flow:**
- `GET /api/calendar/blocked-periods` on mount.
- `POST /api/calendar/blocked-periods` when user clicks "Add Blocked Date".
- `DELETE /api/calendar/blocked-periods/:id` when user clicks Delete (with confirm).
- Each operation triggers immediate refetch of the list.
- Show `Loader2` spinner on the button during the API call.

**Input validation:**
- Date: required, must be today or future.
- Label: optional, max 100 chars.
- Prevent duplicate dates (check against existing list before submitting).

**Empty state:**
```
No blocked dates configured. Add holidays or closure dates to prevent
the chatbot from offering appointments on those days.
```

**Loading state:**
Skeleton rows while fetching.

**Error state:**
If EA is unreachable, show:
```
[AlertCircle amber]
Unable to load blocked dates. Easy!Appointments may be unreachable.
[Retry]
```

**Blocked dates display:**
- Sorted chronologically.
- Past dates shown in muted text.
- Date formatted as: "Mon, Dec 25, 2026".

**Tooltip on "Holidays & Blocked Dates" title:**
```
Block entire days when your business is closed. These dates are managed
directly in Easy!Appointments and apply to all providers.
```

### 7.4 Date Overrides Manager (New)

**File:** `src/components/calendar/date-overrides-manager.tsx`

**Component:** `DateOverridesManager`

**Props:**
```ts
interface DateOverridesManagerProps {
  providers: EAProvider[];
  selectedProviderId: string;
  connectionState: EAConnectionState;
  businessHours: BusinessHoursEntry[];   // for showing "normal hours" comparison
}
```

This component manages working_plan_exceptions on the selected provider. Like holidays, changes are saved immediately via API (not batched with the parent save).

**UI Layout:**
```
+------------------------------------------------------------------+
| Date Overrides                                                   |
| Set custom hours for specific dates. Overrides take priority     |
| over the regular weekly schedule.                                |
|   [i] Use this for early closes, extended hours, or one-off      |
|       schedule changes. These apply to the selected provider.    |
|------------------------------------------------------------------|
|                                                                  |
|  Provider: [Jane Smith v]  (or "No provider selected" if empty)  |
|                                                                  |
|  [+ Add Date Override]                                           |
|                                                                  |
|  Existing Overrides:                                             |
|  +------------------------------------------------------------+ |
|  | Fri, Dec 24, 2026    09:00 - 13:00    "Early close"         | |
|  |   Normal hours: 09:00 - 17:00                      [Delete] | |
|  |------------------------------------------------------------| |
|  | Sat, Jan 9, 2027     10:00 - 14:00    "Special Saturday"    | |
|  |   Normally closed                                  [Delete] | |
|  +------------------------------------------------------------+ |
|                                                                  |
+------------------------------------------------------------------+
```

**"Add Date Override" inline form:**
```
+------------------------------------------------------------------+
|  Date: [YYYY-MM-DD picker]                                       |
|  [ ] Closed all day                                              |
|  Start: [09:00 v]    End: [13:00 v]                              |
|  Label: [__________________] (optional)                          |
|                                          [Cancel]  [Add Override]|
+------------------------------------------------------------------+
```

When "Closed all day" is checked, start/end selects are disabled (grayed out).

**Normal hours comparison line:**
For each override, show what the regular schedule is for that day of the week:
```ts
const dayOfWeek = new Date(override.date).getDay();
const normalEntry = businessHours.find(h => h.dayOfWeek === dayOfWeek);
const normalText = normalEntry?.isEnabled
  ? `Normal hours: ${normalEntry.startTime} - ${normalEntry.endTime}`
  : 'Normally closed';
```
Render as `<p className="text-xs text-secondary-400 mt-0.5">{normalText}</p>`.

**Data flow:**
- When `selectedProviderId` changes, fetch that provider's `settings.workingPlanExceptions` via `GET /api/calendar/providers/:id`.
- To add an override: `PUT /api/calendar/providers/:id/working-plan-exceptions` with the new date entry.
- To remove an override: same PUT endpoint, but omitting that date key from the exceptions object (or the DELETE variant).

**Validation rules:**
- Date: required, must be today or future.
- If not closed: start time < end time.
- No duplicate dates.
- Must have a provider selected.

**Guard: no provider selected:**
```
[AlertCircle amber]
Select a provider above to manage date-specific schedule overrides.
Provider overrides only apply to the selected staff member.
```

**Tooltips:**

| Element | Tooltip Text |
|---------|-------------|
| "Date" label | The specific date you want to override the regular schedule for. |
| "Closed all day" checkbox | Check this to mark the entire day as unavailable. No booking slots will be offered. |
| "Label" field | An optional note to remind you why this override exists (e.g., "Holiday party", "Staff training"). |

---

## 8. Tab 3: Booking History (Modified)

**File:** `src/components/calendar/booking-history.tsx`

**Changes [audit 5f]:**

1. **Add search input:**
   ```tsx
   <Input
     placeholder="Search by name or email..."
     value={searchQuery}
     onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
     className="max-w-xs"
   />
   ```
   Filter: `booking.attendee_name.toLowerCase().includes(q) || booking.attendee_email.toLowerCase().includes(q)`.

2. **Add date range filter:**
   Two `<input type="date">` fields for start and end date. Filter bookings where `booking.start_time` falls within range.

3. **No export in this phase** (low priority, can be added later).

**Updated wireframe:**
```
+------------------------------------------------------------------+
| Booking History                                                  |
| Recent appointments booked through your chatbot.                 |
|------------------------------------------------------------------|
| Search: [_________________]   From: [____]  To: [____]          |
|                                                                  |
| [All (12)] [Confirmed (8)] [Pending (2)] [Cancelled (2)]        |
|                                                                  |
| (booking rows...)                                                |
|                                                                  |
| 12 bookings                              [Previous] [Next]      |
+------------------------------------------------------------------+
```

---

## 9. Shared Components

### 9.1 Sticky Save Bar

**File:** `src/components/calendar/sticky-save-bar.tsx`

```tsx
'use client';

import { Loader2, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StickySaveBarProps {
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
  onTest?: () => void;
  testing?: boolean;
  isNewSetup?: boolean;        // controls "Enable" vs "Update" label
  hasIntegration: boolean;
}

export function StickySaveBar({
  isDirty,
  saving,
  onSave,
  onTest,
  testing,
  isNewSetup,
  hasIntegration,
}: StickySaveBarProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 px-6 py-3 bg-white/95 dark:bg-secondary-900/95 backdrop-blur border-t border-secondary-200 dark:border-secondary-700 flex items-center justify-end gap-3">
      {isDirty && (
        <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          Unsaved changes
        </span>
      )}
      {hasIntegration && onTest && (
        <Button variant="outline" onClick={onTest} disabled={testing || saving}>
          {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Test Connection
        </Button>
      )}
      <Button onClick={onSave} disabled={saving || (!isDirty && !isNewSetup)}>
        {saving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {saving ? 'Saving...' : isNewSetup ? 'Enable Calendar' : 'Save Changes'}
      </Button>
    </div>
  );
}
```

This matches the settings page sticky bar pattern [audit 5c]. The save button is disabled when no changes exist (unless it is the initial setup). Only visible on Tabs 1 and 2 (not Tab 3 / Booking History).

### 9.2 Inline Hint Component

Not a separate file -- this is a reusable pattern applied directly. Used consistently across all new components.

```tsx
// Reusable amber hint pattern
function InlineHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5 text-xs text-amber-600 dark:text-amber-400">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <p>{children}</p>
    </div>
  );
}
```

Optionally extract to `src/components/ui/inline-hint.tsx` if it doesn't exist already, but since the settings page inlines this pattern, keep it inline for now.

---

## 10. State Management

### Parent Page State (`page.tsx`)

The page component owns the following state:

```ts
// Loading & saving
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [testing, setTesting] = useState(false);
const [activeTab, setActiveTab] = useState('connection');

// Connection
const [integration, setIntegration] = useState<CalendarIntegration | null>(null);
const [connectionState, setConnectionState] = useState<EAConnectionState>('not_connected');

// EA entities (fetched once, refreshed after mutations)
const [services, setServices] = useState<EAService[]>([]);
const [providers, setProviders] = useState<EAProvider[]>([]);
const [bookings, setBookings] = useState<CalendarBooking[]>([]);

// User selections (saved via POST /api/calendar/setup)
const [selectedServiceId, setSelectedServiceId] = useState<string>('');
const [selectedProviderId, setSelectedProviderId] = useState<string>('');

// Local config (saved via POST /api/calendar/setup)
const [eventTypeConfig, setEventTypeConfig] = useState<EventTypeConfig>({
  ...DEFAULT_EVENT_TYPE,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});
const [businessHours, setBusinessHours] = useState<BusinessHoursEntry[]>(DEFAULT_BUSINESS_HOURS);

// Snapshot of initial values for dirty tracking
const [initialState, setInitialState] = useState<string>('');
```

### Data Loading Strategy

```ts
const fetchData = useCallback(async () => {
  try {
    // Parallel fetch: integration+bookings and setup config
    const [calRes, setupRes] = await Promise.all([
      fetch(`/api/calendar/integrations?chatbotId=${chatbotId}`),
      fetch(`/api/calendar/setup?chatbotId=${chatbotId}`),
    ]);

    // Process integration + bookings
    if (calRes.ok) {
      const calData = await calRes.json();
      setIntegration(calData.data?.integration || null);
      setBookings(calData.data?.bookings || []);
    }

    // Process setup config + EA entities
    if (setupRes.ok) {
      const setupData = await setupRes.json();
      setConnectionState(setupData.data?.connectionState || 'not_connected');

      if (setupData.data?.eventType) {
        setEventTypeConfig(setupData.data.eventType);
      }
      if (setupData.data?.businessHours) {
        setBusinessHours(setupData.data.businessHours);
      }
      if (setupData.data?.services) setServices(setupData.data.services);
      if (setupData.data?.providers) setProviders(setupData.data.providers);
      if (setupData.data?.serviceId) setSelectedServiceId(String(setupData.data.serviceId));
      if (setupData.data?.providerId) setSelectedProviderId(String(setupData.data.providerId));

      // Snapshot for dirty tracking
      setInitialState(JSON.stringify({
        serviceId: setupData.data?.serviceId || '',
        providerId: setupData.data?.providerId || '',
        eventType: setupData.data?.eventType || DEFAULT_EVENT_TYPE,
        businessHours: setupData.data?.businessHours || DEFAULT_BUSINESS_HOURS,
      }));
    }
  } catch {
    toast.error('Failed to load calendar settings');
  } finally {
    setLoading(false);
  }
}, [chatbotId]);
```

### Services/Providers Refetch

When a child component mutates services or providers (CRUD), it calls `onServicesChange()` / `onProvidersChange()` which triggers a lightweight refetch of just those entities:

```ts
const refetchServices = useCallback(async () => {
  try {
    const res = await fetch('/api/calendar/services');
    if (res.ok) {
      const data = await res.json();
      setServices(data.data || []);
    }
  } catch { /* silent */ }
}, []);

const refetchProviders = useCallback(async () => {
  try {
    const res = await fetch('/api/calendar/providers');
    if (res.ok) {
      const data = await res.json();
      setProviders(data.data || []);
    }
  } catch { /* silent */ }
}, []);
```

---

## 11. Unsaved Changes Tracking

**Addresses audit finding 5a.**

### Dirty Tracking

```ts
const currentState = JSON.stringify({
  serviceId: selectedServiceId,
  providerId: selectedProviderId,
  eventType: eventTypeConfig,
  businessHours: businessHours,
});

const isDirty = initialState !== '' && currentState !== initialState;
```

### beforeunload Warning

```ts
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```

### Visual Indicators

1. **Sticky save bar** shows "Unsaved changes" amber text when `isDirty`.
2. **Save button** is disabled when `!isDirty && !isNewSetup`.
3. **Tab switching** does not warn (changes are preserved in state across tabs).

### After Successful Save

```ts
async function handleSave() {
  setSaving(true);
  try {
    const res = await fetch('/api/calendar/setup', { ... });
    if (!res.ok) throw new Error(...);
    toast.success('Calendar settings saved');

    // Update snapshot to mark as clean
    setInitialState(JSON.stringify({
      serviceId: selectedServiceId,
      providerId: selectedProviderId,
      eventType: eventTypeConfig,
      businessHours: businessHours,
    }));

    fetchData(); // refresh from server
  } catch (err) {
    toast.error(...);
  } finally {
    setSaving(false);
  }
}
```

---

## 12. Error Handling & Loading States

### 12.1 Page-Level Loading

On initial load, show skeleton placeholders (keep existing pattern):
```tsx
if (loading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
```

### 12.2 EA-Specific Loading [audit 5j]

The page renders immediately with local data (event type, business hours from DB). EA entities (services, providers, blocked periods) load separately within their cards.

Each EA-dependent card shows its own loading state:
```tsx
{loadingServices ? (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
) : (
  <ServiceList ... />
)}
```

### 12.3 EA Connection Failure

When an EA API call fails, the affected card shows:
```
+----------------------------------------------------------+
| [AlertCircle amber]                                      |
| Unable to connect to Easy!Appointments. The server may   |
| be temporarily unavailable.                              |
|                                              [Retry]     |
+----------------------------------------------------------+
```

Other cards continue to function normally.

### 12.4 Individual Operation Errors

- **Create/Update/Delete failures:** Show `toast.error()` with the error message from the API.
- **Validation failures:** Show inline red text below the field, matching the existing `text-red-500` pattern.
- **Network failures:** Show `toast.error('Network error. Please check your connection.')`.

### 12.5 Save Operation Error

If `POST /api/calendar/setup` fails:
- Show `toast.error()` with the error message.
- Do NOT update `initialState` (keep dirty tracking active).
- Do NOT clear the form.

---

## 13. Accessibility

### Keyboard Navigation

- All interactive elements are focusable and operable with keyboard.
- Tab order follows visual order.
- The timezone combobox supports `ArrowUp`, `ArrowDown`, `Enter`, `Escape`.
- The tabbed interface uses the existing `TabsTrigger` which has `focus-visible:ring-2`.

### ARIA Labels

- All form fields have `<Label htmlFor>` associations.
- Tooltips render with `role="tooltip"` (already in the Tooltip component).
- The status filter buttons in Booking History use `role="radiogroup"` / `role="radio"` (already implemented).
- Delete confirmation dialogs have `role="dialog"` and `aria-modal="true"` (already in Dialog component).
- Add `aria-label` to icon-only buttons (Edit, Delete).
- Add `aria-describedby` to fields with inline hints.
- The timezone combobox dropdown uses `role="listbox"` and options use `role="option"` with `aria-selected`.

### Screen Reader

- Connection status changes announced via `aria-live="polite"` region.
- Save success/failure announced via toast (sonner handles `aria-live`).

### Color Contrast

- All text meets WCAG AA 4.5:1 ratio (using existing design tokens).
- Status badges maintain contrast in both light and dark modes.
- Amber hint text (`text-amber-600` light / `text-amber-400` dark) meets 4.5:1.

### Touch Targets

- All buttons meet 44x44px minimum (existing Button component handles this).
- Checkbox inputs are 16x16px but have surrounding padding bringing clickable area above minimum.

---

## 14. Migration Considerations

### What Happens to Existing Data

1. **Existing `calendar_integrations` rows:** No schema change. Fully backward compatible.
2. **Existing `calendar_event_types` rows:** No schema change. Fully backward compatible.
3. **Existing `calendar_business_hours` rows:** No schema change. Fully backward compatible.
4. **Existing `calendar_bookings` rows:** No schema change. Fully backward compatible.

### No New Database Tables

All new functionality (services, providers, holidays, date overrides) is managed directly through the EA API. No new Supabase tables are needed. This is intentional:
- Services and providers already live in EA -- no need to duplicate.
- Blocked periods live in EA via `/api/v1/blocked_periods`.
- Date overrides live in EA via provider `settings.workingPlanExceptions`.

The VocUI API routes act as authenticated proxies to the EA API.

### New API Routes Are Additive

All new routes (`/api/calendar/services`, `/api/calendar/providers`, `/api/calendar/blocked-periods`) are new files. No existing routes are broken.

### Setup Route Change Is Backward Compatible

The `GET /api/calendar/setup` response gains a new `connectionState` field. Existing consumers that don't read it will not break.

---

## 15. Audit Finding Cross-Reference

Every finding from the UX audit and where it is addressed in this plan:

### High Priority

| # | Finding | Addressed In |
|---|---------|-------------|
| 1a | Add holidays/blocked dates support | Section 7.3 -- HolidaysManager component, Section 4.6-4.7 -- blocked-periods API routes, Section 5 -- EA adapter getBlockedPeriods/createBlockedPeriod/deleteBlockedPeriod |
| 2a | Add date overrides for custom hours | Section 7.4 -- DateOverridesManager component, Section 4.5 -- working-plan-exceptions API route, Section 5 -- EA adapter working plan exception methods |
| 3a | Add tooltips to all Appointment Settings fields | Section 7.1 -- tooltip table with exact text for all 8 fields |
| 3d | Implement tooltip pattern (imports + markup) | Section 7.1 -- pattern per field showing exact JSX |
| 4a | Add contextual inline hints for empty services/providers | Section 6.2 -- empty state with AlertCircle amber pattern, Section 6.3 -- empty state for providers |
| 5a | Add unsaved changes warning | Section 11 -- dirty tracking via JSON snapshot, beforeunload, visual indicators |

### Medium Priority

| # | Finding | Addressed In |
|---|---------|-------------|
| 1b | Recurring annual holidays | Section 7.3 -- handled natively by EA blocked_periods (user adds each year's dates; recurring logic deferred to future enhancement with local storage or date-holidays npm package) |
| 3b | Add tooltips to EA Connection fields | Section 6.2 -- Service tooltip, Section 6.3 -- Provider tooltip |
| 3c | Add helper text to Business Hours | Section 7.2 -- added `<p>` below label |
| 4b | Improve CardDescription for EA section | Section 6.2 -- updated description text explaining services and providers |
| 4d | Distinguish "EA not configured" from "no services" | Section 4.8 -- connectionState field in setup API, Section 6.1 -- distinct messages per state |
| 5b | Show connection status when no integration exists | Section 6.1 -- always rendered, connectionState drives display |
| 5c | Fix save button placement | Section 9.1 -- StickySaveBar component, sticky bottom bar pattern |
| 5d | Improve timezone selector UX | Section 7.1 -- combobox replacement with badge display |
| 5j | Separate EA API loading from page loading | Section 12.2 -- EA cards load independently with own skeletons |

### Low Priority

| # | Finding | Addressed In |
|---|---------|-------------|
| 2b | Calendar preview for overrides | Deferred to future enhancement. Not in this rebuild scope. |
| 4c | Show selected service duration mismatch warning | Section 6.2 -- duration mismatch inline hint |
| 5e | Expand duration options | Section 7.1 -- DURATION_OPTIONS expanded to include 5, 10, 180, 240 |
| 5f | Add search, date filter, export to booking history | Section 8 -- search input and date range filter added. Export deferred. |
| 5g | Add confirmation dialog for first-time enable | Deferred. The StickySaveBar label changes to "Enable Calendar" for first-time setup, providing clarity without a dialog. |
| 5h | Standardize select element styling | Sections 7.1, 7.2, 6.2, 6.3 -- use `Select` from `@/components/ui/select` |
| 5i | Improve "Copy Mon to weekdays" flexibility | Section 7.2 -- copies from first enabled weekday |
| 5k | Improve disconnect confirmation layout | Section 6.1 -- uses ConfirmDialog modal |
| 5l | Add visual hierarchy between config and history | Section 1 -- tabs naturally separate config (tabs 1-2) from activity (tab 3) |

---

## Appendix A: Complete Page Component Structure

```tsx
// page.tsx outline

export default function CalendarSettingsPage({ params }: PageProps) {
  // ... state declarations (Section 10)
  // ... data fetching (Section 10)
  // ... handlers: handleSave, handleDisconnect, handleTest, handleCancelBooking
  // ... dirty tracking (Section 11)
  // ... beforeunload effect (Section 11)

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      <ChatbotPageHeader ... />

      {/* Always rendered [audit 5b] */}
      <ConnectionStatus
        integration={integration}
        connectionState={connectionState}
        activeBookingCount={bookings.filter(b => b.status === 'confirmed').length}
        onDisconnect={handleDisconnect}
        onTest={handleTest}
        testing={testing}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="connection">Connection & Services</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
        </TabsList>

        {/* Tab 1: Connection & Services */}
        <TabsContent value="connection">
          <div className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Services</CardTitle>
                <CardDescription>
                  Select or create services that your chatbot can book.
                  Services define what can be booked (e.g., Consultation, Demo).
                  Each service has a duration and optional price.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceManager
                  services={services}
                  selectedServiceId={selectedServiceId}
                  onSelectService={setSelectedServiceId}
                  onServicesChange={refetchServices}
                  connectionState={connectionState}
                  eventTypeDuration={eventTypeConfig.durationMinutes}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Providers</CardTitle>
                <CardDescription>
                  Select or create providers (staff members) who handle bookings.
                  Each provider has their own schedule and assigned services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderManager
                  providers={providers}
                  services={services}
                  selectedProviderId={selectedProviderId}
                  onSelectProvider={setSelectedProviderId}
                  onProvidersChange={refetchProviders}
                  connectionState={connectionState}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Scheduling */}
        <TabsContent value="scheduling">
          <div className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appointment Settings</CardTitle>
                <CardDescription>
                  Configure what type of appointments can be booked
                  through your chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventTypeConfigForm
                  value={eventTypeConfig}
                  onChange={setEventTypeConfig}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Business Hours</CardTitle>
                <CardDescription>
                  Set which days and times you accept bookings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessHoursEditor
                  value={businessHours}
                  onChange={setBusinessHours}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Holidays & Blocked Dates</CardTitle>
                <CardDescription>
                  Block specific dates when your business is closed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HolidaysManager
                  connectionState={connectionState}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Date Overrides</CardTitle>
                <CardDescription>
                  Set custom hours for specific dates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DateOverridesManager
                  providers={providers}
                  selectedProviderId={selectedProviderId}
                  connectionState={connectionState}
                  businessHours={businessHours}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Booking History */}
        <TabsContent value="history">
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking History</CardTitle>
                <CardDescription>
                  Recent appointments booked through your chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingHistory
                  bookings={bookings}
                  onCancel={handleCancelBooking}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sticky save bar -- only on config tabs [audit 5c] */}
      {activeTab !== 'history' && (
        <StickySaveBar
          isDirty={isDirty}
          saving={saving}
          onSave={handleSave}
          onTest={integration ? handleTest : undefined}
          testing={testing}
          isNewSetup={!integration}
          hasIntegration={!!integration}
        />
      )}
    </div>
  );
}
```

---

## Appendix B: API Route Implementation Template

All new API routes follow this pattern (matching existing routes in the codebase):

```ts
// Example: src/app/api/calendar/services/route.ts

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError, parseBody } from '@/lib/api/utils';
import { EasyAppointmentsAdapter } from '@/lib/calendar/providers/easy-appointments';

const createServiceSchema = z.object({
  name: z.string().min(1).max(100),
  duration: z.number().min(5).max(480),
  price: z.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const ea = new EasyAppointmentsAdapter({});
    const validation = await ea.validateConfig();
    if (!validation.valid) {
      throw APIError.badRequest(validation.error || 'EA not configured');
    }

    const services = await ea.getServicesFull();
    return successResponse(services);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized();

    const input = await parseBody(req, createServiceSchema);
    const ea = new EasyAppointmentsAdapter({});
    const service = await ea.createService(input);
    return successResponse(service);
  } catch (error) {
    return errorResponse(error);
  }
}
```

---

## Appendix C: Implementation Order

Recommended sequence to minimize risk and enable incremental testing:

### Phase 1: Foundation (can be deployed independently)
1. Add new types to `types.ts`.
2. Add new methods to `easy-appointments.ts` adapter.
3. Create API routes: services, providers, blocked-periods.
4. Modify `GET /api/calendar/setup` to include `connectionState`.

### Phase 2: Page Rebuild
5. Rebuild `page.tsx` with tab structure.
6. Modify `connection-status.tsx` (always render, ConfirmDialog).
7. Add `sticky-save-bar.tsx`.
8. Implement unsaved changes tracking.

### Phase 3: Services & Providers
9. Build `service-manager.tsx`.
10. Build `provider-manager.tsx`.

### Phase 4: Scheduling Enhancements
11. Modify `event-type-config.tsx` (tooltips, expanded durations, tz combobox).
12. Modify `business-hours-editor.tsx` (helper text, copy-from-any-day, design-system select).

### Phase 5: Holidays & Overrides
13. Build `holidays-manager.tsx`.
14. Create working-plan-exceptions API route.
15. Build `date-overrides-manager.tsx`.

### Phase 6: History & Polish
16. Modify `booking-history.tsx` (search, date filter).
17. Final accessibility pass and testing.
