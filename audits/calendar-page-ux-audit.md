# Calendar Booking Settings Page - UX Audit

**Route:** `/dashboard/chatbots/[id]/calendar`
**Date:** 2026-03-28
**Scope:** Comprehensive audit covering holidays, ad-hoc hours, tooltips, service/provider management, and general UX

---

## Files Reviewed

- `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx` (page)
- `src/components/calendar/business-hours-editor.tsx`
- `src/components/calendar/event-type-config.tsx`
- `src/components/calendar/connection-status.tsx`
- `src/components/calendar/booking-history.tsx`
- `src/lib/calendar/types.ts`
- `src/lib/calendar/service.ts`
- `src/lib/calendar/providers/easy-appointments.ts`
- `src/app/api/calendar/setup/route.ts`
- `src/app/api/calendar/availability/route.ts`
- `src/app/api/calendar/book/route.ts`
- `src/app/api/calendar/integrations/route.ts`
- `src/app/api/calendar/webhook/[provider]/route.ts`
- `src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx` (reference pattern)

---

## Current State Summary

The calendar page lets users connect their chatbot to Easy!Appointments for automated booking. It has four sections: connection status, EA service/provider selection, appointment settings (event type config), and availability (business hours editor), followed by a save button and booking history table.

The business hours editor supports per-day enable/disable with start/end time selects and a "Copy Mon to weekdays" shortcut. The event type form has fields for title, duration, description, buffer times, notice period, max days ahead, and timezone.

Services and providers are fetched from the Easy!Appointments API and displayed as `<select>` dropdowns. The page has no concept of holidays, date overrides, or tooltips.

---

## 1. Holidays / Public Holidays

**Current state:** Completely absent. No UI, no data model, no API support.

**Impact:** High. Users operating businesses that close for holidays will have their chatbot offering slots on Christmas, New Year's, etc. This leads to phantom bookings that must be manually cancelled, damaging both user trust and end-customer experience.

### Recommendations

#### 1a. Add a "Blocked Dates" / "Holidays" section to the page
**Priority: High**

Add a new Card between the Availability and Save sections. The UI should support two modes:

**Manual date picker:** A multi-date picker where users select specific dates to block. Each blocked date should have an optional label field (e.g., "Christmas Day", "Team offsite"). Display selected dates as removable chips/tags sorted chronologically.

**Country-based public holidays (optional, lower priority):** A dropdown to select a country/region that auto-populates known public holidays. Consider using a library like `date-holidays` (npm package) or a free API. Show the imported holidays as a list with individual toggle switches so users can opt out of specific holidays that don't apply to them.

**Data model changes needed:**
- New `calendar_blocked_dates` table with columns: `id`, `integration_id`, `date` (DATE), `label` (text, nullable), `is_recurring` (boolean, for annual holidays), `created_at`
- New field in `BusinessHoursEntry` or a separate type for date overrides
- The `CalendarService.getAvailability()` method must filter out blocked dates before returning slots

**Implementation notes:**
- The availability API route already receives `dateFrom`/`dateTo` -- the blocked dates check fits naturally in `CalendarService.getAvailability()` after fetching from the provider but before returning
- Add validation in `POST /api/calendar/setup` to accept a `blockedDates` array
- The Easy!Appointments adapter's `getAvailability()` will still return slots for blocked dates; the filtering should happen at the service layer so it works regardless of provider

#### 1b. Recurring annual holidays
**Priority: Medium**

Allow marking a blocked date as "recurring every year." Store with `is_recurring: true` and match on month+day rather than full date. Display these differently in the UI (e.g., with a repeat icon).

---

## 2. Ad-hoc Hours for Specific Dates

**Current state:** Completely absent. Business hours are only configurable as weekly recurring patterns (Mon-Sun). There is no way to set custom hours for a specific date.

**Impact:** High. Common scenarios that cannot be handled:
- Early close on Dec 24th (close at 1pm instead of 5pm)
- Extended hours for a sale event
- One-off Saturday opening for a special event
- Reduced hours during a staff training day

### Recommendations

#### 2a. Add a "Date Overrides" section
**Priority: High**

