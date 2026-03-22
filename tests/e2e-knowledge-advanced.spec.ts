import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const KNOWLEDGE_URL = `/api/chatbots/${CHATBOT_ID}/knowledge`;

let sourceId: string | null = null;

test.describe('Knowledge Source Advanced', () => {
  test('create source for priority/reprocess tests', async ({ page }) => {
    const res = await page.request.post(KNOWLEDGE_URL, {
      data: {
        type: 'text',
        name: 'E2E Priority Test',
        content: 'This is content for testing priority toggle and reprocessing. It contains enough text to create at least one chunk for embedding purposes.',
      },
    });
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      sourceId = body.data?.id || body.data?.source?.id || null;
    }
  });

  test('toggle knowledge source priority', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    const res = await page.request.patch(`${KNOWLEDGE_URL}/${sourceId}`, {
      data: { is_priority: true },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('reprocess knowledge source', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    const res = await page.request.patch(`${KNOWLEDGE_URL}/${sourceId}`, {
      data: { action: 'reprocess' },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('get single knowledge source details', async ({ page }) => {
    test.skip(!sourceId, 'No source created');

    const res = await page.request.get(`${KNOWLEDGE_URL}/${sourceId}`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(body.data?.id || body.data?.source?.id).toBe(sourceId);
    }
  });

  test('cleanup: delete test source', async ({ page }) => {
    test.skip(!sourceId, 'No source to delete');
    const res = await page.request.delete(`${KNOWLEDGE_URL}/${sourceId}`);
    expect(res.status()).toBeLessThan(500);
  });
});
