/**
 * E2E Tests: ChatbotSubNav post-business-audit changes
 *
 * Changes from business audit:
 * - "Agent Console" renamed to "Live Conversations" (now in primary nav)
 * - "Analytics" promoted to primary nav (no longer behind "More" dropdown)
 * - "More" button now shows MoreHorizontal icon (not a text label)
 *
 * These tests assert the new primary nav structure is correct.
 */

import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;

async function gotoOverview(page: import('@playwright/test').Page) {
  await page.goto(BASE, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
  await page.locator('nav[aria-label="Chatbot navigation"]').waitFor({ state: 'visible', timeout: 15000 });
}

test.describe('ChatbotSubNav Post-Audit Structure', () => {
  test('SUBNAV-001: Analytics is in primary nav (not behind More)', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');

    // Analytics should be a direct link in primary nav, not inside a dropdown
    const analyticsLink = nav.getByRole('link', { name: 'Analytics' });
    await expect(analyticsLink).toBeVisible({ timeout: 10000 });
    await expect(analyticsLink).toHaveAttribute('href', `${BASE}/analytics`);
  });

  test('SUBNAV-002: Live Conversations is in primary nav', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');

    // "Live Conversations" should be a direct primary nav link
    const liveConvLink = nav.getByRole('link', { name: 'Live Conversations' });
    await expect(liveConvLink).toBeVisible({ timeout: 10000 });
    await expect(liveConvLink).toHaveAttribute('href', `${BASE}/conversations`);
  });

  test('SUBNAV-003: "Agent Console" label is no longer in primary nav', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');

    // "Agent Console" should not appear as a primary nav link
    const agentConsoleLink = nav.getByRole('link', { name: 'Agent Console', exact: true });
    await expect(agentConsoleLink).not.toBeVisible({ timeout: 5000 });
  });

  test('SUBNAV-004: Navigating to /conversations shows Live Conversations active in primary nav', async ({ page }) => {
    await page.goto(`${BASE}/conversations`, { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    // Live Conversations link should be active (has active classes)
    const liveConvLink = nav.getByRole('link', { name: 'Live Conversations' });
    await expect(liveConvLink).toBeVisible({ timeout: 10000 });
    const classes = await liveConvLink.getAttribute('class') || '';
    expect(classes).toContain('bg-primary');
  });

  test('SUBNAV-005: Navigating to /analytics shows Analytics active in primary nav', async ({ page }) => {
    await page.goto(`${BASE}/analytics`, { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    // Analytics link should be active in primary nav
    const analyticsLink = nav.getByRole('link', { name: 'Analytics' });
    await expect(analyticsLink).toBeVisible({ timeout: 10000 });
    const classes = await analyticsLink.getAttribute('class') || '';
    expect(classes).toContain('bg-primary');
  });

  test('SUBNAV-006: More dropdown still contains secondary nav items', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');

    // Click More button
    const moreButton = nav.getByRole('button').filter({
      hasText: /More|Performance|Leads|Surveys|Sentiment|Issues|Tickets|Contact|Articles/,
    });
    await moreButton.click();
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    // Secondary nav items should appear in the dropdown
    const dropdown = page.locator('[role="menu"][aria-label="More navigation options"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    await expect(dropdown.getByRole('menuitem', { name: 'Performance' })).toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'Leads' })).toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'Issues' })).toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'Tickets' })).toBeVisible();

    // Analytics and Live Conversations should NOT be in the dropdown (they're primary now)
    await expect(dropdown.getByRole('menuitem', { name: 'Analytics' })).not.toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'Live Conversations' })).not.toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'Agent Console' })).not.toBeVisible();
  });

  test('SUBNAV-007: More dropdown shows active secondary item in trigger button', async ({ page }) => {
    await page.goto(`${BASE}/performance`, { waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');
    await expect(nav).toBeVisible({ timeout: 15000 });

    // The More button should show the active secondary item label
    const moreButton = nav.getByRole('button').filter({ hasText: /Performance/ });
    await expect(moreButton).toBeVisible({ timeout: 10000 });
  });

  test('SUBNAV-008: Calendar link present in primary nav', async ({ page }) => {
    await gotoOverview(page);

    const nav = page.locator('nav[aria-label="Chatbot navigation"]');

    const calendarLink = nav.getByRole('link', { name: 'Calendar' });
    await expect(calendarLink).toBeVisible({ timeout: 10000 });
    await expect(calendarLink).toHaveAttribute('href', `${BASE}/calendar`);
  });
});
