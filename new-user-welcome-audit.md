# NewUserWelcome Onboarding Audit

**Date**: 2026-03-31
**Audited by**: UX Designer, Onboarding Activation Tracker, Codebase Explorer

---

## 1. Current Flow Map

```
/dashboard (chatbotCount === 0)
    |
    v
NewUserWelcome  -->  "Create your first chatbot" CTA
    |
    v
/dashboard/chatbots/new  -->  3-step wizard (Basic Info, Instructions, Review)
    |                          - Name (required), Description, Welcome Message, Language
    |                          - Template selector (40+ templates), raw prompt editor, prompt protection toggle
    |                          - Review summary + "Create Chatbot"
    v
/dashboard/chatbots/[id]/knowledge  -->  FULL knowledge page (URL, Text, Q&A, Article Generation,
    |                                     priority stars, reprocess, re-embed warnings, chunk counts)
    v
    ??? User must self-navigate via 16-item ChatbotSubNav ???
    |
    v
/dashboard/chatbots/[id]/customize  -->  20+ color pickers, 7 preview modes, 24 fonts, position, sizing
    |
    v
/dashboard/chatbots/[id]/deploy     -->  Publish toggle, 4 embed methods, Slack, Telegram, API docs
```

**Full sidebar visible throughout**: Dashboard, Chatbots, API Keys, Webhooks, Usage, Billing, Settings, Wiki, credit meter, sign-out.

**ChatbotSubNav visible after creation**: 8 primary tabs + 8 in "More" dropdown = 16 navigation items.

---

## 2. Key Problems

### P1: The cliff after creation (Critical)
After the guided 3-step creation wizard, the user is dropped onto the **full** knowledge page with no wizard context. They go from a clean card-based flow to a page with: 3 source type cards, crawl toggle with range slider, Article Generation section, re-embed warnings, priority/star buttons, reprocess actions, and chunk counts. This is the steepest cognitive load spike in the entire experience.

### P2: 16-item navigation appears instantly
The moment a chatbot is created, the user sees `ChatbotSubNav` with 8 primary tabs (Overview, Settings, Knowledge, Customize, Calendar, Deploy, Live Conversations, Analytics) plus 8 more in a dropdown. There is no clear signal for "do this next."

### P3: Full sidebar persists during onboarding
The dashboard sidebar (8 menu items + admin section + credit meter + sign-out) remains visible. For a new user, 7 of 8 sidebar items are irrelevant noise. Combined with the ChatbotSubNav, the user faces **two competing navigation systems**.

### P4: No "test your chatbot" prompt
After knowledge processing completes, the `OnboardingChecklist` points to "Customize Widget" next -- not "Test your chatbot." Users are sent down a customization path before ever experiencing their chatbot actually working. The first-value moment is buried.

### P5: No return-to-wizard mechanism
The `OnboardingChecklist` can be dismissed (localStorage, one click). Once dismissed, there is no way to get back to a guided flow. No re-entry point from dashboard or chatbot list.

### P6: Two separate "getting started" surfaces
`NewUserWelcome` on `/dashboard` and the chatbots list empty state on `/dashboard/chatbots` show different visual treatments of the same 3-step concept. These should converge.

### P7: Creation wizard asks too many questions
Step 1 asks for Name, Description, Welcome Message, and Language. Only Name is required. Description and Language can be deferred. Welcome Message has a good default already.

### P8: "Onboarding complete" is binary
`chatbotCount === 0` is the only check. The moment one chatbot exists (even if abandoned with zero knowledge), the user sees the full stats dashboard with all zeros. No graduated states.

---

## 3. Proposed Wizard Flow

### Layout
- **No sidebar**. Use a distinct layout outside the dashboard wrapper.
- **Top bar**: VocUI logo (left), subtle "Exit to dashboard" text link (right).
- **Progress indicator**: Horizontal stepper -- "Create", "Train", "Style", "Deploy".
- Steps clickable to jump back to completed steps.

### Step 1: Create (Name + Template)

| Field | Required | Notes |
|---|---|---|
| Chatbot name | Yes | Only required field |
| Template | Yes (default selected) | Show top 6 most popular as cards, not the full 40+ filtered grid |

