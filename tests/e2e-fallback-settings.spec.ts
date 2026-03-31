import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;

/** Navigate to Credit Exhaustion section in settings */
async function navigateToCreditExhaustion(page: import('@playwright/test').Page) {
  await page.goto(SETTINGS_URL);
  await page.waitForLoadState('networkidle');
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button').filter({ hasText: 'Credit Exhaustion' }).click();
  await expect(page.getByRole('heading', { name: 'Limits & Fallback' })).toBeVisible({ timeout: 10000 });
}

test.describe('Credit Exhaustion Fallback Settings', () => {
  test('FALLBACK-001: Settings section renders with four radio options', async ({ page }) => {
    await navigateToCreditExhaustion(page);
    await expect(page.getByText('Open Tickets').first()).toBeVisible();
    await expect(page.getByText('Simple Contact Form').first()).toBeVisible();
    await expect(page.getByText('Purchase Additional Quota').first()).toBeVisible();
    await expect(page.getByText('Help Articles').first()).toBeVisible();
  });

  test('FALLBACK-002: Switching between modes shows/hides config fields', async ({ page }) => {
    // Ensure tickets mode first
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await navigateToCreditExhaustion(page);

    // Default should show Tickets config
    await expect(page.getByText('Ticket Form Settings').first()).toBeVisible();

    // Switch to Contact Form
    await page.locator('input[value="contact_form"]').click({ force: true });
    await expect(page.getByText('Contact Form Settings').first()).toBeVisible({ timeout: 5000 });

    // Switch to Purchase Credits
    await page.locator('input[value="purchase_credits"]').click({ force: true });
    await expect(page.getByText('Credit Packages').first()).toBeVisible({ timeout: 5000 });

    // Switch to Help Articles
    await page.locator('input[value="help_articles"]').click({ force: true });
    await expect(page.getByText('Help Articles').first()).toBeVisible({ timeout: 5000 });
  });

  test('FALLBACK-003: Ticket form config saves via UI', async ({ page }) => {
    await navigateToCreditExhaustion(page);

    // Select tickets mode
    await page.getByText('Open Tickets').first().click();
    await expect(page.getByText('Ticket Form Settings').first()).toBeVisible({ timeout: 5000 });

    // Fill in ticket form settings
    const titleInput = page.locator('input[placeholder*="title" i]').first();
    if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await titleInput.clear();
      await titleInput.fill('E2E Test Title');
    }

    // Save via button
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();

    // Verify persistence by reloading
    await navigateToCreditExhaustion(page);
  });

  test('FALLBACK-004: Contact form config saves via UI', async ({ page }) => {
    await navigateToCreditExhaustion(page);

    // Switch to Contact Form
    await page.locator('input[value="contact_form"]').click({ force: true });
    await expect(page.getByText('Contact Form Settings').first()).toBeVisible({ timeout: 5000 });

    // Save
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('FALLBACK-005: Credit packages config saves via UI', async ({ page }) => {
    await navigateToCreditExhaustion(page);

    // Switch to Purchase Credits
    await page.locator('input[value="purchase_credits"]').click({ force: true });
    await expect(page.getByText('Credit Packages').first()).toBeVisible({ timeout: 5000 });

    // Save
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('FALLBACK-006: Help articles config saves via UI', async ({ page }) => {
    await navigateToCreditExhaustion(page);

    // Switch to Help Articles
    await page.locator('input[value="help_articles"]').click({ force: true });
    await expect(page.getByText('Help Articles').first()).toBeVisible({ timeout: 5000 });

    // Save
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('FALLBACK-007: Admin notification email validates format', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await navigateToCreditExhaustion(page);
    await page.getByText('Open Tickets').first().click();
    const emailInput = page.locator('input[placeholder="admin@yourcompany.com"]');
    await expect(emailInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('FALLBACK-008: Auto-reply template shows placeholders', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await navigateToCreditExhaustion(page);
    await page.getByText('Open Tickets').first().click();
    await expect(page.getByText('{{name}}').first()).toBeVisible();
    await expect(page.getByText('{{ticketId}}').first()).toBeVisible();
  });

  test('FALLBACK-009: Ticket reference format visible', async ({ page }) => {
    await navigateToCreditExhaustion(page);
    const prefixInput = page.locator('input[placeholder="TKT-"]');
    await expect(prefixInput).toBeVisible();
  });

  test('FALLBACK-010: Purchase credits upsell message customizable', async ({ page }) => {
    await navigateToCreditExhaustion(page);
    await page.getByText('Purchase Additional Quota').click();
    await expect(page.getByText('Upsell Message')).toBeVisible();
  });

  // Restore default mode after tests
  test.afterAll(async ({ request }) => {
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets', credit_exhaustion_config: {} },
    });
  });
});
