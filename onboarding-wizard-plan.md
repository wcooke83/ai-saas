# Onboarding Wizard Implementation Plan

## 1. Route Architecture

### Layout Hierarchy (Current)

```
src/app/(authenticated)/layout.tsx          -- passthrough (just renders children)
  src/app/(authenticated)/dashboard/layout.tsx  -- sidebar, user, admin check, credit meter
    src/app/(authenticated)/dashboard/chatbots/[id]/layout.tsx  -- ChatbotProvider + ChatbotSubNav
```

### Layout Hierarchy (New)

Add a sibling route group `(onboarding)` under `(authenticated)`. This inherits auth protection (middleware checks `/dashboard` prefix -- see below) but **not** the dashboard sidebar layout.

**Problem**: The middleware `protectedRoutes` array (`src/lib/supabase/middleware.ts:89`) currently protects `/dashboard` and `/admin`. The onboarding route `/onboarding` is NOT protected by default.

**Fix**: Add `/onboarding` to the `protectedRoutes` array:

```ts
// src/lib/supabase/middleware.ts line 89
export const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/onboarding',  // ADD
];
```

### New Route Structure

```
src/app/(authenticated)/(onboarding)/
  layout.tsx                                 -- OnboardingLayout (logo bar + stepper, NO sidebar)
  onboarding/
    page.tsx                                 -- Entry point: creates chatbot or resumes, redirects to step 1
    [chatbotId]/
      step/
        [step]/
          page.tsx                           -- Single page component that renders the correct step
```

**URL scheme**: `/onboarding/{chatbotId}/step/{1|2|3|4}`

Rationale for chatbot ID in URL:
- The chatbot is created in step 1, then threaded through steps 2-4.
- Putting it in the URL enables direct linking, resume, and back/forward navigation.
- The entry page `/onboarding` handles the "no chatbot yet" case by either creating one or finding an in-progress one.

### `/onboarding` Entry Page Logic

```
1. Fetch user's chatbots where onboarding_step IS NOT NULL
2. If found: redirect to /onboarding/{chatbotId}/step/{onboarding_step}
3. If not found: show step 1 inline (name + template), create chatbot on submit,
   set onboarding_step=2, redirect to /onboarding/{newId}/step/2
```

### `/onboarding/[chatbotId]/step/[step]` Page Logic

```
1. Validate step is 1-4.
2. Fetch chatbot, verify ownership (RLS handles this) and onboarding_step is not null.
3. Allow navigation to current step or any completed step (step <= onboarding_step).
4. Render the corresponding step component.
```

---

## 2. Wizard Steps -- Component Design

### OnboardingLayout

**File**: `src/app/(authenticated)/(onboarding)/layout.tsx`

```tsx
// Client component
// Props: { children: React.ReactNode }
// Contains:
//   - Top bar: VocUI logo (left), "Exit to dashboard" link (right)
//   - Progress stepper (horizontal, 4 steps)
//   - children rendered below stepper
// No sidebar, no credit meter, no PastDueBanner
```

The stepper reads the current step from the URL (`useParams`) and the chatbot's `onboarding_step` from context to determine which steps are clickable.

**New shared component**: `src/components/onboarding/OnboardingStepperLayout.tsx`

```tsx
interface OnboardingStepperLayoutProps {
  children: React.ReactNode;
}
```

**New context**: `src/components/onboarding/OnboardingContext.tsx`

```tsx
interface OnboardingContextType {
  chatbotId: string | null;
  chatbot: Chatbot | null;
  currentStep: number;               // from URL
  maxCompletedStep: number;           // from chatbot.onboarding_step - 1
  loading: boolean;
  setChatbot: (c: Chatbot) => void;
  goToStep: (step: number) => void;   // router.push + validates step range
  completeCurrentStep: () => Promise<void>;  // PATCH onboarding_step, then goToStep(next)
}
```

### Step 1: Create (Name + Template)

**File**: `src/components/onboarding/steps/CreateStep.tsx`

```tsx
interface CreateStepProps {
  onCreated: (chatbot: Chatbot) => void;
}
```

**What to reuse from `chatbots/new/page.tsx`**:
- `SYSTEM_PROMPT_TEMPLATES` and `getRecommendedTemplateId` from `types.ts` -- use directly
- Template card rendering pattern -- extract into shared component or copy simplified version

**What's different**:
- Only 2 fields: Name (required) + Template selection (top 6 popular templates as cards)
- No Description, Welcome Message, Language, or raw prompt editor
- No Review step -- create immediately on "Next"
- Calls `POST /api/chatbots` with: `{ name, system_prompt: selectedTemplate.prompt, enable_prompt_protection: true }`
- On success: calls `PATCH /api/onboarding/{chatbotId}/step` with `{ step: 2 }`
- Defaults applied server-side: `language: 'en'`, `welcome_message: 'Hi! How can I help you today?'`, `enable_prompt_protection: true`

