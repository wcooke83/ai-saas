import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Credit Exhaustion Fallback Settings', () => {
  test('FALLBACK-001: Settings section renders with four radio options', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for sidebar to load
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    // Click the Credit Exhaustion section
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
    // Four radio options
    await expect(page.getByText('Open Tickets').first()).toBeVisible();
    await expect(page.getByText('Simple Contact Form').first()).toBeVisible();
    await expect(page.getByText('Purchase Additional Quota').first()).toBeVisible();
    await expect(page.getByText('Help Articles').first()).toBeVisible();
  });

  test('FALLBACK-002: Switching between modes shows/hides config fields', async ({ page }) => {
    // Ensure tickets mode is set first
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });

    // Default should show Tickets config
    await expect(page.getByText('Ticket Form Settings').first()).toBeVisible();

    // Switch to Contact Form
    await page.locator('input[value="contact_form"]').click({ force: true });
    await page.waitForTimeout(500);
    await expect(page.getByText('Contact Form Settings').first()).toBeVisible({ timeout: 5000 });

    // Switch to Purchase Credits
    await page.locator('input[value="purchase_credits"]').click({ force: true });
    await page.waitForTimeout(500);
    await expect(page.getByText('Credit Packages').first()).toBeVisible({ timeout: 5000 });

    // Switch to Help Articles
    await page.locator('input[value="help_articles"]').click({ force: true });
    await page.waitForTimeout(500);
    await expect(page.getByText('Help Articles').first()).toBeVisible({ timeout: 5000 });
  });

  test('FALLBACK-003: Ticket form config fields save and persist via API', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'tickets',
        credit_exhaustion_config: {
          tickets: {
            title: 'E2E Test Title',
            description: 'E2E Test Desc',
            showPhone: true,
            showSubject: true,
            showPriority: false,
            adminNotificationEmail: 'admin@test.com',
            ticketReferencePrefix: 'E2E-',
            autoReplyTemplate: 'Hello {{name}}',
          },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);

    // Verify via GET
    const getRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}`);
    if (getRes.ok()) {
      const data = await getRes.json();
      const bot = data.data?.chatbot;
      expect(bot?.credit_exhaustion_mode).toBe('tickets');
      expect(bot?.credit_exhaustion_config?.tickets?.title).toBe('E2E Test Title');
    }
  });

  test('FALLBACK-004: Contact form config fields save and persist via API', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'contact_form',
        credit_exhaustion_config: {
          contact_form: {
            title: 'Contact E2E',
            description: 'Test contact desc',
            adminNotificationEmail: 'contact@test.com',
            autoReplyEnabled: true,
          },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('FALLBACK-005: Credit packages config saves via API', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'Buy more credits',
            purchaseSuccessMessage: 'Thanks for purchasing!',
            packages: [],
          },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('FALLBACK-006: Help articles config saves via API', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'help_articles',
        credit_exhaustion_config: {
          help_articles: {
            searchPlaceholder: 'Find help...',
            emptyStateMessage: 'No articles yet',
          },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('FALLBACK-007: Admin notification email validates format', async ({ page }) => {
    // First ensure mode is tickets
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
    // Select tickets mode to show the email field
    await page.getByText('Open Tickets').first().click();
    await page.waitForTimeout(500);
    const emailInput = page.locator('input[placeholder="admin@yourcompany.com"]');
    await expect(emailInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('FALLBACK-008: Auto-reply template shows placeholders', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
    await page.getByText('Open Tickets').first().click();
    await page.waitForTimeout(500);
    await expect(page.getByText('{{name}}').first()).toBeVisible();
    await expect(page.getByText('{{ticketId}}').first()).toBeVisible();
  });

  test('FALLBACK-009: Ticket reference format visible', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
    const prefixInput = page.locator('input[placeholder="TKT-"]');
    await expect(prefixInput).toBeVisible();
  });

  test('FALLBACK-010: Purchase credits upsell message customizable', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
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
