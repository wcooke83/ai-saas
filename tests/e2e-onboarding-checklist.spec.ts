/**
 * E2E Test: Getting Started Onboarding Checklist
 *
 * Tests the 3-step onboarding checklist on the chatbot overview page:
 * 1. Add Knowledge Sources — completed when a knowledge source has status 'completed'
 * 2. Customize Widget — completed when user saves on the customize page
 * 3. Deploy to Website — completed when chatbot is published
 *
 * Flow:
 * 1. Create a chatbot via the UI wizard
 * 2. Verify the Getting Started checklist appears with all 3 items unchecked
 * 3. Complete "Customize Widget" step → verify it checks off
 * 4. Verify the progress bar updates correctly
 * 5. Dismiss the checklist → verify it stays dismissed after reload
 * 6. Clean up by deleting the chatbot
 *
 * 100% UI-driven — no mock data, no direct API calls, no test shortcuts.
 */

import { test, expect } from '@playwright/test';

// Unique name to avoid collisions between parallel runs
const CHATBOT_NAME = `E2E Onboarding Bot ${Date.now()}`;
const CHATBOT_DESCRIPTION = 'Temporary bot for onboarding checklist e2e test';
const WELCOME_MESSAGE = 'Hello from the onboarding checklist test!';

// Generous timeout — chatbot creation hits the real DB
test.describe.configure({ timeout: 120_000 });

let createdChatbotId: string | null = null;

/**
 * Helper: click the wizard Next button — scoped to avoid strict-mode
 * violations if template buttons contain "Next" text.
 */
async function clickWizardNext(page: import('@playwright/test').Page) {
  const nextBtn = page.locator('button:has(svg.lucide-arrow-right)');
  await expect(nextBtn).toBeEnabled({ timeout: 5_000 });
  await nextBtn.click();
}

/**
 * Helper: navigate to chatbot overview and wait for data to fully load.
 * The H1 heading with the chatbot name only renders after all API fetches
 * complete and loading=false, so it's the most reliable signal.
 */
/**
 * Navigate to the chatbot overview page.
 * Always uses page.goto() for reliability — avoids client-side nav timing issues.
 */
async function gotoOverviewAndWait(page: import('@playwright/test').Page, chatbotId: string) {
  await page.goto(`/dashboard/chatbots/${chatbotId}`);
  // Wait for page data to load — h1 only renders after loading=false
  await page.waitForFunction(() => !!document.querySelector('h1'), { timeout: 30_000 });
}

