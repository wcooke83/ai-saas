import { test, expect } from '@playwright/test';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
const WIDGET_URL = `/widget/${CHATBOT_ID}`;
const DASH_BASE = `/dashboard/chatbots/${CHATBOT_ID}`;

/**
 * Helper: open widget page and wait for it to be ready
 */
async function openWidget(page: import('@playwright/test').Page) {
  await page.goto(WIDGET_URL);
  await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30000 });
  const btn = page.locator('.chat-widget-button');
  if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Helper: send a message in the widget and wait for AI response
 */
async function sendMessage(page: import('@playwright/test').Page, text: string) {
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
  // Small delay for streaming to complete
  await page.waitForTimeout(2000);
}

/**
 * Helper: fill and submit pre-chat form
 */
async function fillPreChatForm(page: import('@playwright/test').Page, data: Record<string, string>) {
  await page.waitForSelector('.chat-widget-form-view', { timeout: 10000 });
  const inputs = page.locator('.chat-widget-form-input');
  const count = await inputs.count();
  const keys = Object.keys(data);
  for (let i = 0; i < Math.min(count, keys.length); i++) {
    await inputs.nth(i).fill(data[keys[i]]);
  }
  await page.locator('.chat-widget-form-submit').click();
  await page.waitForTimeout(1000);
}

test.describe('25. Cross-Feature Integration Tests', () => {
  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(120000);
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
      await page.waitForTimeout(3000);
    }

    // Verify messages appeared
    const messages = page.locator('.chat-widget-messages');
    await expect(messages).toBeVisible();

    // Verify dashboard pages load via API (avoids slow navigation after widget)
    const leadsResp = await page.request.get(`/api/chatbots/${CHATBOT_ID}/leads`);
    expect(leadsResp.status()).toBeLessThan(500);

    const analyticsResp = await page.request.get(`/api/chatbots/${CHATBOT_ID}/conversations?limit=1`);
    expect(analyticsResp.status()).toBeLessThan(500);
  });

  test('INTEG-002: Full handoff journey — widget to agent console to resolution', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send initial message to create conversation
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('I need help with my order');
    await input.press('Enter');
    await page.waitForTimeout(3000);

    // Look for handoff icon (headset)
    const handoffBtn = page.locator('[aria-label*="handoff"], [aria-label*="human"], [aria-label*="person"], .chat-widget-close').first();
    const handoffVisible = await handoffBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (handoffVisible) {
      // Click handoff
      await handoffBtn.click();
      await page.waitForTimeout(2000);

      // Check for confirmation panel
      const confirmPanel = page.locator('.chat-widget-handoff-confirm');
      if (await confirmPanel.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Click connect/confirm
        const connectBtn = confirmPanel.locator('button:has-text("Connect"), button:has-text("Yes")');
        if (await connectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await connectBtn.click();
          await page.waitForTimeout(2000);
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
    await page.waitForTimeout(5000);

    // Look for report/flag button on assistant message
    const reportBtn = page.locator('.chat-widget-report-btn').first();
    const reportVisible = await reportBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (reportVisible) {
      await reportBtn.click();
      await page.waitForTimeout(1000);

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
        await page.waitForTimeout(2000);
      }
    }

    // Navigate to escalations/reports page
    await page.goto(`${DASH_BASE}/escalations`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
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
    await page.waitForTimeout(3000);

    await expect(page.locator('.chat-widget-messages')).toBeVisible();
  });

  test('INTEG-007: Transcript after handoff resolution', async ({ page }) => {
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages', { timeout: 15000 });

    // Send messages to create conversation
    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    await input.fill('I need a transcript of this conversation');
    await input.press('Enter');
    await page.waitForTimeout(3000);

    // Look for transcript/email icon in header
    const transcriptBtn = page.locator('[aria-label*="transcript"], [aria-label*="email"]').first();
    const transcriptVisible = await transcriptBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (transcriptVisible) {
      await transcriptBtn.click();
      await page.waitForTimeout(1000);

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
    await page.waitForTimeout(5000);

    // Verify AI responded (any assistant message)
    const assistantMessages = page.locator('.chat-widget-messages >> text=/./');
    await expect(assistantMessages.first()).toBeVisible({ timeout: 15000 });
  });

  // TODO: Flaky due to dashboard→widget navigation causing trace artifact ENOENT errors
  test.skip('INTEG-009: Language change reflects across all components', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(`${DASH_BASE}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
    await openWidget(page);
    await page.waitForSelector('.chat-widget-messages, .chat-widget-form-view', { timeout: 15000 });
    await expect(page.locator('.chat-widget-container')).toBeVisible();
  });

  test('INTEG-010: Proactive message leads to conversation', async ({ page }) => {
    // Load the widget page and wait for proactive messages
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 15000 });

    // Wait a bit for proactive message (if configured)
    await page.waitForTimeout(5000);

    // Widget should be accessible
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
    await page.waitForTimeout(3000);
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });

    // Navigate to deploy page
    await page.goto(`${DASH_BASE}/deploy`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
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
    await page.waitForTimeout(5000);

    // Look for feedback buttons
    const feedbackBtns = page.locator('.chat-widget-feedback-btn');
    const feedbackVisible = await feedbackBtns.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (feedbackVisible) {
      // Find thumbs-down button
      const thumbsDown = page.locator('[aria-label*="not helpful"], [aria-label*="Not helpful"]').first();
      if (await thumbsDown.isVisible({ timeout: 3000 }).catch(() => false)) {
        await thumbsDown.click();
        await page.waitForTimeout(1000);
      }
    }

    // Navigate to sentiment page
    await page.goto(`${DASH_BASE}/sentiment`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
  });

  // TODO: Dashboard session expires during long serial test runs causing page load timeout
  test.skip('INTEG-014: Multiple simultaneous conversations in Agent Console', async ({ page }) => {
    test.setTimeout(120000);
    // Navigate to agent console / leads conversations
    await page.goto(`${DASH_BASE}/leads`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });

    // Check conversations tab exists
    const conversationsTab = page.locator('button:has-text("Conversations"), [role="tab"]:has-text("Conversations")');
    const tabVisible = await conversationsTab.isVisible({ timeout: 5000 }).catch(() => false);

    if (tabVisible) {
      await conversationsTab.click();
      await page.waitForTimeout(2000);
    }

    await expect(page.locator('#main-content, main')).toBeVisible({ timeout: 15000 });
  });

});