Everything else uses sensible defaults (English, default welcome message, prompt protection on). Description, Language, Welcome Message all deferred.

### Step 2: Train (Simplified Knowledge)

| Element | Show | Hide |
|---|---|---|
| URL input + "Crawl linked pages" toggle | Yes | |
| Text paste area | Yes | |
| Q&A pairs | | Defer to full knowledge page |
| Article Generation | | Defer |
| Priority stars | | Defer |
| Reprocess buttons | | Defer |
| Re-embed warnings | | Defer |
| Chunk counts | | Defer |
| Source status | Simplified: spinner -> checkmark | Hide internal status vocabulary |

- Default crawl to **on**, maxPages to 25.
- Guidance text: "Add at least one source so your chatbot has something to talk about. You can add more later."
- "Next" enabled after at least one source is added.
- "Skip for now" link available.

### Step 3: Preview + Quick Style

| Control | Type |
|---|---|
| Primary color | Color picker with 6-8 preset swatches |
| Widget position | 4 radio buttons (corners) |
| Live preview | Iframe showing the widget with current settings |

That's it. Full customization (20+ colors, fonts, sizing) deferred to Customize page.

### Step 4: Deploy

| Element | Show | Hide |
|---|---|---|
| Publish toggle | Yes (one button) | |
| Script embed code | Yes (single copy-to-clipboard) | |
| React/iFrame methods | | "More ways to embed" link |
| Slack/Telegram | | Defer |
| API docs | | Defer |
| "Skip, I'll deploy later" | Yes | |

### Completion
- Celebration micro-interaction.
- "Your chatbot is live" confirmation with link to test it.
- "Go to Dashboard" primary CTA.
- Chatbot marked as onboarding-complete.

---

## 4. Fields: Wizard vs Deferred

### In Wizard (7 decisions total)
| Field | Step |
|---|---|
| Name | 1 |
| Template (top 6) | 1 |
| First URL or text source | 2 |
| Primary color | 3 |
| Widget position | 3 |
| Publish toggle | 4 |
| Copy embed code | 4 |

### Deferred to Dashboard
| Field | Why |
|---|---|
| Description | Zero impact on chatbot behavior |
| Welcome Message | Good default exists |
| Language | English covers majority of new users |
| Raw system prompt editor | Template covers this |
| Prompt protection toggle | Already defaults to on |
| Q&A pair sources | Power-user feature |
| Article Generation | Advanced feature |
| 20+ color pickers | Primary color is sufficient to start |
| Font selection | Nice-to-have |
| Pre-chat form, Post-chat survey | Complex features |
| File upload config | Not needed for first chatbot |
| Proactive messages, Transcript, Escalation, Feedback, Live handoff configs | All advanced |
| Telegram/Slack integration | Secondary channels |
| API access | Developer feature |
| Model tier, Temperature, Max tokens | Expert controls |

---

## 5. Activation Milestones

### Currently Tracked

| Milestone | Column | Status |
|---|---|---|
| Widget customization reviewed | `chatbots.widget_reviewed_at` | Partially localStorage-dependent |
| First conversation | `chatbots.first_conversation_at` | Fire-and-forget from chat route |
| Chatbot published | `chatbots.is_published` + `status` | Works |

### Not Tracked (Should Be)

| Milestone | Why It Matters |
|---|---|
| Account created as activation event | Starting point for funnel |
| First knowledge source added | Distinguishes "created and abandoned" from "started training" |
| First knowledge chunk processed | The chatbot becomes functional at this point |
| First test message by owner | Distinct from visitor messages |
| Embed code copied | Strong deploy intent signal |
| Time between milestones | Stall detection for re-engagement |
| Wizard step progression | Currently client-side only |

### Likely Drop-off Points

1. **After creation, before knowledge** -- redirected to complex page with no guidance
2. **During knowledge processing** -- async, no notification on completion, user navigates away
3. **Between knowledge added and first test** -- no "Try it now" prompt; checklist sends to Customize instead
4. **Between preview and publish** -- no nudge to complete deployment
5. **OnboardingChecklist dismissed** -- permanently gone (localStorage), incomplete steps invisible

---

## 6. Return-to-Wizard Design

### State Tracking

