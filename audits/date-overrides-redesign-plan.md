# Date Overrides Redesign Plan

## Problem Statement

The Date Overrides section on the Scheduling tab requires a provider to be selected, but the provider selector lives on the Services & Providers tab. Users see a warning "Select a provider on the Services & Providers tab" and must navigate away, select a provider, then navigate back. This is a broken flow -- the user loses context and may not even understand what "provider" means in this context.

Additionally, date overrides are currently only written to the Easy!Appointments provider's `workingPlanExceptions` via the EA API. They are not persisted as part of the chatbot's own calendar config, meaning they are invisible to the local save flow (StickySaveBar dirty tracking) and would be lost if the EA connection is reconfigured.

## UX Analysis of Current State

### What works
- The add/edit/delete override interaction is solid: inline form with date picker, start/end time selects, "closed all day" toggle, sorted list with past-date dimming.
- Delete has a confirmation dialog.
- Normal business hours comparison shown per override (`Normally closed` / `Normal hours: 09:00 - 17:00`).

### What is broken
1. **Cross-tab dependency**: The Date Overrides card renders a warning and blocks all interaction when `selectedProviderId` is empty. The only way to set it is on another tab.
2. **No local persistence**: Overrides write directly to the EA API (`PUT /api/calendar/providers/:id/working-plan-exceptions`). They are not included in the chatbot's calendar config JSON or in the `POST /api/calendar/setup` save payload. If the user switches providers or disconnects EA, all override data is effectively orphaned.
3. **Provider coupling**: The component cannot function without both a provider AND an active EA connection. This is over-constrained -- a user should be able to plan their schedule overrides before the EA connection is fully wired up.

---

## Design Decisions

### 1. Dual-layer storage: local config + EA sync

Date overrides will be stored in two places:

- **Primary (local)**: As a `dateOverrides` array on the chatbot's calendar integration config, persisted via `POST /api/calendar/setup` alongside `businessHours` and `eventType`. This is the source of truth the UI reads and writes.
- **Secondary (sync)**: When saving, if a provider is selected and EA is connected, the overrides are also pushed to the EA provider's `workingPlanExceptions`. This keeps EA in sync but is not required for the UI to function.

This means date overrides work regardless of EA connection state. They are part of the chatbot config, just like business hours.

### 2. Inline provider selector

Instead of requiring users to go to the Services & Providers tab, add a compact provider dropdown directly inside the Date Overrides card header area. This dropdown serves a different purpose than the "Active Provider" selector on tab 1:

- **Tab 1 Active Provider**: Determines which provider handles bookings for this chatbot. Saved to integration config.
- **Date Overrides provider dropdown**: Determines which EA provider's schedule gets synced with the local overrides. Optional -- if no provider is selected or EA is disconnected, overrides still save locally.

The dropdown should:
- Default to the already-selected `selectedProviderId` from the page state
- Show provider names from the `providers` array
- Include an "-- No EA sync --" option (empty value)
- Be visually compact, sitting in the card header next to the "Add Override" button
- Show a subtle info indicator explaining that selecting a provider will also update their EA schedule

### 3. Form integrated with StickySaveBar dirty tracking

Currently, overrides bypass the page's save flow entirely (they POST directly to the EA API on each add/delete). The redesign changes this:

- Adding/deleting an override modifies local state (`dateOverrides` array), which marks the form as dirty via the existing `initialStateRef` / `currentState` comparison.
- The user saves all changes at once via the StickySaveBar "Save Changes" button.
- On save, the API handler persists overrides to the DB and optionally syncs to EA.

This is consistent with how business hours and event type config already work -- edit locally, save once.

### 4. Optimistic local list, sync indicator for EA

The override list renders from local state immediately. If a provider is selected and EA sync is active, show a small sync status indicator:
- Green dot / "Synced" when local overrides match what EA has
- Amber dot / "Pending sync" when local changes have not yet been saved

This is low-priority polish and can be deferred to a follow-up.

---

## Component Changes

