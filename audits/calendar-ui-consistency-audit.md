# Calendar UI Consistency Audit

Date: 2026-03-28

---

## AUDIT 1: Add/Edit Service vs Add/Edit Provider Pattern Consistency

### Current State

#### Service Manager (`service-manager.tsx`)

| Action       | Pattern        | Details |
|-------------|----------------|---------|
| Add Service  | **Inline form** | Clicking "Add Service" toggles `showAddForm` state. A dashed-border `<div>` expands below the service list with the form fields inline on the page. Cancel collapses it. |
| Edit Service | **Dialog**      | Clicking the pencil icon opens a `<Dialog>` modal with the same form fields rendered by the shared `renderFormFields()` function. |
| Delete Service | **Dialog**    | Confirmation dialog. Consistent with Provider delete. |

#### Provider Manager (`provider-manager.tsx`)

| Action         | Pattern    | Details |
|---------------|------------|---------|
| Add Provider   | **Dialog** | Clicking "Add Provider" opens a `<Dialog>` with `max-w-2xl max-h-[90vh] overflow-y-auto`. Form is rendered inside the dialog. |
| Edit Provider  | **Dialog** | Clicking the pencil icon opens an identical dialog structure with the same `renderFormFields()` output. |
| Delete Provider | **Dialog** | Confirmation dialog. Consistent with Service delete. |

### Analysis

**The inconsistency**: Add Service uses an inline expanding form, while Edit Service, Add Provider, and Edit Provider all use dialogs. This means the same entity (Service) uses two different interaction patterns for the same category of action (creating vs editing).

**Field count comparison**:

| Form         | Fields |
|-------------|--------|
| Service      | 5 fields: name, duration (select), price, currency, description (textarea) |
| Provider     | 9+ fields: first name, last name, email, phone, services (multi-checkbox with price overrides), username, password, business hours editor (7-day schedule) |

**UX principles to consider**:

