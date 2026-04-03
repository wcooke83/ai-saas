import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_URL = `/widget/${CHATBOT_ID}`;

test.describe('Chat Message Flow', () => {
  // Ensure chatbot is published and credits are reset before all widget tests
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });

    // Reset message count so a near-limit chatbot doesn't break unrelated widget tests
    await ctx.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { messages_this_month: 0, monthly_message_limit: 1000 },
    }).catch(() => {});

    // Check publish state via API and publish if needed
    const checkRes = await ctx.request.get(`/api/chatbots/${CHATBOT_ID}`);
    if (checkRes.ok()) {
      const body = await checkRes.json();
      const isPublished = body?.data?.chatbot?.is_published;
      if (!isPublished) {
        await ctx.request.post(`/api/chatbots/${CHATBOT_ID}/publish`).catch(() => {});
      }
    }

    await ctx.close();
  });

  test('send message and receive response', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container');

    // Type and send a message
    const input = page.locator('.chat-widget-input');
    await input.fill('Hello, what can you do?');
    await page.locator('.chat-widget-send').click();

    // User message should appear
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('Hello, what can you do?');

    // Wait for assistant response to stream in and contain text
    await expect(page.locator('.chat-widget-typing')).toBeHidden({ timeout: 30_000 });
    const lastAssistant = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant').last();
    await expect(lastAssistant).toBeVisible({ timeout: 30_000 });
    // Wait for actual text to appear (guard against race with React render)
    await expect(lastAssistant).not.toHaveText('', { timeout: 30_000 });
    const responseText = await lastAssistant.textContent();
    expect(responseText!.trim().length).toBeGreaterThan(0);
  });

  test('conversation persists across messages', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container');

    const input = page.locator('.chat-widget-input');

    // First message
    await input.fill('My name is TestUser');
    await page.locator('.chat-widget-send').click();
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('My name is TestUser');
    // Wait for first response
    await expect(page.locator('.chat-widget-typing')).toBeHidden({ timeout: 30_000 });
    const firstResponse = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant').last();
    await expect(firstResponse).toBeVisible({ timeout: 30_000 });

    // Second message in same session
    await input.fill('What did I just tell you?');
    await page.locator('.chat-widget-send').click();
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('What did I just tell you?');
    // Wait for second response
    await expect(page.locator('.chat-widget-typing')).toBeHidden({ timeout: 30_000 });
    const secondResponse = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant').last();
    await expect(secondResponse).toBeVisible({ timeout: 30_000 });

    // Both user messages and both assistant responses should be visible in the conversation
    const userMessages = page.locator('.chat-widget-message-user');
    await expect(userMessages).toHaveCount(2, { timeout: 5_000 });
    const assistantMessages = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant');
    // At least 2 assistant messages (may include welcome message)
    expect(await assistantMessages.count()).toBeGreaterThanOrEqual(2);
  });

  test('send button is disabled for empty input', async ({ page }) => {
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container');

    // With empty input, send button should be disabled
    const sendButton = page.locator('.chat-widget-send');
    await expect(sendButton).toBeDisabled();

    // Type something — send button becomes enabled
    await page.locator('.chat-widget-input').fill('test');
    await expect(sendButton).toBeEnabled();

    // Clear input — send button disabled again
    await page.locator('.chat-widget-input').fill('');
    await expect(sendButton).toBeDisabled();
  });

  test('non-existent chatbot shows error', async ({ page }) => {
    await page.goto('/widget/00000000-0000-0000-0000-000000000000');

    // Should show an unavailable/error message (config fetch returns 404)
    await expect(
      page.getByText(/not yet published|unable to load|isn't available yet|not available/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test('can send message via Enter key', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container');

    const input = page.locator('.chat-widget-input');
    await input.fill('Hello without session');
    await input.press('Enter');

    // User message appears
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('Hello without session');

    // Wait for assistant response
    await expect(page.locator('.chat-widget-typing')).toBeHidden({ timeout: 30_000 });
    const lastAssistant = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant').last();
    await expect(lastAssistant).toBeVisible({ timeout: 30_000 });
    await expect(lastAssistant).not.toHaveText('', { timeout: 30_000 });
    const responseText = await lastAssistant.textContent();
    expect(responseText!.trim().length).toBeGreaterThan(0);
  });

  test('streaming response renders in widget', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(WIDGET_URL);
    await page.waitForSelector('.chat-widget-container');

    const input = page.locator('.chat-widget-input');
    await input.fill('Say hello');
    await page.locator('.chat-widget-send').click();

    // User message appears
    await expect(page.locator('.chat-widget-message-user').last()).toContainText('Say hello');

    // Wait for assistant response to stream in and complete
    await expect(page.locator('.chat-widget-typing')).toBeHidden({ timeout: 30_000 });
    const lastAssistant = page.locator('.chat-widget-message-assistant .chat-widget-bubble-assistant').last();
    await expect(lastAssistant).toBeVisible({ timeout: 30_000 });
    await expect(lastAssistant).not.toHaveText('', { timeout: 30_000 });

    // Verify response has content (streamed result)
    const responseText = await lastAssistant.textContent();
    expect(responseText!.trim().length).toBeGreaterThan(0);
  });
});