**Template selection UI**:
- Show 6 templates: `helpful-assistant`, `customer-support`, `faq-bot`, `sales-assistant`, `lead-generation`, `technical-support`
- Cards with icon, name, description
- First one pre-selected
- "View all templates" expandable/link (optional v2)

### Step 2: Train (Simplified Knowledge)

**File**: `src/components/onboarding/steps/TrainStep.tsx`

```tsx
interface TrainStepProps {
  chatbotId: string;
}
```

**What to reuse from `knowledge/page.tsx`**:
- URL input + crawl toggle -- same form fields, same API call (`POST /api/chatbots/{id}/knowledge`)
- Text paste form -- same fields, same API call
- Source list display with status badges -- simplified version (no priority stars, no reprocess, no delete in wizard)
- Realtime subscription for source status updates -- same pattern using `getClient().channel()`

**What's stripped out**:
- Q&A pair input (defer)
- Article Generation section (defer)
- Priority stars / `handleTogglePriority`
- Reprocess buttons / `confirmReprocessSource`
- Delete button (let them delete from full page later)
- Re-embed warnings
- Chunk count display
- `ChatbotPageHeader` (wizard has its own header)

**What's different**:
- Two source type cards only: "Import Website" and "Paste Text"
- Crawl defaults to ON, maxPages to 25
- Guidance text: "Add at least one source so your chatbot has something to talk about."
- Source status: simplified to spinner (processing) or checkmark (completed)
- "Skip for now" link always visible
- "Next" button enabled even with 0 sources (but shows "Skip" label if 0)
- On "Next": `PATCH /api/onboarding/{chatbotId}/step` with `{ step: 3 }`

### Step 3: Style (Quick Customize)

**File**: `src/components/onboarding/steps/StyleStep.tsx`

```tsx
interface StyleStepProps {
  chatbotId: string;
}
```

**What to reuse from `customize/page.tsx`**:
- `ColorPicker` component concept (but only for primary color)
- Widget preview iframe pattern
- API call: `PATCH /api/chatbots/{chatbotId}` with `{ widget_config: { ...current, primaryColor, position } }`

**What's stripped out** (from the full customize page's 20+ controls):
- All color pickers except primary color
- Font selection (24 fonts)
- All sizing controls (width, height, buttonSize, border radii)
- Pre-chat form config
- Post-chat survey config
- Proactive messages config
- Transcript config
- File upload config
- Custom CSS
- All the "advanced" widget config sections

**What's shown**:
- **Primary color**: 8 preset swatches (buttons) + custom color input. Presets: `#0ea5e9` (default blue), `#8b5cf6` (purple), `#10b981` (green), `#f59e0b` (amber), `#ef4444` (red), `#ec4899` (pink), `#6366f1` (indigo), `#0f172a` (dark)
- **Widget position**: 4 radio buttons: bottom-right (default), bottom-left, top-right, top-left
- **Live preview**: iframe showing `/widget/{chatbotId}?preview=true` with current widget_config

**State**: Load current chatbot widget_config, modify locally, save on "Next"

### Step 4: Deploy

**File**: `src/components/onboarding/steps/DeployStep.tsx`

```tsx
interface DeployStepProps {
  chatbotId: string;
}
```

**What to reuse from `deploy/page.tsx`**:
- `CodeBlock` component -- extract to shared component or import from deploy page
- Publish API call: `POST /api/chatbots/{chatbotId}/publish`
- Embed code generation logic: `<script src="${baseUrl}/widget/sdk.js" data-chatbot-id="${id}"></script>`

**What's stripped out**:
- React/Next.js/iframe/WordPress embed variants
- Slack/Telegram integration
- API docs / curl examples
- Auth section
- Agent console links

**What's shown**:
- Publish button (single action, calls existing publish endpoint)
- Published status indicator
- Script embed code with copy-to-clipboard (just the `<script>` tag)
- "More ways to embed" link pointing to `/dashboard/chatbots/{id}/deploy`
- "Skip, I'll deploy later" link

**On "Next" (Complete)**:
1. Call `PATCH /api/onboarding/{chatbotId}/step` with `{ step: null }` (marks complete)
2. Update `chatbot.widget_reviewed_at` to now
3. Show completion state (inline, not a separate page)

### Completion State (inline in step 4)