Add `onboarding_step` (integer, nullable) to `chatbots` table:
- `1` = created, wizard not started
- `2` = name/template done, at knowledge step
- `3` = knowledge done, at style step
- `4` = style done, at deploy step
- `null` = wizard completed

### Re-entry Points

| Location | Behavior |
|---|---|
| Chatbot list page | Badge on card: "Setup incomplete" + "Continue setup" link |
| Chatbot overview page | Banner: "You haven't finished setting up. [Continue setup]" |
| Dashboard page | Notification: "You have a chatbot not finished. [Continue]" |

### OnboardingChecklist Relationship

- Keep for users who completed the old flow (pre-wizard) or dismissed the wizard.
- For wizard users, the checklist is redundant once `onboarding_step` is null (completed).

---

## 7. Recommended Schema Changes

### Chatbot-level milestones
```sql
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS onboarding_step integer;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS first_knowledge_source_at timestamptz;
ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS first_knowledge_ready_at timestamptz;
-- first_conversation_at already exists
-- widget_reviewed_at already exists
-- is_published already exists
```

### User-level milestones
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_milestones jsonb DEFAULT '{}';
```

Shape:
```typescript
interface OnboardingMilestones {
  account_created_at: string;
  first_chatbot_created_at?: string;
  first_knowledge_ready_at?: string;
  first_conversation_at?: string;
  first_widget_deployed_at?: string;
}
```

This enables funnel queries like:
```sql
SELECT * FROM profiles
WHERE onboarding_milestones->>'first_chatbot_created_at' IS NOT NULL
  AND onboarding_milestones->>'first_knowledge_ready_at' IS NULL;
-- All users stuck between creation and knowledge
```

---

## 8. Accessibility Considerations

### Current Strengths
- Skip-to-content link in dashboard layout
- `aria-label` on sidebar navigation
- `aria-current="page"` on active nav items
- `aria-hidden="true"` on decorative icons
- Focus trap for mobile sidebar
- Focus ring styles on interactive elements

### Issues to Fix in Wizard

| Issue | Fix |
|---|---|
| No focus management between steps | Move focus to step heading on transition (`tabIndex={-1}` + `ref.focus()`) |
| Progress stepper is purely visual | Wrap in `<nav aria-label="Setup progress">` with `<ol>`, add `aria-current="step"` |
| Template selected state is visual only | Add `aria-pressed="true/false"` to template buttons |
| Processing state not announced | Add `aria-live="polite"` region for "Processing..." / "Ready" |
| No step change announcements | `aria-live="assertive"` hidden element: "Step 2 of 4: Train your chatbot" |
| Preset color swatches need keyboard access | Use `<button>` elements for swatches, not just color input |
| Confetti/animations | Respect `prefers-reduced-motion` via `motion-safe:` Tailwind variants |
| Step labels may overflow mobile | Test at 320px; hide connecting lines below `sm` breakpoint |

---

## 9. Implementation Notes

### Route Structure Option
Create wizard at `/onboarding/[chatbotId]` (outside dashboard layout group) or `/dashboard/chatbots/[id]/setup` with its own layout that does not inherit the sidebar.

### Key Files to Modify/Create
| File | Action |
|---|---|
| `src/components/dashboard/new-user-welcome.tsx` | Update CTA to point to wizard route |
| `src/app/(authenticated)/dashboard/layout.tsx` | No changes (wizard uses separate layout) |
| New: wizard layout + pages (4 steps) | Create |
| New: simplified knowledge component | Create (stripped-down version of knowledge page) |
| New: quick-style component | Create (primary color + position only) |
| New: simplified deploy component | Create (publish + script embed only) |
| `src/components/chatbots/OnboardingChecklist.tsx` | Gate on `onboarding_step` instead of localStorage |
| `src/app/(authenticated)/dashboard/page.tsx` | Add incomplete-wizard detection |
| `src/app/(authenticated)/dashboard/chatbots/page.tsx` | Add incomplete-wizard badge on chatbot cards |

### Existing 3-Step Creation Wizard
The current `/dashboard/chatbots/new` wizard can become **Step 1** of the new wizard (simplified to just Name + Template). Its progress stepper pattern is reusable.