### `date-overrides-manager.tsx` -- Major rewrite

**Props change:**

```typescript
// Before
interface DateOverridesManagerProps {
  providers: { id: number; firstName: string; lastName: string }[];
  selectedProviderId: string;
  connectionState: EAConnectionState;
  businessHours: BusinessHoursEntry[];
  onNavigateToProviders?: () => void;
}

// After
interface DateOverridesManagerProps {
  providers: { id: number; firstName: string; lastName: string }[];
  selectedProviderId: string;       // page-level selected provider (default for dropdown)
  connectionState: EAConnectionState;
  businessHours: BusinessHoursEntry[];
  value: DateOverrideEntry[];       // NEW: controlled state from parent
  onChange: (overrides: DateOverrideEntry[]) => void;  // NEW: notify parent of changes
}
```

**Key changes:**

1. Remove all direct API calls (`fetch` to `/api/calendar/providers/:id/working-plan-exceptions`). The component becomes a pure controlled form.
2. Remove `onNavigateToProviders` prop -- no longer needed.
3. Remove the "not_configured" early return that blocks the entire card. Date overrides now work without EA.
4. Add inline provider dropdown in the card header for optional EA sync targeting.
5. `handleAdd` pushes to the local `value` array via `onChange`. `handleDelete` filters it out.
6. The "no provider selected" warning is removed entirely. Replace with a subtle note: "Overrides are saved with your calendar config. Select a provider to also sync to Easy!Appointments."

**New local type:**

```typescript
interface DateOverrideEntry {
  date: string;           // "YYYY-MM-DD"
  startTime: string;      // "09:00"
  endTime: string;        // "17:00"
  isClosed: boolean;
  label?: string;         // optional label like "Early close" or "Holiday hours"
}
```

This is simpler than the EA `EAWorkingPlanDay` type (no breaks array) and maps cleanly to both local storage and EA sync.

**Layout sketch:**

```
+-------------------------------------------------------+
| Date Overrides [?]                                     |
| Set custom hours for specific dates.                   |
|                                                        |
| EA Provider: [dropdown v]      [+ Add Override]        |
|                                                        |
| (inline add form when open)                            |
| Date: [____]  [ ] Closed all day                       |
| Start: [09:00]  End: [17:00]                           |
| Label: [optional_________]                             |
| [Add Override]  [Cancel]                               |
|                                                        |
| Mon, Apr 7, 2026    09:00 - 13:00   "Easter Monday"   |
|   Normal hours: 09:00 - 17:00               [trash]   |
|                                                        |
| Fri, Apr 18, 2026   Closed          "Good Friday"     |
|   Normally closed                            [trash]   |
+-------------------------------------------------------+
```

The provider dropdown sits on the same line as "Add Override", left-aligned. It uses the same `selectClasses` styling as other selects in the codebase. When EA is not configured, the dropdown is hidden and a note says overrides are local-only.

### `calendar/page.tsx` -- State + save flow changes

**New state:**

```typescript
const [dateOverrides, setDateOverrides] = useState<DateOverrideEntry[]>([]);
```

**Dirty tracking update:**

Add `dateOverrides` to the `currentState` JSON:

```typescript
const currentState = JSON.stringify({
  selectedServiceId,
  selectedProviderId,
  eventTypeConfig,
  businessHours,
  dateOverrides,   // NEW
});
```

**fetchData update:**

Read `dateOverrides` from the setup API response:

```typescript
if (d?.dateOverrides) setDateOverrides(d.dateOverrides);
```

**handleSave update:**

Include overrides in the save payload:

```typescript
body: JSON.stringify({
  chatbotId,
  eventType: eventTypeConfig,
  businessHours,
  dateOverrides,           // NEW
  serviceId: selectedServiceId || undefined,
  providerId: selectedProviderId || undefined,
}),
```

**DateOverridesManager usage:**

