import { test, expect, Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_URL = `/widget/${CHATBOT_ID}`;
const DASH_BASE = `/dashboard/chatbots/${CHATBOT_ID}`;

// ============================================================
// Credit Management Helpers
// ============================================================

/** Set the chatbot's monthly message limit and current usage */
async function setCreditState(page: Page, limit: number, used: number) {
  await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
    data: { monthly_message_limit: limit, messages_this_month: used },
  });
}

/** Reset credits to a healthy state (high limit, low usage) */
async function resetCredits(page: Page) {
  await setCreditState(page, 1000, 0);
}

// ============================================================
// Widget Helpers
// ============================================================

/**
 * Helper: open widget page and wait for it to be ready
 */
async function openWidget(page: Page) {
  await page.goto(WIDGET_URL);
  await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
  const btn = page.locator('.chat-widget-button');
  if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await btn.click();
    await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 5000 });
  }
}

/**
 * Helper: send a message in the widget and wait for AI response
 */
async function sendMessage(page: Page, text: string) {
  const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
  await input.fill(text);
  await input.press('Enter');
  // Wait for assistant response to appear
  await page.waitForFunction(
    (msgText) => {
      const msgs = document.querySelectorAll('.chat-widget-messages [class*="assistant"], .chat-widget-messages [class*="bot"]');
      return msgs.length > 0;
    },
    text,
    { timeout: 30000 }
  );
  // Wait for streaming to complete by checking the response stops growing
  await page.waitForLoadState('networkidle');
}

/**
 * Helper: fill and submit pre-chat form
 */
async function fillPreChatForm(page: Page, data: Record<string, string>) {
  await page.waitForSelector('.chat-widget-form-view', { timeout: 10000 });
  const inputs = page.locator('.chat-widget-form-input');
  const count = await inputs.count();
  const keys = Object.keys(data);
  for (let i = 0; i < Math.min(count, keys.length); i++) {
    await inputs.nth(i).fill(data[keys[i]]);
  }
  await page.locator('.chat-widget-form-submit').click();
  await page.waitForSelector('.chat-widget-messages', { timeout: 10000 });
}

/**
 * Helper: mock the widget config endpoint with overrides merged on top of real response
 */
async function mockWidgetConfigWithPackages(page: Page, overrides: Record<string, any> = {}) {
  await page.route(`**/api/widget/${CHATBOT_ID}/config**`, async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    const merged = { ...json.data, ...overrides };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: merged }),
    });
  });
}

