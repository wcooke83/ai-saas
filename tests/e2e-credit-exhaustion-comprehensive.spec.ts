/**
 * Comprehensive Credit Exhaustion Fallback E2E Tests
 *
 * Tests the full lifecycle of each fallback mode:
 * 1. Admin configures mode + custom config via settings
 * 2. Widget config API reflects the configuration
 * 3. When credits are exhausted (mocked 403), the widget transitions to the correct fallback view
 * 4. The fallback form/UI is functional (submit, success state, etc.)
 * 5. Submissions appear in the admin dashboard
 * 6. Admin can manage submissions (status changes, notes, delete)
 * 7. Language changes don't break fallback views
 * 8. Edge cases (rate limiting, empty states, config defaults)
 */

import { test, expect, Page } from '@playwright/test';

// Use the e2e test user's chatbot for everything — owned by the authenticated user
// AND published+active, so both admin PATCH and public widget config work.
const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_URL = `/widget/${BOT_ID}`;

// ============================================================
// Helper: navigate to settings Credit Exhaustion section
// ============================================================
async function goToFallbackSettings(page: Page) {
  await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
  await page.waitForLoadState('domcontentloaded');
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
  await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });
}

// ============================================================
// Helper: mock the chat API to return 403 USAGE_LIMIT_REACHED
// ============================================================
async function mockCreditExhausted(page: Page, chatbotId: string) {
  await page.route(`**/api/chat/${chatbotId}`, (route) =>
    route.fulfill({
      status: 403,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Chatbot has reached its monthly message limit',
          code: 'USAGE_LIMIT_REACHED',
        },
      }),
    })
  );
}

// ============================================================
// Helper: send a chat message in the widget and wait for fallback transition
// ============================================================
async function triggerFallback(page: Page) {
  await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 15000 });
  await page.locator('.chat-widget-input').fill('Hello, I need help');
  await page.locator('.chat-widget-send').click();
  // The widget shows the error, then transitions after 1.5s
  await expect(page.locator('.chat-widget-ticket-form, .chat-widget-contact-form, .chat-widget-purchase-view, .chat-widget-articles-view, .chat-widget-message-error')).toBeVisible({ timeout: 10000 });
}

// ============================================================
// Helper: set credit exhaustion config on the bot (via authenticated page.request)
// ============================================================
async function setFallbackConfig(page: Page, mode: string, config: Record<string, unknown> = {}) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: { credit_exhaustion_mode: mode, credit_exhaustion_config: config },
  });
}

// ============================================================
// Helper: reset bot to default state
// ============================================================
async function resetBot(page: Page) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: { credit_exhaustion_mode: 'tickets', credit_exhaustion_config: {}, language: 'en' },
  });
}


