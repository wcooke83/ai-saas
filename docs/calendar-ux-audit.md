# Calendar Booking Feature -- UX Audit

## Summary

The calendar booking feature is functionally complete but has significant accessibility gaps, several inconsistencies with standard UI patterns, and edge cases that could confuse or block users. Below are all findings organized by severity.

---

## Critical Issues

### C1. No confirmation dialog on destructive actions

**Files:** `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx`, `src/components/calendar/booking-history.tsx`

Both "Disconnect" and booking cancel actions execute immediately with no confirmation. Disconnecting the calendar could break active chatbot booking flows for end users. Cancelling a confirmed booking sends a real cancellation to the attendee.

**Recommendation:** Add a confirmation dialog (AlertDialog from your UI library) for both actions. The disconnect dialog should warn that existing bookings may be affected. The cancel dialog should show the attendee name and date being cancelled.

---

### C2. Business hours editor allows invalid time ranges

**File:** `src/components/calendar/business-hours-editor.tsx`

Users can set end time earlier than start time (e.g., start 17:00, end 09:00) with no validation or error feedback. This silently creates broken availability that would result in zero bookable slots.

**Recommendation:** Validate that endTime > startTime on change. Either filter the end-time dropdown to only show times after the selected start time, or show an inline error message. Also validate on save.

---

### C3. Widget components use hardcoded light-mode colors

**Files:** `src/components/widget/calendar-slots.tsx`, `src/components/widget/booking-confirmation.tsx`

Hardcoded color values like `color: '#64748b'` are used. If the chat widget is embedded on a dark-background page, text will be unreadable.

**Recommendation:** Accept a `textColor` or `theme` prop, or use `currentColor` / CSS custom properties that inherit from the widget container's theme.

---

### C4. Cancel booking button has no accessible label

**File:** `src/components/calendar/booking-history.tsx`

The cancel button renders only an `<X>` icon with no text, `aria-label`, or `title`. Screen readers will announce it as an empty button.

**Recommendation:** Add `aria-label={`Cancel booking for ${booking.attendee_name}`}` to the Button.

---

## Major Issues

### M2. Booking history has no pagination

**File:** `src/components/calendar/booking-history.tsx`

All bookings are rendered in a flat list. For active chatbots this could easily reach hundreds of entries, causing performance degradation and an unusable scroll experience.

**Recommendation:** Add pagination or virtual scrolling. Show 10-20 bookings per page with load-more or page controls.

---

### M3. Business hours checkboxes and filter pills lack focus styles

**Files:** `src/components/calendar/business-hours-editor.tsx`, `src/components/calendar/booking-history.tsx`

The raw `<input type="checkbox">` and filter `<button>` elements use custom styling but no visible focus ring for keyboard navigation.

**Recommendation:** Add `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2` to filter buttons. For checkboxes, either use the app's Checkbox UI component or add explicit focus styles.

---

### M4. Select dropdowns are raw HTML, inconsistent with app's Input component

**Files:** `src/components/calendar/business-hours-editor.tsx`, `src/components/calendar/event-type-config.tsx`

The app uses a consistent `Input` component from `@/components/ui/input`, but all `<select>` elements use raw HTML with manually duplicated Tailwind classes.

**Recommendation:** Create a shared `Select` UI component that matches Input's styling.

---

### M5. Timezone selector is an unsearchable dropdown with 400+ options

**File:** `src/components/calendar/event-type-config.tsx`

`Intl.supportedValuesOf('timeZone')` produces hundreds of timezone strings in a native `<select>`.

**Recommendation:** Replace with a searchable combobox/autocomplete. Group by region for faster scanning.

---

### M6. "Copy Monday to weekdays" fails silently when Monday is not configured

**File:** `src/components/calendar/business-hours-editor.tsx`

If the `value` array does not contain a Monday entry, the function returns silently with no feedback.

**Recommendation:** Show a brief toast "Monday hours copied to Tue-Fri" on success. If Monday is not found or is disabled, show an informative message.

---

### M7. Two-column grid form breaks on mobile

**File:** `src/components/calendar/event-type-config.tsx`

`grid-cols-2` is used without a responsive breakpoint.

**Recommendation:** Change to `grid-cols-1 sm:grid-cols-2 gap-4` for all grid instances.

---

### M8. Widget time slot buttons have no keyboard focus styles

**File:** `src/components/widget/calendar-slots.tsx`

Inline styles define hover behavior via `onMouseEnter`/`onMouseLeave`, but there is no equivalent for keyboard focus.

**Recommendation:** Add `onFocus`/`onBlur` handlers that mirror the hover effect.

---

## Minor Issues

### m1. Inconsistent loading state patterns

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx`

The loading skeleton is generic. Other dashboard pages show skeleton shapes that match their actual content layout.

**Recommendation:** Match skeleton shapes to the actual page layout.

---

### m2. "Copy Monday to all weekdays" link looks like plain text

**File:** `src/components/calendar/business-hours-editor.tsx`

The action uses `text-xs text-primary-600 hover:underline`, which is styled as a text link but performs an action.

**Recommendation:** Use `Button variant="link" size="sm"` or add a small icon.

---

### m3. Booking status filter does not show counts

**File:** `src/components/calendar/booking-history.tsx`

The filter pills show statuses without indicating how many bookings are in each status.

**Recommendation:** Append counts: "Confirmed (3)", "Pending (1)".

---

### m5. ICS file uses hardcoded "Appointment" as summary

**File:** `src/components/widget/booking-confirmation.tsx`

`SUMMARY:Appointment` ignores the configured event type title.

**Recommendation:** Pass the event type title through the `BookingResponse` type and use it in the ICS summary.

---

### m6. Number inputs accept non-numeric characters via paste

**File:** `src/components/calendar/event-type-config.tsx`

`type="number"` inputs allow pasting text like "abc" which results in NaN.

**Recommendation:** Add an `onBlur` handler that clamps to min/max and falls back to the default value if NaN.

---

### m7. No empty state when all bookings are filtered out

**File:** `src/components/calendar/booking-history.tsx`

When a user selects a filter status that has zero matches, the list renders nothing.

**Recommendation:** Add an empty state: "No {status} bookings found."

---

### m9. Event type description should use a textarea, not an Input

**File:** `src/components/calendar/event-type-config.tsx`

Descriptions can be multi-sentence but the single-line Input constrains visible content.

**Recommendation:** Replace with a `<textarea>` or multi-line Input variant, 2-3 rows.

---

### m10. Date tabs in widget can overflow without scroll indicator

**File:** `src/components/widget/calendar-slots.tsx`

`overflowX: 'auto'` enables scrolling but provides no visual cue that more dates exist off-screen.

**Recommendation:** Add fade/gradient edges or left/right arrow indicators when content overflows.

---

## Information Architecture Notes

The Calendar tab placement in `ChatbotSubNav` is reasonable -- it sits in the configuration zone before deployment, which matches the mental model of "set up, then go live."

The page itself follows a logical top-down flow: status -> Easy!Appointments config -> appointment settings -> availability -> history. One gap: there is no onboarding guidance or stepper for first-time setup. A new user sees all sections simultaneously without knowing the sequence.

**Recommendation:** Consider a guided first-run state that collapses unconfigured sections and highlights the next step, or add step numbers/progress to the card headers.
