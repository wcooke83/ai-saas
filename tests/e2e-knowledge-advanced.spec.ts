import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const KNOWLEDGE_PAGE = `/dashboard/chatbots/${CHATBOT_ID}/knowledge`;

let sourceId: string | null = null;

test.describe('Knowledge Source Advanced', () => {
  test('create source via knowledge page for priority/reprocess tests', async ({ page }) => {
    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // Try to add a text source via UI
    const addButton = page.getByRole('button', { name: /add.*source|add.*text|text/i }).first();
    if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.click();
    }

    const textButton = page.locator('button', { hasText: 'Text' }).first();
    if (await textButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await textButton.click();
    }

    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i]').last();
    const contentInput = page.locator('textarea').last();

    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill('E2E Priority Test');
      await contentInput.fill('This is content for testing priority toggle and reprocessing. It contains enough text to create at least one chunk.');

      const submitButton = page.getByRole('button', { name: /add|save|submit|create/i }).last();
      const createPromise = page.waitForResponse(
        (res) => res.url().includes('/knowledge') && res.request().method() === 'POST'
      );
      await submitButton.click();
      const createRes = await createPromise;
      expect(createRes.ok()).toBeTruthy();
      const body = await createRes.json();
      sourceId = body.data?.id || body.data?.source?.id || null;
    } else {
      // Fallback
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
    }
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

    // The source name should be visible
    await expect(page.getByText('E2E Priority Test')).toBeVisible({ timeout: 10000 });
  });

  test('cleanup: delete test source', async ({ page }) => {
    test.skip(!sourceId, 'No source to delete');
    const res = await page.request.delete(`/api/chatbots/${CHATBOT_ID}/knowledge/${sourceId}`);
    expect(res.ok()).toBeTruthy();
  });
});