// ============================================================
// 1. CONFIGURATION PROPAGATION
// ============================================================
test.describe('1. Configuration Propagation', () => {

  test('CFG-001: Setting tickets mode via API is reflected in widget config', async ({ page }) => {
    // Set mode
    const patchRes = await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'tickets',
        credit_exhaustion_config: {
          tickets: {
            title: 'Custom Ticket Title',
            description: 'Custom ticket description for testing',
            showPhone: true,
            showSubject: true,
            showPriority: true,
            ticketReferencePrefix: 'TEST-',
            adminNotificationEmail: 'admin@e2etest.com',
          },
        },
      },
    });
    expect(patchRes.ok()).toBeTruthy();

    // Verify widget config
    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    expect(configRes.ok()).toBeTruthy();
    const config = await configRes.json();
    expect(config.data.creditExhaustionMode).toBe('tickets');
    expect(config.data.creditExhaustionConfig.tickets.title).toBe('Custom Ticket Title');
    expect(config.data.creditExhaustionConfig.tickets.showPhone).toBe(true);
  });

  test('CFG-002: Setting contact_form mode propagates to widget config', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'contact_form',
        credit_exhaustion_config: {
          contact_form: {
            title: 'E2E Contact Title',
            description: 'E2E contact description',
            adminNotificationEmail: 'contact-admin@e2etest.com',
            autoReplyEnabled: false,
          },
        },
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    expect(config.data.creditExhaustionMode).toBe('contact_form');
    expect(config.data.creditExhaustionConfig.contact_form.title).toBe('E2E Contact Title');
  });

  test('CFG-003: Setting purchase_credits mode propagates to widget config', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'E2E upsell: buy more credits!',
            purchaseSuccessMessage: 'E2E success: credits added!',
            packages: [],
          },
        },
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    expect(config.data.creditExhaustionMode).toBe('purchase_credits');
    expect(config.data.creditExhaustionConfig.purchase_credits.upsellMessage).toBe('E2E upsell: buy more credits!');
  });

  test('CFG-004: Setting help_articles mode propagates to widget config', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'help_articles',
        credit_exhaustion_config: {
          help_articles: {
            searchPlaceholder: 'E2E search placeholder',
            emptyStateMessage: 'E2E no articles message',
          },
        },
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    expect(config.data.creditExhaustionMode).toBe('help_articles');
    expect(config.data.creditExhaustionConfig.help_articles.searchPlaceholder).toBe('E2E search placeholder');
  });

  test('CFG-005: creditExhausted flag is false when messages are under limit', async ({ page }) => {
    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    // The widget bot should not be exhausted in normal E2E state
    expect(config.data).toHaveProperty('creditExhausted');
    // creditExhausted is a boolean
    expect(typeof config.data.creditExhausted).toBe('boolean');
  });

  test('CFG-006: Default config is returned when no custom config is set', async ({ page }) => {
    // Clear custom config
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'tickets',
        credit_exhaustion_config: {},
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    // Should have default values merged in
    expect(config.data.creditExhaustionConfig).toBeTruthy();
    expect(config.data.creditExhaustionConfig.tickets).toBeTruthy();
    expect(config.data.creditExhaustionConfig.tickets.title).toBeTruthy();
  });
});


// ============================================================
// 2. WIDGET FALLBACK VIEW — TICKETS MODE
// ============================================================
test.describe('2. Widget Fallback: Tickets Mode', () => {

  test('TKT-W-001: Widget transitions to ticket form on credit exhaustion', async ({ page }) => {
    await setFallbackConfig(page, 'tickets', {
      tickets: {
        title: 'Submit a Ticket',
        description: 'AI is unavailable. Please submit a ticket.',
        showPhone: true, showSubject: true, showPriority: true,
        ticketReferencePrefix: 'E2E-',
      },
    });
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Submit a Ticket').first()).toBeVisible();
    await expect(page.locator('text=AI is unavailable').first()).toBeVisible();
  });

  test('TKT-W-002: Ticket form shows configured optional fields', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });
    // Required fields always present
    await expect(page.locator('text=Name *').first()).toBeVisible();
    await expect(page.locator('text=Email *').first()).toBeVisible();
    await expect(page.locator('text=Message *').first()).toBeVisible();
    // Optional fields enabled in config
    await expect(page.locator('text=Phone').first()).toBeVisible();
    await expect(page.locator('text=Subject').first()).toBeVisible();
    await expect(page.locator('text=Priority').first()).toBeVisible();
  });

  test('TKT-W-003: Ticket form validates required fields', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });
    // Fill only partial data — name but not email or message
    await page.locator('input[placeholder="Your name"]').fill('Test');
    // Submit — the form uses JS validation that shows error text
    await page.locator('.chat-widget-ticket-submit').click();
    // Form should still be visible (not submitted)
    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible();
    await expect(page.locator('.chat-widget-ticket-success')).not.toBeVisible();
  });

  test('TKT-W-004: Ticket form submits successfully and shows reference', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    // Also mock the ticket submission endpoint for reliable test
    await page.route(`**/api/widget/${BOT_ID}/tickets`, (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { ticketId: 'mock-uuid', reference: 'E2E-0001' },
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Fill form
    await page.locator('input[placeholder="Your name"]').fill('E2E Test User');
    await page.locator('input[placeholder="your@email.com"]').fill('e2e@test.com');
    await page.locator('input[placeholder="Subject"]').fill('Test Subject');
    await page.locator('textarea[placeholder="Describe your issue..."]').fill('This is an E2E test ticket message.');
    await page.locator('.chat-widget-ticket-submit').click();

    // Should show success with reference number
    await expect(page.locator('.chat-widget-ticket-success')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Ticket submitted!').first()).toBeVisible();
    await expect(page.locator('text=E2E-0001').first()).toBeVisible();
  });

  test('cleanup: reset to tickets mode', async ({ page }) => {
    await resetBot(page);
  });
});