```tsx
<DateOverridesManager
  providers={providers}
  selectedProviderId={selectedProviderId}
  connectionState={connectionState}
  businessHours={businessHours}
  value={dateOverrides}
  onChange={setDateOverrides}
/>
```

Remove `onNavigateToProviders` prop.

### `calendar/types.ts` -- New type

Add `DateOverrideEntry` alongside the existing `DateOverride` type:

```typescript
export interface DateOverrideEntry {
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm" -- null when isClosed
  endTime: string;    // "HH:mm" -- null when isClosed
  isClosed: boolean;
  label?: string;
}
```

Note: The existing `DateOverride` type (line 326-333) is close but uses nullable `start`/`end` and includes a `breaks` array. The new type is deliberately simpler for the local config use case. Keep the existing `DateOverride` type for backward compatibility with any code that references it.

---

## API / Data Model Changes

### `POST /api/calendar/setup` -- Accept + persist overrides

**Schema update:**

```typescript
const dateOverrideSchema = z.array(z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isClosed: z.boolean(),
  label: z.string().max(100).optional(),
}));

const setupSchema = z.object({
  chatbotId: z.string().uuid(),
  eventType: eventTypeSchema,
  businessHours: businessHoursSchema,
  dateOverrides: dateOverrideSchema.optional().default([]),  // NEW
  serviceId: z.string().optional(),
  providerId: z.string().optional(),
});
```

**Persistence -- two options:**

**Option A (recommended): Store in integration config JSON**

The `calendar_integrations.config` column is already a JSONB blob storing `service_id` and `provider_id`. Add `date_overrides` to it:

```typescript
config: {
  service_id: input.serviceId || null,
  provider_id: input.providerId || null,
  date_overrides: input.dateOverrides,  // NEW
}
```

Pros: No schema migration needed. Date overrides are a natural part of the integration config.
Cons: No relational querying on individual overrides (not needed for this use case).

**Option B: New `calendar_date_overrides` table**

```sql
create table calendar_date_overrides (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid references calendar_integrations(id) on delete cascade,
  override_date date not null,
  start_time time,
  end_time time,
  is_closed boolean default false,
  label text,
  created_at timestamptz default now(),
  unique(integration_id, override_date)
);
```

Pros: Relational, queryable, proper constraints.
Cons: Requires a migration. Adds complexity for a feature that will rarely have more than ~30 entries.

**Recommendation: Option A.** Store in the config JSONB column. The data is small, always loaded/saved as a unit with the rest of the config, and does not need to be independently queried.

**EA sync on save:**

After persisting locally, if `input.providerId` is set and EA is connected, convert `DateOverrideEntry[]` to EA's `workingPlanExceptions` format and push via `ea.setWorkingPlanExceptions()`:

```typescript
if (input.providerId && input.dateOverrides.length > 0) {
  const eaExceptions: Record<string, EAWorkingPlanDay | null> = {};
  for (const override of input.dateOverrides) {
    eaExceptions[override.date] = override.isClosed
      ? null
      : { start: override.startTime, end: override.endTime, breaks: [] };
  }
  try {
    await ea.setWorkingPlanExceptions(Number(input.providerId), eaExceptions);
  } catch (err) {
    console.error('[Calendar Setup] EA sync for date overrides failed:', err);
    // Non-fatal: local config is already saved
  }
}
```

### `GET /api/calendar/setup` -- Return overrides

Read `date_overrides` from the integration config and return in the response:

```typescript
return successResponse({
  eventType: ...,
  businessHours: ...,
  dateOverrides: (config.date_overrides as DateOverrideEntry[]) || [],  // NEW
  serviceId: config.service_id || null,
  providerId: config.provider_id || null,
  services,
  providers,
  connectionState,
});
```

---

## Step-by-Step Implementation Tasks

### Phase 1: Types + API (backend-first)

1. **Add `DateOverrideEntry` type to `src/lib/calendar/types.ts`**
   - Add the interface.
   - Export it.

