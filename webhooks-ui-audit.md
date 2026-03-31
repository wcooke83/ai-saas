# Webhooks Page UI/UX Audit

**File audited:** `src/app/(authenticated)/dashboard/webhooks/page.tsx`
**Related files:** `src/app/api/webhooks/route.ts`, `src/app/api/webhooks/[id]/route.ts`, `src/lib/sdk/webhook.ts`
**Compared against:** `src/app/(authenticated)/dashboard/api-keys/page.tsx` (nearest comparable page)

---

## Executive Summary

The webhooks page is functional and structurally sound but has several gaps relative to the adjacent API Keys page, which sets a higher bar for the same design patterns. The most impactful issues are: (1) a native `confirm()` dialog for a destructive action where a `ConfirmDialog` component already exists and is used elsewhere; (2) no spinner or meaningful feedback during the loading state of toggle/delete actions; (3) a dismiss button (`×`) on the secret banner that is inaccessible at smaller viewport widths because it has no tap target sizing; (4) the "Cancel" toggle on the Add Webhook button uses `ChevronUp` as a proxy for cancel, which is semantically confusing; and (5) there is no developer documentation section comparable to the API Keys page's "Using Your API Key" card, leaving users with no guidance on how to implement signature verification.

Severity counts: High 3 · Medium 7 · Low 5

---

## 1. Interaction Patterns

### 1.1 — Destructive confirmation uses native `confirm()` [HIGH]

**File:** `page.tsx` line 139
**Issue:** `handleDelete` calls `window.confirm(...)`. The codebase already has a fully-featured `ConfirmDialog` / `useConfirmDialog` hook at `src/components/ui/confirm-dialog.tsx` used elsewhere. The native dialog cannot be styled, blocks the main thread, looks inconsistent, and is completely inaccessible to screen readers in many browsers.

**Fix:** Replace with the shared component.
```tsx
// At top of component, alongside other state:
const { confirm: confirmDelete, ConfirmDialog: DeleteConfirmDialog } = useConfirmDialog({
  title: 'Delete webhook?',
  description: 'This cannot be undone. The endpoint will stop receiving events immediately.',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger',
});

// In handleDelete — remove the native confirm call:
const handleDelete = async (id: string) => {
  const confirmed = await confirmDelete();
  if (!confirmed) return;
  // ... rest unchanged
};

// In JSX, render the dialog (e.g. just before the closing </div>):
<DeleteConfirmDialog />
```

---

### 1.2 — Toggle/delete loading state uses bare ellipsis `'…'` [MEDIUM]

**File:** `page.tsx` lines 371–375, 383–388
**Issue:** While toggling or deleting, the button label is replaced with `'…'`. The API Keys page uses a CSS spinner (`border-2 border-X border-t-transparent rounded-full animate-spin`), which is both more accessible (no ambiguous content) and visually consistent with the rest of the dashboard. The `'…'` character also shrinks the button unexpectedly due to its narrow width.

**Fix:**
```tsx
// Replace the '…' in both buttons:
{togglingId === wh.id ? (
  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
) : (
  wh.is_active ? 'Disable' : 'Enable'
)}

// For delete:
{deletingId === wh.id ? (
  <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
) : (
  <Trash2 className="w-4 h-4" />
)}
```

---

### 1.3 — Cancel button uses `ChevronUp` which implies collapse, not cancel [MEDIUM]

**File:** `page.tsx` lines 175–178
**Issue:** The "Add Webhook" button toggles to show "Cancel" with a `ChevronUp` icon. `ChevronUp` implies a collapsible accordion panel, not cancellation. The API Keys page uses a dedicated `X` icon from lucide for close/cancel actions.

**Fix:**
```tsx
import { Plus, X, ... } from 'lucide-react'; // add X, remove ChevronDown/ChevronUp

// Replace the button:
<Button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
  {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
  {showForm ? 'Cancel' : 'Add Webhook'}
</Button>
```

---

### 1.4 — Dismiss button on secret banner has no minimum touch target [MEDIUM]

**File:** `page.tsx` lines 212–219
**Issue:** The `×` dismiss button is a `<button>` with only `text-lg leading-none` sizing. On touch devices the tap target is ~18×18 px, well below the WCAG 2.5.5 recommended 44×44 px minimum. The button also uses the HTML entity `&times;` as its label text rather than an icon, making it visually inconsistent.