Place this in a new Card after the Business Hours card, or as a sub-section within it. The UI should be:

1. An "Add date override" button that opens a row/inline form with:
   - Date picker (single date)
   - Start time and end time selects (reuse the same `TIME_OPTIONS` from `business-hours-editor.tsx`)
   - A "Closed all day" toggle that disables the time selects
   - Optional label/reason field
   - Save/remove controls

2. Display existing overrides as a sorted list showing: date, hours (or "Closed"), label, and a delete button.

3. Indicate visually when an override conflicts with or differs from the regular schedule for that day of the week (e.g., "Normal hours: 09:00-17:00" shown as muted text beneath the override).

**Data model changes needed:**
- New type: `DateOverride { date: string; startTime: string; endTime: string; isClosed: boolean; label?: string }`
- New DB table `calendar_date_overrides` with columns: `id`, `integration_id`, `date` (DATE, unique per integration), `start_time`, `end_time`, `is_closed`, `label`, `created_at`
- Update `CalendarService.getAvailability()` to check for date overrides before applying weekly business hours. If an override exists for a given date, use its hours instead of the weekly pattern. If `is_closed` is true, return zero slots for that date.

**Relationship with Holidays (Section 1):**
A blocked date (holiday) is effectively a date override with `is_closed: true`. Consider whether to merge these into a single "Date Overrides" table where holidays are just overrides marked closed, or keep them separate for clarity. Recommendation: keep them separate in the UI (holidays as a simple date+label list, overrides as a date+hours form) but they can share the same DB table with a `type` column (`holiday` | `override`).

#### 2b. Calendar preview for overrides
**Priority: Low**

A small month calendar view that highlights dates with overrides/holidays, giving users a visual overview. This is a polish item.

---

## 3. Tooltips

**Current state:** Zero tooltips anywhere on the calendar page. The settings page (`/settings`) already uses the `Tooltip` component from `@/components/ui/tooltip` with an `Info` icon from lucide-react consistently. The calendar page imports neither.

**Impact:** Medium. Several fields have non-obvious meanings, especially for users unfamiliar with scheduling software terminology. Fields like "Buffer Before," "Minimum Notice," and "Max Days Ahead" will cause confusion and misconfiguration.

### Recommendations

#### 3a. Add tooltips to all Appointment Settings fields
**Priority: High**

Use the exact pattern from the settings page: `<Tooltip content="..."><Info className="w-4 h-4 text-secondary-400 cursor-help" /></Tooltip>` next to each `<Label>`.

Specific tooltips to add in `event-type-config.tsx`:

| Field | Tooltip Text |
|-------|-------------|
| Appointment Name | The name shown to customers when booking. For example: "Consultation", "Demo", "Support Call". |
| Duration | How long each appointment lasts. The chatbot will only offer time slots that fit this duration within your available hours. |
| Description | An optional description shown to customers before they confirm a booking. Use this to set expectations about the appointment. |
| Buffer Before | Minutes of padding added before each appointment. Use this to allow preparation time. A 15-minute buffer before a 10:00 appointment means the previous slot ends at 9:45. |
| Buffer After | Minutes of padding added after each appointment. Use this to allow wrap-up time or breaks between appointments. |
| Minimum Notice | The minimum number of hours in advance a customer must book. Set to 1 to prevent same-hour bookings, or 24 to require next-day booking. |
| Max Days Ahead | How far into the future customers can book. Set to 30 to allow bookings up to one month out, or 7 for one week. |
| Timezone | The timezone used for all appointment times. Make sure this matches your business location. Customer-facing times are converted to the customer's timezone automatically. |

#### 3b. Add tooltips to Easy!Appointments Connection fields
**Priority: Medium**

| Field | Tooltip Text |
|-------|-------------|
| Service | The service type from your Easy!Appointments instance that this chatbot will book. Each service has a predefined duration set in Easy!Appointments. |
| Provider | The staff member or resource from Easy!Appointments who will handle these bookings. Leave empty to auto-assign to any available provider. |

#### 3c. Add a tooltip or helper text to Business Hours
**Priority: Medium**

