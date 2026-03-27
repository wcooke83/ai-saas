/**
 * E2E Test: Getting Started Onboarding Checklist
 *
 * Tests the 4-step onboarding checklist on the chatbot overview page:
 * 1. Add Knowledge Sources — completed when a knowledge source has status 'completed'
 * 2. Customize Widget — completed when user saves on the customize page
 * 3. Test Your Chatbot — completed when user visits the deploy page
 * 4. Deploy to Website — completed when chatbot is published
 *
 * Flow:
 * 1. Create a chatbot via the UI wizard
 * 2. Verify the Getting Started checklist appears with all 4 items unchecked
 * 3. Complete "Customize Widget" step → verify it checks off
 * 4. Complete "Test Your Chatbot" step → verify it checks off
 * 5. Verify the progress bar updates correctly
 * 6. Dismiss the checklist → verify it stays dismissed after reload
 * 7. Clean up by deleting the chatbot
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
 * Waits for the chatbot API response, then for the skeleton to disappear.
 */
async function gotoOverviewAndWait(page: import('@playwright/test').Page, chatbotId: string) {
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes(`/api/chatbots/${chatbotId}`) && res.request().method() === 'GET' && res.status() === 200,
    { timeout: 30_000 }
  );
  await page.goto(`/dashboard/chatbots/${chatbotId}`);
  await responsePromise;
  // Wait for React to re-render after data loads
  await page.waitForTimeout(1_000);
}

test.describe('Getting Started Onboarding Checklist', () => {

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

    // Step 2: System Prompt — keep defaults
    await expect(page.getByRole('heading', { name: 'System Prompt' })).toBeVisible({ timeout: 10_000 });
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

  test('OB-002: Checklist appears with all 4 items unchecked', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    // Navigate to dashboard first to set up localStorage on the correct domain
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
      localStorage.removeItem(`chatbot-widget-reviewed-${id}`);
      localStorage.removeItem(`chatbot-tested-${id}`);
    }, createdChatbotId);

    // Now navigate to the overview page with clean localStorage
    await gotoOverviewAndWait(page, createdChatbotId!);

    // Getting Started checklist should be visible
    const checklist = page.getByText('Getting Started');
    await expect(checklist).toBeVisible({ timeout: 10_000 });

    // All 4 items should be visible
    await expect(page.getByText('Add Knowledge Sources')).toBeVisible();
    await expect(page.getByText('Customize Widget')).toBeVisible();
    await expect(page.getByText('Test Your Chatbot')).toBeVisible();
    await expect(page.getByText('Deploy to Website')).toBeVisible();

    // Progress should show "0 of 4 steps complete"
    await expect(page.getByText('0 of 4 steps complete')).toBeVisible();
    await expect(page.getByText('0%')).toBeVisible();

    // None of the step labels should have line-through (completed styling)
    for (const label of ['Add Knowledge Sources', 'Customize Widget', 'Test Your Chatbot', 'Deploy to Website']) {
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

    // Ensure clean state — clear localStorage from dashboard, then navigate
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
      localStorage.removeItem(`chatbot-widget-reviewed-${id}`);
      localStorage.removeItem(`chatbot-tested-${id}`);
    }, createdChatbotId);
    await gotoOverviewAndWait(page, createdChatbotId!);
    await expect(page.getByText('Getting Started')).toBeVisible({ timeout: 10_000 });

    // Click the "Customize Widget" link in the checklist
    const customizeLink = page.getByRole('link', { name: /Customize Widget/i });
    await expect(customizeLink).toBeVisible();
    await customizeLink.click();

    // Should navigate to the customize page
    await page.waitForURL(`**/dashboard/chatbots/${createdChatbotId}/customize`, { timeout: 15_000 });
    await page.waitForLoadState('networkidle');

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

    // Progress should show "1 of 4 steps complete"
    await expect(page.getByText('1 of 4 steps complete')).toBeVisible();
    await expect(page.getByText('25%')).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 4: Complete "Test Your Chatbot" step
  // ─────────────────────────────────────────────────────────────────

  test('OB-004: Test Your Chatbot step completes after visiting deploy page', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    // Ensure Customize Widget is still marked, but Test is not
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.evaluate((id) => {
      localStorage.removeItem(`chatbot-onboarding-dismissed-${id}`);
      localStorage.removeItem(`chatbot-tested-${id}`);
      // Keep widget-reviewed set from the previous test
    }, createdChatbotId);
    await gotoOverviewAndWait(page, createdChatbotId!);
    await expect(page.getByText('Getting Started')).toBeVisible({ timeout: 10_000 });

    // "Test Your Chatbot" should not yet have line-through
    const testLabel = page.getByText('Test Your Chatbot');
    await expect(testLabel).toBeVisible();
    const beforeDecoration = await testLabel.evaluate((el) => window.getComputedStyle(el).textDecoration);
    expect(beforeDecoration).not.toContain('line-through');

    // Click the "Test Your Chatbot" link in the checklist
    const testLink = page.getByRole('link', { name: /Test Your Chatbot/i });
    await expect(testLink).toBeVisible();
    await testLink.click();

    // Should navigate to the deploy page
    await page.waitForURL(`**/dashboard/chatbots/${createdChatbotId}/deploy`, { timeout: 15_000 });
    await page.waitForLoadState('networkidle');

    // Navigate back to the overview page
    await gotoOverviewAndWait(page, createdChatbotId!);

    // Verify "Test Your Chatbot" is now checked (has line-through)
    await expect(page.getByText('Getting Started')).toBeVisible({ timeout: 10_000 });
    const testLabelAfter = page.getByText('Test Your Chatbot');
    await expect(testLabelAfter).toBeVisible();
    const afterDecoration = await testLabelAfter.evaluate((el) => window.getComputedStyle(el).textDecoration);
    expect(afterDecoration).toContain('line-through');

    // Progress should show "2 of 4 steps complete" (Customize + Test)
    await expect(page.getByText('2 of 4 steps complete')).toBeVisible();
    await expect(page.getByText('50%')).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 5: Dismiss the checklist
  // ─────────────────────────────────────────────────────────────────

  test('OB-005: Dismiss checklist persists across page reloads', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

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
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await gotoOverviewAndWait(page, createdChatbotId!);
    await expect(checklist).not.toBeVisible({ timeout: 5_000 });
  });

  // ─────────────────────────────────────────────────────────────────
  // PHASE 6: Clean up — delete the chatbot
  // ─────────────────────────────────────────────────────────────────

  test('OB-006: Delete chatbot cleanup', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('networkidle');
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