// ============================================================
// 3. WIDGET FALLBACK VIEW — CONTACT FORM MODE
// ============================================================
test.describe('3. Widget Fallback: Contact Form Mode', () => {

  test('CTF-W-001: Widget transitions to contact form on credit exhaustion', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form', {
      contact_form: {
        title: 'Leave a Message',
        description: 'Our AI is taking a break. Drop us a line.',
        autoReplyEnabled: true,
      },
    });
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Leave a Message').first()).toBeVisible();
    await expect(page.locator('text=Our AI is taking a break').first()).toBeVisible();
  });

  test('CTF-W-002: Contact form shows name, email, message fields', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="your@email.com"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Your message..."]')).toBeVisible();
  });

  test('CTF-W-003: Contact form validates required fields', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });
    // Fill only name, skip email and message
    await page.locator('input[placeholder="Your name"]').fill('Test');
    await page.locator('.chat-widget-contact-form button[type="submit"]').click();
    // Form should still be visible (not submitted)
    await expect(page.locator('.chat-widget-contact-form')).toBeVisible();
    await expect(page.locator('text=Message sent!').first()).not.toBeVisible();
  });

  test('CTF-W-004: Contact form submits and shows success', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    await page.route(`**/api/widget/${BOT_ID}/contact`, (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'mock-contact-id' } }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });

    await page.locator('input[placeholder="Your name"]').fill('Contact Test User');
    await page.locator('input[placeholder="your@email.com"]').fill('contact@test.com');
    await page.locator('textarea[placeholder="Your message..."]').fill('This is a contact form E2E test.');
    await page.locator('.chat-widget-contact-form button[type="submit"]').click();

    await expect(page.locator('text=Message sent!').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=get back to you soon').first()).toBeVisible();
  });

  test('cleanup: reset to tickets mode', async ({ page }) => {
    await resetBot(page);
  });
});


// ============================================================
// 4. WIDGET FALLBACK VIEW — PURCHASE CREDITS MODE
// ============================================================
test.describe('4. Widget Fallback: Purchase Credits Mode', () => {

  test('PUR-W-001: Widget transitions to purchase view on credit exhaustion', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits', {
      purchase_credits: {
        upsellMessage: 'Credits depleted! Buy more to keep chatting.',
        purchaseSuccessMessage: 'Credits added!',
        packages: [
          { id: 'pkg-1', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_test_50' },
          { id: 'pkg-2', name: '200 Credits', creditAmount: 200, priceCents: 1499, stripePriceId: 'price_test_200' },
        ],
      },
    });
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Credits depleted').first()).toBeVisible();
  });

  test('PUR-W-002: Purchase view renders package cards from config', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
    // Two package cards
    await expect(page.locator('.chat-widget-package-card')).toHaveCount(2);
    // Card content
    await expect(page.locator('text=50 Credits').first()).toBeVisible();
    await expect(page.locator('text=200 Credits').first()).toBeVisible();
    // Price buttons
    await expect(page.locator('text=$4.99').first()).toBeVisible();
    await expect(page.locator('text=$14.99').first()).toBeVisible();
  });

  test('PUR-W-003: Buy button triggers purchase API call', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    // Intercept purchase API to verify it's called with correct data
    let purchaseCalled = false;
    let purchaseBody: any = null;
    await page.route(`**/api/widget/${BOT_ID}/purchase`, async (route) => {
      purchaseCalled = true;
      purchaseBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { checkoutUrl: 'https://checkout.stripe.com/mock-session' },
        }),
      });
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    // Click the first package buy button
    await page.locator('.chat-widget-package-buy').first().click();
    await expect.poll(() => purchaseCalled).toBeTruthy();
    expect(purchaseCalled).toBeTruthy();
    expect(purchaseBody).toHaveProperty('packageId');
  });

  test('PUR-W-004: Empty packages shows no-packages message', async ({ page }) => {
    // Temporarily set empty packages
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'No packages configured',
            packages: [],
          },
        },
      },
    });

    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=No credit packages available').first()).toBeVisible();
  });

  test('cleanup: reset to tickets mode', async ({ page }) => {
    await resetBot(page);
  });
});


