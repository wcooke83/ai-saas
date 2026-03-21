import { test as setup, expect } from '@playwright/test';

const E2E_SECRET = 'e2e-playwright-secret-2026';
const STORAGE_STATE = 'tests/auth/e2e-storage.json';
const PROJECT_REF = 'oxiekhzthqmpuyoibunn';

setup('authenticate e2e test user', async ({ page, context }) => {
  // 1. Get session tokens from the API
  const response = await page.request.post('/api/auth/e2e-login', {
    data: { secret: E2E_SECRET },
  });

  const body = await response.json();
  console.log(`E2E login: ${response.status()} user=${body.email}`);
  expect(response.ok()).toBeTruthy();
  expect(body.success).toBe(true);

  // 2. Set the Supabase auth cookie in the format @supabase/ssr expects
  // combineChunks reads: key first, then key.0, key.1... — value is raw JSON string
  const sessionJSON = JSON.stringify({
    access_token: body.access_token,
    refresh_token: body.refresh_token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  const cookieBase = `sb-${PROJECT_REF}-auth-token`;
  const maxChunk = 3180;

  if (sessionJSON.length <= maxChunk) {
    // Fits in a single cookie (no chunking)
    await context.addCookies([{
      name: cookieBase,
      value: sessionJSON,
      domain: 'localhost',
      path: '/',
    }]);
  } else {
    // Chunk it
    const encoded = encodeURIComponent(sessionJSON);
    const chunks: { name: string; value: string }[] = [];
    let remaining = encoded;
    let i = 0;
    while (remaining.length > 0) {
      let head = remaining.slice(0, maxChunk);
      // Don't break in the middle of a percent-encoded sequence
      const lastPct = head.lastIndexOf('%');
      if (lastPct > maxChunk - 3) {
        head = remaining.slice(0, lastPct);
      }
      chunks.push({ name: `${cookieBase}.${i}`, value: decodeURIComponent(head) });
      remaining = remaining.slice(head.length);
      i++;
    }
    await context.addCookies(chunks.map(c => ({
      ...c,
      domain: 'localhost',
      path: '/',
    })));
  }

  // 3. Verify auth works
  await page.goto('/dashboard');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  const url = page.url();
  console.log(`After auth, URL: ${url}`);

  // Save storage state
  await context.storageState({ path: STORAGE_STATE });
});