1. **Internal consistency** (Nielsen Heuristic #4): Within the same page, the same type of action (CRUD on a list item) should follow the same pattern. Currently, "Add" uses two different patterns depending on which entity you are adding. This forces users to learn two mental models on one screen.

2. **Form complexity and vertical space**: The service form is relatively compact (5 fields). An inline form works well here because it does not push the page content excessively and the user can see the list context above. The provider form is substantially more complex (personal details, multi-select with nested price overrides, credentials, 7-day business hours grid). Inline would cause significant page displacement.

3. **Context preservation**: Inline forms let the user see the existing list while filling out the new entry. This is valuable for short forms where the user might reference existing items. For providers, the form is tall enough that the list would scroll out of view anyway, negating this benefit.

4. **Progressive disclosure / focus**: Dialogs create a focused task space, reducing distraction. For a complex form with many required fields and validation, a dialog helps the user concentrate. For a 5-field form, a dialog adds unnecessary ceremony (open, interact, close) when an inline expansion is faster.

### Recommendation

**Make Add Service and Edit Service both use inline forms. Keep Add Provider and Edit Provider as dialogs.**

Rationale:

- The service form is simple enough that inline editing is the superior pattern. It is faster (no modal open/close), preserves page context, and feels lightweight for a form with only 5 fields.
- Converting Edit Service from a dialog to an inline form (expanding in place of the service row, or replacing the row with the edit form) creates consistency within the Service section: both Add and Edit happen inline.
- The provider form is too complex for inline. The business hours editor alone takes significant vertical space, plus the multi-checkbox service selector with price overrides. A dialog is the correct pattern here, and both Add and Edit already use it consistently.
- This creates a deliberate, explainable pattern: "simple forms are inline, complex forms are dialogs" rather than the current arbitrary split of "add is inline, edit is dialog" for the same entity.

**Implementation specifics**:

1. Remove the Edit Service `<Dialog>` and instead render the edit form inline, replacing the service row being edited. When the user clicks the pencil icon on a service, that row transforms into the edit form (same `renderFormFields` output currently used). Cancel reverts to the display row.
2. Only one form should be open at a time: if Add is open and the user clicks Edit on a row, close Add and open Edit in-place (and vice versa).
3. Keep the dashed-border visual treatment for the Add form. Use a solid subtle border (matching the row style) for the Edit form to differentiate "new" from "modifying existing."
4. No changes needed to Provider Manager -- its dialog pattern is already consistent for both Add and Edit.

**Alternative considered and rejected**: Making everything a dialog. This would be consistent, but adds friction to the simple service form for no benefit. The "Add Service" inline form is actually the better UX for that context; the problem was only that Edit did not match it.

---

## AUDIT 2: SDK UI Settings Theme Variables Usage

### Design System Architecture

The application has a comprehensive theming system:

1. **CSS custom properties (variables)** defined on `:root` and toggled by the `ColorOverridesProvider`. Key variables include:
   - `--form-element-bg` -- background color for form inputs, selects, textareas
   - `--card-bg`, `--card-border`, `--card-gradient-from`, `--card-gradient-to` -- card theming
   - `--primary-button-bg`, `--primary-button-hover-bg` -- button theming
   - `--secondary-button-bg`, `--secondary-button-hover-bg` -- outline button theming
   - `--select-option-bg`, `--select-option-text`, etc. -- select dropdown option theming
   - Full primary/secondary color scales (`--primary-50` through `--primary-950`)

2. **Shared UI components** that consume these variables via inline `style` props:
   - `<Input>` -- applies `style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}`
   - `<Textarea>` -- applies `style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}`
   - `<Select>` -- applies `style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}` plus option-level theming via CSS attribute selectors
   - `<Button>` -- applies `--primary-button-bg` / `--secondary-button-bg` with hover states
   - `<Card>` -- applies `--card-bg`, `--card-border`, `--card-gradient-*` via MutationObserver

### Calendar Component Findings

#### Components that correctly use the design system

| Component | `<Button>` | `<Input>` | `<Card>` | `<Label>` | `<Badge>` | `<Dialog>` | `<Tooltip>` |
|-----------|-----------|-----------|----------|-----------|-----------|------------|-------------|
| calendar/page.tsx | Yes | -- | Yes | -- | Yes | -- | Yes |
| connection-status.tsx | Yes | -- | -- | -- | Yes | Yes | Yes |
| service-manager.tsx | Yes | Yes | -- | Yes | Yes | Yes | Yes |
| provider-manager.tsx | Yes | Yes | -- | Yes | Yes | Yes | Yes |
| business-hours-editor.tsx | -- | -- | -- | Yes | -- | -- | Yes |
| event-type-config.tsx | -- | Yes | -- | Yes | Yes | -- | -- |
| booking-history.tsx | Yes | Yes | -- | -- | Yes | -- | Yes |
| date-overrides-manager.tsx | Yes | Yes | Yes | Yes | -- | Yes | Yes |
| holidays-manager.tsx | Yes | Yes | Yes | Yes | -- | Yes | Yes |
| sticky-save-bar.tsx | Yes | -- | -- | -- | -- | -- | Yes |

#### Components that bypass the design system

**Problem 1: Raw `<select>` elements with hardcoded `selectClasses` string**

Five calendar components define a local `selectClasses` constant with hardcoded Tailwind classes instead of using the shared `<Select>` component:

| File | Line | `selectClasses` definition |
|------|------|---------------------------|
| `service-manager.tsx` | L24-25 | `'w-full border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 bg-white dark:bg-secondary-900 ...'` |
| `provider-manager.tsx` | L31-32 | Same as above |
| `business-hours-editor.tsx` | L17 | Similar, slightly different sizing (`px-2 py-1.5`) |
| `event-type-config.tsx` | L12 | Same as service-manager |
| `date-overrides-manager.tsx` | L27 | Same as business-hours-editor |

These raw `<select>` elements hardcode `bg-white dark:bg-secondary-900` instead of using `rgb(var(--form-element-bg))`. This means:
- When a user customizes the `--form-element-bg` theme variable via the SDK Settings/Customize page, `<Input>` and `<Textarea>` backgrounds update, but `<select>` elements remain white/dark-900.
- The select option styling (`--select-option-bg`, `--select-option-hover-bg`, etc.) defined in the `<Select>` component is completely absent.
- No `appearance-none` or custom chevron icon, unlike the shared `<Select>` which renders a `<ChevronDown>` icon.

**Instances of raw `<select>` usage** (not using `<Select>` component):

| Component | Purpose | Count |
|-----------|---------|-------|
| `service-manager.tsx` | Active Service selector, Duration dropdown | 3 (1 active service, 2 inside `renderFormFields`) |
| `provider-manager.tsx` | Active Provider selector | 1 |
| `business-hours-editor.tsx` | Start/end time selectors per day | 14 (2 per enabled day) |
| `event-type-config.tsx` | Duration dropdown | 1 |
| `date-overrides-manager.tsx` | Start/end time selectors, MultiSelect trigger | 2 + custom multi-select |

**Total: ~21 raw `<select>` elements across the calendar page that bypass the theme system.**

**Problem 2: Raw `<textarea>` elements with hardcoded `textareaClasses` string**

| File | Line | Context |
|------|------|---------|
| `service-manager.tsx` | L27-28, L264-271 | `textareaClasses` constant, used for Description field in `renderFormFields()` |
| `event-type-config.tsx` | L138-144 | Inline hardcoded textarea classes for Description field |

These hardcode `bg-white dark:bg-secondary-900` instead of using `rgb(var(--form-element-bg))` from the shared `<Textarea>` component.

**Total: 2 raw `<textarea>` elements that bypass the theme system.**

**Problem 3: Raw `<input type="checkbox">` elements**

| File | Line | Context |
|------|------|---------|
| `business-hours-editor.tsx` | L87-92 | Day enable/disable toggle |
| `provider-manager.tsx` | L469-473 | Service multi-select checkboxes |
| `date-overrides-manager.tsx` | L357-362 | "Closed all day" checkbox |

These use hardcoded Tailwind classes (`border-secondary-300 text-primary-600 focus:ring-primary-500`). There is no shared `<Checkbox>` component in the UI library, so this is a design system gap rather than a bypass. However, the checkbox styling does reference the Tailwind color tokens (which map to the CSS variables via the Tailwind config), so these are partially theme-aware. The concern is minor.

**Problem 4: Raw `<input type="date">` elements**

| File | Line | Context |
|------|------|---------|
| `booking-history.tsx` | L112-117, L121-126 | From/To date filters |

These use fully hardcoded classes: `border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900`. They do not use the `<Input>` component or reference `--form-element-bg`. When the theme is customized, these date inputs will have a white background while `<Input>` elements beside them use the themed background.

**Problem 5: Custom `MultiSelect` component in `date-overrides-manager.tsx`**

The `MultiSelect` dropdown (lines 55-149) builds its own select-like trigger and dropdown panel using raw `<button>` and `<div>` elements with the same hardcoded `selectClasses`. The dropdown panel uses `bg-white dark:bg-secondary-900` and hover states with `hover:bg-secondary-50 dark:hover:bg-secondary-800`. None of these reference the theme variables.

**Problem 6: Custom timezone autocomplete in `event-type-config.tsx`**

The timezone dropdown (lines 241-269) builds a custom listbox with hardcoded colors: `bg-white dark:bg-secondary-900`, `bg-primary-100 dark:bg-primary-900/30`, `bg-secondary-100 dark:bg-secondary-800`. While these use Tailwind tokens that map to CSS variables, the dropdown container background (`bg-white dark:bg-secondary-900`) does not use `--form-element-bg`.

### Severity Assessment

| Issue | Severity | Impact |
|-------|----------|--------|
| Raw `<select>` bypassing `--form-element-bg` | **High** | 21 elements will have wrong background when theme is customized. Most visible inconsistency. |
| Raw `<textarea>` bypassing `--form-element-bg` | **Medium** | 2 elements with wrong background. Same root cause as select. |
| Raw `<input type="date">` bypassing `--form-element-bg` | **Medium** | 2 elements in booking history. Visible when filtering. |
| Custom `MultiSelect` not themed | **Low** | Only appears in date overrides form. Less commonly used. |
| Custom timezone dropdown not themed | **Low** | Only appears in event type config. Single instance. |
| Raw checkboxes | **Low** | No shared Checkbox component exists. Tailwind tokens provide partial theme awareness. |

### Recommendations

**Priority 1 -- Replace raw `<select>` with `<Select>` component (or make them theme-aware)**

The shared `<Select>` component has a different API: it takes an `options` prop as `{ value: string; label: string }[]` and renders `<option>` elements internally. The calendar components use raw `<select>` with `<option>` children directly.

Two approaches:

**Option A (preferred): Migrate to `<Select>` component.**
Replace all raw `<select>` + `<option>` blocks with the `<Select>` component. This requires converting the `<option>` children into the `options` prop format, which is straightforward since all calendar selects already have simple value/label pairs.

For cases where the `<Select>` component's API is limiting (e.g., the business hours time selectors need a compact size variant), extend `<Select>` to accept a `size` prop rather than duplicating styles.

**Option B (quick fix): Replace `bg-white dark:bg-secondary-900` with inline style.**
Add `style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}` to each raw `<select>`. This is less clean but faster and preserves the current HTML structure. Delete the `selectClasses` constants entirely and use the `<Select>` component's class pattern.

**Priority 2 -- Replace raw `<textarea>` with `<Textarea>` component**

The shared `<Textarea>` component accepts standard textarea props. Direct swap: replace `<textarea className={textareaClasses} ...>` with `<Textarea ...>`. Remove the `textareaClasses` constant.

Affected files:
- `service-manager.tsx` line 264: swap `<textarea ... className={textareaClasses}>` with `<Textarea>`
- `event-type-config.tsx` line 138: swap raw `<textarea>` with `<Textarea>`

**Priority 3 -- Fix date inputs in booking-history.tsx**

Replace the 2 raw `<input type="date">` elements (lines 112-117, 121-126) with the `<Input>` component, which already handles `type="date"` and applies `--form-element-bg`.

**Priority 4 -- Theme the custom MultiSelect and timezone autocomplete**

For the `MultiSelect` in `date-overrides-manager.tsx`: add `style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}` to both the trigger button and the dropdown panel `<div>`.

For the timezone autocomplete in `event-type-config.tsx`: add the same inline style to the `<ul>` dropdown container.

**Priority 5 -- Create a shared Checkbox component (future)**

This is a design system gap, not a calendar-specific issue. When a shared `<Checkbox>` component is created, migrate the 3 calendar checkbox instances to use it.

### Summary Table

| What to fix | Files affected | Estimated changes |
|------------|----------------|-------------------|
| Raw `<select>` -> `<Select>` | 5 files | ~21 element replacements, delete 5 `selectClasses` constants |
| Raw `<textarea>` -> `<Textarea>` | 2 files | 2 element replacements, delete 1 `textareaClasses` constant |
| Raw date `<input>` -> `<Input>` | 1 file | 2 element replacements |
| Theme custom dropdowns | 2 files | 2 inline style additions |
| Shared Checkbox (future) | 3 files | Create component + 3 migrations |
