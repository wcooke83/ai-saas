# Calendar Services & Providers: Add/Edit Form Consistency Audit

**Date:** 2026-03-28
**Scope:** Visual language consistency across all 4 CRUD forms on the Services & Providers tab
**Files:**
- `src/components/calendar/service-manager.tsx`
- `src/components/calendar/provider-manager.tsx`


## 1. Current State: Form-by-Form Documentation

### 1A. Add Service (inline form, service-manager.tsx lines 425-445)

**Interaction pattern:** Inline. Clicking "Add Service" button replaces the button with an inline form. Cancel collapses back to button.

**Container styling:**
```
p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-900 space-y-4
```
- `p-4` padding
- `border-2 border-dashed` -- dashed double-width border
- `border-secondary-300 dark:border-secondary-600` -- gray border color
- `bg-white dark:bg-secondary-900` -- solid white/dark background
- No form heading or description text

**Form fields:** Rendered via shared `renderFormFields()` (lines 214-277):
- Fields wrapped in `space-y-4`
- Labels use `<Label>` component directly (no tooltip wrappers)
- Inputs use `className="mt-1"` gap between label and input
- Price/Currency in `grid grid-cols-2 gap-3`
- Description uses `<Textarea>` with `rows={3}`

**Buttons (lines 428-444):**
```
<div className="flex justify-end gap-2">
  <Button variant="outline" size="sm" ... >Cancel</Button>
  <Button size="sm" ... >Create</Button>
</div>
```
- Both buttons are `size="sm"`
- Right-aligned via `justify-end`
- `gap-2` between buttons
- Primary action text: "Create"

**Open/close:** Toggle boolean `showAddForm`. Cancel resets form state and hides.

---

### 1B. Edit Service (inline form, service-manager.tsx lines 339-358)

**Interaction pattern:** Inline. Clicking pencil icon on a service row replaces that row with an inline edit form. Cancel restores the row.

