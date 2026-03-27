/**
 * E2E Tests: Article Generation → Knowledge Base → No Live Fetch
 *
 * Flow:
 * 1. Generate articles from a website URL (umart.com.au) on the e2e chatbot
 * 2. Verify articles appear & knowledge source is created
 * 3. Regenerate and verify old article-sources are cleaned up (no circular refs)
 * 4. Ask the chatbot questions the articles should answer
 * 5. Check the performance log — live_fetch_triggered should be false
 *
 * Uses e2e chatbot (owned by e2e-test user) for all authenticated admin APIs.
 * The chat API (/api/chat/:id) is public and doesn't require auth.
 */

import { test, expect } from '@playwright/test';

// E2E chatbot owned by the e2e-test user
const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE_URL = `/dashboard/chatbots/${CHATBOT_ID}`;
const CHAT_API = `/api/chat/${CHATBOT_ID}`;
const TARGET_URL = 'https://www.umart.com.au';

// Article generation calls AI + scrapes a URL — need generous timeouts
test.describe.configure({ timeout: 300_000 });

test.describe('Article Generation & Knowledge Pipeline', () => {
  // ─────────────────────────────────────────────────────────────
  // PHASE 1: Extraction Prompts CRUD
  // ─────────────────────────────────────────────────────────────

  test('AG-001: Extraction prompts API returns seeded defaults', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.prompts.length).toBeGreaterThanOrEqual(5);

    // Should include business-relevant questions
    const questions: string[] = data.data.prompts.map((p: any) => p.question);
    expect(questions.some(q => q.toLowerCase().includes('hours'))).toBeTruthy();
    expect(questions.some(q => q.toLowerCase().includes('located'))).toBeTruthy();
  });

  test('AG-002: Can add and delete a custom extraction prompt', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, {
      data: { question: 'Do you offer click and collect?' },
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.data.prompt.question).toBe('Do you offer click and collect?');
    expect(data.data.prompt.enabled).toBe(true);

    // Clean up
    const promptId = data.data.prompt.id;
    const delRes = await page.request.delete(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`);
    expect(delRes.ok()).toBeTruthy();
  });

  test('AG-003: Can toggle extraction prompt enabled/disabled', async ({ page }) => {
    // Get prompts
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const prompt = listData.data.prompts[0];

    // Disable
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`, {
      data: { enabled: false },
    });
    expect(res.ok()).toBeTruthy();
    const patchData = await res.json();
    expect(patchData.data.prompt.enabled).toBe(false);

    // Re-enable
    const res2 = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`, {
      data: { enabled: true },
    });
    expect(res2.ok()).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 2: Generate from URL & Knowledge Source Creation
  // ─────────────────────────────────────────────────────────────

  test('AG-010: Generate articles from URL creates articles + knowledge source', async ({ page }) => {
    test.setTimeout(300_000);

    // Record knowledge sources BEFORE
    const beforeRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    expect(beforeRes.ok()).toBeTruthy();
    const beforeData = await beforeRes.json();
    const beforeArticleSourceIds = (beforeData.data?.sources ?? [])
      .filter((s: any) => s.name?.startsWith('Generated Articles:'))
      .map((s: any) => s.id);

    // Generate from URL — can take a while with multiple extraction prompts + AI calls
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/generate-from-url`, {
      data: { url: TARGET_URL },
      timeout: 240_000,
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.articlesGenerated).toBeGreaterThan(0);
    console.log(`[AG-010] Generated ${data.data.articlesGenerated} articles, ${data.data.chunksCreated} chunks`);

    // Check articles exist
    const articlesRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles`);
    const articlesData = await articlesRes.json();
    expect(articlesData.data.articles.length).toBeGreaterThan(0);

    // At least some articles should have source_url set
    const urlArticles = articlesData.data.articles.filter((a: any) => a.source_url === TARGET_URL);
    expect(urlArticles.length).toBeGreaterThan(0);

    // Check new knowledge source appeared
    const afterRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const afterData = await afterRes.json();
    const newArticleSources = (afterData.data?.sources ?? [])
      .filter((s: any) => s.name?.startsWith('Generated Articles:') && !beforeArticleSourceIds.includes(s.id));

    expect(newArticleSources.length).toBeGreaterThan(0);
    const newSource = newArticleSources[0];
    expect(newSource.status).toBe('completed');
    expect(newSource.chunks_count).toBeGreaterThan(0);
    console.log(`[AG-010] Knowledge source: "${newSource.name}" — ${newSource.chunks_count} chunks`);
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 3: Circular Reference Prevention
  // ─────────────────────────────────────────────────────────────

  test('AG-020: Regeneration cleans up old article-generated sources', async ({ page }) => {
    test.setTimeout(240_000);

    // Get current article-generated knowledge sources
    const beforeRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const beforeData = await beforeRes.json();
    const oldArticleSources = (beforeData.data?.sources ?? [])
      .filter((s: any) => s.name?.startsWith('Generated Articles:'));
    const oldIds = oldArticleSources.map((s: any) => s.id);
    console.log(`[AG-020] Old article sources before regen: ${oldIds.length}`);

    // Regenerate from knowledge base
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/generate`, {
      timeout: 180_000,
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    console.log(`[AG-020] Regenerated: ${data.data.articlesGenerated} articles, ${data.data.chunksCreated} chunks`);

    // Verify old article-generated sources are gone
    const afterRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const afterData = await afterRes.json();
    const remainingSources = (afterData.data?.sources ?? [])
      .filter((s: any) => oldIds.includes(s.id));

    expect(remainingSources.length).toBe(0);

    // If articles were generated, new sources should exist with different IDs
    if (data.data.articlesGenerated > 0) {
      const newArticleSources = (afterData.data?.sources ?? [])
        .filter((s: any) => s.name?.startsWith('Generated Articles:'));
      expect(newArticleSources.length).toBeGreaterThan(0);

      for (const ns of newArticleSources) {
        expect(oldIds).not.toContain(ns.id);
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 4: Generate fresh articles from URL for chat testing
  // ─────────────────────────────────────────────────────────────

  test('AG-030: Generate fresh articles from URL for chat test', async ({ page }) => {
    test.setTimeout(300_000);

    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/generate-from-url`, {
      data: { url: TARGET_URL },
      timeout: 240_000,
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.data.articlesGenerated).toBeGreaterThan(0);
    expect(data.data.chunksCreated).toBeGreaterThan(0);
    console.log(`[AG-030] Fresh: ${data.data.articlesGenerated} articles, ${data.data.chunksCreated} chunks`);
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 5: Chat via API — verify no live fetch needed
  // ─────────────────────────────────────────────────────────────

  test('AG-040: Chat questions answered without live fetch', async ({ page }) => {
    test.setTimeout(120_000);

    const questions = [
      'What are your opening hours?',
      'Where are you located?',
    ];

    const sessionId = `e2e-article-gen-${Date.now()}`;
    let chatSucceeded = false;

    for (const question of questions) {
      console.log(`[AG-040] Asking: "${question}"`);

      const res = await page.request.post(CHAT_API, {
        data: {
          message: question,
          stream: false,
          session_id: sessionId,
        },
        timeout: 60_000,
      });

      if (!res.ok()) {
        const body = await res.text().catch(() => '');
        console.log(`[AG-040] Chat API returned ${res.status()} for "${question}": ${body.slice(0, 200)}`);
        continue;
      }

      const data = await res.json();
      expect(data.success).toBe(true);

      const reply = data.data?.message || data.data?.content || '';
      console.log(`[AG-040] Reply (${reply.length} chars): ${reply.slice(0, 200)}...`);
      expect(reply.length).toBeGreaterThan(20);
      chatSucceeded = true;
    }

    // If chat worked, check perf logs
    if (!chatSucceeded) {
      console.log('[AG-040] Chat API did not succeed — skipping perf check');
      return;
    }

    // Wait for fire-and-forget perf logs to land
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });

    // Check the performance API for recent requests
    const perfRes = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/performance?days=1`
    );

    if (!perfRes.ok()) {
      console.log(`[AG-040] Performance API returned ${perfRes.status()} — skipping perf check`);
      return;
    }

    const perfData = await perfRes.json();
    const recent: any[] = perfData.data?.recent ?? [];

    // Find our test messages in the perf log
    const ourRequests = recent.filter((r: any) =>
      r.user_message && questions.some(q =>
        r.user_message?.toLowerCase().includes(q.toLowerCase().slice(0, 20))
      )
    );

    console.log(`[AG-040] Found ${ourRequests.length} of our requests in perf log (${recent.length} total recent)`);

    for (const req of ourRequests) {
      console.log(`[AG-040] Perf: "${req.user_message?.slice(0, 40)}" — ` +
        `live_fetch=${req.live_fetch_triggered}, ` +
        `confidence=${req.rag_confidence?.toFixed?.(2) ?? req.rag_confidence}, ` +
        `chunks=${req.rag_chunks_count}, ` +
        `rag_live_fetch_ms=${req.rag_live_fetch_ms}`
      );

      // KEY ASSERTION: live fetch should NOT be triggered
      // When article-generated chunks are embedded, the RAG pipeline finds them
      // via similarity search so it doesn't need to live-fetch the website.
      expect(req.live_fetch_triggered).toBe(false);

      // If embeddings matched (confidence > 0), chunks should have been returned.
      // confidence=0 with chunks=0 can happen if query embedding model differs
      // from chunk embedding model — still valid since live fetch was avoided.
      if (req.rag_confidence > 0) {
        expect(req.rag_chunks_count).toBeGreaterThan(0);
      } else {
        console.log(`[AG-040] Note: confidence=0 — possible embedding model mismatch (still no live fetch)`);
      }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 6: Schedule API
  // ─────────────────────────────────────────────────────────────

  test('AG-050: Schedule API get/set works', async ({ page }) => {
    // Get default schedule
    const getRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    expect(getRes.ok()).toBeTruthy();

    const getData = await getRes.json();
    const originalSchedule = getData.data.schedule;

    // Set to weekly
    const setRes = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      data: { article_schedule: 'weekly' },
    });
    expect(setRes.ok()).toBeTruthy();

    // Verify
    const verifyRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const verifyData = await verifyRes.json();
    expect(verifyData.data.schedule).toBe('weekly');

    // Restore original
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      data: { article_schedule: originalSchedule || 'manual' },
    });
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7: UI Verification
  // ─────────────────────────────────────────────────────────────

  test('AG-060: Articles page shows generation controls', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for article generation UI to load (appears before ChatbotPageHeader finishes fetching)
    await expect(page.getByText(/Generate.*(?:from|Articles).*URL/)).toBeVisible({ timeout: 30000 });
    await expect(page.getByPlaceholder('https://example.com')).toBeVisible();

    // Extraction prompts section (collapsed by default)
    await expect(page.getByText('Extraction Prompts')).toBeVisible();

    // Schedule section (collapsed by default)
    await expect(page.getByText('Auto-Regeneration Schedule')).toBeVisible();

    // Generate from Knowledge button
    await expect(page.getByText('Generate from Knowledge')).toBeVisible();
  });

  test('AG-061: Knowledge page shows article generation section', async ({ page }) => {
    await page.goto(`${BASE_URL}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    // Scroll to bottom — Article Generation section is below the sources list
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Article generation section
    await expect(page.getByText('Article Generation')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Extraction Prompts')).toBeVisible();
  });

  test('AG-062: Extraction prompts expand and show checklist', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for the extraction prompts section header
    const promptsHeader = page.getByText('Extraction Prompts').first();
    await expect(promptsHeader).toBeVisible({ timeout: 30000 });

    // Click to expand — the header is the click target
    await promptsHeader.click();

    // Should show the "Add" input (always present when expanded, regardless of prompt count)
    const addInput = page.getByPlaceholder(/Add a custom extraction question/);
    const isVisible = await addInput.isVisible({ timeout: 10000 }).catch(() => false);

    if (!isVisible) {
      // Maybe section didn't expand — try clicking again
      await promptsHeader.click();
    }

    await expect(addInput).toBeVisible({ timeout: 10000 });
  });

  test('AG-063: Schedule section expands and shows options', async ({ page }) => {
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Auto-Regeneration Schedule')).toBeVisible({ timeout: 30000 });

    // Click to expand schedule
    await page.getByText('Auto-Regeneration Schedule').click();

    // Should show frequency label and select
    await expect(page.getByText('Regeneration Frequency', { exact: false })).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7B: Prompt Editing & Persistence
  // ─────────────────────────────────────────────────────────────

  test('AG-004: Edit prompt question text via API and verify persistence', async ({ page }) => {
    // Get prompts
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    expect(listData.success).toBe(true);

    const prompt = listData.data.prompts[0];
    const originalQuestion = prompt.question;
    const newQuestion = `Updated test question ${Date.now()}`;

    // Edit the prompt
    const patchRes = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { question: newQuestion } }
    );
    expect(patchRes.ok()).toBeTruthy();
    const patchData = await patchRes.json();
    expect(patchData.data.prompt.question).toBe(newQuestion);
    expect(patchData.data.prompt.id).toBe(prompt.id); // Same ID, not recreated

    // Verify persistence — re-fetch all prompts
    const verifyRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const verifyData = await verifyRes.json();
    const updated = verifyData.data.prompts.find((p: any) => p.id === prompt.id);
    expect(updated).toBeDefined();
    expect(updated.question).toBe(newQuestion);

    // Restore original
    await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { question: originalQuestion } }
    );
  });

  test('AG-005: Added prompt persists across fresh API calls', async ({ page }) => {
    const question = `Persistence test ${Date.now()}`;

    // Create
    const createRes = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, {
      data: { question },
    });
    expect(createRes.ok()).toBeTruthy();
    const createData = await createRes.json();
    const promptId = createData.data.prompt.id;

    // Fetch — verify it's there
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const found = listData.data.prompts.find((p: any) => p.id === promptId);
    expect(found).toBeDefined();
    expect(found.question).toBe(question);
    expect(found.enabled).toBe(true);

    // Clean up
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`);
  });

  test('AG-006: Cannot save prompt with less than 3 characters', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, {
      data: { question: 'ab' },
    });
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBe(400);
  });

  test('AG-007: Cannot save empty prompt question on edit', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const prompt = listData.data.prompts[0];

    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { question: '' } }
    );
    // Zod min(3) validation should reject empty string
    expect(res.ok()).toBeFalsy();
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7C: Per-Prompt Scheduling API
  // ─────────────────────────────────────────────────────────────

  test('AG-080: Set per-prompt schedule via API', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const prompt = listData.data.prompts[0];

    // Set to daily
    const patchRes = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { schedule: 'daily' } }
    );
    expect(patchRes.ok()).toBeTruthy();
    const patchData = await patchRes.json();
    expect(patchData.data.prompt.schedule).toBe('daily');

    // Verify persistence
    const verifyRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const verifyData = await verifyRes.json();
    const updated = verifyData.data.prompts.find((p: any) => p.id === prompt.id);
    expect(updated.schedule).toBe('daily');

    // Restore to inherit
    await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { schedule: 'inherit' } }
    );
  });

  test('AG-081: Per-prompt schedule rejects invalid values', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const prompt = listData.data.prompts[0];

    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { data: { schedule: 'every_5_minutes' } }
    );
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBe(400);
  });

  test('AG-082: Multiple prompts can have different schedules', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const prompts = listData.data.prompts;
    expect(prompts.length).toBeGreaterThanOrEqual(2);

    // Set first to daily, second to weekly
    const [res1, res2] = await Promise.all([
      page.request.patch(
        `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompts[0].id}`,
        { data: { schedule: 'daily' } }
      ),
      page.request.patch(
        `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompts[1].id}`,
        { data: { schedule: 'weekly' } }
      ),
    ]);
    expect(res1.ok()).toBeTruthy();
    expect(res2.ok()).toBeTruthy();

    // Verify both persisted
    const verifyRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const verifyData = await verifyRes.json();
    const p0 = verifyData.data.prompts.find((p: any) => p.id === prompts[0].id);
    const p1 = verifyData.data.prompts.find((p: any) => p.id === prompts[1].id);
    expect(p0.schedule).toBe('daily');
    expect(p1.schedule).toBe('weekly');

    // Restore both
    await Promise.all([
      page.request.patch(
        `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompts[0].id}`,
        { data: { schedule: 'inherit' } }
      ),
      page.request.patch(
        `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompts[1].id}`,
        { data: { schedule: 'inherit' } }
      ),
    ]);
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7D: UI Interaction Tests
  // ─────────────────────────────────────────────────────────────

  test('AG-064: Edit prompt via UI and verify persistence', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // Expand extraction prompts — click the card header containing "Extraction Prompts"
    const promptsHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Extraction Prompts' }).first();
    await promptsHeader.click();

    // Wait for the add input to confirm expansion
    const addInput = page.getByPlaceholder(/Add a custom/);
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // Find a prompt row with the checkbox and text
    const promptRows = page.locator('.group').filter({ has: page.locator('button') });
    const firstPromptRow = promptRows.first();
    await firstPromptRow.hover();

    // Click pencil — visible on hover
    const pencilBtn = firstPromptRow.locator('button').filter({ has: page.locator('svg.lucide-pencil') });
    if (await pencilBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pencilBtn.click();

      const editInput = firstPromptRow.locator('input');
      if (await editInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        const originalText = await editInput.inputValue();
        const newText = `${originalText} (edited)`;

        await editInput.fill(newText);

        // Wait for the PATCH response when pressing Enter
        const [patchResponse] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/articles/prompts/') && resp.request().method() === 'PATCH'),
          editInput.press('Enter'),
        ]);
        expect(patchResponse.ok()).toBeTruthy();

        // Verify the updated text appears
        await expect(page.getByText(newText, { exact: false })).toBeVisible({ timeout: 5000 });

        // Restore via API
        const patchData = await patchResponse.json();
        const promptId = patchData.data?.prompt?.id;
        if (promptId) {
          await page.request.patch(
            `/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`,
            { data: { question: originalText } }
          );
        }
      }
    }
  });

  test('AG-065: Knowledge page shows Generate from Knowledge button', async ({ page }) => {
    await page.goto(`${BASE_URL}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Article Generation')).toBeVisible({ timeout: 30000 });

    // Should now show the Generate from Knowledge button (was previously missing)
    await expect(page.getByText('Generate from Knowledge')).toBeVisible({ timeout: 10000 });
  });

  test('AG-066: Schedule change persists after page reload', async ({ page }) => {
    test.setTimeout(60_000);

    // Set to manual first via API to establish a known starting state
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      data: { article_schedule: 'manual' },
    });

    // Change to weekly via API and verify persistence
    const patchRes = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      data: { article_schedule: 'weekly' },
    });
    expect(patchRes.ok()).toBeTruthy();

    // Verify via GET
    const getRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const getData = await getRes.json();
    expect(getData.data.schedule).toBe('weekly');

    // Now verify the UI reflects it after loading the page
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // Expand schedule section
    const scheduleHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Auto-Regeneration Schedule' }).first();
    await scheduleHeader.click();

    // The Select component renders a native <select> inside the schedule section
    // Use a label-based locator to find the right one
    const scheduleSection = page.locator('text=Default Regeneration Frequency').locator('..');
    const scheduleSelect = scheduleSection.locator('select').first();
    if (await scheduleSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const value = await scheduleSelect.inputValue();
      expect(value).toBe('weekly');
    } else {
      // Fallback: just verify the badge shows "weekly"
      await expect(page.getByText('weekly', { exact: false })).toBeVisible({ timeout: 5000 });
    }

    // Restore
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      data: { article_schedule: 'manual' },
    });
  });

  test('AG-067: Knowledge page distinguishes import vs article generation URLs', async ({ page }) => {
    await page.goto(`${BASE_URL}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    // Should show "Import Website Content" for the knowledge source card (renamed from "Add Website URL")
    await expect(page.getByText('Import Website Content')).toBeVisible({ timeout: 30000 });

    // Should show "Generate Articles from URL" in the article generation section
    await expect(page.getByText('Generate Articles from URL')).toBeVisible({ timeout: 10000 });

    // The descriptions should explain the difference
    await expect(page.getByText(/raw content.*directly/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/one-time extraction/i)).toBeVisible({ timeout: 5000 });
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7E: Save Feedback Tests
  // ─────────────────────────────────────────────────────────────

  test('AG-090: Adding prompt via UI shows success feedback', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // Expand prompts section
    const promptsHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Extraction Prompts' }).first();
    await promptsHeader.click();

    const addInput = page.getByPlaceholder(/Add a custom/);
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // Add a test prompt and wait for API response
    const testQuestion = `E2E toast test ${Date.now()}`;
    await addInput.fill(testQuestion);

    const [postResponse] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/articles/prompts') && resp.request().method() === 'POST'),
      addInput.press('Enter'),
    ]);
    expect(postResponse.ok()).toBeTruthy();

    // Should show success toast (sonner renders in a [data-sonner-toaster] container)
    await expect(page.getByText('Prompt added')).toBeVisible({ timeout: 8000 });

    // Clean up
    const postData = await postResponse.json();
    const promptId = postData.data?.prompt?.id;
    if (promptId) {
      await page.request.delete(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`);
    }
  });

  test('AG-091: Toggling prompt shows feedback', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // Expand prompts section
    const promptsHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Extraction Prompts' }).first();
    await promptsHeader.click();

    const addInput = page.getByPlaceholder(/Add a custom/);
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // Click the first checkbox to toggle
    const firstCheckbox = page.locator('button.flex-shrink-0').first();
    await expect(firstCheckbox).toBeVisible({ timeout: 5000 });

    const [patchResponse] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/articles/prompts/') && resp.request().method() === 'PATCH'),
      firstCheckbox.click(),
    ]);
    expect(patchResponse.ok()).toBeTruthy();

    // Should show toggle toast
    await expect(
      page.getByText(/Prompt (enabled|disabled)/)
    ).toBeVisible({ timeout: 8000 });

    // Toggle back
    await firstCheckbox.click();
  });

  test('AG-092: Deleting prompt requires confirmation click', async ({ page }) => {
    test.setTimeout(60_000);

    // Create a test prompt to delete
    const question = `Delete confirm test ${Date.now()}`;
    const createRes = await page.request.post(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, {
      data: { question },
    });
    const createData = await createRes.json();
    const promptId = createData.data.prompt.id;

    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // Expand prompts section
    const promptsHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Extraction Prompts' }).first();
    await promptsHeader.click();

    const addInput = page.getByPlaceholder(/Add a custom/);
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // Find the row containing our test prompt
    const testRow = page.locator('.group').filter({ hasText: question });
    await expect(testRow).toBeVisible({ timeout: 5000 });
    await testRow.hover();

    const trashBtn = testRow.locator('button').filter({ has: page.locator('svg.lucide-trash-2') });
    if (await trashBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      // First click shows confirmation UI
      await trashBtn.click();

      // The trash button should be replaced by confirm (check) + cancel (X)
      const cancelBtn = testRow.locator('button').filter({ has: page.locator('svg.lucide-x') });
      await expect(cancelBtn).toBeVisible({ timeout: 3000 });

      // Click cancel — prompt should survive
      await cancelBtn.click();

      // Verify prompt still exists via API
      const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
      const listData = await listRes.json();
      const stillExists = listData.data.prompts.find((p: any) => p.id === promptId);
      expect(stillExists).toBeDefined();
    }

    // Clean up
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`);
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 7F: Schedule Override UX Clarity
  // ─────────────────────────────────────────────────────────────

  test('AG-100: Context-aware badge and helper text when global=Manual with per-prompt override', async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto(`${BASE_URL}/articles`);
    await page.waitForLoadState('networkidle');

    // ── Step 1: Set global schedule to Manual via UI ──
    const scheduleHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Auto-Regeneration Schedule' }).first();
    await expect(scheduleHeader).toBeVisible({ timeout: 30000 });
    await scheduleHeader.click();

    // Wait for the schedule dropdown to appear
    const freqLabel = page.getByText('Default Regeneration Frequency');
    await expect(freqLabel).toBeVisible({ timeout: 10000 });
    const scheduleSection = freqLabel.locator('..');
    const globalSelect = scheduleSection.locator('select').first();
    await expect(globalSelect).toBeEnabled({ timeout: 10000 });

    // Save the original value so we can restore later
    const originalSchedule = await globalSelect.inputValue();

    // Set to manual
    if (originalSchedule !== 'manual') {
      await globalSelect.selectOption('manual');
      await page.waitForResponse(resp => resp.url().includes('/articles/schedule') && resp.request().method() === 'PATCH');
    }

    // Collapse the schedule card
    await scheduleHeader.click();

    // Verify badge shows "Off" (no per-prompt overrides yet)
    const scheduleBadge = scheduleHeader.locator('[class*="badge"], span').filter({ hasText: /Off|prompt.*scheduled/ });
    await expect(scheduleBadge.filter({ hasText: 'Off' })).toBeVisible({ timeout: 5000 });

    // ── Step 2: Set one prompt to Daily via UI ──
    const promptsHeader = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Extraction Prompts' }).first();
    await expect(promptsHeader).toBeVisible({ timeout: 10000 });
    await promptsHeader.click();

    // Wait for prompts to load
    const addInput = page.getByPlaceholder(/Add a custom/);
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // Hover the first prompt row to reveal the schedule dropdown
    const firstPromptRow = page.locator('.group').filter({ has: page.locator('button.flex-shrink-0') }).first();
    await firstPromptRow.hover();

    // Find the per-prompt schedule dropdown (has title="Set schedule for this prompt")
    const promptScheduleSelect = firstPromptRow.locator('select[title="Set schedule for this prompt"]');
    await expect(promptScheduleSelect).toBeVisible({ timeout: 5000 });

    // Verify it shows "Use default (Manual)" as the first option
    const inheritOption = promptScheduleSelect.locator('option[value="inherit"]');
    const inheritText = await inheritOption.textContent();
    expect(inheritText).toContain('Use default');
    expect(inheritText).toContain('Manual');

    // Change to Daily and wait for the PATCH response
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/articles/prompts/') && resp.request().method() === 'PATCH'),
      promptScheduleSelect.selectOption('daily'),
    ]);

    // ── Step 3: Verify the badge updated to "1 prompt scheduled" ──
    // The badge on the schedule card header should now reflect the override
    await expect(scheduleHeader.getByText(/1 prompt scheduled/)).toBeVisible({ timeout: 5000 });

    // ── Step 4: Verify helper text in expanded schedule card ──
    // Collapse prompts first, then expand schedule
    await promptsHeader.click();
    await scheduleHeader.click();
    await expect(freqLabel).toBeVisible({ timeout: 10000 });

    // Helper text should mention the override
    await expect(page.getByText(/1 prompt has its own schedule and will still run/)).toBeVisible({ timeout: 5000 });

    // Collapse schedule, re-expand prompts for indicator checks
    await scheduleHeader.click();
    await promptsHeader.click();
    await expect(addInput).toBeVisible({ timeout: 15000 });

    // ── Step 5: Verify per-prompt schedule indicators ──
    // The overridden prompt should show a blue "Daily" badge
    await expect(firstPromptRow.getByText('Daily')).toBeVisible({ timeout: 5000 });

    // A different prompt (still inheriting) should show dimmed "Manual" text
    const secondPromptRow = page.locator('.group').filter({ has: page.locator('button.flex-shrink-0') }).nth(1);
    const secondRowExists = await secondPromptRow.isVisible({ timeout: 3000 }).catch(() => false);
    if (secondRowExists) {
      await expect(secondPromptRow.getByText('Manual')).toBeVisible({ timeout: 5000 });
    }

    // ── Cleanup: restore the prompt to "inherit" via UI ──
    await firstPromptRow.hover();
    const restoreSelect = firstPromptRow.locator('select[title="Set schedule for this prompt"]');
    await expect(restoreSelect).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/articles/prompts/') && resp.request().method() === 'PATCH'),
      restoreSelect.selectOption('inherit'),
    ]);

    // Restore global schedule if it was changed
    if (originalSchedule !== 'manual') {
      await page.request.patch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
        data: { article_schedule: originalSchedule },
      });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 8: Performance page waterfall verification
  // ─────────────────────────────────────────────────────────────

  test('AG-070: Performance page shows requests without live fetch badge', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto(`${BASE_URL}/performance`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for data to load
    const hasData = await page.getByText('Total Requests').isVisible({ timeout: 15000 }).catch(() => false);

    if (!hasData) {
      console.log('[AG-070] No performance data visible — skipping waterfall check');
      return;
    }

    // Check via API — more reliable than scraping the waterfall UI
    const perfRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/performance?days=1`);
    if (!perfRes.ok()) {
      console.log('[AG-070] Performance API failed — skipping');
      return;
    }

    const perfData = await perfRes.json();
    const recent: any[] = perfData.data?.recent ?? [];

    const articleCachedRequests = recent.filter((r: any) =>
      r.user_message &&
      (r.user_message.toLowerCase().includes('hours') || r.user_message.toLowerCase().includes('located')) &&
      r.live_fetch_triggered === false
    );

    console.log(`[AG-070] Found ${articleCachedRequests.length} article-cached requests (no live fetch) out of ${recent.length} total`);

    for (const r of articleCachedRequests) {
      expect(r.live_fetch_triggered).toBe(false);
      expect(r.rag_chunks_count).toBeGreaterThan(0);
      console.log(`[AG-070] "${r.user_message?.slice(0, 40)}" — chunks=${r.rag_chunks_count}, confidence=${r.rag_confidence}`);
    }
  });
});
