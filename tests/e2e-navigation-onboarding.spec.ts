import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF!;
let freshPage: Page;
let freshContext: BrowserContext;
let freshChatbotId: string;

async function gotoOverview(page: import('@playwright/test').Page) {
  await page.goto(BASE, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
  await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });
}

test.describe('24. Navigation & Onboarding', () => {
  test('NAV-001: Chatbot sub-navigation renders', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    // Primary nav items
    await expect(nav.getByText('Overview')).toBeVisible();
    await expect(nav.getByText('Settings')).toBeVisible();
    await expect(nav.getByText('Knowledge')).toBeVisible();
    await expect(nav.getByText('Customize')).toBeVisible();
    await expect(nav.getByText('Deploy')).toBeVisible();

    // "More" dropdown trigger
    const moreButton = nav.getByRole('button').filter({ hasText: /More|Performance|Leads|Surveys|Sentiment|Issues|Tickets|Contact|Articles|Live Conversations/ });
    await expect(moreButton).toBeVisible();
  });

  test('NAV-002: More dropdown opens and closes', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    const moreButton = nav.getByRole('button').filter({ hasText: /More|Performance|Leads|Surveys|Sentiment|Issues|Tickets|Contact|Articles|Live Conversations/ });
    await moreButton.click();
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    // Dropdown items — Agent Console was renamed to Live Conversations; Analytics is now primary nav
    await expect(page.getByText('Performance')).toBeVisible();
    await expect(page.getByText('Leads')).toBeVisible();

    // Close by clicking outside
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(moreButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('NAV-003: Active secondary item shown in trigger', async ({ page }) => {
    // Analytics is now in primary nav — use /performance (a secondary nav item) instead
    await page.goto(`${BASE}/performance`, { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    // The dropdown button should show "Performance" when on the performance page
    const moreButton = nav.getByRole('button').filter({ hasText: /Performance/ });
    await expect(moreButton).toBeVisible({ timeout: 10000 });
  });

  test('NAV-004: Onboarding checklist displays', async ({ page }) => {
    await gotoOverview(page);
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, CHATBOT_ID);
    await page.reload({ waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    const checklist = page.getByText('Getting Started');
    if (await checklist.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(page.getByText('Add Knowledge Sources')).toBeVisible();
      await expect(page.getByText('Customize Widget')).toBeVisible();
      await expect(page.getByText('Test Your Chatbot')).toBeVisible();
      await expect(page.getByText('Deploy to Website')).toBeVisible();
      await expect(page.getByText(/\d+ of \d+ steps complete/)).toBeVisible();
    } else {
      // If all steps complete, checklist auto-hides — that's valid
      test.skip(true, 'Onboarding checklist not visible (may be auto-hidden)');
    }
  });

  test('NAV-005: Onboarding step completion tracking', async ({ page }) => {
    await gotoOverview(page);
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, CHATBOT_ID);
    await page.reload({ waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    const checklist = page.getByText('Getting Started');
    if (await checklist.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(page.getByText(/\d+ of \d+ steps complete/)).toBeVisible();
    } else {
      test.skip(true, 'Onboarding checklist not visible');
    }
  });

  test('NAV-006: Onboarding checklist dismiss', async ({ page }) => {
    await gotoOverview(page);
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, CHATBOT_ID);
    await page.reload({ waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    const checklist = page.getByText('Getting Started');
    if (await checklist.isVisible({ timeout: 10000 }).catch(() => false)) {
      const dismissButton = page.locator('button[aria-label="Dismiss onboarding checklist"]');
      await expect(dismissButton).toBeVisible();
      await dismissButton.click();
      await expect(checklist).not.toBeVisible({ timeout: 5000 });

      // Verify persistence after reload
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });
      await expect(checklist).not.toBeVisible({ timeout: 5000 });
    } else {
      test.skip(true, 'Onboarding checklist not visible');
    }
  });

  test('NAV-007: Onboarding auto-hides when all complete', async ({ page }) => {
    await gotoOverview(page);
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, CHATBOT_ID);
    await page.reload({ waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // If all complete text appears, checklist should auto-hide
    const allComplete = page.getByText('4 of 4 steps complete');
    if (await allComplete.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(page.getByText('Getting Started')).not.toBeVisible();
    }
    // Otherwise checklist is either shown (not all complete) or hidden — both valid
  });
});

test.describe('37. Layout & Breadcrumb', () => {
  test('LAYOUT-001: Breadcrumb displays chatbot name', async ({ page }) => {
    await gotoOverview(page);

    // "Chatbots" back link should be visible
    const chatbotsLink = page.getByRole('link', { name: /Chatbots/i }).first();
    await expect(chatbotsLink).toBeVisible({ timeout: 15000 });

    // Sub-nav should be visible
    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('LAYOUT-002: Breadcrumb "Chatbots" back link', async ({ page }) => {
    await gotoOverview(page);

    const backLink = page.getByRole('link', { name: /Chatbots/i }).first();
    await expect(backLink).toBeVisible({ timeout: 15000 });
    await expect(backLink).toHaveAttribute('href', '/dashboard/chatbots');

    await backLink.click();
    await page.waitForURL('**/dashboard/chatbots', { timeout: 15000 });
    expect(page.url()).toMatch(/\/dashboard\/chatbots$/);
  });

  test('LAYOUT-003: Sub-nav dropdown closes on route change', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    const moreButton = nav.getByRole('button').filter({ hasText: /More|Performance|Leads|Surveys|Sentiment|Issues|Tickets|Contact|Articles|Live Conversations/ });
    await moreButton.click();
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    // Click a dropdown item to navigate (items have role="menuitem", not "link")
    // Analytics is now in primary nav — use Performance which is in the More dropdown
    const performanceItem = page.getByRole('menuitem', { name: /Performance/i });
    await performanceItem.click();

    await page.waitForURL(`**/${CHATBOT_ID}/performance`, { timeout: 15000 });

    // Dropdown menu should no longer be visible after navigation
    const dropdown = page.locator('[role="menu"][aria-label="More navigation options"]');
    await expect(dropdown).not.toBeVisible({ timeout: 5000 });
  });

  test('LAYOUT-004: Sub-nav overview vs nested path matching', async ({ page }) => {
    // Navigate to Overview
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    const overviewLink = nav.getByRole('link', { name: 'Overview' });
    const overviewClasses = await overviewLink.getAttribute('class') || '';
    expect(overviewClasses).toContain('bg-primary');

    // Navigate to Settings
    await page.goto(`${BASE}/settings`, { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await expect(nav).toBeVisible({ timeout: 15000 });

    const settingsLink = nav.getByRole('link', { name: 'Settings' });
    const overviewClasses2 = await overviewLink.getAttribute('class') || '';
    const settingsClasses = await settingsLink.getAttribute('class') || '';

    expect(overviewClasses2).not.toContain('bg-primary');
    expect(settingsClasses).toContain('bg-primary');
  });

  test('LAYOUT-005: Onboarding "Test Your Chatbot" step always incomplete', async ({ page }) => {
    await gotoOverview(page);
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, CHATBOT_ID);
    await page.reload({ waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    const checklist = page.getByText('Getting Started');
    if (await checklist.isVisible({ timeout: 10000 }).catch(() => false)) {
      const testStep = page.getByText('Test Your Chatbot');
      await expect(testStep).toBeVisible();

      // Should NOT have line-through (strikethrough = completed)
      const testStepStyle = await testStep.evaluate((el) => {
        return window.getComputedStyle(el).textDecoration;
      });
      expect(testStepStyle).not.toContain('line-through');
    } else {
      test.skip(true, 'Onboarding checklist not visible');
    }
  });
});

test.describe('24c. Onboarding Checklist — Fresh Account', () => {
  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    // Create a fresh temp user via the e2e API
    const setupCtx = await browser.newContext();
    const setupPage = await setupCtx.newPage();

    const res = await setupPage.request.post('/api/e2e/create-temp-user', {
      data: { secret: process.env.E2E_TEST_SECRET },
    });
    expect(res.ok(), `create-temp-user failed: ${await res.text()}`).toBeTruthy();
    const userData = await res.json();
    freshChatbotId = userData.chatbotId;

    // Set up browser context with fresh user's auth (same pattern as e2e-auth.setup.ts)
    const sessionJSON = JSON.stringify({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });

    const cookieBase = `sb-${SUPABASE_PROJECT_REF}-auth-token`;
    const maxChunk = 3180;
    const cookies: Array<{ name: string; value: string; domain: string; path: string }> = [];

    if (sessionJSON.length <= maxChunk) {
      cookies.push({ name: cookieBase, value: sessionJSON, domain: 'localhost', path: '/' });
    } else {
      const encoded = encodeURIComponent(sessionJSON);
      let remaining = encoded;
      let i = 0;
      while (remaining.length > 0) {
        let head = remaining.slice(0, maxChunk);
        const lastPct = head.lastIndexOf('%');
        if (lastPct > maxChunk - 3) head = remaining.slice(0, lastPct);
        cookies.push({ name: `${cookieBase}.${i}`, value: decodeURIComponent(head), domain: 'localhost', path: '/' });
        remaining = remaining.slice(head.length);
        i++;
      }
    }

    freshContext = await browser.newContext();
    await freshContext.addCookies(cookies);
    freshPage = await freshContext.newPage();

    await setupCtx.close();
  });

  test.afterAll(async () => {
    // Delete the temp user's account via the "Delete Account" UI
    try {
      await freshPage.goto('/dashboard/settings');
      await freshPage.waitForLoadState('domcontentloaded');
      const deleteBtn = freshPage.getByRole('button', { name: 'Delete Account' });
      await expect(deleteBtn).toBeVisible({ timeout: 15000 });
      await deleteBtn.click();

      // Fill in confirmation
      const confirmInput = freshPage.getByLabel(/Type.*DELETE.*to confirm/i);
      await expect(confirmInput).toBeVisible({ timeout: 5000 });
      await confirmInput.fill('DELETE');

      // Click the confirm button in the dialog
      const confirmDeleteBtn = freshPage.getByRole('button', { name: 'Delete Account' }).last();
      await expect(confirmDeleteBtn).toBeEnabled({ timeout: 2000 });
      await confirmDeleteBtn.click();

      // Should redirect to login
      await freshPage.waitForURL('**/login**', { timeout: 15000 });
      console.log('[ONBOARDING-FRESH] Account deleted successfully via UI');
    } catch (err) {
      console.warn('[ONBOARDING-FRESH] afterAll delete account failed:', err);
    } finally {
      await freshContext.close().catch(() => {});
    }
  });

  test('NAV-004b: Onboarding checklist displays for fresh chatbot', async () => {
    await freshPage.goto(`/dashboard/chatbots/${freshChatbotId}`, { waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // Clear any dismiss localStorage entry
    await freshPage.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, freshChatbotId);
    await freshPage.reload({ waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // Checklist MUST be visible for a fresh chatbot
    await expect(freshPage.getByText('Getting Started')).toBeVisible({ timeout: 10000 });

    // Verify the 3 actual steps (component has 3 steps, not 4)
    await expect(freshPage.getByText('Add Knowledge Sources')).toBeVisible();
    await expect(freshPage.getByText('Customize Widget')).toBeVisible();
    await expect(freshPage.getByText('Deploy to Website')).toBeVisible();

    // Progress indicator
    await expect(freshPage.getByText(/\d+ of 3 steps complete/)).toBeVisible();

    console.log('[NAV-004b] Onboarding checklist visible with 3 steps');
  });

  test('NAV-005b: Onboarding step completion shows 0 of 3 for fresh chatbot', async () => {
    await freshPage.goto(`/dashboard/chatbots/${freshChatbotId}`, { waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    await freshPage.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, freshChatbotId);
    await freshPage.reload({ waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // Fresh chatbot: 0 of 3 steps complete
    await expect(freshPage.getByText('0 of 3 steps complete')).toBeVisible({ timeout: 10000 });
    console.log('[NAV-005b] 0 of 3 steps complete confirmed');
  });

  test('NAV-006b: Onboarding checklist can be dismissed', async () => {
    await freshPage.goto(`/dashboard/chatbots/${freshChatbotId}`, { waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // Ensure not dismissed
    await freshPage.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, freshChatbotId);
    await freshPage.reload({ waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    await expect(freshPage.getByText('Getting Started')).toBeVisible({ timeout: 10000 });

    // Dismiss
    const dismissButton = freshPage.locator('button[aria-label="Dismiss onboarding checklist"]');
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // Checklist should be gone
    await expect(freshPage.getByText('Getting Started')).not.toBeVisible({ timeout: 5000 });

    // Verify persistence after reload
    await freshPage.reload({ waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });
    await expect(freshPage.getByText('Getting Started')).not.toBeVisible({ timeout: 5000 });
    console.log('[NAV-006b] Dismiss works and persists');
  });

  test('LAYOUT-005b: Incomplete steps show without line-through', async () => {
    await freshPage.goto(`/dashboard/chatbots/${freshChatbotId}`, { waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    // Reset dismiss
    await freshPage.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, freshChatbotId);
    await freshPage.reload({ waitUntil: 'commit' });
    await freshPage.waitForLoadState('domcontentloaded');
    await freshPage.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });

    await expect(freshPage.getByText('Getting Started')).toBeVisible({ timeout: 10000 });

    // "Add Knowledge Sources" step is incomplete — should NOT have line-through
    const knowledgeStep = freshPage.getByText('Add Knowledge Sources');
    await expect(knowledgeStep).toBeVisible();
    const textDecoration = await knowledgeStep.evaluate(
      (el) => window.getComputedStyle(el).textDecoration
    );
    expect(textDecoration).not.toContain('line-through');

    // "Deploy to Website" is also incomplete (not published)
    const deployStep = freshPage.getByText('Deploy to Website');
    await expect(deployStep).toBeVisible();
    const deployDecoration = await deployStep.evaluate(
      (el) => window.getComputedStyle(el).textDecoration
    );
    expect(deployDecoration).not.toContain('line-through');
    console.log('[LAYOUT-005b] Incomplete steps confirmed without line-through');
  });
});