2. **Update `POST /api/calendar/setup` route**
   - Add `dateOverrides` to the zod schema (optional, defaults to `[]`).
   - Store `date_overrides` in the integration config JSONB.
   - After local save, sync to EA if provider is selected (non-fatal on failure).

3. **Update `GET /api/calendar/setup` route**
   - Read `date_overrides` from config and include in the response payload.

### Phase 2: Page state + wiring

4. **Update `calendar/page.tsx`**
   - Add `dateOverrides` state with `useState<DateOverrideEntry[]>([])`.
   - Add `dateOverrides` to `currentState` for dirty tracking.
   - Read `dateOverrides` from `fetchData` response.
   - Include `dateOverrides` in `handleSave` POST body.
   - Pass `value` + `onChange` to `DateOverridesManager`.
   - Remove `onNavigateToProviders` prop from `DateOverridesManager`.

### Phase 3: Component rewrite

5. **Rewrite `date-overrides-manager.tsx`**
   - Change to controlled component: accept `value` + `onChange` props.
   - Remove all direct `fetch` calls.
   - Remove `onNavigateToProviders` prop and the cross-tab warning.
   - Remove the `not_configured` early return that blocks the entire card.
   - Add inline provider dropdown in the card header (local state, display-only -- the actual EA sync happens at save time via the API).
   - `handleAdd`: validate, push new entry to `value` via `onChange([...value, newEntry])`.
   - `handleDelete`: filter entry from `value` via `onChange(value.filter(...))`.
   - Keep the delete confirmation dialog.
   - Add optional `label` field to the add form.
   - Show EA sync note when a provider is selected: "Changes will also sync to {providerName}'s Easy!Appointments schedule when saved."
   - Show local-only note when no provider: "Overrides are saved with your chatbot config."

### Phase 4: Cleanup

6. **Evaluate the working-plan-exceptions API route**
   - The `GET /PUT /DELETE` routes at `/api/calendar/providers/[id]/working-plan-exceptions` are still valid for direct EA interaction (e.g., the provider-manager edit dialog might use them).
   - No deletion needed, but the date-overrides-manager no longer calls them directly.

7. **Test the full flow**
   - Add override without EA connected -- should save locally, appear in list, persist across page reload.
   - Add override with EA connected and provider selected -- should save locally AND sync to EA.
   - Edit business hours + add override in same session -- StickySaveBar shows "Unsaved changes", single Save commits both.
   - Delete override -- marks dirty, save persists deletion.
   - Switch providers on tab 1 -- date overrides on tab 2 should still show (they are chatbot-level, not provider-level).

---

## Edge Cases

### Override date conflicts
- User adds an override for a date that already exists in the array. The `handleAdd` function should check for duplicates and show an error toast (same behavior as today).

### Past dates
- Overrides with past dates should be dimmed but not auto-deleted. The user may want to keep historical records. A future enhancement could auto-prune past overrides on save.

### Provider changes
- If the user switches the active provider on tab 1, the date overrides remain the same (they belong to the chatbot, not the provider). The inline EA sync dropdown in the Date Overrides card can be independently set to target a different provider for sync purposes, but this is optional.

### EA sync failures
- If the EA sync fails during save, the local config is still persisted. Show a warning toast: "Calendar settings saved, but failed to sync overrides to Easy!Appointments." The user can retry by saving again.

### EA disconnection
- If EA is later disconnected, the local overrides remain intact. They are part of the chatbot config and will be re-synced whenever EA is reconnected and a provider is selected.

### Max overrides
- No hard limit, but the JSONB column has practical limits. Consider a soft cap of 365 entries (one year) with a warning if exceeded. This is a low-priority concern.

### Override with no time (closed all day)
- `isClosed: true` with `startTime` and `endTime` set to empty strings or a sentinel value like `"00:00"`. The display logic should show "Closed" instead of a time range. The EA sync maps this to `null` (EA's representation of a closed day).

### Label display
- Labels are optional. When present, show them inline after the time range in a muted style. When absent, show nothing extra. Labels are local-only -- EA does not have a label field for working plan exceptions.