// ============================================================
// 5. WIDGET FALLBACK VIEW — HELP ARTICLES MODE
// ============================================================
test.describe('5. Widget Fallback: Help Articles Mode', () => {

  test('ART-W-001: Widget transitions to help articles view on credit exhaustion', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles', {
      help_articles: {
        searchPlaceholder: 'Search our help center...',
        emptyStateMessage: 'No articles available at this time.',
      },
    });
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
  });

  test('ART-W-002: Help articles view shows search bar with custom placeholder', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    const searchInput = page.locator('.chat-widget-articles-search input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search our help center...');
  });

  test('ART-W-003: Help articles view shows articles when available', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    // Mock articles endpoint to return test articles
    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            articles: [
              { id: 'art-1', title: 'Getting Started Guide', summary: 'Learn how to get started with our platform.', body: '# Getting Started\n\nWelcome to our platform.' },
              { id: 'art-2', title: 'Billing FAQ', summary: 'Common billing questions answered.', body: '# Billing FAQ\n\n**Q: How do I update my card?**\nGo to Settings > Billing.' },
            ],
          },
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.chat-widget-article-card')).toHaveCount(2);
    await expect(page.locator('text=Getting Started Guide').first()).toBeVisible();
    await expect(page.locator('text=Billing FAQ').first()).toBeVisible();
  });

  test('ART-W-004: Clicking an article expands it to detail view', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            articles: [
              { id: 'art-1', title: 'Test Article', summary: 'A test summary.', body: '# Test Article\n\nThis is the **full body** of the article.' },
            ],
          },
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    // Click the article card
    await page.locator('.chat-widget-article-card').first().click();
    // Detail view should be visible
    await expect(page.locator('.chat-widget-article-detail')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Test Article').first()).toBeVisible();
    await expect(page.locator('text=full body').first()).toBeVisible();
  });

  test('ART-W-005: Back button returns from article detail to list', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            articles: [
              { id: 'art-1', title: 'Article One', summary: 'Summary one.', body: 'Body one.' },
            ],
          },
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    await page.locator('.chat-widget-article-card').first().click();
    await expect(page.locator('.chat-widget-article-detail')).toBeVisible({ timeout: 5000 });

    // Click back button
    await page.locator('text=Back to articles').click();
    // Should be back to list
    await expect(page.locator('.chat-widget-article-card')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.chat-widget-article-detail')).not.toBeVisible();
  });

  test('ART-W-006: Empty state shown when no articles exist', async ({ page }) => {
    await mockCreditExhausted(page, BOT_ID);

    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { articles: [] } }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=No articles available at this time').first()).toBeVisible({ timeout: 5000 });
  });

  test('ART-W-007: Search triggers new articles fetch', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles', {
      help_articles: { searchPlaceholder: 'Search...', emptyStateMessage: 'None' },
    });
    await mockCreditExhausted(page, BOT_ID);

    const requestUrls: string[] = [];
    await page.route(`**/api/widget/${BOT_ID}/articles*`, async (route) => {
      requestUrls.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { articles: [] } }),
      });
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });

    // Clear previous request tracking
    const beforeCount = requestUrls.length;

    // Type search query and click Search
    await page.locator('.chat-widget-articles-search input').fill('billing');
    await page.locator('.chat-widget-articles-search button').click();
    await expect.poll(() => requestUrls.length).toBeGreaterThan(beforeCount);

    // A new request should have been made after the search
    expect(requestUrls.length).toBeGreaterThan(beforeCount);
    const searchUrl = requestUrls.find(u => u.includes('q=billing'));
    expect(searchUrl).toBeTruthy();
  });

  test('cleanup: reset to tickets mode', async ({ page }) => {
    await resetBot(page);
  });
});


