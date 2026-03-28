# Plan: Per-Service/Provider Scoping for Business Hours & Holidays

## Goal

Add optional `serviceIds` and `providerIds` scoping to **Business Hours** and **Holidays & Blocked Dates**, matching the existing pattern used by **Date Overrides** (`DateOverrideEntry.serviceIds/providerIds`).

---

## Current State

| Feature | Storage | Scoping |
|---------|---------|---------|
| Business Hours | `calendar_business_hours` table (7 rows per integration) | Global only |
| Holidays | EA `blocked_periods` API (system-wide) | Global only |
| Date Overrides | `calendar_integrations.config.date_overrides` (JSON) | Per-service/provider via `serviceIds[]` + `providerIds[]` |

---

## Design Decisions

### Business Hours: Move to JSON config (like Date Overrides)

**Why:** The `calendar_business_hours` table stores one set of 7 rows per integration. Adding scoping means multiple sets of business hours for the same integration (e.g., "Service A has Mon-Fri 9-5, Service B has Mon-Sat 8-8"). This is awkward in a relational table with a unique constraint on `(integration_id, day_of_week)`.

**Approach:** Store business hours sets in `calendar_integrations.config.business_hours_sets` as an array, each set having optional `serviceIds`/`providerIds`. Keep the existing `calendar_business_hours` table as the "global default" (the set with no scoping), and add the scoped sets in config JSON.

**Alternative considered:** Adding `scope_id` + `service_ids`/`provider_ids` columns to the table. Rejected because it over-complicates the schema and the JSON approach is already proven with date overrides.

### Holidays: Move to local config (like Date Overrides)

**Why:** EA `blocked_periods` are system-wide with no scoping mechanism. To support per-service/provider holidays, we need local storage where we can attach scope metadata.

**Approach:** Store scoped holidays in `calendar_integrations.config.holidays` as an array of `HolidayEntry` objects, each with optional `serviceIds`/`providerIds`. The EA `blocked_periods` API remains as the sync target for holidays that apply to all providers.

---

## Data Model Changes

### New Types (`src/lib/calendar/types.ts`)

```typescript
// Scoped business hours set
interface BusinessHoursSet {
  id: string;                    // UUID for identification
  label?: string;                // e.g. "Massage Therapy Hours"
  hours: BusinessHoursEntry[];   // 7 entries, same structure as today
  serviceIds?: string[];         // optional, undefined = all services
  providerIds?: string[];        // optional, undefined = all providers
}

// Scoped holiday entry (local config)
interface HolidayEntry {
  date: string;                  // "YYYY-MM-DD"
  label?: string;                // e.g. "Christmas Day"
  serviceIds?: string[];         // optional, undefined = all services
  providerIds?: string[];        // optional, undefined = all providers
}
```

### Config Schema Update (`EasyAppointmentsConfig`)

```typescript
interface EasyAppointmentsConfig {
  service_id?: string;
  provider_id?: string;
  provider_service_prices?: ProviderServicePriceOverrides;
  date_overrides?: DateOverrideEntry[];
  // NEW:
  business_hours_sets?: BusinessHoursSet[];   // scoped overrides on top of global
  holidays?: HolidayEntry[];                  // scoped holidays
}
```

### Key Functions

```typescript
// Duplicate detection for business hours sets (same pattern as overrideKey)
function businessHoursSetKey(set: { serviceIds?: string[]; providerIds?: string[] }): string {
  const sIds = (set.serviceIds || []).sort().join(',');
  const pIds = (set.providerIds || []).sort().join(',');
  return `${sIds}|${pIds}`;
}

// Duplicate detection for holidays
function holidayKey(h: { date: string; serviceIds?: string[]; providerIds?: string[] }): string {
  const sIds = (h.serviceIds || []).sort().join(',');
  const pIds = (h.providerIds || []).sort().join(',');
  return `${h.date}|${sIds}|${pIds}`;
}
```

---

## Resolution Logic

When determining availability, the system needs to resolve which business hours and holidays apply for a given service + provider combination. The resolution order is:

