# Chatbot Deploy & Publish UX Audit

**Date:** 2026-03-28
**Scope:** End-to-end publishing and deployment flow from chatbot overview through widget embed


## 1. Current Flow Analysis

### Step-by-step: What happens today

**A. User creates a chatbot**
- POST `/api/chatbots` creates with database defaults. No `status` or `is_published` is explicitly set in the creation API route (`src/app/api/chatbots/route.ts`, lines 95-112). The database defaults `status` to `'draft'` and `is_published` to `false`.

**B. User lands on chatbot overview (`/dashboard/chatbots/[id]`)**
- Header shows chatbot name with a "draft" badge.
- No "Published" badge shown (correct).
- A "Publish" button appears in the top-right header (lines 195-209 of `page.tsx`).
- The `OnboardingChecklist` component renders a "Getting Started" card with 4 steps:
  1. Add Knowledge Sources -> links to `/dashboard/chatbots/[id]/knowledge`
  2. Customize Widget -> links to `/dashboard/chatbots/[id]/customize`
  3. Test Your Chatbot -> links to `/dashboard/chatbots/[id]/deploy`
  4. Deploy to Website -> links to `/dashboard/chatbots/[id]/deploy`

**C. User clicks "Deploy to Website" in checklist**
- Navigates to `/dashboard/chatbots/[id]/deploy`.
- This is the same destination as "Test Your Chatbot" (both point to the deploy page).

**D. Deploy page loads**
- Yellow warning banner appears: "Chatbot not published -- Embed codes below won't work until you publish. Publish now" (lines 270-285 of `deploy/page.tsx`).
- The "Publish now" link points to `/dashboard/chatbots/${chatbot.id}` -- the overview page.
- Embed code blocks are rendered but visually disabled: 50% opacity, no text selection, and an overlay saying "Publish to enable" (lines 340-356).
- Copy buttons are disabled.
- The live preview iframe points to `/widget/${id}` but the widget config API (`/api/widget/[chatbotId]/config`) returns 404 for unpublished chatbots (line 57-58 of config route: `.eq('is_published', true).eq('status', 'active')`).
- So the preview shows the generic error: "Unable to load chatbot" with the 404 message.

**E. User clicks "Publish now" on the deploy page**
- Navigates back to `/dashboard/chatbots/[id]` (the overview page).
- The overview page has a "Publish" button in the header.
- There is no visual emphasis, toast, or highlight drawing attention to the publish button.
- User must discover the publish button on their own.

**F. User clicks "Publish" on the overview page**
- Calls POST `/api/chatbots/[id]/publish`.
- API sets `status = 'active'` and `is_published = true`.
- Toast notification: "Chatbot published".
- Header now shows "Published" badge and button text changes to "Unpublish".
- The onboarding checklist's "Deploy to Website" step shows as completed.

**G. User navigates back to the deploy page**
- Warning banner is gone.
- Embed codes are fully visible and copyable.
- Live preview iframe now works (config API returns 200).


## 2. UX Issues Identified

### CRITICAL

#### C1. "Publish now" link creates a circular dead-end
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`, line 278
**Problem:** The "Publish now" link in the warning banner navigates to `/dashboard/chatbots/${chatbot.id}` (the overview page). Once there, there is no contextual cue that the user arrived with the intent to publish. The "Publish" button exists but is one of several buttons in the header, and nothing highlights or draws attention to it. The user is left wondering what to do.
**Impact:** Users who follow the intended deploy flow hit a wall. They cannot complete deployment without discovering a button they may have ignored.

#### C2. Embed codes are completely hidden behind the publish gate
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`, lines 340-356
**Problem:** When the chatbot is unpublished, embed codes are shown at 50% opacity with `select-none` and a blocking overlay. The copy button is disabled. Users cannot see or copy the embed codes at all.
**Impact:** Developers who want to integrate the widget code into their site before publishing cannot do so. This blocks a natural workflow where a developer adds the embed code first, then publishes when ready.

#### C3. SDK silently builds widget on config fetch failure
**Location:** `src/app/widget/sdk.js/route.ts`, line 40
**Problem:** The SDK's `.catch()` handler calls `build(config.chatbotId, null, null, userData, userContext)`. When the config API returns 404 (unpublished chatbot), the SDK catches the error and still builds the widget container with null config. The widget button appears on the page with default styling, and clicking it opens an iframe that shows "Unable to load chatbot" -- a generic error with no actionable guidance.
**Impact:** An end user on a production site sees a broken chat widget with no explanation. The site owner gets no developer-facing signal about why it is broken. There is no console logging telling the developer the chatbot needs to be published.


