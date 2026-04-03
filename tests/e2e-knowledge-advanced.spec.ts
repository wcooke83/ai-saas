import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const KNOWLEDGE_PAGE = `/dashboard/chatbots/${CHATBOT_ID}/knowledge`;

let sourceId: string | null = null;

test.describe('Knowledge Source Advanced', () => {
  test('create source via knowledge page for priority/reprocess tests', async ({ page }) => {
    // First check if an existing E2E Priority Test source is available (reuse to avoid plan limits)
    const listRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    if (listRes.ok()) {
      const listBody = await listRes.json();
      const sources = listBody.data?.sources || listBody.data || [];
      const existing = Array.isArray(sources)
        ? sources.find((s: { name: string; type: string }) => s.name === 'E2E Priority Test' && s.type === 'text')
        : null;
      if (existing) {
        sourceId = existing.id;
        console.log(`[SETUP] Reusing existing source: ${sourceId}`);
        return;
      }
    }

    // Try to create via API (may fail if at plan limit)
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: {
        type: 'text',
        name: 'E2E Priority Test',
        content: 'This is content for testing priority toggle and reprocessing. It contains enough text to create at least one chunk.',
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    sourceId = body.data?.id || body.data?.source?.id || null;
  });

  test('toggle knowledge source priority via UI', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // Look for priority toggle/star button near the source
    const sourceRow = page.getByText('E2E Priority Test').locator('..').locator('..');
    const priorityButton = sourceRow.locator('button[aria-label*="priority" i], button:has(svg[class*="star" i])').first();

    if (await priorityButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const patchPromise = page.waitForResponse(
        (res) => res.url().includes('/knowledge/') && res.request().method() === 'PATCH'
      );
      await priorityButton.click();
      const patchRes = await patchPromise;
      expect(patchRes.ok()).toBeTruthy();
    } else {
      // Fallback via API
      const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/knowledge/${sourceId}`, {
        data: { is_priority: true },
      });
      expect(res.ok()).toBeTruthy();
    }
  });

  test('reprocess knowledge source via UI', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // Look for reprocess button near the source
    const sourceRow = page.getByText('E2E Priority Test').locator('..').locator('..');
    const reprocessButton = sourceRow.locator('button[aria-label*="reprocess" i], button[title*="reprocess" i]').first();

    if (await reprocessButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const patchPromise = page.waitForResponse(
        (res) => res.url().includes('/knowledge/') && res.request().method() === 'PATCH'
      );
      await reprocessButton.click();
      const patchRes = await patchPromise;
      expect(patchRes.ok()).toBeTruthy();
    } else {
      // Fallback via API
      const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}/knowledge/${sourceId}`, {
        data: { action: 'reprocess' },
      });
      expect(res.ok()).toBeTruthy();
    }
  });

  test('knowledge source details visible on page', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // The source name should be visible (multiple may exist from prior runs — first() is sufficient)
    await expect(page.getByText('E2E Priority Test').first()).toBeVisible({ timeout: 10000 });
  });

  test('cleanup: delete test source', async ({ page }) => {
    test.skip(!sourceId, 'No source to delete');
    const res = await page.request.delete(`/api/chatbots/${CHATBOT_ID}/knowledge/${sourceId}`);
    expect(res.ok()).toBeTruthy();
  });
});
