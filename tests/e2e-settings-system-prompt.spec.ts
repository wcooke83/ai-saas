import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;

async function gotoPromptSection(page: import('@playwright/test').Page) {
  await page.goto(SETTINGS_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button', { hasText: 'System Prompt' }).click();
}

test.describe('3. Settings -- System Prompt', () => {
  test('SET-PROMPT-001: System prompt minimum length validation', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea[name="system_prompt"], textarea#system_prompt').first();
    await expect(promptField).toBeVisible({ timeout: 10000 });

    // Enter short text
    await promptField.fill('Short');
    await page.locator('button', { hasText: 'Save Changes' }).first().click();

    // Should show validation error
    await expect(page.locator('text=/at least 10 characters/i')).toBeVisible({ timeout: 5000 });
  });

  test('SET-PROMPT-002: Quick template selection', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea[name="system_prompt"], textarea#system_prompt').first();
    await expect(promptField).toBeVisible({ timeout: 10000 });

    // Click Customer Support template
    const templateBtn = page.locator('button', { hasText: 'Customer Support' }).first();
    await expect(templateBtn).toBeVisible({ timeout: 5000 });
    await templateBtn.click();

    // Textarea should be populated
    const promptVal = await promptField.inputValue();
    expect(promptVal.length).toBeGreaterThan(10);
  });

  test('SET-PROMPT-003: All templates are available', async ({ page }) => {
    await gotoPromptSection(page);

    const templates = [
      'Helpful Assistant', 'FAQ Bot',
      'Sales Assistant', 'Lead Generation', 'Appointment Booking', 'E-Commerce',
      'Customer Support', 'Technical Support',
      'Onboarding Guide', 'Re-Engagement',
    ];
    for (const name of templates) {
      await expect(page.locator('button', { hasText: name }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('SET-PROMPT-004: Prompt injection protection toggle', async ({ page }) => {
    await gotoPromptSection(page);

    const checkbox = page.locator('input#enable_prompt_protection, input[name="enable_prompt_protection"]').first();
    await expect(checkbox).toBeAttached({ timeout: 10000 });

    // Toggle it
    const wasChecked = await checkbox.isChecked();
    await checkbox.click({ force: true });

    const isNowChecked = await checkbox.isChecked();
    expect(isNowChecked).toBe(!wasChecked);

    // Restore original state
    if (isNowChecked !== wasChecked) {
      await checkbox.click({ force: true });
    }
  });

  test('SET-PROMPT-005: Character count display', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea[name="system_prompt"], textarea#system_prompt').first();
    await expect(promptField).toBeVisible({ timeout: 10000 });

    // Clear and type some text
    await promptField.fill('This is a test prompt for counting characters.');

    // Counter should show current length/5000
    const counter = page.locator('text=/\\/5000 characters/i');
    await expect(counter).toBeVisible({ timeout: 5000 });
  });
});
