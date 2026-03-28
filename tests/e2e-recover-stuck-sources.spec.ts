/**
 * E2E Tests: Stuck Knowledge Source Recovery
 *
 * Tests the recover-stuck-sources cron endpoint that detects and recovers
 * knowledge sources stuck in 'processing' state.
 *
 * Uses e2e test helpers to create stuck sources, then calls the real cron
 * endpoint to verify recovery works correctly.
 *
 * Requires: E2E_TEST_SECRET, CRON_SECRET env vars.
 */

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnvSecret(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(new RegExp(`^${key}=(.+)$`));
      if (match) return match[1].trim();
    }
  } catch { /* ignore */ }
  return undefined;
}

const E2E_SECRET = loadEnvSecret('E2E_TEST_SECRET');
const CRON_SECRET = loadEnvSecret('CRON_SECRET');

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Stuck Source Recovery Cron', () => {
  test.describe.configure({ timeout: 60_000 });

  test('RECOVER-001: Cron requires valid authorization', async ({ page }) => {
    // No auth header
    const res1 = await page.request.post('/api/cron/recover-stuck-sources');
    expect(res1.status()).toBe(401);

    // Wrong auth
    const res2 = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: 'Bearer wrong-secret' },
    });
    expect(res2.status()).toBe(401);
  });

  test('RECOVER-002: Cron returns success with no stuck sources', async ({ page }) => {
    if (!CRON_SECRET) {
      test.skip(true, 'CRON_SECRET not set');
      return;
    }

    const res = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.recovered).toBeGreaterThanOrEqual(0);
    console.log(`[RECOVER-002] Recovered: ${data.recovered}`);
  });

  test('RECOVER-003: Cron recovers a stuck source and cleans up partial chunks', async ({ page }) => {
    if (!CRON_SECRET || !E2E_SECRET) {
      test.skip(true, 'CRON_SECRET or E2E_TEST_SECRET not set');
      return;
    }

    // 1. Create a stuck source (30 minutes old, with partial chunks)
    const createRes = await page.request.post('/api/e2e/create-stuck-source', {
      data: {
        secret: E2E_SECRET,
        chatbot_id: CHATBOT_ID,
        minutes_ago: 30,
        with_partial_chunks: true,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const createData = await createRes.json();
    expect(createData.success).toBe(true);
    const stuckSourceId = createData.source_id;
    console.log(`[RECOVER-003] Created stuck source: ${stuckSourceId}`);

    // 2. Run the recovery cron
    const cronRes = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(cronRes.ok()).toBeTruthy();

    const cronData = await cronRes.json();
    expect(cronData.recovered).toBeGreaterThanOrEqual(1);

    // 3. Verify our source was recovered
    const ourSource = cronData.details?.find((d: any) => d.id === stuckSourceId);
    expect(ourSource).toBeTruthy();
    expect(ourSource.partial_chunks_deleted).toBeGreaterThanOrEqual(1);
    console.log(
      `[RECOVER-003] Source recovered: ${ourSource.name}, ` +
      `partial chunks deleted: ${ourSource.partial_chunks_deleted}`
    );

    // 4. Verify source status is now 'failed' via knowledge API
    const sourceRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    if (sourceRes.ok()) {
      const sourceData = await sourceRes.json();
      const sources = sourceData.data?.sources ?? [];
      const recovered = sources.find((s: any) => s.id === stuckSourceId);
      if (recovered) {
        expect(recovered.status).toBe('failed');
        expect(recovered.error_message).toContain('timed out');
        console.log(`[RECOVER-003] Verified source status: ${recovered.status}, error: ${recovered.error_message}`);
      }
    }

    // 5. Cleanup: delete the test source
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/knowledge/${stuckSourceId}`);
    console.log(`[RECOVER-003] Cleaned up test source`);
  });

  test('RECOVER-004: Cron does NOT recover sources processing for less than 15 minutes', async ({ page }) => {
    if (!CRON_SECRET || !E2E_SECRET) {
      test.skip(true, 'CRON_SECRET or E2E_TEST_SECRET not set');
      return;
    }

    // Create a source that's only been processing for 5 minutes (under threshold)
    const createRes = await page.request.post('/api/e2e/create-stuck-source', {
      data: {
        secret: E2E_SECRET,
        chatbot_id: CHATBOT_ID,
        minutes_ago: 5,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const createData = await createRes.json();
    const recentSourceId = createData.source_id;
    console.log(`[RECOVER-004] Created recent processing source: ${recentSourceId}`);

    // Run recovery cron
    const cronRes = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(cronRes.ok()).toBeTruthy();

    const cronData = await cronRes.json();
    const ourSource = cronData.details?.find((d: any) => d.id === recentSourceId);
    expect(ourSource).toBeUndefined();
    console.log(`[RECOVER-004] Confirmed: recent source was NOT recovered (still processing)`);

    // Verify source is still 'processing'
    const sourceRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    if (sourceRes.ok()) {
      const sourceData = await sourceRes.json();
      const sources = sourceData.data?.sources ?? [];
      const stillProcessing = sources.find((s: any) => s.id === recentSourceId);
      if (stillProcessing) {
        expect(stillProcessing.status).toBe('processing');
        console.log(`[RECOVER-004] Verified: source still has status 'processing'`);
      }
    }

    // Cleanup
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/knowledge/${recentSourceId}`);
    console.log(`[RECOVER-004] Cleaned up test source`);
  });

  test('RECOVER-005: Running cron twice does not double-recover', async ({ page }) => {
    if (!CRON_SECRET || !E2E_SECRET) {
      test.skip(true, 'CRON_SECRET or E2E_TEST_SECRET not set');
      return;
    }

    // Create a stuck source
    const createRes = await page.request.post('/api/e2e/create-stuck-source', {
      data: {
        secret: E2E_SECRET,
        chatbot_id: CHATBOT_ID,
        minutes_ago: 30,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const stuckSourceId = (await createRes.json()).source_id;

    // First run - should recover it
    const res1 = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(res1.ok()).toBeTruthy();
    const data1 = await res1.json();
    const found1 = data1.details?.find((d: any) => d.id === stuckSourceId);
    expect(found1).toBeTruthy();

    // Second run - should NOT find it again (it's now 'failed', not 'processing')
    const res2 = await page.request.post('/api/cron/recover-stuck-sources', {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    expect(res2.ok()).toBeTruthy();
    const data2 = await res2.json();
    const found2 = data2.details?.find((d: any) => d.id === stuckSourceId);
    expect(found2).toBeUndefined();
    console.log(`[RECOVER-005] Confirmed: second run did not re-recover the source`);

    // Cleanup
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/knowledge/${stuckSourceId}`);
  });
});
