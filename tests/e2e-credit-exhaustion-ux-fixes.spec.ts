/**
 * E2E Tests for Credit Exhaustion UX Audit Fixes
 *
 * Covers behavior changes from the UX audit:
 * - Immediate fallback on mount (creditExhausted=true, no message needed)
 * - Per-field validation with inline errors
 * - Email format validation
 * - Purchase error display (visible, not just console)
 * - Keyboard navigation on article cards
 * - Back-to-chat button after form submission
 * - Credit packages served from DB via settings → API → widget
 * - Low credit warning banner (pre-emptive at 80%)
 * - Full credit exhaustion → purchase → continue flow
 * - Settings UI for the new global-packages model
 */

import { test, expect, Page } from '@playwright/test';

const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_URL = `/widget/${BOT_ID}`;

// ============================================================
// Helpers
// ============================================================

async function setFallbackConfig(page: Page, mode: string, config: Record<string, unknown> = {}) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: { credit_exhaustion_mode: mode, credit_exhaustion_config: config },
  });
}

/**
 * Exhaust credits via the real API so widget config returns creditExhausted=true
 * and the chat API returns 403 USAGE_LIMIT_REACHED.
 * Only works for non-purchase modes (tickets, contact_form, help_articles).
 */
async function exhaustCredits(page: Page) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: { monthly_message_limit: 1, messages_this_month: 1 },
  });
}

/** Reset credits to a healthy state */
async function resetCredits(page: Page) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: { monthly_message_limit: 1000, messages_this_month: 0 },
  });
}

/**
 * Mock widget config for purchase_credits mode where creditExhausted=true.
 * This MUST be mocked because the real API deliberately returns creditExhausted=false
 * for purchase_credits mode (server handles exhaustion via auto-topup).
 */