**Fix:**
```tsx
import { X } from 'lucide-react'; // already imported in the icon block

<button
  type="button"
  onClick={() => setNewSecret(null)}
  className="flex items-center justify-center w-8 h-8 rounded-md text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-shrink-0"
  aria-label="Dismiss"
>
  <X className="w-4 h-4" />
</button>
```

---

## 2. Form UX

### 2.1 — Form has no `autoFocus` on the URL input [LOW]

**File:** `page.tsx` line 235
**Issue:** When the form expands, focus remains on the "Add Webhook" button. The API Keys page adds `autoFocus` to the first field of its create form. Without this, keyboard users must tab into the form manually.

**Fix:** Add `autoFocus` to the URL `<Input>`.

---

### 2.2 — Event checkbox area has no `Select All / Clear All` control [LOW]

**File:** `page.tsx` lines 251–273
**Issue:** There are 17 webhook events. Selecting all requires 17 individual clicks. There is no affordance to select or clear all at once. This is a significant usability issue for power users who want all events or want to reset their selection.

**Fix:** Add a header row above the grid:
```tsx
<div className="flex items-center justify-between mb-1">
  <Label>Events</Label>
  <div className="flex gap-3">
    <button
      type="button"
      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
      onClick={() => setFormEvents(ALL_EVENTS as unknown as string[])}
    >
      Select all
    </button>
    <button
      type="button"
      className="text-xs text-secondary-500 hover:underline"
      onClick={() => setFormEvents([])}
    >
      Clear
    </button>
  </div>
</div>
```

---

### 2.3 — No URL validation feedback before submission [MEDIUM]

**File:** `page.tsx` lines 235–243 and `route.ts` lines 49–57
**Issue:** The API route rejects non-HTTPS URLs with a `400`, but the form only shows the server error via a toast after the round-trip. The hint `"Must be an HTTPS URL."` is present but is static helper text, not a validation state. Users entering `http://` get no instant feedback.

**Fix:** Add inline validation using the browser's native URL parsing:
```tsx
const urlError = useMemo(() => {
  if (!formUrl) return null;
  try {
    const u = new URL(formUrl);
    if (u.protocol !== 'https:') return 'URL must use HTTPS.';
    return null;
  } catch {
    return 'Please enter a valid URL.';
  }
}, [formUrl]);

// On the Input:
<Input
  id="webhook-url"
  type="url"
  placeholder="https://your-server.com/webhook"
  value={formUrl}
  onChange={(e) => setFormUrl(e.target.value)}
  required
  autoFocus
  className={urlError ? 'border-red-400 focus-visible:ring-red-400' : ''}
  aria-describedby="webhook-url-hint webhook-url-error"
/>
{urlError ? (
  <p id="webhook-url-error" className="text-xs text-red-600 dark:text-red-400" role="alert">{urlError}</p>
) : (
  <p id="webhook-url-hint" className="text-xs text-secondary-500">Must be an HTTPS URL.</p>
)}

// Also disable submit when there is a URL error:
<Button type="submit" disabled={submitting || !formUrl.trim() || !!urlError}>
```

---

## 3. Loading States

### 3.1 — Skeleton count is fixed at 2, mismatched with content structure [LOW]

**File:** `page.tsx` lines 298–304
**Issue:** The loading skeleton renders exactly 2 rows regardless of the expected content. Each skeleton row only has two placeholder lines but real rows have 3 content rows (URL + badges, event badges, metadata). The skeleton does not accurately reflect the visual shape of a loaded row.

**Fix:** Add a third placeholder line per skeleton row and match the vertical spacing:
```tsx
{[1, 2, 3].map((i) => (
  <div key={i} className="px-6 py-4 animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-56 bg-secondary-100 dark:bg-secondary-800 rounded" />
          <div className="h-5 w-14 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-20 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
          <div className="h-5 w-24 bg-secondary-100 dark:bg-secondary-800 rounded-full" />
        </div>
        <div className="h-3 w-36 bg-secondary-100 dark:bg-secondary-800 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-16 bg-secondary-100 dark:bg-secondary-800 rounded-md" />
        <div className="h-9 w-9 bg-secondary-100 dark:bg-secondary-800 rounded-md" />
      </div>
    </div>
  </div>
))}
```

---

## 4. Empty State

### 4.1 — Empty state is minimal compared to the API Keys page [MEDIUM]

**File:** `page.tsx` lines 306–317
**Issue:** The empty state renders a bare icon and one line of text. The API Keys page uses a circular icon container, a headline (`<h3>`), a description line, and a CTA button with an icon — providing stronger visual hierarchy and guidance. Webhooks is likely unfamiliar to some users and warrants more explanation at the zero-state.