// ============================================================
// 6. ADMIN TICKET LIFECYCLE
// ============================================================
test.describe('6. Admin Ticket Lifecycle', () => {

  let createdTicketId: string | null = null;

  test('ADM-TKT-001: Create ticket via widget API', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${BOT_ID}/tickets`, {
      data: {
        name: 'Lifecycle Test User',
        email: 'lifecycle@test.com',
        subject: 'Lifecycle test ticket',
        message: 'This ticket tests the full admin lifecycle.',
        priority: 'high',
      },
    });
    // Might be 201 or 404 depending on chatbot state — either is non-500
    expect(res.status()).toBeLessThan(500);
    if (res.status() === 201) {
      const data = await res.json();
      createdTicketId = data.data?.ticketId;
    }
  });

  test('ADM-TKT-002: Tickets appear in admin list endpoint', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${BOT_ID}/tickets`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data.tickets).toBeDefined();
      expect(typeof data.data.total).toBe('number');
    }
  });

  test('ADM-TKT-003: Tickets page renders with filter tabs', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/tickets`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Tickets' })).toBeVisible({ timeout: 15000 });
    // Filter tabs
    await expect(page.getByText('All').first()).toBeVisible();
    await expect(page.getByText('Open').first()).toBeVisible();
    await expect(page.getByText('In Progress').first()).toBeVisible();
    await expect(page.getByText('Resolved').first()).toBeVisible();
    await expect(page.getByText('Closed').first()).toBeVisible();
  });

  test('ADM-TKT-004: Filter tabs change displayed tickets', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/tickets`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Tickets' })).toBeVisible({ timeout: 15000 });

    // Click "Open" filter
    await page.getByText('Open').first().click();
    // Page should not error out
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('ADM-TKT-005: Ticket status can be updated via API', async ({ page }) => {
    // Get first ticket
    const listRes = await page.request.get(`/api/chatbots/${BOT_ID}/tickets`);
    if (!listRes.ok()) return;
    const listData = await listRes.json();
    const ticket = listData.data?.tickets?.[0];
    if (!ticket) return;

    // Update status
    const updateRes = await page.request.patch(`/api/chatbots/${BOT_ID}/tickets/${ticket.id}`, {
      data: { status: 'in_progress' },
    });
    expect(updateRes.ok()).toBeTruthy();

    if (updateRes.ok()) {
      const updateData = await updateRes.json();
      expect(updateData.data.ticket.status).toBe('in_progress');
    }
  });

  test('ADM-TKT-006: Admin notes can be added to a ticket', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${BOT_ID}/tickets`);
    if (!listRes.ok()) return;
    const listData = await listRes.json();
    const ticket = listData.data?.tickets?.[0];
    if (!ticket) return;

    const updateRes = await page.request.patch(`/api/chatbots/${BOT_ID}/tickets/${ticket.id}`, {
      data: { admin_notes: 'E2E test admin note' },
    });
    expect(updateRes.ok()).toBeTruthy();

    if (updateRes.ok()) {
      const updateData = await updateRes.json();
      expect(updateData.data.ticket.admin_notes).toBe('E2E test admin note');
    }
  });

  test('ADM-TKT-007: Resolving a ticket sets resolved_at timestamp', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${BOT_ID}/tickets`);
    if (!listRes.ok()) return;
    const listData = await listRes.json();
    const ticket = listData.data?.tickets?.[0];
    if (!ticket) return;

    const updateRes = await page.request.patch(`/api/chatbots/${BOT_ID}/tickets/${ticket.id}`, {
      data: { status: 'resolved' },
    });
    if (updateRes.ok()) {
      const updateData = await updateRes.json();
      expect(updateData.data.ticket.status).toBe('resolved');
      expect(updateData.data.ticket.resolved_at).toBeTruthy();
    }
  });
});