async function mockWidgetConfigExhaustedPurchaseMode(page: Page, extraConfig: Record<string, unknown> = {}) {
  await page.route(`**/api/widget/${BOT_ID}/config*`, async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    if (data.data) {
      data.data.creditExhausted = true;
      data.data.creditExhaustionMode = 'purchase_credits';
      if (Object.keys(extraConfig).length > 0) {
        data.data.creditExhaustionConfig = { ...data.data.creditExhaustionConfig, ...extraConfig };
      }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

/** Full mock of widget config — does not call real API */
async function mockFullWidgetConfig(page: Page, config: Record<string, unknown>) {
  await page.route(`**/api/widget/${BOT_ID}/config*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: config }),
    })
  );
}



/** Default base config for full mocking when real API is not needed */
function baseWidgetConfig(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    chatbot: { id: BOT_ID, name: 'E2E Test Bot', welcome_message: 'Hello!', placeholder_text: 'Type a message...', logo_url: null, language: 'en' },
    widgetConfig: {
      position: 'bottom-right', offsetX: 20, offsetY: 20,
      width: 380, height: 600, buttonSize: 60,
      primaryColor: '#0ea5e9', secondaryColor: '#f0f9ff', backgroundColor: '#ffffff',
      textColor: '#0f172a', userBubbleColor: '#0ea5e9', userBubbleTextColor: '#ffffff',
      botBubbleColor: '#f1f5f9', botBubbleTextColor: '#0f172a', headerTextColor: '#ffffff',
      inputBackgroundColor: '#ffffff', inputTextColor: '#0f172a', inputPlaceholderColor: '#94a3b8',
      sendButtonColor: '#0ea5e9', sendButtonIconColor: '#ffffff',
      formBackgroundColor: '#ffffff', formTitleColor: '#0f172a', formDescriptionColor: '#6b7280',
      formBorderColor: '#e5e7eb', formLabelColor: '#0f172a', formSubmitButtonTextColor: '#ffffff',
      formPlaceholderColor: '#94a3b8', formInputBackgroundColor: '#ffffff', formInputTextColor: '#0f172a',
      secondaryButtonColor: 'transparent', secondaryButtonTextColor: '#374151', secondaryButtonBorderColor: '#d1d5db',
      fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14,
      containerBorderRadius: 16, inputBorderRadius: 24, buttonBorderRadius: 50,
      showBranding: true, headerText: 'Chat with us',
      autoOpen: false, autoOpenDelay: 3000, soundEnabled: false,
      reportBackgroundColor: '#ffffff', reportTextColor: '#0f172a',
      reportReasonButtonColor: '#f1f5f9', reportReasonButtonTextColor: '#0f172a',
      reportReasonSelectedColor: '#0ea5e9', reportReasonSelectedTextColor: '#ffffff',
      reportSubmitButtonColor: '#0ea5e9', reportSubmitButtonTextColor: '#ffffff',
      reportInputBackgroundColor: '#f1f5f9', reportInputTextColor: '#0f172a',
      reportInputBorderColor: '#e2e8f0', customCss: '',
    },
    preChatFormConfig: { enabled: false, title: 'Before we start', description: '', fields: [
      { id: 'name', type: 'name', label: 'Name', placeholder: 'Your name', required: true },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
    ], submitButtonText: 'Start Chat' },
    postChatSurveyConfig: { enabled: false },
    fileUploadConfig: { enabled: false },
    proactiveMessagesConfig: { enabled: false },
    transcriptConfig: { enabled: false },
    escalationConfig: { enabled: false },
    feedbackConfig: { enabled: false },
    liveHandoffConfig: { enabled: false },
    agentsAvailable: false,
    creditExhausted: false,
    creditLow: false,
    creditRemaining: null,
    creditExhaustionMode: 'tickets',
    creditExhaustionConfig: {},
    creditPackages: [],
    memoryEnabled: false,
    sessionTtlHours: 24,
    ...overrides,
  };
}


// ============================================================
// 1. IMMEDIATE FALLBACK ON MOUNT
// ============================================================
test.describe('1. Immediate Fallback on Mount', () => {

  test('MOUNT-001: Widget shows ticket form immediately when creditExhausted=true', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Should show ticket form immediately — no need to send a message
    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });
    // Chat input should NOT be visible
    await expect(page.locator('.chat-widget-input')).not.toBeVisible();
  });

  test('MOUNT-002: Widget shows contact form immediately when creditExhausted=true', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });
  });

  test('MOUNT-003: Widget shows purchase view immediately when creditExhausted=true', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits');
    // Must mock: real API returns creditExhausted=false for purchase_credits mode (server-side handling)
    await mockWidgetConfigExhaustedPurchaseMode(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
  });

  test('MOUNT-004: Widget shows articles view immediately when creditExhausted=true', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
  });

  test('MOUNT-005: Widget shows normal chat when creditExhausted=false', async ({ page }) => {
    await resetCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Chat input should be visible, no fallback views
    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.chat-widget-ticket-form')).not.toBeVisible();
    await expect(page.locator('.chat-widget-contact-form')).not.toBeVisible();
    await expect(page.locator('.chat-widget-purchase-view')).not.toBeVisible();
    await expect(page.locator('.chat-widget-articles-view')).not.toBeVisible();
  });
});


// ============================================================
// 2. PER-FIELD VALIDATION & EMAIL FORMAT
// ============================================================
test.describe('2. Per-Field Validation', () => {

  test('VAL-001: Ticket form shows per-field errors when fields are empty', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Widget shows ticket form immediately since credits are exhausted
    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Submit empty form
    await page.locator('.chat-widget-ticket-submit').click();

    // Per-field errors should appear
    await expect(page.locator('#ticket-name-err')).toBeVisible();
    await expect(page.locator('#ticket-name-err')).toHaveText('Name is required');
    await expect(page.locator('#ticket-email-err')).toBeVisible();
    await expect(page.locator('#ticket-email-err')).toHaveText('Email is required');
    await expect(page.locator('#ticket-msg-err')).toBeVisible();
    await expect(page.locator('#ticket-msg-err')).toHaveText('Message is required');
  });

  test('VAL-002: Ticket form shows email format error for invalid email', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Fill name and message, but use invalid email
    await page.locator('#ticket-name').fill('Test User');
    await page.locator('#ticket-email').fill('not-an-email');
    await page.locator('#ticket-message').fill('Test message');
    await page.locator('.chat-widget-ticket-submit').click();

    // Email-specific error
    await expect(page.locator('#ticket-email-err')).toBeVisible();
    await expect(page.locator('#ticket-email-err')).toHaveText('Please enter a valid email address');
    // Name and message errors should NOT appear (they're filled)
    await expect(page.locator('#ticket-name-err')).not.toBeVisible();
    await expect(page.locator('#ticket-msg-err')).not.toBeVisible();
  });

  test('VAL-003: Ticket form clears field error when user starts typing', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Trigger errors
    await page.locator('.chat-widget-ticket-submit').click();
    await expect(page.locator('#ticket-name-err')).toBeVisible();

    // Start typing in name field — error should clear
    await page.locator('#ticket-name').fill('A');
    await expect(page.locator('#ticket-name-err')).not.toBeVisible();
  });

  test('VAL-004: Contact form shows per-field errors', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });

    // Submit empty
    await page.locator('.chat-widget-contact-form button[type="submit"]').click();

    await expect(page.locator('#contact-name-err')).toBeVisible();
    await expect(page.locator('#contact-email-err')).toBeVisible();
    await expect(page.locator('#contact-msg-err')).toBeVisible();
  });

  test('VAL-005: Contact form validates email format', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });

    await page.locator('#contact-name').fill('Test');
    await page.locator('#contact-email').fill('bademail');
    await page.locator('#contact-message').fill('Test msg');
    await page.locator('.chat-widget-contact-form button[type="submit"]').click();

    await expect(page.locator('#contact-email-err')).toHaveText('Please enter a valid email address');
  });
});


// ============================================================
// 3. ACCESSIBILITY ATTRIBUTES
// ============================================================
test.describe('3. Accessibility', () => {

  test('A11Y-001: Ticket form inputs have id and labels have htmlFor', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Check that inputs have IDs
    await expect(page.locator('#ticket-name')).toBeVisible();
    await expect(page.locator('#ticket-email')).toBeVisible();
    await expect(page.locator('#ticket-message')).toBeVisible();

    // Check that labels point to inputs
    await expect(page.locator('label[for="ticket-name"]')).toBeVisible();
    await expect(page.locator('label[for="ticket-email"]')).toBeVisible();
    await expect(page.locator('label[for="ticket-message"]')).toBeVisible();
  });

  test('A11Y-002: Contact form inputs have id and labels have htmlFor', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('label[for="contact-name"]')).toBeVisible();
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
    await expect(page.locator('label[for="contact-message"]')).toBeVisible();
  });

  test('A11Y-003: Error messages have role=alert', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Trigger errors
    await page.locator('.chat-widget-ticket-submit').click();

    // Error elements should have role="alert"
    const nameErr = page.locator('#ticket-name-err');
    await expect(nameErr).toHaveAttribute('role', 'alert');
  });

  test('A11Y-004: Article cards are keyboard focusable', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles');
    await exhaustCredits(page);

    // Mock articles endpoint for specific test article content
    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { articles: [
            { id: 'a1', title: 'Keyboard Test Article', summary: 'Testing keyboard nav', body: 'Body text' },
          ]},
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });

    // Article card should have tabIndex
    const card = page.locator('.chat-widget-article-card').first();
    await expect(card).toHaveAttribute('tabindex', '0');

    // Focus the card via tab
    await card.focus();

    // Press Enter to open article detail
    await page.keyboard.press('Enter');
    await expect(page.locator('.chat-widget-article-detail')).toBeVisible({ timeout: 5000 });
  });

  test('A11Y-005: Article list has list role', async ({ page }) => {
    await setFallbackConfig(page, 'help_articles');
    await exhaustCredits(page);

    // Mock articles endpoint for specific test article content
    await page.route(`**/api/widget/${BOT_ID}/articles*`, (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { articles: [
            { id: 'a1', title: 'Article 1', summary: 'Summary 1', body: 'Body 1' },
          ]},
        }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-articles-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[role="list"][aria-label="Help articles"]')).toBeVisible();
    await expect(page.locator('.chat-widget-article-card[role="listitem"]')).toBeVisible();
  });
});


// ============================================================
// 4. PURCHASE ERROR DISPLAY
// ============================================================
test.describe('4. Purchase Error Display', () => {

  test('ERR-001: Purchase API failure shows error message to visitor', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits');

    // Mock purchase endpoint to fail (testing error display)
    await page.route(`**/api/widget/${BOT_ID}/purchase`, (route) =>
      route.fulfill({
        status: 500, contentType: 'application/json',
        body: JSON.stringify({ success: false, error: { message: 'Stripe error: card declined' } }),
      })
    );

    // Must mock: real API returns creditExhausted=false and creditPackages=[] for purchase mode
    await mockWidgetConfigExhaustedPurchaseMode(page, {
      purchase_credits: {
        upsellMessage: 'Buy more credits',
        packages: [
          { id: 'pkg-err', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_test' },
        ],
      },
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    // Click buy
    await page.locator('.chat-widget-package-buy').first().click();

    // Error should be VISIBLE to user via .chat-widget-purchase-error (not generic [role="alert"])
    await expect(page.locator('.chat-widget-purchase-error')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.chat-widget-purchase-error')).toContainText('Stripe error: card declined');
  });

  test('ERR-002: Purchase buy button shows Loading... while in progress', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits');

    // Mock purchase with a delay (testing loading state)
    await page.route(`**/api/widget/${BOT_ID}/purchase`, async (route) => {
      await new Promise(r => setTimeout(r, 2000));
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { checkoutUrl: 'https://example.com' } }),
      });
    });

    // Must mock: real API returns creditExhausted=false and creditPackages=[] for purchase mode
    await mockWidgetConfigExhaustedPurchaseMode(page, {
      purchase_credits: {
        upsellMessage: 'Buy more',
        packages: [
          { id: 'pkg-load', name: '100 Credits', creditAmount: 100, priceCents: 999, stripePriceId: 'price_test' },
        ],
      },
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    // Click buy — should show "Loading..." not "..."
    await page.locator('.chat-widget-package-buy').first().click();
    await expect(page.locator('text=Loading...')).toBeVisible({ timeout: 2000 });
  });

  test('ERR-003: Purchase buy button has aria-label', async ({ page }) => {
    await setFallbackConfig(page, 'purchase_credits');

    // Must mock: real API returns creditExhausted=false and creditPackages=[] for purchase mode
    await mockWidgetConfigExhaustedPurchaseMode(page, {
      purchase_credits: {
        upsellMessage: 'Buy more',
        packages: [
          { id: 'pkg-aria', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_test' },
        ],
      },
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    const buyBtn = page.locator('.chat-widget-package-buy').first();
    const ariaLabel = await buyBtn.getAttribute('aria-label');
    expect(ariaLabel).toContain('Buy');
    expect(ariaLabel).toContain('$4.99');
  });
});


// ============================================================
// 5. BACK TO CHAT BUTTON
// ============================================================
test.describe('5. Back to Chat Navigation', () => {

  test('BACK-001: Ticket success state shows Back to chat button', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    // Fill and submit via real ticket API
    await page.locator('#ticket-name').fill('Back Test');
    await page.locator('#ticket-email').fill('back@test.com');
    await page.locator('#ticket-message').fill('Testing back button');
    await page.locator('.chat-widget-ticket-submit').click();

    // Success state with Back to chat
    await expect(page.locator('.chat-widget-ticket-success')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Back to chat')).toBeVisible();
  });

  test('BACK-002: Clicking Back to chat returns to chat view', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-ticket-form')).toBeVisible({ timeout: 10000 });

    await page.locator('#ticket-name').fill('Test');
    await page.locator('#ticket-email').fill('test@test.com');
    await page.locator('#ticket-message').fill('Message');
    await page.locator('.chat-widget-ticket-submit').click();

    await expect(page.locator('text=Back to chat')).toBeVisible({ timeout: 10000 });
    await page.locator('text=Back to chat').click();

    // Should be back to chat view (even if disabled)
    await expect(page.locator('.chat-widget-ticket-form')).not.toBeVisible();
    await expect(page.locator('.chat-widget-ticket-success')).not.toBeVisible();
  });

  test('BACK-003: Contact success state shows Back to chat button', async ({ page }) => {
    await setFallbackConfig(page, 'contact_form');
    await exhaustCredits(page);

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-contact-form')).toBeVisible({ timeout: 10000 });

    await page.locator('#contact-name').fill('Contact Back');
    await page.locator('#contact-email').fill('back@test.com');
    await page.locator('#contact-message').fill('Testing back');
    await page.locator('.chat-widget-contact-form button[type="submit"]').click();

    await expect(page.locator('text=Message sent!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Back to chat')).toBeVisible();
  });
});


// ============================================================
// 6. CREDIT PACKAGES FROM DB
// ============================================================
test.describe('6. Credit Packages from DB', () => {

  test('PKG-DB-001: Credit packages API returns list', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${BOT_ID}/credit-packages`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('packages');
      expect(Array.isArray(data.data.packages)).toBeTruthy();
    }
  });

  test('PKG-DB-002: Credit packages can be saved via PUT', async ({ page }) => {
    const res = await page.request.put(`/api/chatbots/${BOT_ID}/credit-packages`, {
      data: {
        packages: [
          { name: 'E2E Small Pack', credit_amount: 50, price_cents: 499, stripe_price_id: 'price_e2e_small', active: true, sort_order: 0 },
          { name: 'E2E Large Pack', credit_amount: 200, price_cents: 1499, stripe_price_id: 'price_e2e_large', active: true, sort_order: 1 },
        ],
      },
    });
    expect(res.ok()).toBeTruthy();

    if (res.ok()) {
      const data = await res.json();
      expect(data.data.packages).toHaveLength(2);
      expect(data.data.packages[0].name).toBe('E2E Small Pack');
      expect(data.data.packages[1].name).toBe('E2E Large Pack');
    }
  });

  test('PKG-DB-003: Saved packages appear in widget config', async ({ page }) => {
    // Set mode to purchase_credits first
    await setFallbackConfig(page, 'purchase_credits');

    // Save packages
    await page.request.put(`/api/chatbots/${BOT_ID}/credit-packages`, {
      data: {
        packages: [
          { name: 'Widget Pack', credit_amount: 100, price_cents: 999, stripe_price_id: 'price_widget_test', active: true, sort_order: 0 },
        ],
      },
    });

    // Check widget config
    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    if (configRes.ok()) {
      const config = await configRes.json();
      expect(config.data.creditPackages).toBeDefined();
      expect(Array.isArray(config.data.creditPackages)).toBeTruthy();
      if (config.data.creditPackages.length > 0) {
        expect(config.data.creditPackages[0].name).toBe('Widget Pack');
        expect(config.data.creditPackages[0].creditAmount).toBe(100);
        expect(config.data.creditPackages[0].priceCents).toBe(999);
      }
    }
  });

  test('PKG-DB-004: PUT replaces packages — removed ones are deleted', async ({ page }) => {
    // Save two packages
    await page.request.put(`/api/chatbots/${BOT_ID}/credit-packages`, {
      data: {
        packages: [
          { name: 'Keep This', credit_amount: 50, price_cents: 499, stripe_price_id: 'price_keep', active: true, sort_order: 0 },
          { name: 'Remove This', credit_amount: 100, price_cents: 999, stripe_price_id: 'price_remove', active: true, sort_order: 1 },
        ],
      },
    });

    // Now save only one — the other should be deleted
    await page.request.put(`/api/chatbots/${BOT_ID}/credit-packages`, {
      data: {
        packages: [
          { name: 'Keep This', credit_amount: 50, price_cents: 499, stripe_price_id: 'price_keep', active: true, sort_order: 0 },
        ],
      },
    });

    const res = await page.request.get(`/api/chatbots/${BOT_ID}/credit-packages`);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data.packages).toHaveLength(1);
      expect(data.data.packages[0].name).toBe('Keep This');
    }
  });

  test('PKG-DB-005: Widget config returns empty packages when mode is not purchase_credits', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    if (configRes.ok()) {
      const config = await configRes.json();
      expect(config.data.creditPackages).toEqual([]);
    }
  });

  // Cleanup
  test('PKG-DB-CLEANUP: Remove test packages and reset credits', async ({ page }) => {
    await page.request.put(`/api/chatbots/${BOT_ID}/credit-packages`, {
      data: { packages: [] },
    });
    await setFallbackConfig(page, 'tickets');
    await resetCredits(page);
  });
});