**Fix:**
```tsx
<div className="px-6 py-16 text-center">
  <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
    <Webhook className="w-6 h-6 text-secondary-400" aria-hidden="true" />
  </div>
  <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No webhooks configured</h3>
  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4 max-w-xs mx-auto">
    Webhooks let you receive HTTP POST notifications when events happen in your chatbots.
  </p>
  <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="gap-2">
    <Plus className="w-4 h-4" />
    Add your first webhook
  </Button>
</div>
```

---

## 5. Missing Developer Documentation Section

### 5.1 — No signature verification documentation [HIGH]

**File:** `page.tsx` (absent)
**Issue:** The API Keys page has a collapsible "Using Your API Key" section with code examples. The webhooks page shows a secret and mentions HMAC-SHA256 in the banner, but once the banner is dismissed there is no persistent documentation anywhere on the page explaining how to verify signatures. Given that incorrect signature verification is a common security pitfall, this is a high-severity usability and security-adjacent issue. The `src/lib/sdk/webhook.ts` file already documents the exact header names (`X-Webhook-Signature`, `X-Webhook-Timestamp`, `X-Webhook-Event`) and the signing algorithm.

**Fix:** Add a collapsible card below the webhook list (matching the pattern in `api-keys/page.tsx`):

```tsx
const [showDocs, setShowDocs] = useState(false);

<Card className="group">
  <CardHeader
    className="cursor-pointer"
    onClick={() => setShowDocs(!showDocs)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-500" />
        <div>
          <CardTitle>Verifying Webhook Signatures</CardTitle>
          <CardDescription>How to validate incoming webhook requests</CardDescription>
        </div>
      </div>
      <ChevronDown className={`w-5 h-5 text-secondary-500 transition-transform duration-200 ${showDocs ? 'rotate-180' : ''}`} />
    </div>
  </CardHeader>
  {showDocs && (
    <CardContent className="space-y-4 pt-0">
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Each request includes three headers. Compute <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">HMAC-SHA256(timestamp + "." + body, secret)</code> and compare against <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">X-Webhook-Signature</code>.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { header: 'X-Webhook-Signature', desc: 'HMAC-SHA256 hex digest' },
          { header: 'X-Webhook-Timestamp', desc: 'Unix epoch seconds' },
          { header: 'X-Webhook-Event', desc: 'Event name e.g. lead.captured' },
        ].map(({ header, desc }) => (
          <div key={header} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-1">
            <code className="text-xs font-mono text-secondary-800 dark:text-secondary-200 break-all">{header}</code>
            <p className="text-xs text-secondary-500">{desc}</p>
          </div>
        ))}
      </div>
    </CardContent>
  )}
</Card>
```

---

## 6. Visual Hierarchy & Typography

### 6.1 — Webhook list card header is redundant when count is zero during load [LOW]

**File:** `page.tsx` lines 291–294
**Issue:** The `CardTitle` inside the list card reads `"Loading…"` while data is fetching. The skeleton rows below already communicate the loading state. "Loading…" as a heading is awkward — it semantically suggests the heading itself is loading rather than the content below it.

**Fix:** Use a neutral heading during load:
```tsx
<CardTitle className="text-base">
  {loading ? 'Webhooks' : `${webhooks.length} Webhook${webhooks.length !== 1 ? 's' : ''}`}
</CardTitle>
```

---

### 6.2 — `max-w-4xl` constraint missing on API Keys page, inconsistency [LOW]

**File:** `page.tsx` line 164
**Issue:** The webhooks page wraps its content in `<div className="max-w-4xl space-y-6">`. The API Keys page uses `<div className="space-y-6">` without a max-width, so the keys list expands to fill available space. On wider viewports this creates a visual inconsistency between the two peer pages. One or the other should be standardized.

**Recommendation:** Align with whichever is the intended dashboard column width. If pages should be constrained, add `max-w-4xl` to API Keys. If unconstrained, remove it from webhooks.

---

## 7. Accessibility

### 7.1 — Event checkboxes lack `aria-describedby` linking to description text [MEDIUM]

**File:** `page.tsx` lines 256–270
**Issue:** Each event has both a `font-mono` event name and a description below it. The native `<input type="checkbox">` is inside a `<label>` so the label text is associated correctly, but the description line (`WEBHOOK_EVENTS[event]`) is a sibling `<span>` not explicitly linked. Screen readers may or may not read the description depending on the browser/AT combination.