### MAJOR

#### M1. "Test Your Chatbot" and "Deploy to Website" go to the same page
**Location:** `src/components/chatbots/OnboardingChecklist.tsx`, lines 70-84
**Problem:** Both checklist steps link to `/dashboard/chatbots/${chatbotId}/deploy`. Despite having different labels and descriptions ("Preview how visitors will interact with it" vs. "Publish and embed on your site"), they are indistinguishable from a navigation standpoint.
**Impact:** This confuses the mental model. Users expect each checklist item to have a distinct destination. It also inflates the step count -- effectively two items share one action.

#### M2. Live preview is broken for unpublished chatbots
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`, lines 444-454 and `src/app/api/widget/[chatbotId]/config/route.ts`, lines 56-59
**Problem:** The deploy page embeds the widget in a live preview iframe (`/widget/${id}`), but the widget config API only returns data for published + active chatbots. For unpublished chatbots, the preview shows an error state: "Unable to load chatbot."
**Impact:** The "Test Your Chatbot" step in the onboarding checklist tells the user to test via the deploy page, but the preview does not work until the chatbot is already published. This is a catch-22: you cannot test before publishing, but the onboarding flow suggests you should.

#### M3. No publish action available on the deploy page itself
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`
**Problem:** The deploy page has no publish button. The `ChatbotPageHeader` used on this page (line 255) does not include publish/unpublish actions in its `actions` prop -- it only has an "SDK Docs" link. The publish button only exists on the chatbot overview page.
**Impact:** Users on the deploy page who are ready to publish must navigate away to a different page, find the button, then navigate back. This breaks the deploy workflow at the critical moment of completion.

#### M4. Unpublishing sets status to 'paused' -- side effect is non-obvious
**Location:** `src/lib/chatbots/api.ts`, lines 178-183
**Problem:** `unpublishChatbot()` sets both `is_published: false` AND `status: 'paused'`. Publishing sets `status: 'active'`. This couples two distinct concepts. A user who unpublishes temporarily to make edits may not realize their chatbot status also changed.
**Impact:** If any logic elsewhere depends on `status === 'active'` for features other than widget serving, unpublishing creates unintended side effects. The status badge on the overview page changes from "active" to "paused," which may confuse users who only wanted to stop the public widget.


### MINOR

#### m1. Deploy page marks "Test Your Chatbot" as complete on page load
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`, line 99
**Problem:** `localStorage.setItem('chatbot-tested-${id}', 'true')` fires in `useEffect` on mount. Simply loading the deploy page marks the testing step as complete, even if the user never interacted with the preview or tested anything.
**Impact:** The onboarding checklist falsely shows progress. The "tested" checkmark does not reflect actual testing behavior.

#### m2. Widget preview iframe loads even when preview is toggled off
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`, lines 444-454
**Problem:** The `showPreview` state controls rendering via `{showPreview && (...)}`, but the iframe is only conditionally rendered on this toggle. When `showPreview` is toggled on, the iframe re-mounts and re-fetches config. There is no lazy-loading or debouncing.
**Impact:** Minor performance concern. Toggling preview on/off creates unnecessary network requests.