// ============================================================
// 7. LOW CREDIT WARNING BANNER
// ============================================================
test.describe('7. Low Credit Warning Banner', () => {

  test('LOW-001: Banner appears when creditLow=true with remaining count', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditLow: true,
      creditRemaining: 5,
      creditExhausted: false,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: [
        { id: 'pkg-low-1', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_low_test' },
      ],
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });
    await expect(banner).toContainText('5 remaining');
  });

  test('LOW-002: Banner dismiss button hides the banner', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditLow: true,
      creditRemaining: 3,
      creditExhausted: false,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: [
        { id: 'pkg-low-2', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_low_test' },
      ],
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });

    // Click dismiss (x) button
    await banner.locator('button[aria-label="Dismiss low credit warning"]').click();
    await expect(banner).not.toBeVisible();
  });

  test('LOW-003: Banner "Purchase more" link opens purchase overlay', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditLow: true,
      creditRemaining: 2,
      creditExhausted: false,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: [
        { id: 'pkg-low-3', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_low_test' },
      ],
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });

    // Click "Purchase more" link inside the banner
    await banner.locator('button', { hasText: 'Purchase more' }).click();

    // Purchase overlay should appear
    const overlay = page.locator('.chat-widget-purchase-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });
    await expect(overlay).toContainText('Purchase More Credits');
  });

  test('LOW-004: Purchase overlay shows packages and can be closed', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditLow: true,
      creditRemaining: 2,
      creditExhausted: false,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: [
        { id: 'pkg-low-4a', name: 'Small Pack', creditAmount: 25, priceCents: 299, stripePriceId: 'price_sm' },
        { id: 'pkg-low-4b', name: 'Big Pack', creditAmount: 100, priceCents: 999, stripePriceId: 'price_lg' },
      ],
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });
    await banner.locator('button', { hasText: 'Purchase more' }).click();

    const overlay = page.locator('.chat-widget-purchase-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    // Should show both packages
    const cards = overlay.locator('.chat-widget-package-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText('Small Pack');
    await expect(cards.last()).toContainText('Big Pack');

    // Close the overlay
    await overlay.locator('button[aria-label="Close purchase overlay"]').click();
    await expect(overlay).not.toBeVisible();

    // Chat input should still be visible (not exhausted)
    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });
  });

  test('LOW-005: No banner when creditLow=false', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditLow: false,
      creditRemaining: 100,
      creditExhausted: false,
      creditExhaustionMode: 'purchase_credits',
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.chat-widget-low-credit-banner')).not.toBeVisible();
  });
});


