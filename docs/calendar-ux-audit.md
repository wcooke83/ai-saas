# Calendar Booking Feature -- UX Audit

## Summary

The calendar booking feature is functionally complete but has significant accessibility gaps, several inconsistencies with standard UI patterns, and edge cases that could confuse or block users. Below are all findings organized by severity.

---

## Critical Issues

### C1. No confirmation dialog on destructive actions

**Files:** `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx` (lines 121-134), `src/components/calendar/booking-history.tsx` (lines 104-113)

Both "Disconnect" and booking cancel actions execute immediately with no confirmation. Disconnecting a calendar provider could break active chatbot booking flows for end users. Cancelling a confirmed booking sends a real cancellation to the attendee.

**Recommendation:** Add a confirmation dialog (AlertDialog from your UI library) for both actions. The disconnect dialog should warn that existing bookings may be affected. The cancel dialog should show the attendee name and date being cancelled.

---

### C2. Business hours editor allows invalid time ranges

**File:** `src/components/calendar/business-hours-editor.tsx` (lines 69-86)

Users can set end time earlier than start time (e.g., start 17:00, end 09:00) with no validation or error feedback. This silently creates broken availability that would result in zero bookable slots.

**Recommendation:** Validate that endTime > startTime on change. Either filter the end-time dropdown to only show times after the selected start time, or show an inline error message. Also validate on save in `handleSaveHosted`.

---

### C3. Widget components use hardcoded light-mode colors

**Files:** `src/components/widget/calendar-slots.tsx` (lines 50-53, 101), `src/components/widget/booking-confirmation.tsx` (lines 84, 89)

`color: '#64748b'`, `color: '#0f172a'`, `color: '#334155'`, `color: '#94a3b8'` are all hardcoded. If the chat widget is embedded on a dark-background page, text will be unreadable.

**Recommendation:** Accept a `textColor` or `theme` prop, or use `currentColor` / CSS custom properties that inherit from the widget container's theme.

---

### C4. Cancel booking button has no accessible label

**File:** `src/components/calendar/booking-history.tsx` (lines 105-112)

The cancel button renders only an `<X>` icon with no text, `aria-label`, or `title`. Screen readers will announce it as an empty button.

**Recommendation:** Add `aria-label={`Cancel booking for ${booking.attendee_name}`}` to the Button.

---

## Major Issues

### M1. Provider selection does not prevent switching when already connected

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx` (lines 219-231)

When a user has an active integration (e.g., hosted_calcom), they can freely click another provider card, which immediately shows that provider's configuration form. This creates a confusing split state where ConnectionStatus shows "Connected to Hosted Calendar" but the form below asks them to connect Cal.com.

**Recommendation:** Either disable other provider cards while connected (with a tooltip "Disconnect current provider first"), or show a warning/confirmation when switching.

---

### M2. Booking history has no pagination

**File:** `src/components/calendar/booking-history.tsx`

All bookings are rendered in a flat list. For active chatbots this could easily reach hundreds of entries, causing performance degradation and an unusable scroll experience.

**Recommendation:** Add pagination or virtual scrolling. Show 10-20 bookings per page with load-more or page controls.

---

### M3. Business hours checkboxes and filter pills lack focus styles

**Files:** `src/components/calendar/business-hours-editor.tsx` (line 58-62), `src/components/calendar/booking-history.tsx` (lines 43-56)

The raw `<input type="checkbox">` and filter `<button>` elements use custom styling but no visible focus ring for keyboard navigation. The filter pills use no `focus:` or `focus-visible:` class.

**Recommendation:** Add `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2` to filter buttons. For checkboxes, either use the app's Checkbox UI component for consistency or add explicit focus styles.

---

### M4. Select dropdowns are raw HTML, inconsistent with app's Input component

**Files:** `src/components/calendar/business-hours-editor.tsx` (lines 71-85), `src/components/calendar/event-type-config.tsx` (lines 34-43, 114-123)

The app uses a consistent `Input` component from `@/components/ui/input`, but all `<select>` elements use raw HTML with manually duplicated Tailwind classes. They look slightly different from the Input fields (different padding, border color tokens).

**Recommendation:** Create a shared `Select` UI component (or use an existing one from your design system) that matches Input's styling. This also ensures consistent focus states and dark mode behavior.

---

### M5. Timezone selector is an unsearchable dropdown with 400+ options

**File:** `src/components/calendar/event-type-config.tsx` (lines 112-124)

`Intl.supportedValuesOf('timeZone')` produces hundreds of timezone strings rendered in a native `<select>`. Finding a timezone requires scrolling through a massive list.

**Recommendation:** Replace with a searchable combobox/autocomplete. Group by region (America, Europe, Asia, etc.) for faster scanning.

---

### M6. "Copy Monday to weekdays" fails silently when Monday is not configured

**File:** `src/components/calendar/business-hours-editor.tsx` (lines 26-36)

If the `value` array does not contain a Monday entry (dayOfWeek === 1), the function returns silently with no feedback. Even when Monday exists, there is no toast or visual indication that the copy happened.

**Recommendation:** Show a brief toast "Monday hours copied to Tue-Fri" on success. If Monday is not found or is disabled, show an informative message.

---

### M7. Two-column grid form breaks on mobile

**File:** `src/components/calendar/event-type-config.tsx` (lines 21, 58, 85)

`grid-cols-2` is used without a responsive breakpoint. On narrow screens, form fields will be cramped. Other dashboard forms in this app likely use `sm:grid-cols-2` or stack on mobile.

**Recommendation:** Change to `grid-cols-1 sm:grid-cols-2 gap-4` for all three grid instances.

---

### M8. Widget time slot buttons have no keyboard focus styles

**File:** `src/components/widget/calendar-slots.tsx` (lines 70-96)

Inline styles define hover behavior via `onMouseEnter`/`onMouseLeave`, but there is no equivalent for keyboard focus. Tab-navigating users get no visual indication of which slot is focused.

**Recommendation:** Add `onFocus`/`onBlur` handlers that mirror the hover effect. Better yet, use CSS `:focus-visible` via a class or styled approach rather than inline JS event handlers.

---

## Minor Issues

### m1. Inconsistent loading state patterns

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx` (lines 179-193)

