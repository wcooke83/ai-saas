# Knowledge Page UX Audit

**Page:** `/dashboard/chatbots/:id/knowledge`
**Date:** 2026-03-24
**Scope:** Article generation, extraction prompts, scheduling, URL generation, save feedback
**Status:** All issues FIXED (see implementation notes in each section)

---

## 1. Per-Prompt Scheduling

**Current behavior:** A single `article_schedule` field on the `chatbots` table controls regeneration frequency for ALL prompts. The cron job (`/api/cron/regenerate-articles`) calls `generateHelpArticles()` which runs every enabled prompt at the same interval.

**Problem:** Some extraction prompts may need different frequencies. E.g., "What are your business hours?" rarely changes (monthly), while "What promotions are available?" should run daily.

**Recommendation:**

Add per-prompt schedule fields to `article_extraction_prompts`:

```sql
ALTER TABLE article_extraction_prompts
  ADD COLUMN schedule text DEFAULT 'inherit',  -- 'inherit' | 'manual' | 'daily' | 'weekly' | 'monthly'
  ADD COLUMN last_generated_at timestamptz;
```

- `inherit` = use the chatbot-level schedule (current behavior, backwards compatible)
- Per-prompt overrides allow fine-grained control
- UI: add a small schedule dropdown next to each prompt in the extraction prompts list
- Cron logic change: instead of running all prompts at once, check each prompt's effective schedule independently

**Priority:** Medium - useful but not blocking

---

## 2. Extraction Prompt Editing Does Not Appear to Save

**Root cause analysis:** The `savePromptEdit()` function in `ArticleGeneration.tsx:167-181` sends a correct PATCH request and updates local state. The API handler in `prompts/[promptId]/route.ts:24-50` validates and persists correctly. **The API code appears correct.**

**Likely UX issues causing the perceived bug:**

### 2a. No success feedback after saving
After a successful prompt edit, there is **no toast, no visual confirmation, nothing**. Compare:
- Schedule update: shows `toast.success('Schedule updated to ...')`
- Prompt edit: silently closes edit mode

The user edits, presses Enter, the field reverts to display mode... and they have no idea if it saved. If they navigate away and come back, the prompts panel is **collapsed by default** (`showPrompts = false`), so they can't immediately verify.

**Fix:** Add `toast.success('Prompt updated')` after successful save in `savePromptEdit()`.

### 2b. No loading state during save
The save button (check icon) has no disabled/loading state during the API call. If the network is slow, the user might click again or navigate away.

**Fix:** Add a `savingPrompt` state boolean, disable the check button and show a small spinner during save.

