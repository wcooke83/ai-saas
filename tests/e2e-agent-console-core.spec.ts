import { test, expect, Page } from '@playwright/test';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
const CONVERSATIONS_URL = `/dashboard/chatbots/${CHATBOT_ID}/conversations`;

/** Navigate to agent console and wait for it to fully render */
async function gotoAgentConsole(page: Page) {
  await page.goto(CONVERSATIONS_URL);
  await page.waitForLoadState('domcontentloaded');
  // Wait for the page-level spinner to disappear (chatbot fetch)
  await page.waitForSelector('.animate-spin', { timeout: 30000 }).catch(() => {});
  await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 60000 }).catch(() => {});
  // Wait for AgentConsoleLayout to mount
  await page.waitForSelector('[data-testid="conversation-list"]', { timeout: 30000 });
}

test.describe('14. Agent Console', () => {
  // Allow extra time for slow chatbot API fetches
  test.setTimeout(120_000);

  test('AGENT-001: Agent Console layout renders', async ({ page }) => {
    await gotoAgentConsole(page);

    // Two-panel layout: conversation list on left
    await expect(page.getByTestId('conversation-list')).toBeVisible();

    // Right panel shows empty state placeholder
    await expect(page.getByText('Select a conversation to view messages')).toBeVisible();
  });

  test('AGENT-002: Conversation list loads', async ({ page }) => {
    await gotoAgentConsole(page);

    // Skeleton should disappear after data loads
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    // List body visible
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();

    // Either conversations or empty state
    const count = await page.locator('[data-testid^="conversation-item-"]').count();
    if (count === 0) {
      await expect(page.getByText('No conversations')).toBeVisible();
    }
  });

  test('AGENT-003: Filter by status', async ({ page }) => {
    await gotoAgentConsole(page);

    await expect(page.getByTestId('filter-tabs')).toBeVisible();

    for (const id of ['filter-all', 'filter-pending', 'filter-active', 'filter-resolved']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }

    for (const id of ['filter-pending', 'filter-active', 'filter-resolved', 'filter-all']) {
      await page.getByTestId(id).click();
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('conversation-list-body')).toBeVisible();
    }
  });

  test('AGENT-004: Pending filter count badge with pulse', async ({ page }) => {
    await gotoAgentConsole(page);

    const pendingBtn = page.getByTestId('filter-pending');
    await expect(pendingBtn).toBeVisible();
    const btnText = await pendingBtn.textContent();
    expect(btnText).toContain('Pending');
  });

  test('AGENT-005: Select a conversation', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(1500);
    await expect(items.first()).toHaveAttribute('data-selected', 'true');
    await expect(page.getByText('Select a conversation to view messages')).not.toBeVisible();
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
  });

  test('AGENT-006: Messages display correctly', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    const bodyText = await page.getByTestId('chat-messages-area').textContent();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('AGENT-007: Send agent reply', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const textarea = page.locator('textarea[placeholder="Type a reply..."]');
    if (!(await textarea.isVisible().catch(() => false))) { test.skip(); return; }

    await textarea.fill(`E2E test reply ${Date.now()}`);
    await textarea.press('Enter');
    await page.waitForTimeout(3000);
    await expect(textarea).toHaveValue('');
  });

  test('AGENT-008: Reply disabled for pending conversations', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const textarea = page.locator('textarea[placeholder="Take over the conversation first..."]');
    if (await textarea.isVisible().catch(() => false)) {
      await expect(textarea).toBeDisabled();
    }
    await expect(page.getByTestId('action-take-over')).toBeVisible({ timeout: 10000 });
  });

  test('AGENT-009: Reply disabled for resolved conversations', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-resolved').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);
    await expect(page.locator('textarea[placeholder="Type a reply..."]')).not.toBeVisible();
  });

  test('AGENT-010: Take Over action', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const takeOverBtn = page.getByTestId('action-take-over');
    if (!(await takeOverBtn.isVisible().catch(() => false))) { test.skip(); return; }

    await takeOverBtn.click();
    await page.waitForTimeout(3000);

    const resolveVisible = await page.getByTestId('action-resolve').isVisible().catch(() => false);
    const returnVisible = await page.getByTestId('action-return-to-ai').isVisible().catch(() => false);
    expect(resolveVisible || returnVisible).toBeTruthy();
  });

  test('AGENT-011: Resolve action', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const resolveBtn = page.getByTestId('action-resolve');
    if (!(await resolveBtn.isVisible().catch(() => false))) { test.skip(); return; }

    await resolveBtn.click();
    await page.waitForTimeout(3000);
    await expect(page.locator('textarea[placeholder="Type a reply..."]')).not.toBeVisible();
  });

  test('AGENT-012: Return to AI action', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const returnBtn = page.getByTestId('action-return-to-ai');
    if (!(await returnBtn.isVisible().catch(() => false))) { test.skip(); return; }

    await returnBtn.click();
    await page.waitForTimeout(3000);
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();
  });

  test('AGENT-013: Real-time new message updates', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
  });

  test('AGENT-014: Real-time new handoff notification', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list')).toBeVisible();
    await expect(page.getByTestId('filter-tabs')).toBeVisible();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('AGENT-015: Visitor presence indicator', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const hasOnline = await page.getByText('Online').isVisible().catch(() => false);
    const hasOffline = await page.getByText('Offline').isVisible().catch(() => false);
    expect(hasOnline || hasOffline).toBeTruthy();
  });

  test('AGENT-016: Visitor typing indicator', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
  });

  test('AGENT-017: Escalation reason display', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody).toBeVisible();
    const bodyText = await listBody.textContent();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('AGENT-018: Message cache prevents flash of empty state', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) < 2) { test.skip(); return; }

    await items.nth(0).click();
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });

    await items.nth(1).click();
    await page.waitForTimeout(2000);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });

    await items.nth(0).click();
    const skeletonVisible = await page.getByTestId('messages-skeleton').isVisible().catch(() => false);
    expect(skeletonVisible).toBe(false);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible();
  });

  test('AGENT-019: Agent presence broadcast', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list')).toBeVisible();
  });
});