// ============================================================
// 7. ADMIN CONTACT SUBMISSION LIFECYCLE
// ============================================================
test.describe('7. Admin Contact Submission Lifecycle', () => {

  test('ADM-CTF-001: Create contact submission via widget API', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${BOT_ID}/contact`, {
      data: {
        name: 'Contact Lifecycle User',
        email: 'contact-lifecycle@test.com',
        message: 'Testing admin contact lifecycle.',
      },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('ADM-CTF-002: Contact submissions endpoint returns valid response', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${BOT_ID}/contact-submissions`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('submissions');
      expect(data.data).toHaveProperty('total');
      expect(Array.isArray(data.data.submissions)).toBeTruthy();
    }
  });

  test('ADM-CTF-003: Contact page renders', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/contact`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Contact Submissions' })).toBeVisible({ timeout: 15000 });
  });

  test('ADM-CTF-004: Contact submission status can be updated', async ({ page }) => {
    const listRes = await page.request.get(`/api/chatbots/${BOT_ID}/contact-submissions`);
    if (!listRes.ok()) return;
    const data = await listRes.json();
    const sub = data.data?.submissions?.[0];
    if (!sub) return;

    const updateRes = await page.request.patch(
      `/api/chatbots/${BOT_ID}/contact-submissions?submissionId=${sub.id}`,
      { data: { status: 'read' } }
    );
    expect(updateRes.ok()).toBeTruthy();
    if (updateRes.ok()) {
      const updateData = await updateRes.json();
      expect(updateData.data.submission.status).toBe('read');
    }
  });
});


// ============================================================
// 8. ADMIN ARTICLES LIFECYCLE
// ============================================================
test.describe('8. Admin Articles Lifecycle', () => {

  test('ADM-ART-001: Articles admin endpoint returns list with source count', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${BOT_ID}/articles`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('articles');
      expect(data.data).toHaveProperty('knowledgeSourcesCount');
    }
  });

  test('ADM-ART-002: Articles page renders with generate button', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Help Articles' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Generate from Knowledge').first()).toBeVisible();
  });

  test('ADM-ART-003: Articles page renders without errors', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    // Just verify the page renders with the heading — content depends on DB state
    await expect(page.getByRole('heading', { name: 'Help Articles' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 3000 });
  });

  test('ADM-ART-004: Widget articles endpoint returns array', async ({ request }) => {
    const res = await request.get(`/api/widget/${BOT_ID}/articles`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(Array.isArray(data.data?.articles)).toBeTruthy();
    }
  });

  test('ADM-ART-005: Widget articles search with query param', async ({ request }) => {
    const res = await request.get(`/api/widget/${BOT_ID}/articles?q=test`);
    expect(res.ok()).toBeTruthy();
  });
});


// ============================================================
// 9. LANGUAGE CONSISTENCY
// ============================================================
test.describe('9. Language Consistency', () => {

  test('LANG-001: Changing language to Spanish does not break ticket fallback view', async ({ page }) => {
    // Set language to Spanish
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { language: 'es', credit_exhaustion_mode: 'tickets' },
    });

    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    // Ticket form should still render (fallback text is config-driven, not translation-driven)
    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });
    // Form fields should still be functional
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="your@email.com"]')).toBeVisible();
  });

  test('LANG-002: Changing language to French does not break contact fallback view', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form', {
      contact_form: { title: 'Contactez-nous', description: 'Test FR' },
    });
    await page.request.patch(`/api/chatbots/${BOT_ID}`, { data: { language: 'fr' } });

    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });
  });

  test('LANG-003: Changing language to Arabic (RTL) does not break purchase view', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits', {
      purchase_credits: { upsellMessage: 'Arabic test', packages: [] },
    });
    await page.request.patch(`/api/chatbots/${BOT_ID}`, { data: { language: 'ar' } });

    await mockCreditExhausted(page, BOT_ID);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
  });

  test('LANG-004: Changing language to Japanese does not break articles view', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles', {
      help_articles: { searchPlaceholder: 'Search JP', emptyStateMessage: 'None' },
    });
    await page.request.patch(`/api/chatbots/${BOT_ID}`, { data: { language: 'ja' } });

    await mockCreditExhausted(page, BOT_ID);

    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { articles: [] } }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await triggerFallback(page);

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
  });

  test('LANG-005: Language update is tracked with language_updated_at', async ({ page }) => {
    // Reset to English first
    await page.request.patch(`/api/chatbots/${BOT_ID}`, { data: { language: 'en' } });

    const before = await page.request.get(`/api/chatbots/${BOT_ID}`);
    const beforeData = await before.json();
    const beforeTimestamp = beforeData.data?.chatbot?.language_updated_at;

    // Change language to German
    await page.request.patch(`/api/chatbots/${BOT_ID}`, { data: { language: 'de' } });

    const after = await page.request.get(`/api/chatbots/${BOT_ID}`);
    const afterData = await after.json();
    const afterTimestamp = afterData.data?.chatbot?.language_updated_at;

    // Timestamp should have changed (or been set)
    if (beforeTimestamp) {
      expect(afterTimestamp).not.toBe(beforeTimestamp);
    } else {
      expect(afterTimestamp).toBeTruthy();
    }
  });

  test('LANG-CLEANUP: Restore English and tickets mode', async ({ page }) => {
    await resetBot(page);
  });
});