### 2c. Clicking outside edit mode silently discards changes
If the user edits text then clicks anywhere other than the check/X buttons (e.g., clicking another prompt's toggle, collapsing the section, etc.), the edit state is lost with no warning. There's no `onBlur` handler on the input.

**Fix:** Add an `onBlur` handler that either auto-saves or shows a "Discard changes?" confirmation.

### 2d. Collapsing the section loses edit state
Clicking the "Extraction Prompts" header collapses the section via `setShowPrompts(!showPrompts)`. If the user is mid-edit, the collapse unmounts the input and the edit is silently lost.

**Fix:** Prevent collapse while `editingPromptId` is set, or auto-save before collapsing.

**Priority:** High - this is actively confusing users

---

## 3. URL Persistence for Scheduled Regeneration

**Current behavior:** The "Generate from Website URL" input is **ephemeral** - it triggers a one-time scrape+generate action and then clears itself. The URL is stored on the resulting `help_articles.source_url` for display purposes only.

**The scheduled regeneration cron (`regenerate-articles`) only calls `generateHelpArticles()` which regenerates from existing knowledge chunks.** It does NOT re-scrape any URLs.

**The schedule description text is misleading:**
> "Articles will be regenerated from knowledge sources **and website URLs** on a {schedule} basis."

This text (line 417-418 in `ArticleGeneration.tsx`) implies URLs will be re-scraped on schedule, which is not true.

**Recommendation — Two options:**

### Option A: Store URLs for scheduled re-scraping (larger scope)

Add a `scheduled_urls` table or a JSON column on chatbots:
```sql
ALTER TABLE chatbots ADD COLUMN article_source_urls text[] DEFAULT '{}';
```

Update the cron to:
1. Re-scrape each stored URL
2. Run `generateArticlesFromUrl()` for each
3. Then run `generateHelpArticles()` for knowledge-base content

UI: Show saved URLs as a list with add/remove, separate from the one-time generation input.

### Option B: Fix the misleading text (quick fix)

Change the description to accurately reflect behavior:
> "Articles will be regenerated from your existing knowledge sources on a {schedule} basis."

And add a note near the URL input:
> "This is a one-time generation. To keep articles updated from this URL, add the URL as a knowledge source instead."

**Priority:** High - the current text creates false expectations

---

## 4. Save Indicators

**Missing feedback across the component:**

| Action | Has loading state? | Has success feedback? | Has error feedback? |
|--------|-------------------|----------------------|-------------------|
| Generate from URL | Spinner + "Scraping..." | Toast success | Toast error |
| Generate from Knowledge | Spinner + "Generating..." | Toast success | Toast error |
| Add prompt | No | No | Toast error |
| Toggle prompt | No (instant optimistic) | No | Toast error |
| Edit prompt | No | No | Toast error |
| Delete prompt | No | No | Toast error |
| Update schedule | No | Toast success | Toast error |

**Recommendations:**

1. **Add `toast.success()` for all mutating actions** — prompt add, edit, delete, toggle
2. **Add loading states for prompt CRUD:**
   - `addPrompt`: disable "Add" button and show spinner during save
   - `savePromptEdit`: disable check button and show spinner during save
   - `deletePrompt`: disable trash button and show spinner (or optimistic removal with undo toast)
3. **Add a subtle "Saving..." indicator** near the schedule dropdown when `updateSchedule` is in flight
4. **Consider optimistic updates with rollback** for toggle and delete (toggle already does this, delete does not)

**Priority:** High - users have no confidence their changes are persisting

---

## 5. E2E Test Coverage Gaps

### Existing coverage (in `tests/e2e-article-generation.spec.ts`):
- AG-001: Prompt seeding defaults
- AG-002: Add and delete custom prompt
- AG-003: Toggle prompt enabled/disabled
- AG-010: Generate from URL creates articles + knowledge source
- AG-020: Regeneration cleans up old sources (circular ref prevention)
- AG-030: Fresh URL generation for chat testing
- AG-040: Chat answered without live fetch
- AG-050: Schedule API get/set
- AG-060-063: UI element visibility
- AG-070: Performance page verification

### Missing tests needed:

**Prompt editing persistence (highest priority):**
```
AG-004: Edit prompt question text and verify persistence
  1. GET prompts, pick one
  2. PATCH with new question text
  3. GET prompts again
  4. Assert question text changed in DB
  5. Verify original prompt ID is retained (not recreated)
```

**Prompt editing via UI:**
```
AG-064: Edit prompt via UI interaction
  1. Navigate to knowledge or articles page
  2. Expand extraction prompts
  3. Click pencil icon on a prompt
  4. Type new text
  5. Press Enter or click check
  6. Verify text updated in UI
  7. Refresh page, re-expand, verify persistence
```

**URL input and generation from knowledge page:**
```
AG-065: Generate from URL on knowledge page
  1. Navigate to knowledge page
  2. Enter URL in "Generate from Website URL" field
  3. Click Generate
  4. Verify articles created (check articles API)
  5. Verify knowledge source created (check knowledge API)
```

**Schedule persistence via UI:**
```
AG-066: Schedule change persists via UI
  1. Navigate to knowledge/articles page
  2. Expand schedule section
  3. Change dropdown to "weekly"
  4. Refresh page
  5. Re-expand schedule
  6. Verify dropdown still shows "weekly"
  7. Clean up: set back to "manual"
```

**Schedule + cron integration:**
```
AG-051: Cron skips chatbots not due for regeneration
  1. Set schedule to "daily"
  2. Trigger generation (sets article_last_generated_at to now)
  3. Call cron endpoint
  4. Verify chatbot was skipped (not enough time elapsed)

AG-052: Cron processes chatbots that are due
  1. Set schedule to "daily"
  2. Manually set article_last_generated_at to 25 hours ago (via admin API)
  3. Call cron endpoint
  4. Verify chatbot was processed
  5. Verify article_last_generated_at was updated
```

**Prompt add persistence:**
```
AG-005: Added prompt persists across page loads
  1. POST new prompt
  2. GET prompts — verify it's in the list
  3. Navigate away and back
  4. GET prompts again — still there
  5. Clean up: DELETE the prompt
```

**Edge cases:**
```
AG-006: Cannot save empty prompt (min 3 chars validation)
  1. POST with question: "ab"
  2. Expect 400 error

AG-007: Disabled prompts are excluded from generation
  1. Disable all but one prompt
  2. Generate from URL
  3. Verify only articles from the enabled prompt exist
  4. Re-enable all prompts
```

---

## 6. Additional Issues Found

### 6a. Knowledge page doesn't show "Generate from Knowledge" button
The `ArticleGeneration` component on the knowledge page is rendered without `showKnowledgeGenerate={true}`:

```tsx
// knowledge/page.tsx line 667
<ArticleGeneration chatbotId={id} onGenerated={() => fetchSources()} />
```

This means users on the knowledge page can only generate from URL, not from existing knowledge sources. The articles page has this button, but users managing knowledge would expect to trigger regeneration from there too.

**Fix:** Add `showKnowledgeGenerate={true}` to the knowledge page's `ArticleGeneration` instance.

### 6b. Extraction prompts collapsed by default — low discoverability
`showPrompts` defaults to `false`. New users see "Extraction Prompts (10/10 active)" but have to click to see what they are. Most users won't know these exist or that they can customize them.

**Recommendation:** Default to expanded on first visit (or when prompts haven't been customized), collapsed after the user has interacted with them. Alternatively, add a brief description visible in the collapsed state: "Customize what questions are extracted into articles."

### 6c. Schedule section description is misleading
As noted in section 3, the text says URLs will be re-scraped on schedule, which is not true. The cron only regenerates from knowledge chunks.

### 6d. No confirmation before deleting a prompt
`deletePrompt()` fires immediately on clicking the trash icon — no confirmation dialog. Compare this to knowledge source deletion which shows a confirm dialog. A misclick deletes the prompt with no undo.

**Fix:** Add confirmation or an undo toast (preferred for lightweight actions).

### 6e. Prompt sort order not draggable
Prompts have a `sort_order` field but there's no UI to reorder them. The order affects which articles are generated first. Consider adding drag-to-reorder or move-up/move-down buttons.

### 6f. No indication of which prompts produced articles
After generation, there's no way to see which prompts produced articles and which were skipped (returned `{"skip": true}`). The articles page shows `extraction_prompt_id` but the prompt text isn't displayed alongside the article.

**Recommendation:** On the articles page, show the extraction prompt question that generated each article. On the prompts list, show a count of articles generated by each prompt.

### 6g. Embedding provider shown in source list could confuse users
The knowledge page shows `embedding_provider` info in the source cards. This is an implementation detail that most users won't understand. Consider hiding this unless there's a mismatch issue.

### 6h. "Generate from Website URL" on knowledge page vs knowledge source "Add Website URL"
Both exist on the same page with similar names but different purposes:
- "Add Website URL" (top of page) = scrapes + chunks + embeds as knowledge source
- "Generate from Website URL" (bottom in Article Generation section) = scrapes + generates articles via AI + embeds articles as knowledge

This is confusing. Users may not understand the difference.

**Recommendation:** Add clearer descriptions or rename:
- "Add Website URL" → "Import Website Content" with description "Raw content added directly to knowledge base"
- "Generate from Website URL" → "Generate Articles from URL" with description "AI generates structured help articles from the website, then adds them to knowledge base"

---

## Summary of Priorities

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 2 | Prompt editing appears broken (missing feedback) | **High** | Small |
| 3 | URL not persisted for scheduled regen + misleading text | **High** | Medium (text fix: Small) |
| 4 | Missing save indicators across all actions | **High** | Small |
| 6d | No delete confirmation for prompts | **High** | Small |
| 6a | Knowledge page missing "Generate from Knowledge" button | **Medium** | Trivial |
| 6h | Confusing duplicate URL inputs | **Medium** | Small |
| 5 | E2E test gaps (prompt editing, schedule UI, cron) | **Medium** | Medium |
| 1 | Per-prompt scheduling | **Medium** | Large |
| 6b | Prompts collapsed by default, low discoverability | **Low** | Small |
| 6e | No drag-to-reorder for prompts | **Low** | Medium |
| 6f | No prompt-to-article mapping in UI | **Low** | Medium |
| 6g | Embedding provider detail visible to users | **Low** | Trivial |