1. **Date Override** (most specific, already exists) - wins if matching scope
2. **Holiday** (new) - blocks the date if matching scope
3. **Scoped Business Hours Set** (new) - uses if scope matches
4. **Global Business Hours** (existing) - fallback default

**Matching rule:** A scoped entry applies if:
- `serviceIds` is empty/undefined (= all services), OR the requested service is in `serviceIds`
- AND `providerIds` is empty/undefined (= all providers), OR the requested provider is in `providerIds`

**Conflict resolution (most specific scope wins):**
1. Entry scoped to both specific service AND specific provider
2. Entry scoped to specific service only (all providers)
3. Entry scoped to specific provider only (all services)
4. Entry with no scoping (global default)

---

## File Changes

### 1. Types (`src/lib/calendar/types.ts`)

- Add `BusinessHoursSet` interface
- Add `HolidayEntry` interface
- Update `EasyAppointmentsConfig` to include `business_hours_sets` and `holidays`
- Add `businessHoursSetKey()` and `holidayKey()` helper functions

### 2. Business Hours Editor (`src/components/calendar/business-hours-editor.tsx`)

**Current:** Simple 7-row grid, no scoping UI.

**Change:** Add a "scope" concept. The component becomes a list of business hours "sets":
- The first set is always the **Global Default** (no scoping, cannot be deleted)
- Additional sets can be added with service/provider scoping via the same `MultiSelect` component used in Date Overrides
- Each set is a collapsible card showing its scope label and the 7-day grid

**New props:**
```typescript
interface BusinessHoursEditorProps {
  globalHours: BusinessHoursEntry[];           // existing global default
  onGlobalChange: (hours: BusinessHoursEntry[]) => void;
  scopedSets: BusinessHoursSet[];              // NEW: scoped overrides
  onScopedSetsChange: (sets: BusinessHoursSet[]) => void;
  services: { id: number; name: string }[];    // for MultiSelect
  providers: { id: number; firstName: string; lastName: string; services: number[] }[];
}
```

**UI layout:**
```
[Business Hours]
├─ Global Default (Mon-Fri 9-5)          [cannot delete]
│  └─ 7-day grid (existing UI)
├─ + Add Scoped Hours                     [button]
├─ "Massage Therapy" — Provider: Jane     [collapsible, deletable]
│  └─ 7-day grid + scope selectors
└─ "Consultation" — All providers         [collapsible, deletable]
   └─ 7-day grid + scope selectors
```

### 3. Holidays Manager (`src/components/calendar/holidays-manager.tsx`)

**Current:** Fetches EA `blocked_periods`, creates/deletes via API. No scoping. System-wide.

**Change:** Dual mode:
- **Global holidays** (no scope): Continue using EA `blocked_periods` API as today
- **Scoped holidays**: Stored locally in config, managed via parent state (like date overrides)

**New props:**
```typescript
interface HolidaysManagerProps {
  connectionState: EAConnectionState;
  services: { id: number; name: string }[];
  providers: { id: number; firstName: string; lastName: string; services: number[] }[];
  scopedHolidays: HolidayEntry[];
  onScopedHolidaysChange: (holidays: HolidayEntry[]) => void;
}
```

**UI layout:**
```
[Holidays & Blocked Dates]
├─ Global (all services & providers)      [section header]
│  ├─ Dec 25, 2026 — Christmas Day       [from EA blocked_periods, as today]
│  └─ + Add Blocked Date                  [existing form]
├─ Scoped                                 [section header]
│  ├─ Dec 24, 2026 — Early Close (Massage only, Provider: Jane)
│  ├─ Jan 2, 2027 — Staff Training (All services, Provider: Bob)
│  └─ + Add Scoped Holiday               [form with date + scope selectors]
└─ Note: "Global holidays apply to all. Scoped holidays apply only to selected services/providers."
```

**Add Scoped Holiday form:** Reuse the same pattern as Date Overrides form:
- Date picker
- Label (optional)
- Services multi-select
- Providers multi-select (filtered by selected services)
- At least one scope must be selected (otherwise use global)

### 4. Calendar Page (`src/app/(authenticated)/dashboard/chatbots/[id]/calendar/page.tsx`)

