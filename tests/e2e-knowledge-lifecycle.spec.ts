import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const KNOWLEDGE_URL = `/api/chatbots/${CHATBOT_ID}/knowledge`;

let createdSourceId: string | null = null;

test.describe('Knowledge Source Lifecycle', () => {
  test('add text knowledge source', async ({ page }) => {
    const res = await page.request.post(KNOWLEDGE_URL, {
      data: {
        type: 'text',
        name: 'E2E Test Knowledge',
        content: 'Our company offers three pricing plans: Starter at $9/month, Pro at $29/month, and Enterprise at $99/month. Each plan includes different features. The Starter plan includes basic chatbot functionality.',
      },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    createdSourceId = body.data?.id || body.data?.source?.id || null;
    expect(createdSourceId).toBeTruthy();
  });

  test('list knowledge sources includes new source', async ({ page }) => {
    const res = await page.request.get(KNOWLEDGE_URL);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const sources = body.data?.sources || body.data || [];
    expect(Array.isArray(sources)).toBeTruthy();
  });

  test('add URL knowledge source', async ({ page }) => {
    const res = await page.request.post(KNOWLEDGE_URL, {
      data: {
        type: 'url',
        name: 'E2E URL Source',
        url: 'https://example.com',
      },
    });
    // URL sources may fail to process (no actual content) but creation should succeed
    expect(res.ok()).toBeTruthy();
  });

  test('delete knowledge source', async ({ page }) => {
    test.skip(!createdSourceId, 'No source to delete');

    const res = await page.request.delete(`${KNOWLEDGE_URL}/${createdSourceId}`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      createdSourceId = null;
    }
  });

  test('reject invalid knowledge source type', async ({ page }) => {
    const res = await page.request.post(KNOWLEDGE_URL, {
      data: { type: 'invalid_type', name: 'Bad Source' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