#### m3. Redundant chatbot API fetch in deploy page
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx` (line 88) and `src/app/(authenticated)/dashboard/chatbots/[id]/layout.tsx` (line 20) and `src/components/chatbots/ChatbotPageHeader.tsx` (line 35)
**Problem:** Three separate components each fetch `/api/chatbots/${id}` independently: the layout, the page header, and the deploy page itself. This results in 3 identical API calls on every deploy page load.
**Impact:** Wasted network requests and potential for state inconsistency if the chatbot changes between fetches.

#### m4. Inconsistent error messaging between widget page and SDK
**Location:** `src/app/widget/[chatbotId]/page.tsx` (lines 87-96) vs. `src/app/widget/sdk.js/route.ts` (line 40)
**Problem:** The widget page (`/widget/[chatbotId]`) shows "Unable to load chatbot" with the API error message when config fetch fails. The SDK (`sdk.js`) silently catches the error and builds a widget with null config, resulting in a chat button that opens to a broken iframe. Two different failure modes for the same root cause.
**Impact:** Debugging is confusing. The error experience differs depending on whether the user accesses the widget directly vs. via the SDK embed.

#### m5. No feedback on status change when "Publish" button is clicked
**Location:** `src/app/(authenticated)/dashboard/chatbots/[id]/page.tsx`, lines 99-120
**Problem:** The publish button triggers a toast ("Chatbot published") and updates the badge, but there is no prompt or confirmation guiding the user to the deploy page to get embed codes. The user publishes but may not know the next step.
**Impact:** Users who publish from the overview page may not know they need to go to the deploy page for embed codes, or may not realize the flow is now unblocked on the deploy page.


## 3. Recommended Improvements

### R1. Add inline publish action to the deploy page (fixes C1, M3)
Add a prominent "Publish Chatbot" button directly on the deploy page's warning banner, replacing the "Publish now" link that navigates away. Call the same `POST /api/chatbots/${id}/publish` endpoint inline.

**Implementation:**
- In `deploy/page.tsx`, add a `handlePublish` function (similar to the one in the overview `page.tsx`, lines 99-120).
- Replace the `<Link>` on line 278 with a `<Button>` that calls `handlePublish`.
- On success, update local `chatbot` state so the banner disappears and embed codes become active.
- Show a toast: "Chatbot published -- embed codes are now active."

```tsx
// Replace the Link on line 278 with:
<Button
  size="sm"
  variant="default"
  onClick={handlePublish}
  disabled={publishing}
  className="ml-2"