Add helper text below the "Business Hours" label in `business-hours-editor.tsx`:

> "Set the hours your business accepts bookings for each day of the week. Disabled days will show as unavailable to customers."

This can be a `<p className="text-xs text-secondary-500">` under the label, matching the pattern used elsewhere.

#### 3d. Implementation
**Priority: High**

In `event-type-config.tsx`, add these imports:
```
import { Tooltip } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
```

Then wrap each `<Label>` in a flex container with the tooltip:
```tsx
<div className="flex items-center gap-2">
  <Label htmlFor="et-buffer-before">Buffer Before (min)</Label>
  <Tooltip content="Minutes of padding added before each appointment...">
    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
  </Tooltip>
</div>
```

---

## 4. Adding Services & Providers

**Current state:** Services and providers are fetched from the Easy!Appointments API (`ea.getServices()`, `ea.getProviders()`) and displayed as `<select>` dropdowns. When no services exist, a plain text message says "No services found. Make sure Easy!Appointments is configured and has at least one service." When no providers exist, the provider dropdown is simply hidden (not rendered at all).

**Impact:** High. Users have no guidance on how to create services or providers. The current empty state gives no actionable path forward. The provider dropdown silently disappearing when empty is confusing.

### Recommendations

#### 4a. Add contextual inline hints with links
**Priority: High**

Apply the same pattern as the settings page's "Placeholders require the pre-chat form to be enabled." hint. Use the amber alert style with `AlertCircle` icon.

**When no services are found**, replace the current plain text with:

```tsx
<div className="flex gap-1.5 text-xs text-amber-600 dark:text-amber-400">
  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
  <p>
    No services found. Services are created in your{' '}
    <a
      href={`${process.env.NEXT_PUBLIC_EASY_APPOINTMENTS_URL || '#'}/index.php/backend/services`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline whitespace-nowrap hover:text-amber-700 dark:hover:text-amber-300"
    >
      Easy!Appointments admin panel
    </a>
    . You need at least one service before the chatbot can accept bookings.
  </p>
</div>
```

**When no providers are found**, show a similar message instead of hiding the section entirely:

```tsx
<div className="flex gap-1.5 text-xs text-amber-600 dark:text-amber-400">
  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
  <p>
    No providers found. Providers (staff members) are created in your{' '}
    <a
      href={`${process.env.NEXT_PUBLIC_EASY_APPOINTMENTS_URL || '#'}/index.php/backend/users/providers`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline whitespace-nowrap hover:text-amber-700 dark:hover:text-amber-300"
    >
      Easy!Appointments admin panel
    </a>
    . Without a provider, bookings cannot be assigned.
  </p>
</div>
```

#### 4b. Add a description explaining what services and providers are
**Priority: Medium**

Update the `CardDescription` in the Easy!Appointments Connection card from:

> "Select the service and provider from your Easy!Appointments instance."

To:

> "Select the service and provider from your Easy!Appointments instance. Services define what can be booked (e.g., Consultation, Demo). Providers are the staff members who handle the bookings."

#### 4c. Show the selected service duration
**Priority: Low**

When a service is selected, show its duration below the select. This helps users understand the relationship between the EA service duration and the "Duration" field in Appointment Settings. If they differ, show a warning:

```tsx
{selectedService && selectedService.duration !== eventTypeConfig.durationMinutes && (
  <div className="flex gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-1">
    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
    <p>
      This service is {selectedService.duration} min in Easy!Appointments, but your
      appointment duration is set to {eventTypeConfig.durationMinutes} min. These
      should typically match.
    </p>
  </div>
)}
```

#### 4d. Environment variable dependency
**Priority: Medium**

When `EASY_APPOINTMENTS_URL` is not configured (the adapter returns an empty services/providers list), the current page shows the "No services found" message which is misleading. The actual problem is that the EA connection isn't configured at the environment level. The API already catches this in `validateConfig()`. The page should surface a distinct message:

```
Easy!Appointments is not configured. Contact your administrator to set up
the EASY_APPOINTMENTS_URL and EASY_APPOINTMENTS_KEY environment variables.
```

