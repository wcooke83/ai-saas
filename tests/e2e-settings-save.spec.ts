import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;

test.describe('Chatbot Settings Save', () => {
  test('update chatbot name via settings form', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    await nameInput.clear();
    await nameInput.fill('E2E Bot Renamed');

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();

    if (saveRes.ok()) {
      const body = await saveRes.json();
      expect(body.data?.chatbot?.name || body.data?.name).toBe('E2E Bot Renamed');
    }
  });

  test('update system prompt via settings form', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    const promptTextarea = page.locator('#system_prompt');
    await expect(promptTextarea).toBeVisible({ timeout: 10000 });

    await promptTextarea.clear();
    await promptTextarea.fill('You are an updated test assistant.');

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('update temperature via settings form', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    // Navigate to the Model section if needed
    const modelSection = page.locator('nav button', { hasText: 'Model' });
    if (await modelSection.isVisible().catch(() => false)) {
      await modelSection.click();
    }

    const tempSlider = page.locator('#temperature');
    await expect(tempSlider).toBeVisible({ timeout: 10000 });

    // Set temperature by filling the range input value
    await tempSlider.fill('0.5');

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('update language via settings form', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    const langSelect = page.locator('#language');
    await expect(langSelect).toBeVisible({ timeout: 10000 });

    await langSelect.selectOption('en');

    // Language change may trigger a confirmation dialog
    const confirmButton = page.getByRole('button', { name: 'Confirm' });
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('restore original name via settings form', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    await nameInput.clear();
    await nameInput.fill('E2E Test Bot');

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('settings page shows saved values', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Verify the name is what we set
    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await expect(nameInput).toHaveValue('E2E Test Bot');
  });
});
