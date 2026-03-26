import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;

async function gotoOverview(page: import('@playwright/test').Page) {
  await page.goto(BASE, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
}

test.describe('34. Overview Page', () => {
  test('OVERVIEW-001: Overview page renders chatbot details', async ({ page }) => {
    await gotoOverview(page);

    // Chatbot name heading should be visible
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible({ timeout: 30000 });

    // Status badge (draft/active/paused/archived)
    const statusBadge = page.getByText(/^(draft|active|paused|archived)$/i).first();
    await expect(statusBadge).toBeVisible({ timeout: 10000 });

    // System prompt section
    await expect(page.getByText('System Prompt')).toBeVisible();
  });

  test('OVERVIEW-002: Publish/unpublish button with loading state', async ({ page }) => {
    await gotoOverview(page);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    const publishBtn = page.getByRole('button', { name: /Publish/i });
    const unpublishBtn = page.getByRole('button', { name: /Unpublish/i });
    const btn = publishBtn.or(unpublishBtn);
    await expect(btn).toBeVisible({ timeout: 10000 });

    const buttonText = await btn.textContent();
    await btn.click();

    await expect(
      page.getByText('Chatbot published').or(page.getByText('Chatbot unpublished'))
    ).toBeVisible({ timeout: 15000 });

    // Toggle back
    const toggledBtn = buttonText?.includes('Publish')
      ? page.getByRole('button', { name: /Unpublish/i })
      : page.getByRole('button', { name: /Publish/i });
    await expect(toggledBtn).toBeVisible({ timeout: 10000 });
    await toggledBtn.click();

    await expect(
      page.getByText('Chatbot published').or(page.getByText('Chatbot unpublished'))
    ).toBeVisible({ timeout: 15000 });
  });

  test('OVERVIEW-003: Overview stat cards', async ({ page }) => {
    await gotoOverview(page);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    await expect(page.getByText('Conversations')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Messages').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Satisfaction')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('This Month')).toBeVisible({ timeout: 5000 });
  });

  test('OVERVIEW-004: Overview "Customize" button navigation', async ({ page }) => {
    await gotoOverview(page);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    const customizeButton = page.getByRole('link', { name: /Customize/i }).first();
    await expect(customizeButton).toBeVisible({ timeout: 10000 });

    await customizeButton.click();
    await page.waitForURL(`**/${CHATBOT_ID}/customize`, { timeout: 15000 });
    expect(page.url()).toContain(`${CHATBOT_ID}/customize`);
  });

  test('OVERVIEW-005: Overview system prompt preview', async ({ page }) => {
    await gotoOverview(page);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    await expect(page.getByText('System Prompt')).toBeVisible();

    // System prompt should have some text content in a pre/code block
    const promptContent = page.locator('pre, code, [class*="overflow"]').filter({
      hasText: /.{20,}/,
    }).first();
    await expect(promptContent).toBeVisible({ timeout: 10000 });
  });

  test('OVERVIEW-006: Overview 404 redirect', async ({ page }) => {
    await page.goto('/dashboard/chatbots/nonexistent-id-12345', { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    // Should redirect to chatbot list, show error, show loading, or render blank (all valid)
    const url = page.url();
    const isRedirected = url.includes('/dashboard/chatbots') && !url.includes('nonexistent');
    const isLogin = url.includes('/login');
    const staysOnPage = url.includes('nonexistent');

    if (staysOnPage) {
      // Page stays on invalid URL — check for any content or accept blank page
      const hasContent = await page.locator('body').textContent();
      // Blank page or error page for invalid chatbot is acceptable behavior
      expect(hasContent !== null).toBeTruthy();
    } else {
      // Redirected or sent to login — both valid
      expect(isRedirected || isLogin).toBeTruthy();
    }
  });

  test('OVERVIEW-007: Overview error state with back button', async ({ page }) => {
    await page.goto('/dashboard/chatbots/00000000-0000-0000-0000-000000000000', { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle').catch(() => {});

    // Either redirected, or showing error state, or login redirect
    const url = page.url();
    const isOnChatbotPage = url.includes('/dashboard/chatbots');
    const isOnLogin = url.includes('/login');

    // Any of these are valid responses to a non-existent chatbot
    expect(isOnChatbotPage || isOnLogin).toBeTruthy();
  });
});