>
  {publishing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
  Publish now
</Button>
```

### R2. Always show embed codes, gate the widget rendering instead (fixes C2, C3)
Show embed codes at full visibility regardless of publish status. Remove the disabled overlay. Instead:

**Widget-side changes (`sdk.js`):**
- When the config API returns 404 (unpublished), do NOT build the widget.
- Log a clear developer-facing console warning:
  ```
  [VocUI] Chatbot "{id}" is not published. The widget will not render.
  Publish your chatbot at https://vocui.com/dashboard/chatbots/{id} to activate the widget.
  ```
- Do not create the iframe or chat button.

**Widget config page changes (`/widget/[chatbotId]/page.tsx`):**
- When the config API returns 404, show a branded error message:
  ```
  This chatbot is not yet published.
  If you own this chatbot, publish it from your VocUI dashboard.
  ```

**Deploy page changes (`deploy/page.tsx`):**
- Remove the opacity/overlay/disabled treatment on code blocks (lines 340-356 and line 40 `disabled` prop).
- Keep the yellow warning banner but change the message:
  ```
  Chatbot not published -- The embed codes below are ready to add to your site.
  The widget will not render for visitors until you publish. [Publish now] button
  ```

### R3. Allow preview for unpublished chatbots in dashboard context (fixes M2)
The widget config API (`/api/widget/[chatbotId]/config`) currently requires `is_published = true` AND `status = 'active'`. For dashboard previews, this creates a catch-22.

**Option A (recommended):** Add a preview token system.
- The deploy page generates a short-lived preview token (e.g., signed JWT or random token stored in session).
- The preview iframe URL becomes `/widget/${id}?preview=TOKEN`.
- The config API accepts the token and skips the `is_published` check for valid preview tokens.

**Option B (simpler):** Create a separate preview config endpoint.
- Add `GET /api/chatbots/[id]/preview-config` that requires authentication (dashboard session) and returns the same config data without checking `is_published`.
- The deploy page's preview iframe uses this endpoint instead.

### R4. Separate "Test Your Chatbot" from "Deploy to Website" in the checklist (fixes M1)
The two steps currently share the same destination. Options:

**Option A:** Remove "Test Your Chatbot" as a separate step. Merge it into "Deploy to Website" and reduce the checklist to 3 steps. The deploy page already has a live preview.

**Option B:** Make "Test Your Chatbot" link to the customize page's preview, or to a dedicated test page/modal on the overview page.

**Option C (recommended):** Keep 4 steps but differentiate behavior:
- "Test Your Chatbot" opens a test chat modal directly on the overview page (or inline preview).
- "Deploy to Website" links to `/deploy` for embed codes.
- Remove the auto-completion via `localStorage` on page mount. Instead, mark "Test" as complete when the user actually sends a message in the preview.

### R5. Decouple publish state from chatbot status (fixes M4)
Currently `publishChatbot()` sets `status = 'active'` and `unpublishChatbot()` sets `status = 'paused'`. These should be independent.

**Implementation:**
- `publishChatbot()` should only set `is_published = true` without changing `status`.
- `unpublishChatbot()` should only set `is_published = false` without changing `status`.
- The widget config API already checks both fields (`is_published = true` AND `status = 'active'`), which is correct.
- This gives users explicit control: they can pause a chatbot (stop all responses) without unpublishing, or unpublish (remove the widget) without pausing.
- New chatbots should default to `status = 'active'` on creation rather than `'draft'`, or the publish action should set both if the current status is `'draft'`.

### R6. Post-publish guidance on the overview page (fixes m5)
After the user clicks "Publish" on the overview page, show a contextual prompt:

```
Chatbot published! Next step: add the widget to your website.
[Go to Deploy Page ->]
```

This could be a toast with a link, or a temporary inline banner below the header.

### R7. Eliminate redundant API fetches (fixes m3)
Use React context or a shared data-fetching layer (e.g., SWR or React Query) so the layout, page header, and page content share a single chatbot fetch. The layout already fetches the chatbot; pass it down via context to child components.

### R8. Fix premature "Test" completion (fixes m1)
Replace the `localStorage.setItem` in `useEffect` on deploy page mount (line 99) with a more meaningful signal. Options:
- Set it when the user clicks inside the preview iframe.
- Set it after a `postMessage` from the widget indicating the user sent a message.
- Set it after the user opens the preview for at least 5 seconds.


## 4. Priority Ranking

| Priority | Issue | Fix | Effort | Impact |
|----------|-------|-----|--------|--------|
| P0 | C1. "Publish now" dead-end | R1. Inline publish on deploy page | Small | Unblocks the primary deploy flow |
| P0 | C2. Embed codes gated behind publish | R2. Always show codes, gate widget rendering | Medium | Enables natural developer workflow |
| P0 | C3. SDK builds broken widget silently | R2. Console warning + no-render on 404 | Small | Prevents broken widgets on production sites |
| P1 | M2. Preview broken for unpublished bots | R3. Preview token or separate endpoint | Medium | Allows testing before publishing |
| P1 | M3. No publish button on deploy page | R1. (same fix -- inline publish) | Small | Eliminates page-hopping |
| P1 | M1. Duplicate checklist destinations | R4. Differentiate test vs. deploy | Small | Reduces user confusion |
| P2 | M4. Publish/unpublish changes status | R5. Decouple is_published from status | Small | Prevents side effects |
| P2 | m5. No post-publish guidance | R6. Toast with deploy page link | Small | Improves flow completion |
| P3 | m1. Auto-complete "tested" step | R8. Require actual interaction | Small | Improves checklist accuracy |
| P3 | m3. Triple API fetch | R7. Shared context/SWR | Medium | Reduces network waste |
| P3 | m4. Inconsistent error display | R2. (addressed by SDK fix) | Small | Improves debuggability |
| P3 | m2. Preview iframe re-mount | Low priority | Small | Minor perf improvement |


## 5. Files Referenced

| File | Role |
|------|------|
| `src/app/(authenticated)/dashboard/chatbots/[id]/page.tsx` | Chatbot overview page (has publish button) |
| `src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx` | Deploy page (embed codes, preview, warning banner) |
| `src/app/(authenticated)/dashboard/chatbots/[id]/layout.tsx` | Chatbot layout (sub-nav, re-embed warning) |
| `src/components/chatbots/OnboardingChecklist.tsx` | Getting Started checklist (4 steps) |
| `src/components/chatbots/ChatbotSubNav.tsx` | Chatbot sub-navigation tabs |
| `src/components/chatbots/ChatbotPageHeader.tsx` | Shared page header with status badges |
| `src/components/widget/ChatWidget.tsx` | Chat widget component |
| `src/app/widget/[chatbotId]/page.tsx` | Widget page (loads config, renders ChatWidget) |
| `src/app/widget/sdk.js/route.ts` | SDK script served to third-party sites |
| `src/app/api/widget/[chatbotId]/config/route.ts` | Widget config API (publish gate) |
| `src/app/api/chatbots/[id]/publish/route.ts` | Publish/unpublish API |
| `src/app/api/chat/[chatbotId]/route.ts` | Chat API (also checks is_published) |
| `src/lib/chatbots/api.ts` | Core chatbot CRUD (publishChatbot, unpublishChatbot) |
| `src/lib/chatbots/types.ts` | Chatbot type definitions |
| `src/app/api/chatbots/route.ts` | Chatbot creation API |