**State additions:**
```typescript
const [businessHoursSets, setBusinessHoursSets] = useState<BusinessHoursSet[]>([]);
const [scopedHolidays, setScopedHolidays] = useState<HolidayEntry[]>([]);
```

**Dirty tracking:** Add `businessHoursSets` and `scopedHolidays` to the `currentState` JSON.

**Data loading (fetchData):** Read `business_hours_sets` and `holidays` from `setupData.data`.

**Save (handleSave):** Send `businessHoursSets` and `scopedHolidays` in the POST body.

**Component wiring:**
```tsx
<BusinessHoursEditor
  globalHours={businessHours}
  onGlobalChange={setBusinessHours}
  scopedSets={businessHoursSets}
  onScopedSetsChange={setBusinessHoursSets}
  services={services}
  providers={providers}
/>

<HolidaysManager
  connectionState={connectionState}
  services={services}
  providers={providers}
  scopedHolidays={scopedHolidays}
  onScopedHolidaysChange={setScopedHolidays}
/>
```

### 5. Setup API (`src/app/api/calendar/setup/route.ts`)

**GET handler:**
- Return `businessHoursSets` and `holidays` from `integration.config`

**POST handler:**
- Accept `businessHoursSets` and `scopedHolidays` in the request schema
- Store in `calendar_integrations.config`
- **EA sync for business hours:** For each scoped business hours set that targets specific providers, update those providers' `workingPlan` in EA. For global hours, sync to all providers (existing behavior).
- **EA sync for holidays:** For scoped holidays targeting specific providers, add as `working_plan_exceptions` on those providers. For global holidays, continue using `blocked_periods` API.

**Validation schema additions:**
```typescript
const businessHoursSetSchema = z.array(z.object({
  id: z.string(),
  label: z.string().max(100).optional(),
  hours: businessHoursSchema,
  serviceIds: z.array(z.string()).optional(),
  providerIds: z.array(z.string()).optional(),
})).optional().default([]);

const holidaySchema = z.array(z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  label: z.string().max(100).optional(),
  serviceIds: z.array(z.string()).optional(),
  providerIds: z.array(z.string()).optional(),
})).optional().default([]);
```

### 6. Calendar Service (`src/lib/calendar/service.ts`)

**getAvailability:** When checking availability for a specific service+provider:
1. Load scoped business hours sets and holidays from integration config
2. Resolve which business hours apply (scoped > global)
3. Check if any holiday blocks the requested date
4. Apply before querying EA (or use to filter EA results)

This is the most complex change — the resolution logic needs to correctly layer scoped hours/holidays on top of global defaults.

### 7. MultiSelect Extraction

Extract the `MultiSelect` component from `date-overrides-manager.tsx` into a shared component at `src/components/ui/multi-select.tsx` so it can be reused by:
- Date Overrides Manager (existing)
- Business Hours Editor (new)
- Holidays Manager (new)

---

## Implementation Order

1. **Extract MultiSelect** to shared component
2. **Types** — add new interfaces and helper functions
3. **Business Hours Editor** — add scoped sets UI
4. **Holidays Manager** — add scoped holidays UI
5. **Calendar Page** — wire new state + props
6. **Setup API** — accept/return/store new fields + EA sync
7. **Calendar Service** — resolution logic for scoped hours/holidays
8. **Testing** — manual testing of all scope combinations

---

## Migration / Backwards Compatibility

- Existing integrations have no `business_hours_sets` or `holidays` in config — treated as empty arrays (global-only, same as today)
- Global business hours remain in `calendar_business_hours` table — no migration needed
- EA `blocked_periods` continue to work for global holidays — no breaking change
- No database migration required — all new data stored in existing `config` JSONB column

---

## Edge Cases

1. **Deleted service/provider referenced in scope:** Display "Unknown service" / "Unknown provider" in UI (same as Date Overrides). On save, silently preserve the ID — it may be re-created.
2. **Provider not linked to a scoped service:** Filter provider list by selected services (same as Date Overrides).
3. **Overlapping scopes:** Most specific scope wins (both service + provider > service only > provider only > global).
4. **No scoped set matches:** Fall back to global business hours.
5. **Scoped holiday + date override on same date/scope:** Date override wins (it has time information; holiday is all-day closed).