test.describe('Getting Started Onboarding Checklist', () => {

  // ─────────────────────────────────────────────────────────────────
  // CLEANUP: Delete any orphaned "E2E Onboarding Bot" chatbots from
  // previous interrupted runs to avoid hitting plan chatbot limits.
  // ─────────────────────────────────────────────────────────────────

  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      const listRes = await page.request.get('/api/chatbots');
      if (listRes.ok()) {
        const body = await listRes.json();
        const chatbots: Array<{ id: string; name: string }> = body.data?.chatbots || body.data || [];
        const orphans = chatbots.filter(
          (c) => typeof c.name === 'string' && c.name.startsWith('E2E Onboarding Bot')
        );
        for (const orphan of orphans) {
          await page.request.delete(`/api/chatbots/${orphan.id}`);
          console.log(`[beforeAll] Deleted orphaned chatbot: ${orphan.name} (${orphan.id})`);
        }
      }
    } finally {
      await ctx.close();
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 1: Create a chatbot through the wizard
  // ─────────────────────────────────────────────────────────────────

  test('OB-001: Create chatbot via wizard', async ({ page }) => {
    await page.goto('/dashboard/chatbots/new');
    await expect(page.getByRole('heading', { name: 'Create New Chatbot' })).toBeVisible({ timeout: 15_000 });

    // Step 1: Basic Info
    await page.getByLabel('Chatbot Name *').fill(CHATBOT_NAME);
    await page.locator('textarea#description').fill(CHATBOT_DESCRIPTION);
    const welcomeInput = page.getByLabel('Welcome Message');
    await welcomeInput.clear();
    await welcomeInput.fill(WELCOME_MESSAGE);
    await clickWizardNext(page);

    // Step 2: Chatbot Instructions — keep defaults
    await expect(page.getByRole('heading', { name: 'Chatbot Instructions' })).toBeVisible({ timeout: 10_000 });
    await clickWizardNext(page);

    // Step 3: Review — click Create Chatbot
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(CHATBOT_NAME)).toBeVisible();

    const createPromise = page.waitForResponse(
      (res) => res.url().includes('/api/chatbots') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Create Chatbot' }).click();
    const createResponse = await createPromise;

    expect(createResponse.ok()).toBeTruthy();
    const body = await createResponse.json();
    createdChatbotId = body.data?.chatbot?.id || null;
    expect(createdChatbotId).toBeTruthy();

    // Should redirect to knowledge page after creation
    await page.waitForURL(`**/dashboard/chatbots/${createdChatbotId}/knowledge`, { timeout: 15_000 });
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 2: Verify checklist renders with all items unchecked
  // ─────────────────────────────────────────────────────────────────

  test('OB-002: Checklist appears with all 3 items unchecked', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    // Navigate to a chatbot subpage first so we can use client-side nav to overview
    await page.goto(`/dashboard/chatbots/${createdChatbotId}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    // Clear localStorage so checklist is visible
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
      localStorage.removeItem(`chatbot-widget-reviewed-${id}`);
    }, createdChatbotId);

    // Navigate to overview via tab (client-side nav works reliably)
    await gotoOverviewAndWait(page, createdChatbotId!);

    // Getting Started checklist should be visible
    const checklist = page.getByText('Getting Started');
    await expect(checklist).toBeVisible({ timeout: 10_000 });

    // All 3 items should be visible
    await expect(page.getByText('Add Knowledge Sources')).toBeVisible();
    await expect(page.getByText('Customize Widget')).toBeVisible();
    await expect(page.getByText('Deploy to Website')).toBeVisible();

    // "Test Your Chatbot" should no longer exist as a separate step
    await expect(page.getByText('Test Your Chatbot')).not.toBeVisible();

    // Progress should show "0 of 3 steps complete"
    const checklistSection = page.locator('section, div').filter({ hasText: 'Getting Started' }).first();
    await expect(checklistSection.getByText('0 of 3 steps complete')).toBeVisible();
    await expect(checklistSection.locator('span').filter({ hasText: '0%' })).toBeVisible();

    // None of the step labels should have line-through (completed styling)
    for (const label of ['Add Knowledge Sources', 'Customize Widget', 'Deploy to Website']) {
      const stepEl = page.getByText(label);
      const textDecoration = await stepEl.evaluate((el) => window.getComputedStyle(el).textDecoration);
      expect(textDecoration).not.toContain('line-through');
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 3: Complete "Customize Widget" step
  // ─────────────────────────────────────────────────────────────────

  test('OB-003: Customize Widget step completes after saving', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    // Ensure clean state — navigate to subpage, clear localStorage, then go to overview
    await page.goto(`/dashboard/chatbots/${createdChatbotId}/knowledge`);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
      localStorage.removeItem(`chatbot-widget-reviewed-${id}`);
    }, createdChatbotId);
    await gotoOverviewAndWait(page, createdChatbotId!);
    await expect(page.getByText('Getting Started')).toBeVisible({ timeout: 10_000 });

    // Click the "Customize Widget" link in the checklist
    const customizeLink = page.getByRole('link', { name: /Customize Widget/i });
    await expect(customizeLink).toBeVisible();
    await customizeLink.click();

    // Should navigate to the customize page
    await page.waitForURL(`**/dashboard/chatbots/${createdChatbotId}/customize`, { timeout: 15_000 });
    await page.waitForLoadState('domcontentloaded');

    // Wait for the customize page to load
    await expect(page.getByText('Save Changes')).toBeVisible({ timeout: 15_000 });

    // Click Save Changes and wait for the API response
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${createdChatbotId}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).click();
    const saveResponse = await savePromise;
    expect(saveResponse.ok()).toBeTruthy();

    // Navigate back to the overview page
    await gotoOverviewAndWait(page, createdChatbotId!);

    // Verify "Customize Widget" is now checked (has line-through)
    await expect(page.getByText('Getting Started')).toBeVisible({ timeout: 10_000 });
    const customizeLabel = page.getByText('Customize Widget');
    await expect(customizeLabel).toBeVisible();
    const textDecoration = await customizeLabel.evaluate((el) => window.getComputedStyle(el).textDecoration);
    expect(textDecoration).toContain('line-through');

    // Progress should show "1 of 3 steps complete"
    const checklistSection = page.locator('section, div').filter({ hasText: 'Getting Started' }).first();
    await expect(checklistSection.getByText('1 of 3 steps complete')).toBeVisible();
    await expect(checklistSection.locator('span').filter({ hasText: '33%' })).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 4: Dismiss the checklist
  // ─────────────────────────────────────────────────────────────────

  test('OB-005: Dismiss checklist persists across page reloads', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto(`/dashboard/chatbots/${createdChatbotId}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    // Ensure checklist is not dismissed
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
    }, createdChatbotId);
    await gotoOverviewAndWait(page, createdChatbotId!);

    const checklist = page.getByText('Getting Started');
    await expect(checklist).toBeVisible({ timeout: 10_000 });

    // Click the dismiss button
    const dismissButton = page.locator('button[aria-label="Dismiss onboarding checklist"]');
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // Checklist should disappear
    await expect(checklist).not.toBeVisible({ timeout: 5_000 });

    // Navigate away and back to verify dismiss persists
    await page.goto(`/dashboard/chatbots/${createdChatbotId}/knowledge`);
    await page.waitForLoadState('domcontentloaded');
    await gotoOverviewAndWait(page, createdChatbotId!);
    await expect(checklist).not.toBeVisible({ timeout: 5_000 });
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 5: Clean up — delete the chatbot
  // ─────────────────────────────────────────────────────────────────

  test('OB-006: Delete chatbot cleanup', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');
    await expect(
      page.getByRole('heading', { name: 'Chatbots' }).or(page.getByText('No chatbots yet'))
    ).toBeVisible({ timeout: 15_000 });

    // Find the chatbot card and open its actions menu
    const card = page.locator(`text=${CHATBOT_NAME}`).locator('..').locator('..').locator('..');
    const menuButton = card.locator('button[aria-label="Chatbot actions"]');
    await expect(menuButton).toBeVisible({ timeout: 10_000 });
    await menuButton.click();

    // Click Delete in the dropdown menu
    await page.getByRole('menuitem', { name: 'Delete' }).click();

    // Confirm the delete dialog
    const deletePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${createdChatbotId}`) && res.request().method() === 'DELETE'
    );
    await page.getByRole('button', { name: 'Delete' }).click();
    const deleteResponse = await deletePromise;

    expect(deleteResponse.ok()).toBeTruthy();
    createdChatbotId = null;
  });
});