After the wizard completes:
- Heading: "Your chatbot is ready"
- Subtext: brief congrats
- "Go to Dashboard" primary CTA -> `/dashboard/chatbots/{chatbotId}`
- "Test your chatbot" secondary CTA -> opens widget preview in new tab `/widget/{chatbotId}`

---

## 3. Schema Changes

### Migration: `supabase/migrations/20260331500000_add_onboarding_tracking.sql`

```sql
-- Chatbot-level onboarding step tracking
-- 1 = created, at name/template step (just created, wizard entry)
-- 2 = at train/knowledge step
-- 3 = at style step
-- 4 = at deploy step
-- NULL = wizard completed (or chatbot created before wizard existed)
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS onboarding_step integer;

-- Milestone timestamps
ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS first_knowledge_source_at timestamptz;

ALTER TABLE chatbots
  ADD COLUMN IF NOT EXISTS first_knowledge_ready_at timestamptz;

-- User-level onboarding milestones (JSONB for flexibility)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_milestones jsonb DEFAULT '{}';

-- Index for fast lookup of incomplete onboarding chatbots
CREATE INDEX IF NOT EXISTS idx_chatbots_onboarding_step
  ON chatbots (user_id)
  WHERE onboarding_step IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN chatbots.onboarding_step IS
  'Current wizard step (1-4). NULL means wizard complete or pre-wizard chatbot.';
```

### RLS Impact

Existing RLS policies on `chatbots` table already restrict to `user_id = auth.uid()`. The new `onboarding_step` column is covered by these policies -- no new RLS needed.

Existing RLS on `profiles` restricts to own row. Same applies to `onboarding_milestones` -- no new policy needed.

### Type Updates

After migration, run `npm run db:gen-types` to regenerate `src/types/database.ts`.

Update `src/lib/chatbots/types.ts` Chatbot interface:

```ts
// Add to Chatbot interface (around line 674, near widget_reviewed_at)
onboarding_step?: number | null;
first_knowledge_source_at?: string | null;
first_knowledge_ready_at?: string | null;
```

Update `ChatbotInsert` interface:

```ts
// Add to ChatbotInsert interface
onboarding_step?: number | null;
```

### Impact on Existing Data

- All existing chatbots get `onboarding_step = NULL` (column default). This means "wizard complete or pre-wizard" which is correct -- existing chatbots should NOT show wizard UI.
- All existing profiles get `onboarding_milestones = '{}'`.
- No existing queries break because they don't select or filter on these columns.

---

## 4. API Routes

### New: `POST /api/onboarding/start`

**File**: `src/app/api/onboarding/start/route.ts`

**Purpose**: Create a chatbot with `onboarding_step = 1` and return it. Called from the onboarding entry page.

**Request body**:
```ts
{
  name: string;
  system_prompt: string;  // from selected template
}
```

**Logic**:
1. Authenticate user
2. Check chatbot limit (reuse `checkChatbotLimit`)
3. Create chatbot via existing `createChatbot()` with defaults + `onboarding_step: 2`
4. Update `profiles.onboarding_milestones` with `first_chatbot_created_at` if not set
5. Return `{ chatbot }`

### New: `PATCH /api/onboarding/[chatbotId]/step`

**File**: `src/app/api/onboarding/[chatbotId]/step/route.ts`

**Purpose**: Update the onboarding step for a chatbot. Called on each step transition.

**Request body**:
```ts
{
  step: number | null;  // 2, 3, 4, or null (complete)
}
```

**Logic**:
1. Authenticate user
2. Fetch chatbot, verify ownership
3. Validate step transition: new step must be current step + 1, or null (complete)
4. Update `chatbots.onboarding_step` to new value
5. If step is null (complete): also set `widget_reviewed_at = now()` if not set
6. If step is null: update `profiles.onboarding_milestones.first_widget_deployed_at` if chatbot is published
7. Return `{ chatbot }`

### New: `GET /api/onboarding/resume`

**File**: `src/app/api/onboarding/resume/route.ts`

**Purpose**: Find user's in-progress onboarding chatbot. Called from the onboarding entry page.

**Response**:
```ts
{
  chatbot: Chatbot | null;  // null if no in-progress onboarding
}
```

**Logic**:
1. Authenticate user
2. Query `chatbots` where `user_id = auth.uid()` and `onboarding_step IS NOT NULL`, order by `created_at DESC`, limit 1
3. Return chatbot or null

### Modified: `POST /api/chatbots/[id]/knowledge`

No changes needed -- the existing endpoint works as-is for the simplified wizard. The wizard just calls it with fewer source types.

### Modified: `PATCH /api/chatbots/[id]`