This requires the setup API GET endpoint to distinguish between "EA not configured" and "EA configured but no services exist" and return that distinction in the response.

---

## 5. General UX Issues

### 5a. No unsaved changes warning
**Priority: High**

Users can modify business hours, event type config, and service/provider selections without any visual indicator that changes are unsaved. If they navigate away, all changes are lost silently. The settings page handles this with `react-hook-form`'s dirty tracking.

**Recommendation:**
- Track whether any field has been modified from its loaded state
- Show an unsaved changes indicator near the Save button (e.g., a dot, or change button text to "Save Changes")
- Add a `beforeunload` event listener to warn when navigating away with unsaved changes
- Optionally disable the Save button when no changes have been made

### 5b. Connection status not shown when no integration exists
**Priority: Medium**

When `integration` is null (first-time setup), the ConnectionStatus component is not rendered at all (line 215: `{integration && <ConnectionStatus .../>}`). The page jumps straight to the EA service/provider card with no context about the current connection state.

**Recommendation:** Show a lightweight "Not connected" state instead of hiding the section entirely. The `ConnectionStatus` component already has a `!integration` branch that renders "Not connected" text, but the parent never renders it in that case. Remove the `{integration && ...}` conditional so the component always renders.

### 5c. Save button placement
**Priority: Medium**

The Save and Test buttons are placed between the Availability card and the Booking History card (lines 299-310). This is a non-standard placement. Users who scroll down to configure business hours may not realize there's a save button below, and users who see booking history may not realize there's configuration above that needs saving.

**Recommendation:**
- Add a sticky save bar at the bottom of the viewport (only visible when there are unsaved changes), consistent with the settings page pattern
- Alternatively, move the save button into the last configuration card or place it after both the EA Connection and Appointment Settings sections with a visual separator

### 5d. Timezone selector UX
**Priority: Medium**

The timezone selector in `event-type-config.tsx` is a two-part UI: a search input and a `<select size={6}>` listbox below it. Issues:

1. The listbox always shows 6 rows, taking significant vertical space even when the user hasn't interacted with it
2. There is no clear indication of the currently selected timezone unless the user scrolls through the list
3. The search input and select have no visual grouping

**Recommendation:**
- Replace with a combobox/autocomplete pattern: a single input that shows the current timezone as text, which when focused/typed into, opens a dropdown of filtered options
- Show the current timezone prominently (e.g., as a badge or in the label: "Timezone: America/New_York")
- Auto-detect and pre-fill from the browser (this is already done on initial load via `Intl.DateTimeFormat().resolvedOptions().timeZone`, but the UI should show this clearly)

### 5e. Duration options are limited
**Priority: Low**

The duration dropdown only offers: 15, 30, 45, 60, 90, 120 minutes. This covers most cases but misses some common durations.

**Recommendation:** Add 5 and 10 minutes (for quick check-ins), and 180 and 240 minutes (for half-day sessions/workshops). The API schema already supports `min(5).max(480)`. Alternatively, allow a custom numeric input with the dropdown as a preset selector.

### 5f. Booking history lacks search and export
**Priority: Low**

The booking history shows up to 50 recent bookings with status filter tabs and pagination. There is no search (by name/email), no date range filter, and no export.

**Recommendation:**
- Add a search input for attendee name or email
- Add a date range picker for filtering
- Add a "Download CSV" button for bookings export (consistent with the analytics page which has export functionality)

### 5g. No confirmation or summary before saving
**Priority: Low**

When the user clicks Save/Enable Calendar, the form submits immediately. There is no review step showing what will be saved, especially important for first-time setup where enabling the calendar is a significant action.

**Recommendation:** For first-time setup (when button says "Enable Calendar"), consider showing a summary dialog:
- Selected service and provider
- Business hours overview
- Appointment settings summary
- A clear "Enable" confirmation button

### 5h. Native `<select>` elements lack design system consistency
**Priority: Low**

The service and provider dropdowns in the page component use native `<select>` elements with inline className strings (lines 238-248, 260-268). These don't match the design system's `Input` component styling perfectly and don't support dark mode transitions as smoothly.