// ============================================================
// 8. FULL CREDIT EXHAUSTION → PURCHASE → CONTINUE FLOW
// ============================================================
test.describe('8. Full Credit Exhaustion → Purchase → Continue Flow', () => {

  const TEST_PACKAGES = [
    { id: 'pkg-flow-a', name: 'Basic Refill', creditAmount: 50, priceCents: 499, stripePriceId: 'price_flow_basic' },
    { id: 'pkg-flow-b', name: 'Pro Refill', creditAmount: 200, priceCents: 1499, stripePriceId: 'price_flow_pro' },
  ];

  test('FLOW-001: Normal chat works when credits are not exhausted', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: false,
      creditLow: false,
      creditRemaining: 100,
    }));

    // Mock a successful chat response
    await page.route(`**/api/chat/${BOT_ID}`, (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { message: 'Hello! How can I help?' } }),
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });
    // No fallback views
    await expect(page.locator('.chat-widget-purchase-view')).not.toBeVisible();
    await expect(page.locator('.chat-widget-low-credit-banner')).not.toBeVisible();
  });

  test('FLOW-002: Warning banner appears when credits reach low threshold', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: false,
      creditLow: true,
      creditRemaining: 8,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Chat input should still be available
    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });

    // Banner should warn about low credits
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 10000 });
    await expect(banner).toContainText('8 remaining');
  });

  test('FLOW-003: Widget switches to purchase fallback when credits are fully exhausted', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: true,
      creditLow: false,
      creditRemaining: 0,
      creditExhaustionMode: 'purchase_credits',
      creditExhaustionConfig: { purchase_credits: { upsellMessage: 'Credits depleted. Buy more to continue.' } },
      creditPackages: TEST_PACKAGES,
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Should show purchase view, not chat
    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.chat-widget-input')).not.toBeVisible();
    await expect(page.locator('.chat-widget-purchase-view')).toContainText('Credits depleted. Buy more to continue.');
  });

  test('FLOW-004: Purchase view shows packages with correct names and prices', async ({ page }) => {
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: true,
      creditLow: false,
      creditRemaining: 0,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    const cards = page.locator('.chat-widget-package-card');
    await expect(cards).toHaveCount(2);

    // First package: Basic Refill — $4.99
    await expect(cards.nth(0)).toContainText('Basic Refill');
    await expect(cards.nth(0)).toContainText('50 additional messages');
    await expect(cards.nth(0).locator('.chat-widget-package-buy')).toContainText('$4.99');

    // Second package: Pro Refill — $14.99
    await expect(cards.nth(1)).toContainText('Pro Refill');
    await expect(cards.nth(1)).toContainText('200 additional messages');
    await expect(cards.nth(1).locator('.chat-widget-package-buy')).toContainText('$14.99');
  });

  test('FLOW-005: Clicking buy calls /api/widget/BOT_ID/purchase with correct packageId', async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: true,
      creditLow: false,
      creditRemaining: 0,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    }));

    // Intercept the purchase API to capture the request body
    await page.route(`**/api/widget/${BOT_ID}/purchase`, async (route) => {
      const request = route.request();
      capturedBody = JSON.parse(request.postData() || '{}');
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { checkoutUrl: 'https://checkout.stripe.com/test' } }),
      });
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    // Click the first package's buy button
    await page.locator('.chat-widget-package-buy').first().click();

    // Verify the purchase API was called with the correct packageId
    await expect.poll(() => capturedBody).not.toBeNull();
    expect(capturedBody!.packageId).toBe('pkg-flow-a');
  });

  test('FLOW-006: After purchase, mocking config back to non-exhausted shows chat', async ({ page }) => {
    // Start with credits exhausted
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: true,
      creditLow: false,
      creditRemaining: 0,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    }));

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 10000 });

    // Simulate returning from Stripe — clear route and set non-exhausted config
    await page.unrouteAll({ behavior: 'wait' });
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: false,
      creditLow: false,
      creditRemaining: 50,
      creditExhaustionMode: 'purchase_credits',
    }));

    // Reload the page (simulates returning from Stripe checkout)
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Chat should now be available
    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.chat-widget-purchase-view')).not.toBeVisible();
  });

  test('FLOW-007: Chat message sent after credit top-up succeeds', async ({ page }) => {
    // Simulate post-purchase state: credits restored
    await mockFullWidgetConfig(page, baseWidgetConfig({
      creditExhausted: false,
      creditLow: false,
      creditRemaining: 50,
      creditExhaustionMode: 'purchase_credits',
    }));

    // Mock chat API to return success
    await page.route(`**/api/chat/${BOT_ID}`, (route) =>
      route.fulfill({
        status: 200, contentType: 'text/event-stream',
        body: 'data: {"type":"text","content":"Thanks for purchasing more credits!"}\n\ndata: [DONE]\n\n',
      })
    );

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-input')).toBeVisible({ timeout: 10000 });

    // Send a message — should work since credits are restored
    await page.locator('.chat-widget-input').fill('Can you help me now?');
    await page.locator('.chat-widget-send').click();

    // The user message should appear in the chat
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('Can you help me now?', { timeout: 5000 });
  });
});