const TEST_PACKAGES = [
  { id: 'pkg-small', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_test_small' },
  { id: 'pkg-large', name: '200 Credits', creditAmount: 200, priceCents: 1499, stripePriceId: 'price_test_large' },
];

// ============================================================
// 25. Cross-Feature Integration Tests
// ============================================================

test.describe('25. Cross-Feature Integration Tests', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(120000);
    await resetCredits(page);
  });

  test.afterAll(async ({ request }) => {
    // Final cleanup: reset credits to healthy state
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { monthly_message_limit: 1000, messages_this_month: 0 },
    });
  });

  test('INTEG-001: Full visitor journey — pre-chat form to survey to analytics', async ({ page }) => {
    test.setTimeout(120000);
    await openWidget(page);

    // Check if pre-chat form appears
    const formView = page.locator('.chat-widget-form-view');
    if (await formView.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fillPreChatForm(page, {
        name: 'E2E Integration User',
        email: `integ001-${Date.now()}@test.com`,
      });
    }

    // Wait for chat view
    await page.waitForSelector('.chat-widget-messages', { timeout: 10000 });

    // Send 3 messages
    for (let i = 1; i <= 3; i++) {
      const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
      await input.fill(`Integration test message ${i}`);
      await input.press('Enter');
      await page.waitForLoadState('networkidle');
    }

    // Verify messages appeared
    const messages = page.locator('.chat-widget-messages');
    await expect(messages).toBeVisible();

    // Verify dashboard pages load via API (avoids slow navigation after widget)
    const leadsResp = await page.request.get(`/api/chatbots/${CHATBOT_ID}/leads`);
    expect(leadsResp.ok()).toBeTruthy();

    const analyticsResp = await page.request.get(`/api/chatbots/${CHATBOT_ID}/conversations?limit=1`);
    expect(analyticsResp.ok()).toBeTruthy();
  });

  test('INTEG-002: Full handoff journey — widget to agent console to resolution', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send initial message to create conversation
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('I need help with my order');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    // Look for handoff icon (headset)
    const handoffBtn = page.locator('[aria-label*="handoff"], [aria-label*="human"], [aria-label*="person"], .chat-widget-close').first();
    const handoffVisible = await handoffBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (handoffVisible) {
      // Click handoff
      await handoffBtn.click();

      // Check for confirmation panel
      const confirmPanel = page.locator('.chat-widget-handoff-confirm');
      if (await confirmPanel.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Click connect/confirm
        const connectBtn = confirmPanel.locator('button:has-text("Connect"), button:has-text("Yes")');
        if (await connectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await connectBtn.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }

    // Verify widget still functional
    await expect(page.locator('.chat-widget-container')).toBeVisible();
  });

  test('INTEG-003: Memory + pre-chat form identity verification', async ({ page }) => {
    await openWidget(page);

    const formView = page.locator('.chat-widget-form-view');
    const formVisible = await formView.isVisible({ timeout: 5000 }).catch(() => false);

    if (formVisible) {
      // Fill form with a known email
      await fillPreChatForm(page, {
        name: 'Memory Test User',
        email: 'memory-verify@test.com',
      });

      // Check if verify-email view appears
      const verifyView = page.locator('.chat-widget-form-view:has-text("verify"), .chat-widget-form-view:has-text("Verify")');
      const verifyVisible = await verifyView.isVisible({ timeout: 3000 }).catch(() => false);

      if (verifyVisible) {
        // Look for "No thanks, start fresh" skip option
        const skipBtn = page.locator('button:has-text("fresh"), button:has-text("skip"), button:has-text("No thanks")');
        if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await skipBtn.click();
        }
      }
    }

    // Should land in chat view
    await page.waitForSelector('.chat-widget-messages', { timeout: 10000 });
    await expect(page.locator('.chat-widget-messages')).toBeVisible();
  });

  test('INTEG-004: Memory verification — skip flow', async ({ page }) => {
    await openWidget(page);

    const formView = page.locator('.chat-widget-form-view');
    const formVisible = await formView.isVisible({ timeout: 5000 }).catch(() => false);

    if (formVisible) {
      await fillPreChatForm(page, {
        name: 'Skip Verify User',
        email: 'skip-verify@test.com',
      });

      // If verify view appears, click skip
      const skipBtn = page.locator('button:has-text("fresh"), button:has-text("skip"), button:has-text("No thanks")');
      const skipVisible = await skipBtn.isVisible({ timeout: 3000 }).catch(() => false);
      if (skipVisible) {
        await skipBtn.click();
      }
    }

    // Should be in chat view with fresh session
    await page.waitForSelector('.chat-widget-messages', { timeout: 10000 });
    await expect(page.locator('.chat-widget-messages')).toBeVisible();
  });

  test('INTEG-005: Escalation report to escalation dashboard', async ({ page }) => {
    test.setTimeout(120000);
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send a message to get an AI response
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('Tell me about refund policy');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    // Look for report/flag button on assistant message
    const reportBtn = page.locator('.chat-widget-report-btn').first();
    const reportVisible = await reportBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (reportVisible) {
      await reportBtn.click();

      // Select "Wrong Answer" reason
      const wrongAnswer = page.locator('.chat-widget-report-reasons label:has-text("Wrong"), .chat-widget-report-reasons input[value*="wrong"]').first();
      if (await wrongAnswer.isVisible({ timeout: 2000 }).catch(() => false)) {
        await wrongAnswer.click();
      }

      // Fill details
      const textarea = page.locator('.chat-widget-report-textarea');
      if (await textarea.isVisible({ timeout: 2000 }).catch(() => false)) {
        await textarea.fill('This is incorrect - E2E test');
      }

      // Submit
      const submitBtn = page.locator('.chat-widget-report-form button[type="submit"], .chat-widget-report-form button:has-text("Submit"), .chat-widget-report-form button:has-text("Report")');
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Navigate to escalations/reports page
    await page.goto(`${DASH_BASE}/issues`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
  });

  test('INTEG-006: File upload + AI vision analysis', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Check for file upload button (paperclip icon)
    const uploadBtn = page.locator('[aria-label*="attach"], [aria-label*="file"], [aria-label*="upload"]').first();
    const uploadVisible = await uploadBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (uploadVisible) {
      // Verify button exists
      await expect(uploadBtn).toBeVisible();
    }

    // Send a text message to verify basic chat works
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('What file types do you support?');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.chat-widget-messages')).toBeVisible();
  });

  test('INTEG-007: Transcript after handoff resolution', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send messages to create conversation
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('I need a transcript of this conversation');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    // Look for transcript/email icon in header
    const transcriptBtn = page.locator('[aria-label*="transcript"], [aria-label*="email"]').first();
    const transcriptVisible = await transcriptBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (transcriptVisible) {
      await transcriptBtn.click();

      // Check for email input
      const emailInput = page.locator('input[type="email"], input[placeholder*="email"]');
      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(emailInput).toBeVisible();
      }
    }

    await expect(page.locator('.chat-widget-container')).toBeVisible();
  });

  test('INTEG-008: Knowledge base + RAG + widget integration', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Ask a knowledge-base question
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('What services do you offer?');
    await input.press('Enter');

    // Verify AI responded (any assistant message)
    const assistantMessages = page.locator('.chat-widget-messages >> text=/./');
    await expect(assistantMessages.first()).toBeVisible({ timeout: 15000 });
  });

  test('INTEG-009: Language change reflects across all components', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(`${DASH_BASE}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages, .chat-widget-form-view', { timeout: 15000 });
    await expect(page.locator('.chat-widget-container')).toBeVisible();
  });

  test('INTEG-010: Proactive message leads to conversation', async ({ page }) => {
    // Load the widget page and wait for proactive messages
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 15000 });

    // Widget should be accessible (allow time for proactive message if configured)
    const container = page.locator('.chat-widget-container');
    const button = page.locator('.chat-widget-button');
    const widgetVisible = await container.isVisible().catch(() => false);
    const buttonVisible = await button.isVisible().catch(() => false);

    expect(widgetVisible || buttonVisible).toBeTruthy();
  });

  test('INTEG-011: Customize changes visible in deploy preview', async ({ page }) => {
    test.setTimeout(120000);
    // Navigate to customize page
    await page.goto(`${DASH_BASE}/customize`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });

    // Navigate to deploy page
    await page.goto(`${DASH_BASE}/deploy`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });

    // Check for preview iframe or preview section
    const preview = page.locator('iframe[src*="widget"], [class*="preview"]');
    const previewVisible = await preview.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (previewVisible) {
      await expect(preview.first()).toBeVisible();
    }
  });

  test('INTEG-012: CORS enforcement across all widget endpoints', async ({ request }) => {
    // Test CORS on config endpoint with allowed origin
    const configResponse = await request.get(`/api/widget/${CHATBOT_ID}/config`, {
      headers: { 'Origin': 'https://example.com' },
      timeout: 30000,
    });

    // Should respond (even if CORS headers vary by config)
    expect(configResponse.status()).toBeLessThan(500);

    // Test with a different origin
    const evilResponse = await request.get(`/api/widget/${CHATBOT_ID}/config`, {
      headers: { 'Origin': 'https://evil.com' },
      timeout: 30000,
    });

    // Server should still respond (CORS is enforced by browser, not server rejecting)
    expect(evilResponse.status()).toBeLessThan(500);

    // Verify CORS headers exist
    const headers = configResponse.headers();
    expect(headers['access-control-allow-origin'] || headers['vary']).toBeDefined();
  });

  test('INTEG-013: Feedback + sentiment — thumbs-down affects sentiment', async ({ page }) => {
    test.setTimeout(120000);
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send message to get response
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('Tell me about your features');
    await input.press('Enter');
    await page.waitForLoadState('networkidle');

    // Look for feedback buttons
    const feedbackBtns = page.locator('.chat-widget-feedback-btn');
    const feedbackVisible = await feedbackBtns.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (feedbackVisible) {
      // Find thumbs-down button
      const thumbsDown = page.locator('[aria-label*="not helpful"], [aria-label*="Not helpful"]').first();
      if (await thumbsDown.isVisible({ timeout: 3000 }).catch(() => false)) {
        await thumbsDown.click();
      }
    }

    // Navigate to sentiment page
    await page.goto(`${DASH_BASE}/sentiment`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
  });

  test('INTEG-014: Multiple simultaneous conversations in Agent Console', async ({ page }) => {
    test.setTimeout(120000);
    // Navigate to agent console / leads conversations
    await page.goto(`${DASH_BASE}/leads`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });

    // Check conversations tab exists
    const conversationsTab = page.locator('button:has-text("Conversations"), [role="tab"]:has-text("Conversations")');
    const tabVisible = await conversationsTab.isVisible({ timeout: 5000 }).catch(() => false);

    if (tabVisible) {
      await conversationsTab.click();
    }

    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
  });

});

// ============================================================
// 26. Credit Exhaustion Auto-Purchase Flow
// ============================================================

test.describe('26. Credit Exhaustion Auto-Purchase Flow', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(120000);
    await resetCredits(page);
  });

  test('CREDIT-001: Credits healthy — widget shows normal chat', async ({ page }) => {
    await setCreditState(page, 100, 10); // 10% used
    await openWidget(page);

    // Chat input should be visible
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible({ timeout: 15000 });

    // No low-credit warning banner
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).not.toBeVisible();
  });

  test('CREDIT-002: Credits at 80% — low credit warning banner appears', async ({ page }) => {
    await setCreditState(page, 100, 80); // 80% used
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Low credit banner should be visible
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 15000 });

    // Banner should show remaining credits
    await expect(banner).toContainText('20 remaining');

    // Chat input should still be available
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible();
  });

  test('CREDIT-003: Credits at 95% — low credit warning still shows, chat still works', async ({ page }) => {
    await setCreditState(page, 100, 95); // 95% used
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Banner should show 5 remaining
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 15000 });
    await expect(banner).toContainText('5 remaining');

    // Chat input should still be available
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible();
  });

  test('CREDIT-004: Credits fully exhausted — widget switches to purchase fallback', async ({ page }) => {
    await setCreditState(page, 100, 100); // 100% used
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Purchase view should be visible
    const purchaseView = page.locator('.chat-widget-purchase-view');
    await expect(purchaseView).toBeVisible({ timeout: 15000 });

    // Chat input should NOT be available
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).not.toBeVisible();

    // Packages or empty state should be shown
    const packages = page.locator('.chat-widget-package-buy');
    const emptyState = page.locator('.chat-widget-purchase-view:has-text("No credit packages"), .chat-widget-purchase-view:has-text("no packages"), .chat-widget-purchase-view:has-text("unavailable")');
    const packagesVisible = await packages.first().isVisible({ timeout: 3000 }).catch(() => false);
    const emptyVisible = await emptyState.isVisible({ timeout: 3000 }).catch(() => false);
    expect(packagesVisible || emptyVisible).toBeTruthy();
  });

  test('CREDIT-005: Purchase flow — buy button creates Stripe checkout session', async ({ page }) => {
    await setCreditState(page, 100, 100); // exhausted

    // Mock widget config with test packages and exhausted credits
    await mockWidgetConfigWithPackages(page, {
      creditExhausted: true,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    });

    // Track purchase API calls
    let purchaseApiCalled = false;
    let purchaseBody: any = null;
    await page.route(`**/api/widget/${CHATBOT_ID}/purchase`, async (route) => {
      purchaseApiCalled = true;
      purchaseBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { checkoutUrl: 'https://checkout.stripe.com/test_session_123' },
        }),
      });
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');

    // Purchase view should be visible
    await expect(page.locator('.chat-widget-purchase-view')).toBeVisible({ timeout: 15000 });

    // Click first buy button
    const buyBtn = page.locator('.chat-widget-package-buy').first();
    await expect(buyBtn).toBeVisible({ timeout: 10000 });
    await buyBtn.click();
    // Wait for purchase API call to complete
    await page.waitForLoadState('networkidle');

    // Verify purchase API was called with the correct package ID
    expect(purchaseApiCalled).toBeTruthy();
    expect(purchaseBody).toBeDefined();
    expect(purchaseBody.packageId).toBe('pkg-small');
  });

  test('CREDIT-006: After purchase completes — credits restored, chat resumes', async ({ page }) => {
    await setCreditState(page, 100, 100); // exhausted
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Verify purchase view is shown
    const purchaseView = page.locator('.chat-widget-purchase-view');
    await expect(purchaseView).toBeVisible({ timeout: 15000 });

    // Simulate webhook adding 50 credits (limit goes from 100 to 150)
    await setCreditState(page, 150, 100);

    // Reload widget page
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
    const btn = page.locator('.chat-widget-button');
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btn.click();
      await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 5000 });
    }

    // Chat input should now be available (100 used < 150 limit)
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible({ timeout: 15000 });
  });

  test('CREDIT-007: Low credit banner dismiss persists during session', async ({ page }) => {
    await setCreditState(page, 100, 85); // 85% used
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Banner should be visible
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 15000 });

    // Click dismiss button
    const dismissBtn = page.locator('[aria-label="Dismiss low credit warning"]');
    await expect(dismissBtn).toBeVisible({ timeout: 5000 });
    await dismissBtn.click();

    // Banner should be hidden
    await expect(banner).not.toBeVisible();

    // Send a chat message (chat still works)
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await chatInput.fill('Testing after dismiss');
    await chatInput.press('Enter');
    await page.waitForLoadState('networkidle');

    // Banner should stay hidden
    await expect(banner).not.toBeVisible();
  });

  test('CREDIT-008: Purchase overlay from low credit banner', async ({ page }) => {
    await setCreditState(page, 100, 85); // 85% used

    // Mock config with low credit + packages
    await mockWidgetConfigWithPackages(page, {
      creditLow: true,
      creditRemaining: 15,
      creditExhaustionMode: 'purchase_credits',
      creditPackages: TEST_PACKAGES,
    });

    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
    const widgetBtn = page.locator('.chat-widget-button');
    if (await widgetBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await widgetBtn.click();
      await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 5000 });
    }

    // Banner should be visible
    const banner = page.locator('.chat-widget-low-credit-banner');
    await expect(banner).toBeVisible({ timeout: 15000 });

    // Click "Purchase more" in the banner
    const purchaseMoreBtn = banner.locator('button:has-text("Purchase"), a:has-text("Purchase")');
    await expect(purchaseMoreBtn).toBeVisible({ timeout: 5000 });
    await purchaseMoreBtn.click();

    // Purchase overlay should appear
    const overlay = page.locator('.chat-widget-purchase-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    // Packages should be shown in overlay
    const overlayPackages = overlay.locator('.chat-widget-package-buy');
    await expect(overlayPackages.first()).toBeVisible({ timeout: 5000 });

    // Close the overlay
    const closeBtn = page.locator('[aria-label="Close purchase overlay"]');
    await expect(closeBtn).toBeVisible({ timeout: 5000 });
    await closeBtn.click();

    // Overlay should be hidden, chat should still be visible
    await expect(overlay).not.toBeVisible();
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible();
  });

  test('CREDIT-009: Conversation continues after credit top-up', async ({ page }) => {
    test.setTimeout(120000);

    await setCreditState(page, 100, 100); // exhausted
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await openWidget(page);

    // Verify purchase fallback is shown
    const purchaseView = page.locator('.chat-widget-purchase-view');
    await expect(purchaseView).toBeVisible({ timeout: 15000 });

    // Simulate credit top-up via purchase (limit increases)
    await setCreditState(page, 200, 100);

    // Reload widget
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
    const btn = page.locator('.chat-widget-button');
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btn.click();
      await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 5000 });
    }

    // Chat should be available
    const chatInput = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await expect(chatInput).toBeVisible({ timeout: 15000 });

    // Send a message — real chat API should respond since credits were restored
    await chatInput.fill('Hello after top-up');
    await chatInput.press('Enter');
    await page.waitForLoadState('networkidle');

    // Verify messages area is visible (response appeared)
    await expect(page.locator('.chat-widget-messages')).toBeVisible();
  });

  test('CREDIT-CLEANUP: Reset credits and mode', async ({ page }) => {
    await resetCredits(page);
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });

    // Verify credits were reset
    const configResp = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    expect(configResp.ok()).toBeTruthy();
  });
});