**Recommendation:** Create a shared `Select` component in `src/components/ui/` or use the same `selectClasses` constant defined in `event-type-config.tsx` for consistency. The business hours editor already defines its own `selectClasses` constant separately.

### 5i. "Copy Mon to weekdays" fails silently for edge cases
**Priority: Low**

In `business-hours-editor.tsx`, the "Copy Mon to weekdays" button shows a toast error if Monday is disabled or not configured. However, if a user hasn't configured Monday yet (e.g., they started by configuring Wednesday), the toast says "Monday is disabled -- enable it first" which isn't helpful. The feature assumes a Monday-first workflow.

**Recommendation:** Rename to "Copy to all weekdays" and use the first enabled weekday as the source, or let the user choose which day to copy from via a small dropdown.

### 5j. Missing loading/error states for EA API calls
**Priority: Medium**

When the page loads, it fetches services and providers from the EA API via the setup endpoint. If the EA server is slow or down, the page shows the skeleton loader until the entire fetch completes. There's no specific indication that the EA connection itself is the bottleneck.

**Recommendation:** Show the rest of the form (appointment settings, business hours) immediately from the local DB data, and load the EA services/providers separately with their own loading spinner within the EA Connection card. Use a local error state within that card if the EA API fails, rather than failing the entire page.

### 5k. Disconnect confirmation is cramped
**Priority: Low**

In `connection-status.tsx`, the disconnect confirmation shows inline: "Disconnect? This may affect active bookings." plus two buttons, all in a `flex items-center gap-2` container. On smaller screens this wraps awkwardly.

**Recommendation:** Use a modal/dialog for the disconnect confirmation, or move the confirmation text to a new line below the buttons area. Include a count of active bookings if possible (e.g., "You have 3 active bookings. Disconnecting will not cancel them, but new bookings will not be possible.").

### 5l. No visual hierarchy between configuration and history
**Priority: Low**

All cards (Connection, EA Config, Appointment Settings, Availability, Booking History) are visually identical. Configuration and read-only sections are not distinguished.

**Recommendation:** Add a section divider or heading between configuration cards and the booking history card. For example:

```tsx
<div className="border-t border-secondary-200 dark:border-secondary-700 pt-6 mt-2">
  <h3 className="text-sm font-medium text-secondary-500 mb-4">Booking Activity</h3>
  {/* Booking History card */}
</div>
```

---

## Summary by Priority

### High Priority
| # | Finding | Section |
|---|---------|---------|
| 1a | Add holidays/blocked dates support | Holidays |
| 2a | Add date overrides for custom hours | Ad-hoc Hours |
| 3a | Add tooltips to all Appointment Settings fields | Tooltips |
| 3d | Implement tooltip pattern (imports + markup) | Tooltips |
| 4a | Add contextual inline hints for empty services/providers | Services & Providers |
| 5a | Add unsaved changes warning | General UX |

### Medium Priority
| # | Finding | Section |
|---|---------|---------|
| 1b | Recurring annual holidays | Holidays |
| 3b | Add tooltips to EA Connection fields | Tooltips |
| 3c | Add helper text to Business Hours | Tooltips |
| 4b | Improve CardDescription for EA section | Services & Providers |
| 4d | Distinguish "EA not configured" from "no services" | Services & Providers |
| 5b | Show connection status when no integration exists | General UX |
| 5c | Fix save button placement | General UX |
| 5d | Improve timezone selector UX | General UX |
| 5j | Separate EA API loading from page loading | General UX |

### Low Priority
| # | Finding | Section |
|---|---------|---------|
| 2b | Calendar preview for overrides | Ad-hoc Hours |
| 4c | Show selected service duration mismatch warning | Services & Providers |
| 5e | Expand duration options | General UX |
| 5f | Add search, date filter, and export to booking history | General UX |
| 5g | Add confirmation dialog for first-time enable | General UX |
| 5h | Standardize select element styling | General UX |
| 5i | Improve "Copy Mon to weekdays" flexibility | General UX |
| 5k | Improve disconnect confirmation layout | General UX |
| 5l | Add visual hierarchy between config and history | General UX |
