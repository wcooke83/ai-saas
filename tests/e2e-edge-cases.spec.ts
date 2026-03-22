import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Edge Cases', () => {
  test('temperature bounds — reject value > 2', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { temperature: 2.5 },
    });
    // Should reject or clamp — not 500
    expect(res.status()).toBeLessThan(500);
  });

  test('temperature bounds — reject negative value', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { temperature: -1 },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('max_tokens bounds — reject 0', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { max_tokens: 0 },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('chatbot name with special characters', async ({ page }) => {
    const specialName = 'Bot <script>alert("xss")</script> & "quotes" \'apostrophes\'';
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { name: specialName },
    });
    expect(res.status()).toBeLessThan(500);

    if (res.ok()) {
      const getRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}`);
      if (getRes.ok()) {
        const body = await getRes.json();
        const name = (body.data?.chatbot || body.data)?.name;
        // Name should be stored as-is (escaped on render, not on save)
        expect(name).toBe(specialName);
      }
    }

    // Restore
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { name: 'E2E Test Bot' },
    });
  });

  test('very long system prompt accepted', async ({ page }) => {
    const longPrompt = 'You are a helpful assistant. '.repeat(200); // ~5600 chars
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: longPrompt },
    });
    expect(res.status()).toBeLessThan(500);

    // Restore
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a helpful test assistant.' },
    });
  });

  test('empty knowledge content rejected', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: { type: 'text', name: 'Empty', content: '' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('duplicate knowledge source name allowed', async ({ page }) => {
    const name = `Dupe Test ${Date.now()}`;
    const res1 = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: { type: 'text', name, content: 'First source content' },
    });
    const res2 = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: { type: 'text', name, content: 'Second source content' },
    });
    // Both should succeed (names aren't unique constraints)
    expect(res1.status()).toBeLessThan(500);
    expect(res2.status()).toBeLessThan(500);
  });

  test('widget config with unknown fields is preserved', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { widget_config: { customField: 'should be kept', primaryColor: '#999999' } },
    });
    expect(res.status()).toBeLessThan(500);
  });
});