**Container styling:**
```
p-4 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-secondary-900 space-y-4
```
- `p-4` padding (same as Add)
- `border` -- single-width solid border (DIFFERENT from Add's `border-2 border-dashed`)
- `border-primary-200 dark:border-primary-700` -- blue/primary border color (DIFFERENT from Add's secondary/gray)
- `bg-white dark:bg-secondary-900` -- same background as Add
- No form heading or description text

**Form fields:** Same `renderFormFields()` -- identical to Add Service.

**Buttons (lines 344-357):**
```
<div className="flex justify-end gap-2">
  <Button variant="outline" size="sm" ... >Cancel</Button>
  <Button size="sm" ... >Save</Button>
</div>
```
- Both buttons are `size="sm"` (same as Add)
- Right-aligned (same as Add)
- Primary action text: "Save" (vs Add's "Create")

**Open/close:** Sets `editingServiceId` to the service's ID. Cancel sets it to null.

---

### 1C. Add Provider (dialog, provider-manager.tsx lines 730-755)

**Interaction pattern:** Dialog. Clicking "Add Provider" button opens a modal dialog.

**Container styling:**
```
DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"
```
- DialogContent provides `p-6` padding (from dialog.tsx line 147)
- `rounded-xl border shadow-xl` from DialogContent base
- Background from CSS variable `--modal-bg`
- Border from CSS variable `--modal-border`
- Has DialogHeader with title "Add Provider" and description "Create a new staff member who can accept bookings."

**Form fields:** Rendered via shared `renderFormFields()` (lines 384-579), wrapped in `<div className="mt-4">`:
- Fields wrapped in `space-y-4` (same as service forms)
- Labels use `<Label>` component (same)
- Inputs use `className="mt-1"` (same)
- Several fields use `<InfoTooltip>` alongside the Label, wrapped in `<div className="flex items-center gap-1.5">`
- First/Last name in `grid grid-cols-2 gap-3` (same grid pattern as service Price/Currency)
- Username/Password in `grid grid-cols-2 gap-3`
- Services section has a scrollable checkbox list with `max-h-64 overflow-y-auto border rounded-md p-3`
- Business hours rendered via `<BusinessHoursEditor>`

**Buttons (lines 741-754):**
```
DialogFooter className="mt-6"
  <Button variant="outline" ... >Cancel</Button>
  <Button ... >Create</Button>
```
- Buttons are DEFAULT size (no `size="sm"`) -- DIFFERENT from service forms
- Right-aligned via DialogFooter's `sm:justify-end`
- `sm:space-x-2` gap from DialogFooter (vs `gap-2` in service forms)
- `mt-6` top margin on footer (service forms have no explicit margin, rely on parent `space-y-4`)
- Primary action text: "Create"

**Open/close:** Dialog `open` prop tied to `showAddDialog` boolean. Cancel calls `setShowAddDialog(false)`.

---

### 1D. Edit Provider (dialog, provider-manager.tsx lines 757-777)

**Interaction pattern:** Dialog. Clicking pencil icon opens a modal dialog.

**Container styling:** Same as Add Provider -- `max-w-2xl max-h-[90vh] overflow-y-auto`.

**Form fields:** Same `renderFormFields()` with `isEdit=true`:
- Password label shows "(optional)" suffix
- Password placeholder shows "Leave blank to keep current"
- Otherwise identical to Add Provider

**Buttons (lines 766-776):**
```
DialogFooter className="mt-6"
  <Button variant="outline" ... >Cancel</Button>
  <Button ... >Save</Button>
```
- Default size (same as Add Provider, DIFFERENT from service forms)
- Primary action text: "Save"

**Open/close:** Dialog `open` tied to `editProvider !== null`. Cancel sets `editProvider` to null.

---

## 2. Inconsistencies Found

### CRITICAL: Button sizes differ between inline and dialog forms

| Form | Cancel size | Primary size |
|------|-------------|-------------|
| Add Service (inline) | `sm` | `sm` |
| Edit Service (inline) | `sm` | `sm` |
| Add Provider (dialog) | default | default |
| Edit Provider (dialog) | default | default |

The service forms use `size="sm"` (h-9, text-xs) while provider dialogs use default size (h-10, text-sm). This creates a visible difference in button height and text size if a user interacts with both forms in the same session.

**Verdict:** The dialog context justifies slightly larger buttons (more room, modal is a "heavier" interaction), but the current gap is too large. Both should standardize.

### MAJOR: Add Service vs Edit Service container borders are inconsistent

- **Add Service:** `border-2 border-dashed border-secondary-300` -- thick dashed gray border
- **Edit Service:** `border border-primary-200` -- thin solid blue/primary border

These are the same type of interaction (inline form replacing content in the list area) but use completely different border treatments. The Add form's dashed border signals "placeholder/empty state" which is appropriate, but the edit form's primary-colored solid border creates a visual language mismatch between two sibling forms.

### MINOR: No heading/context on inline service forms

Provider dialogs have a clear `DialogTitle` ("Add Provider" / "Edit Provider") and `DialogDescription`. The inline service forms have no heading at all -- the user is expected to understand from context that the form that appeared is for adding or editing. This works because the forms are simple and contextually obvious (they appear where the button/row was), but adding a small heading would improve parity.

### MINOR: Footer spacing differs

- Service inline forms: buttons are part of the `space-y-4` flow, so they get 16px top margin from the parent
- Provider dialog forms: `DialogFooter` has explicit `mt-6` (24px) and `sm:space-x-2` gap between buttons vs `gap-2`

### OBSERVATION: Label-to-tooltip wrapping pattern differs

- Service forms: Labels are bare `<Label>` elements, no tooltips on any field
- Provider forms: Some fields wrap Label + InfoTooltip in `<div className="flex items-center gap-1.5">`, others use bare `<Label>`

This is not necessarily an inconsistency to fix (services have fewer fields and simpler concepts that don't need tooltips), but worth noting that if tooltips are ever added to service fields, they should use the same `flex items-center gap-1.5` wrapper pattern.

---

## 3. Recommendations

### R1. Standardize button sizes across all 4 forms

**Change:** Use `size="sm"` consistently for inline forms and default size for dialogs. The current split is actually correct in principle -- dialog buttons should be slightly larger to match the modal's visual weight. No changes needed here.

**However**, verify the button text is consistent:
- Add actions should always say "Create"
- Edit actions should always say "Save"

**Current state:** Already consistent. "Create" for adds, "Save" for edits across all 4 forms. No change needed.

### R2. Unify inline form container borders (service-manager.tsx)

Make Edit Service's container border match Add Service's visual language, but use a solid border to differentiate "editing existing" from "creating new."

**File:** `src/components/calendar/service-manager.tsx`
**Location:** Line 341, the Edit Service inline form container

**Current:**
```tsx
className="p-4 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-secondary-900 space-y-4"
```

**Recommended change:**
```tsx
className="p-4 rounded-lg border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-secondary-900 space-y-4"
```

**Rationale:** Both inline forms now use `border-2` for consistent visual weight. Add Service keeps `border-dashed border-secondary-300` (dashed gray = "new, empty placeholder"). Edit Service uses `border-2 border-primary-200` (solid primary = "active editing of existing item"). The difference in dashed vs solid and gray vs primary correctly signals the semantic difference, but the border width is now consistent.

### R3. Add lightweight headings to inline service forms (service-manager.tsx)

Add a small heading to both inline service forms so users have explicit context, matching the provider dialog pattern of title + description.

**File:** `src/components/calendar/service-manager.tsx`

**Add Service form -- add heading inside the container (after line 426, before `renderFormFields`):**

Add this as the first child inside the `<div className="p-4 rounded-lg ...">` for the Add form:
```tsx
<p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">New Service</p>
```

**Edit Service form -- add heading inside the container (after line 341, before `renderFormFields`):**

Add this as the first child inside the `<div className="p-4 rounded-lg ...">` for the Edit form:
```tsx
<p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Edit Service</p>
```

**Rationale:** These are lightweight single-line headings (not full DialogHeader/DialogTitle weight) that match the inline form's lighter visual treatment. They provide the same "what am I doing" context that the provider dialogs provide via DialogTitle, without being visually heavy.

### R4. Normalize footer spacing for inline forms (service-manager.tsx)

The inline forms use `space-y-4` on the parent, which gives the button row 16px of top spacing. The dialog forms use `mt-6` (24px). For inline forms, 16px is fine -- the forms are compact. But add a subtle top separator to visually distinguish the action area from the form fields.

**File:** `src/components/calendar/service-manager.tsx`

**Both button rows (lines 344 and 428):**

**Current:**
```tsx
<div className="flex justify-end gap-2">
```

**Recommended change:**
```tsx
<div className="flex justify-end gap-2 pt-2 border-t border-secondary-100 dark:border-secondary-800">
```

**Rationale:** Adds a light separator line and an extra 8px of padding above the buttons, visually grouping them as a "footer" separate from the form fields. This mirrors the visual separation that DialogFooter provides in the provider dialogs (where the modal structure itself creates separation). The border color is intentionally very subtle (`secondary-100`/`secondary-800`) so it does not compete with the form container border.

### R5. Keep dialog button size as default (no change needed)

Provider dialog buttons are already correctly using default size. Dialog modals have more visual weight and space; the larger buttons are proportionally correct. The service inline form buttons at `size="sm"` are also correct for their compact inline context. This is an intentional, context-appropriate difference -- not an inconsistency.

### R6. Ensure consistent gap between buttons

**File:** `src/components/calendar/service-manager.tsx` -- uses `gap-2` (8px)
**File:** `src/components/calendar/provider-manager.tsx` -- uses `sm:space-x-2` (8px) via DialogFooter

These are effectively the same spacing (8px). No change needed.

---

## 4. Summary Table

| Property | Add Service (inline) | Edit Service (inline) | Add Provider (dialog) | Edit Provider (dialog) | Consistent? |
|---|---|---|---|---|---|
| Container padding | `p-4` | `p-4` | `p-6` (dialog) | `p-6` (dialog) | Yes (context-appropriate) |
| Border width | `border-2` | `border` | `border` (dialog) | `border` (dialog) | NO -- fix Edit to `border-2` |
| Border style | dashed | solid | solid (dialog) | solid (dialog) | Yes (intentional) |
| Border color | secondary-300 | primary-200 | CSS var | CSS var | Yes (intentional) |
| Background | white/900 | white/900 | CSS var | CSS var | Yes (context-appropriate) |
| Field spacing | `space-y-4` | `space-y-4` | `space-y-4` | `space-y-4` | Yes |
| Label-input gap | `mt-1` | `mt-1` | `mt-1` | `mt-1` | Yes |
| Grid gaps | `gap-3` | `gap-3` | `gap-3` | `gap-3` | Yes |
| Button size | `sm` | `sm` | default | default | Yes (context-appropriate) |
| Button alignment | `justify-end` | `justify-end` | `sm:justify-end` | `sm:justify-end` | Yes |
| Button gap | `gap-2` | `gap-2` | `space-x-2` | `space-x-2` | Yes (same 8px) |
| Cancel text | "Cancel" | "Cancel" | "Cancel" | "Cancel" | Yes |
| Primary text | "Create" | "Save" | "Create" | "Save" | Yes |
| Form heading | none | none | DialogTitle | DialogTitle | NO -- add lightweight headings |
| Footer separator | none | none | implicit (dialog) | implicit (dialog) | NO -- add border-t to inline |

---

## 5. Implementation Checklist

1. **[service-manager.tsx, line 341]** Change Edit Service container from `border` to `border-2`
2. **[service-manager.tsx, after line 341]** Add `<p>` heading "Edit Service" inside Edit form container
3. **[service-manager.tsx, after line 426]** Add `<p>` heading "New Service" inside Add form container
4. **[service-manager.tsx, line 344]** Add `pt-2 border-t border-secondary-100 dark:border-secondary-800` to Edit form button row
5. **[service-manager.tsx, line 428]** Add `pt-2 border-t border-secondary-100 dark:border-secondary-800` to Add form button row

All changes are confined to `service-manager.tsx`. The provider dialog forms need no changes -- they are already visually consistent with each other and appropriately styled for their dialog context.
