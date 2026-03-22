import { test, expect } from '@playwright/test';

let createdKeyId: string | null = null;

test.describe('API Key CRUD', () => {
  test('create API key', async ({ page }) => {
    const res = await page.request.post('/api/keys', {
      data: { name: 'E2E Test Key' },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.plainKey).toBeTruthy();
    expect(body.name).toBe('E2E Test Key');
    expect(body.key_prefix).toBeTruthy();
    createdKeyId = body.id;
  });

  test('list API keys includes created key', async ({ page }) => {
    const res = await page.request.get('/api/keys');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const keys = Array.isArray(body) ? body : (body.keys || body.data || []);
    expect(Array.isArray(keys)).toBeTruthy();

    if (createdKeyId) {
      const found = keys.find((k: any) => k.id === createdKeyId);
      expect(found).toBeTruthy();
    }
  });

  test('create key with allowed_domains', async ({ page }) => {
    const res = await page.request.post('/api/keys', {
      data: { name: 'Domain Key', allowed_domains: ['example.com', 'test.com'] },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.allowed_domains).toEqual(['example.com', 'test.com']);

    // Cleanup
    if (body.id) {
      await page.request.delete(`/api/keys/${body.id}`);
    }
  });

  test('reject key without name', async ({ page }) => {
    const res = await page.request.post('/api/keys', {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('delete API key', async ({ page }) => {
    test.skip(!createdKeyId, 'No key to delete');
    const res = await page.request.delete(`/api/keys/${createdKeyId}`);
    expect(res.ok()).toBeTruthy();
  });
});