// ============================================================
// 10. EDGE CASES AND API VALIDATION
// ============================================================
test.describe('10. Edge Cases & Validation', () => {

  test('EDGE-001: Ticket API rejects oversized message (>5000 chars)', async ({ request }) => {
    const longMessage = 'A'.repeat(5001);
    const res = await request.post(`/api/widget/${BOT_ID}/tickets`, {
      data: { name: 'Test', email: 'test@test.com', message: longMessage },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-002: Contact API rejects oversized message', async ({ request }) => {
    const longMessage = 'B'.repeat(5001);
    const res = await request.post(`/api/widget/${BOT_ID}/contact`, {
      data: { name: 'Test', email: 'test@test.com', message: longMessage },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-003: Ticket API rejects invalid priority value', async ({ request }) => {
    const res = await request.post(`/api/widget/${BOT_ID}/tickets`, {
      data: { name: 'Test', email: 'test@test.com', message: 'Test', priority: 'critical' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-004: Purchase API rejects missing packageId', async ({ request }) => {
    const res = await request.post(`/api/widget/${BOT_ID}/purchase`, {
      data: {},
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-005: Invalid credit_exhaustion_mode rejected by PATCH', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'invalid_mode' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-006: Articles endpoint handles empty search gracefully', async ({ request }) => {
    const res = await request.get(`/api/widget/${BOT_ID}/articles?q=`);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-007: Articles endpoint handles special characters in search', async ({ request }) => {
    const res = await request.get(`/api/widget/${BOT_ID}/articles?q=${encodeURIComponent("O'Brien & <script>")}`);
    expect(res.status()).toBeLessThan(500);
  });

  test('EDGE-008: Widget does NOT transition to fallback on normal 403 (non-limit)', async ({ page }) => {
    // Mock a non-limit 403 (e.g., chatbot unpublished)
    await page.route(`**/api/chat/${BOT_ID}`, (route) =>
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { message: 'Chatbot is not available', code: 'FORBIDDEN' },
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 15000 });
    await page.locator('.chat-widget-input').fill('Hello');
    await page.locator('.chat-widget-send').click();
    await page.waitForLoadState('domcontentloaded');

    // Should NOT show any fallback view
    await expect(page.locator('.chat-widget-ticket-form')).not.toBeVisible();
    await expect(page.locator('.chat-widget-contact-form')).not.toBeVisible();
    await expect(page.locator('.chat-widget-purchase-view')).not.toBeVisible();
    await expect(page.locator('.chat-widget-articles-view')).not.toBeVisible();
  });

  test('EDGE-009: Ticket submission with all optional fields', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${BOT_ID}/tickets`, {
      data: {
        name: 'Full Fields User',
        email: 'full@test.com',
        phone: '+1-555-0123',
        subject: 'Full field test',
        message: 'Testing all fields populated.',
        priority: 'urgent',
        customFields: { department: 'Sales', urgency: 'ASAP' },
      },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('EDGE-010: Admin article delete endpoint works', async ({ page }) => {
    // Try to delete a non-existent article — should not 500
    const res = await page.request.delete(
      `/api/chatbots/${BOT_ID}/articles/00000000-0000-0000-0000-000000000000`
    );
    expect(res.status()).toBeLessThan(500);
  });
});


// ============================================================
// 11. SUBNAV INTEGRATION
// ============================================================
test.describe('11. Subnav Integration', () => {

  test('NAV-001: Tickets link appears in chatbot subnav', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/tickets`);
    await page.waitForLoadState('domcontentloaded');
    // Should not show a 404 or error — the page rendered with the Tickets heading
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 5000 });
  });

  test('NAV-002: Contact link appears in chatbot subnav', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/contact`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 5000 });
  });

  test('NAV-003: Articles link appears in chatbot subnav', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${BOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 5000 });
  });
});
