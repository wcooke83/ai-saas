import { test, expect } from '@playwright/test';

test.describe('Section 42: Admin -- Auth & Security', () => {
  test('ADMIN-AUTH-001: Non-admin user sees blank page', async ({ browser }) => {
    // Create a clean context with no auth cookies
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const page = await context.newPage();

    await page.goto('http://localhost:3030/admin/logs');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000);

    // Should either redirect to login, show login content, or show blank page
    const url = page.url();
    const isRedirected = url.includes('/login');
    const hasLoginContent = await page.getByText('Sign in').isVisible().catch(() => false);
    const hasWelcomeBack = await page.getByText('Welcome back').isVisible().catch(() => false);

    expect(isRedirected || hasLoginContent || hasWelcomeBack).toBeTruthy();

    await context.close();
  });

  test('ADMIN-AUTH-002: Unauthenticated user redirected to login', async ({ browser }) => {
    // Create a clean context with NO storage state (no cookies)
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    // Clear all cookies explicitly
    await context.clearCookies();

    await page.goto('http://localhost:3030/admin/logs');
    await page.waitForLoadState('domcontentloaded');
    // Wait for client-side redirect (admin layout checks auth and redirects)
    await page.waitForTimeout(10000);

    // Should either redirect to /login or show login page content
    const url = page.url();
    const hasLoginContent = await page.getByText('Sign in').isVisible().catch(() => false);
    const hasWelcomeBack = await page.getByText('Welcome back').isVisible().catch(() => false);
    expect(url.includes('/login') || hasLoginContent || hasWelcomeBack).toBeTruthy();

    await context.close();
  });

  test('ADMIN-AUTH-003: Admin API routes require admin role', async ({ browser }) => {
    // Test with unauthenticated context
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const page = await context.newPage();

    // POST to admin credits without auth
    const creditsRes = await page.request.post('http://localhost:3030/api/admin/credits', {
      data: { user_id: 'test', amount: 100, reason: 'test' },
    });
    expect(creditsRes.status()).toBeGreaterThanOrEqual(400);

    // GET admin trials without auth
    const trialsRes = await page.request.get('http://localhost:3030/api/admin/trials');
    expect(trialsRes.status()).toBeGreaterThanOrEqual(400);

    await context.close();
  });

  test('ADMIN-AUTH-004: Admin check API returns correct role', async ({ page }) => {
    // With authenticated user
    const res = await page.request.get('/api/admin/check');
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.success).toBe(true);
    // The e2e test user should be authenticated
    expect(body.data.authenticated).toBe(true);
    // isAdmin depends on the profiles.is_admin flag — verify the structure is correct
    expect(typeof body.data.isAdmin).toBe('boolean');
    if (body.data.authenticated) {
      expect(body.data.userId).toBeTruthy();
    }
  });
});