No changes needed -- existing endpoint accepts `widget_config` partial updates. The wizard sends `{ widget_config: { primaryColor, position } }`.

### Modified: `POST /api/chatbots/[id]/publish`

No changes needed -- existing endpoint works. Wizard calls it on the deploy step.

### Milestone Tracking Hook

When a knowledge source is added (`POST /api/chatbots/{id}/knowledge`), update milestone:

**File modification**: `src/app/api/chatbots/[id]/knowledge/route.ts`

Add after successful source creation:
```ts
// Update first_knowledge_source_at if not set
await supabase
  .from('chatbots')
  .update({ first_knowledge_source_at: new Date().toISOString() })
  .eq('id', chatbotId)
  .is('first_knowledge_source_at', null);
```

Similarly, when knowledge processing completes (in the processing pipeline), set `first_knowledge_ready_at`.

---

## 5. State Management

### Wizard Progress Persistence

- **Primary**: `chatbots.onboarding_step` column (server-side, survives browser close)
- **Step data**: Each step saves to the chatbot record immediately (chatbot name, widget_config, etc.)
- **No client-side form state between steps** -- each step reads current chatbot state from API on mount

### Flow: User closes browser mid-wizard

1. User completes step 1 (chatbot created, `onboarding_step = 2`)
2. User closes browser
3. User returns, navigates to `/dashboard`
4. Dashboard page checks: any chatbot with `onboarding_step IS NOT NULL`?
5. Yes -> shows banner: "You haven't finished setting up {name}. [Continue setup]"
6. Click -> redirects to `/onboarding/{chatbotId}/step/{onboarding_step}`

### Return-to-Wizard Entry Points

| Location | Implementation |
|---|---|
| `/dashboard` page | Server component: query chatbots with `onboarding_step IS NOT NULL`. If found, show banner above stats. |
| `/dashboard/chatbots` list | Add badge on ChatbotCard: "Setup incomplete" + "Continue setup" link when `chatbot.onboarding_step != null`. |
| `/dashboard/chatbots/[id]` overview | Banner if `chatbot.onboarding_step != null`: "Continue setup" link. |
| `/onboarding` entry | Calls `GET /api/onboarding/resume` to find in-progress chatbot. |

### "Onboarding Complete" Definition

A chatbot's onboarding is complete when `onboarding_step IS NULL`. This happens:
- When the user clicks "Complete" on step 4
- When the user clicks "Skip, go to dashboard" (set `onboarding_step = null`)
- Pre-wizard chatbots: already null by default

### OnboardingChecklist Relationship

The existing `OnboardingChecklist` component (`src/components/chatbots/OnboardingChecklist.tsx`) will be modified:

1. Add `onboardingStep` prop (number | null)
2. If `onboardingStep != null`: hide the checklist entirely (wizard is active, checklist is redundant)
3. If `onboardingStep == null` and checklist was not dismissed: show as before (for pre-wizard chatbots)

This is a backward-compatible change -- existing users see no difference.

### NewUserWelcome Modification

`src/components/dashboard/new-user-welcome.tsx`:
- Change CTA from `/dashboard/chatbots/new` to `/onboarding`
- Keep the 3-step visual indicators

---

## 6. File Tree

### New Files

```
src/app/(authenticated)/(onboarding)/
  layout.tsx                                    -- Onboarding layout (logo + stepper, no sidebar)
  onboarding/
    page.tsx                                    -- Entry: resume or start new

src/app/(authenticated)/(onboarding)/onboarding/[chatbotId]/
  step/
    [step]/
      page.tsx                                  -- Step router: validates step, renders component

src/components/onboarding/
  OnboardingContext.tsx                          -- React context for wizard state
  OnboardingProgressStepper.tsx                 -- Horizontal 4-step stepper component
  steps/
    CreateStep.tsx                              -- Step 1: Name + Template
    TrainStep.tsx                               -- Step 2: Simplified knowledge
    StyleStep.tsx                               -- Step 3: Primary color + position
    DeployStep.tsx                              -- Step 4: Publish + embed code
    CompletionView.tsx                          -- Post-wizard celebration + CTAs

src/app/api/onboarding/
  start/
    route.ts                                    -- POST: Create chatbot with onboarding_step
  resume/
    route.ts                                    -- GET: Find in-progress onboarding chatbot
  [chatbotId]/
    step/
      route.ts                                  -- PATCH: Update onboarding step

supabase/migrations/
  20260331500000_add_onboarding_tracking.sql    -- Schema changes
```

**Total new files: 14**

### Modified Files