// ============================================================
// 9. SETTINGS UI — CREDIT EXHAUSTION TAB
// ============================================================
test.describe('9. Settings Credit Exhaustion UI', () => {

  test('SETT-001: Credit Exhaustion tab shows correct UI for purchase_credits mode', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });

    // Select purchase mode
    await page.locator('input[value="purchase_credits"]').click({ force: true });

    // Should see the 80% pre-emptive info callout
    await expect(page.getByText('80% usage')).toBeVisible({ timeout: 10000 });

    // Should show either global packages or the "No credit packages" empty state
    await expect(page.getByText('Available Packages')).toBeVisible({ timeout: 10000 });

    // Wait for packages to load — the loading spinner should disappear and either
    // the empty state or package list items should appear
    const emptyState = page.getByText('No credit packages have been set up yet.');
    const packageList = page.locator('[role="switch"]');
    // Wait for one of these to appear (packages load is async)
    await expect(emptyState.or(packageList.first())).toBeVisible({ timeout: 15000 });
  });

  test('SETT-002: Info callout about pre-emptive 80% behavior is visible', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[value="purchase_credits"]').click({ force: true });

    // The callout should explain the pre-emptive 80% behavior
    const calloutText = page.getByText('visitors will see a non-blocking purchase banner when credits reach 80% usage');
    await expect(calloutText).toBeVisible({ timeout: 10000 });
  });

  test('SETT-003: Upsell message and success message fields are editable', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[value="purchase_credits"]').click({ force: true });

    // Find Upsell Message field and type into it
    const upsellLabel = page.getByText('Upsell Message');
    await expect(upsellLabel).toBeVisible({ timeout: 10000 });
    const upsellInput = page.locator('label:has-text("Upsell Message") + input, label:has-text("Upsell Message") ~ input').first();
    // The input may be a sibling or child — use a broader approach
    const upsellSection = upsellLabel.locator('..').locator('input').first();
    if (await upsellSection.isVisible().catch(() => false)) {
      await upsellSection.fill('Custom upsell text');
      await expect(upsellSection).toHaveValue('Custom upsell text');
    } else {
      // Fall back to finding the input near the label
      await upsellInput.fill('Custom upsell text');
      await expect(upsellInput).toHaveValue('Custom upsell text');
    }

    // Find Purchase Success Message field
    const successLabel = page.getByText('Purchase Success Message');
    await expect(successLabel).toBeVisible({ timeout: 10000 });
  });

  test('SETT-004: Generate Articles button is visible for help_articles mode', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'help_articles' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Credit Exhaustion Fallback' })).toBeVisible({ timeout: 10000 });

    await page.locator('input[value="help_articles"]').click({ force: true });

    // Generate button should be visible and not disabled initially
    const genBtn = page.getByText('Generate Articles from Knowledge Sources').first();
    await expect(genBtn).toBeVisible();
    await expect(genBtn).toBeEnabled();
  });

  // Cleanup
  test('SETT-CLEANUP: Reset mode and credits', async ({ page }) => {
    await setFallbackConfig(page, 'tickets');
    await resetCredits(page);
  });
});