The loading skeleton is generic (a rectangle and a bar). Other dashboard pages likely show skeleton shapes that match their actual content layout (cards, form fields). The current skeleton does not hint at what will load, reducing perceived performance.

**Recommendation:** Match skeleton shapes to the actual page layout: a provider selector card row, a form card, and a table placeholder.

---

### m2. "Copy Monday to all weekdays" link looks like plain text

**File:** `src/components/calendar/business-hours-editor.tsx` (lines 42-48)

The action uses `text-xs text-primary-600 hover:underline`, which is styled as a text link. Since it performs an action (not navigation), it should look like a small button or at minimum have a clear affordance.

**Recommendation:** Use `Button variant="link" size="sm"` or add a small icon (e.g., Copy icon) to make the action more discoverable.

---

### m3. Booking status filter does not show counts

**File:** `src/components/calendar/booking-history.tsx` (lines 42-57)

The filter pills show "all", "confirmed", "pending", etc. without indicating how many bookings are in each status. Users must click through to discover if a filter has results.

**Recommendation:** Append counts: "Confirmed (3)", "Pending (1)". Hide statuses with zero bookings, or dim them.

---

### m4. Provider selector cards lack ARIA roles

**File:** `src/components/calendar/provider-selector.tsx` (lines 34-64)

These function as radio buttons but are rendered as generic `<button>` elements. Screen readers cannot convey the "one of three selected" semantics.

**Recommendation:** Use `role="radiogroup"` on the container, `role="radio"` and `aria-checked` on each button.

---

### m5. ICS file uses hardcoded "Appointment" as summary

**File:** `src/components/widget/booking-confirmation.tsx` (line 20)

`SUMMARY:Appointment` ignores the configured event type title. If the user configured "Consultation" or "Demo Call", the calendar event will still say "Appointment".

**Recommendation:** Pass the event type title through the `BookingResponse` type and use it in the ICS summary.

---

### m6. Number inputs accept non-numeric characters via paste

**File:** `src/components/calendar/event-type-config.tsx` (lines 61-109)

`type="number"` inputs allow pasting text like "abc" which results in NaN being passed to the state via `Number(e.target.value)`.

**Recommendation:** Add an `onBlur` handler that clamps to min/max and falls back to the default value if NaN.

---

### m7. No empty state when all bookings are filtered out

**File:** `src/components/calendar/booking-history.tsx` (lines 59-116)

When a user selects a filter status that has zero matches, the list simply renders nothing -- a blank space with no message.

**Recommendation:** Add an empty state for filtered results: "No {status} bookings found."

---

### m8. Cal.com connect form does not mask/reveal API key

**File:** `src/components/calendar/calcom-connect-form.tsx` (lines 58-66)

The API key field is `type="password"` with no toggle to reveal. Users cannot verify what they pasted, which is a common source of connection failures.

**Recommendation:** Add a show/hide toggle icon inside the input field.

---

### m9. Event type description should use a textarea, not an Input

**File:** `src/components/calendar/event-type-config.tsx` (lines 47-56)

Descriptions can be multi-sentence but the single-line Input constrains visible content and makes longer text hard to review.

**Recommendation:** Replace with a `<textarea>` or multi-line Input variant, 2-3 rows.

---

### m10. Date tabs in widget can overflow without scroll indicator

**File:** `src/components/widget/calendar-slots.tsx` (line 36)

`overflowX: 'auto'` enables scrolling but provides no visual cue that more dates exist off-screen. In a small chat widget, this is easy to miss.

**Recommendation:** Add fade/gradient edges or left/right arrow indicators when content overflows.

---

## Information Architecture Notes

The Calendar tab placement in `ChatbotSubNav` (position 5 of 6 in primary nav, between Customize and Deploy) is reasonable. It sits in the configuration zone before deployment, which matches the mental model of "set up, then go live."

The page itself follows a logical top-down flow: status -> provider -> config -> history. One gap: there is no onboarding guidance or stepper for first-time setup. A new user sees all sections simultaneously without knowing the sequence (pick provider first, then configure, then save).

**Recommendation:** Consider a guided first-run state that collapses unconfigured sections and highlights the next step, or add step numbers/progress to the card headers.