| File | Change |
|---|---|
| `src/lib/supabase/middleware.ts` | Add `/onboarding` to `protectedRoutes` array |
| `src/lib/chatbots/types.ts` | Add `onboarding_step`, `first_knowledge_source_at`, `first_knowledge_ready_at` to `Chatbot` and `ChatbotInsert` interfaces |
| `src/components/dashboard/new-user-welcome.tsx` | Change CTA href from `/dashboard/chatbots/new` to `/onboarding` |
| `src/components/chatbots/OnboardingChecklist.tsx` | Add `onboardingStep` prop; hide when wizard is active |
| `src/app/(authenticated)/dashboard/page.tsx` | Add query for in-progress onboarding chatbot; show resume banner |
| `src/app/(authenticated)/dashboard/chatbots/page.tsx` | Show "Setup incomplete" badge on ChatbotCard when `onboarding_step != null` |
| `src/app/(authenticated)/dashboard/chatbots/[id]/layout.tsx` | Optionally show "Continue setup" banner if `onboarding_step != null` |
| `src/app/api/chatbots/[id]/knowledge/route.ts` | Set `first_knowledge_source_at` on first source add |

**Total modified files: 8**

---

## 7. Implementation Order

### Phase 1: Foundation (no dependencies between items)

These can be done in parallel:

1. **Migration** -- Write and apply `20260331500000_add_onboarding_tracking.sql`. Run `npm run db:gen-types`.
2. **Type updates** -- Add new fields to `Chatbot` and `ChatbotInsert` in `types.ts`.
3. **Middleware update** -- Add `/onboarding` to `protectedRoutes`.

### Phase 2: API Routes (depends on Phase 1)

Can be done in parallel:

1. **`POST /api/onboarding/start`** -- Create chatbot with onboarding_step
2. **`PATCH /api/onboarding/[chatbotId]/step`** -- Step transitions
3. **`GET /api/onboarding/resume`** -- Find in-progress chatbot

### Phase 3: Layout + Context (depends on Phase 1)

1. **OnboardingContext** -- `src/components/onboarding/OnboardingContext.tsx`
2. **OnboardingProgressStepper** -- `src/components/onboarding/OnboardingProgressStepper.tsx`
3. **Onboarding layout** -- `src/app/(authenticated)/(onboarding)/layout.tsx`

### Phase 4: Step Components (depends on Phase 2 + 3)

Build in order (each step depends on the previous being navigable):

1. **CreateStep** + **Entry page** (`/onboarding` page.tsx)
2. **TrainStep**
3. **StyleStep**
4. **DeployStep** + **CompletionView**
5. **Step router page** (`/onboarding/[chatbotId]/step/[step]/page.tsx`)

### Phase 5: Integration (depends on Phase 4)

Can be done in parallel:

1. **Modify NewUserWelcome** -- Point CTA to `/onboarding`
2. **Modify OnboardingChecklist** -- Add `onboardingStep` prop
3. **Dashboard resume banner** -- Query + display
4. **Chatbot list badge** -- "Setup incomplete" on cards
5. **Knowledge route milestone** -- Set `first_knowledge_source_at`

### Phase 6: Polish (depends on Phase 5)

1. Accessibility: focus management between steps, aria-live announcements, prefers-reduced-motion
2. Mobile responsive testing at 320px
3. Loading states and error handling for each step
4. Edge cases: chatbot deleted while wizard open, plan limit reached mid-wizard

---

## Appendix: Key Decisions & Rationale

### Why chatbot ID in URL (not session/context only)

Enables: direct links, browser back/forward, share with support, bookmark resume. The alternative (single `/onboarding` URL with client-side routing) breaks all of these.

### Why server-side step tracking (not localStorage)

The audit identified P5 (no return-to-wizard mechanism) and P8 (binary onboarding check) as key problems. Server-side tracking via `onboarding_step` on the chatbot record solves both: the wizard state survives across devices, and the dashboard can query for incomplete onboarding.

### Why `onboarding_step` on `chatbots` table (not `profiles`)

The onboarding is chatbot-scoped. A user might have one complete chatbot and one mid-wizard chatbot. Putting the step on the chatbot itself is more natural and avoids the complexity of tracking which chatbot the onboarding refers to.

### Why a separate route group (not a query param or modal overlay)

The audit's P3 (sidebar noise) explicitly requires removing the sidebar during onboarding. A route group is the clean Next.js App Router way to have different layouts for the same auth level. A query param approach would require the dashboard layout to conditionally hide itself, which is fragile.

### Why 4 steps instead of 3

The audit proposes separating Style from Deploy. The current flow bundles "customize everything" and "publish" as separate full pages but with no guided path between them. 4 discrete steps with minimal choices each (7 total decisions across the entire wizard) keeps cognitive load low per step.