**Fix:** Add explicit IDs:
```tsx
<label key={event} htmlFor={`event-${event}`} className="...">
  <input
    id={`event-${event}`}
    type="checkbox"
    aria-describedby={`event-${event}-desc`}
    className="mt-0.5 rounded"
    checked={formEvents.includes(event)}
    onChange={() => toggleEvent(event)}
  />
  <span className="min-w-0">
    <span className="block text-sm font-mono ...">
      {event}
    </span>
    <span id={`event-${event}-desc`} className="block text-xs text-secondary-500 mt-0.5">
      {WEBHOOK_EVENTS[event]}
    </span>
  </span>
</label>
```

---

### 7.2 — Native checkbox styling is unthemed [LOW]

**File:** `page.tsx` line 258
**Issue:** `<input type="checkbox" className="mt-0.5 rounded" />` renders with the browser's default checkbox appearance. In dark mode this is typically a white checkbox on a dark form background, which can appear visually broken. The API Keys page avoids native checkboxes entirely. The Tailwind `accent-*` utility or a custom styled checkbox should be used for consistency.

**Fix:**
```tsx
<input
  type="checkbox"
  className="mt-0.5 rounded accent-primary-600 w-4 h-4 cursor-pointer"
  ...
/>
```

---

### 7.3 — Secret `<code>` block has `truncate` but no tooltip for full value [HIGH]

**File:** `page.tsx` line 195
**Issue:** The secret is displayed in a `<code>` element with `truncate`. If the card is narrow (common on tablets with a sidebar), the secret will be silently clipped. There is no tooltip or expand mechanism. Combined with the "save it now, you'll never see it again" warning, a truncated secret that the user copies believing it is complete would be a critical data loss scenario.

**Fix:** Remove `truncate` and instead use `break-all` to allow the secret to wrap. Alternatively, keep truncation but add a tooltip with the full value and ensure the copy button always copies the full string (it does, but the visual truncation is misleading).

```tsx
<code className="flex-1 px-3 py-2 text-xs font-mono bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-md break-all select-all">
  {newSecret}
</code>
```

The `select-all` class (`user-select: all`) enables selecting the full text with a single click, which is a commonly expected interaction for secrets and tokens.

---

## 8. Responsive Design

### 8.1 — Action buttons stack awkwardly on small screens [MEDIUM]

**File:** `page.tsx` lines 364–390
**Issue:** Each webhook row has `flex items-center gap-2 flex-shrink-0` for the action column. On screens narrower than ~375 px the URL column's `flex-1 min-w-0` collapses correctly, but the two action buttons (Enable/Disable + trash) remain inline and can push the URL off-screen if the URL is long. There is no `flex-wrap` on the outer row flex container.

**Fix:** Allow the row to wrap on very narrow viewports:
```tsx
// Change the outer row container:
<div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
```

---

## Summary Table

| # | Issue | Severity | File:Line |
|---|-------|----------|-----------|
| 1.1 | Native `confirm()` for destructive delete | High | page.tsx:139 |
| 1.2 | Bare `'…'` used as loading indicator for actions | Medium | page.tsx:371,384 |
| 1.3 | `ChevronUp` used for Cancel semantics | Medium | page.tsx:176 |
| 1.4 | Dismiss `×` has no minimum touch target | Medium | page.tsx:212 |
| 2.1 | No `autoFocus` on URL input | Low | page.tsx:235 |
| 2.2 | No Select All / Clear All for event checkboxes | Low | page.tsx:251 |
| 2.3 | No inline URL validation before submit | Medium | page.tsx:235 |
| 3.1 | Skeleton rows mismatched to real row structure | Low | page.tsx:298 |
| 4.1 | Bare empty state lacks headline and description | Medium | page.tsx:306 |
| 5.1 | No signature verification documentation | High | page.tsx (absent) |
| 6.1 | "Loading…" text used as card heading | Low | page.tsx:293 |
| 6.2 | `max-w-4xl` inconsistent with API Keys page | Low | page.tsx:164 |
| 7.1 | Checkbox descriptions not linked via `aria-describedby` | Medium | page.tsx:256 |
| 7.2 | Native checkbox unthemed in dark mode | Low | page.tsx:258 |
| 7.3 | Secret `code` truncates with no tooltip; `truncate` risks silent data loss | High | page.tsx:195 |
| 8.1 | Action buttons not wrapping on very narrow viewports | Medium | page.tsx:364 |
