import { test, expect, type Page, type Route } from '@playwright/test';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const CHATBOT_ID = 'fb000000-0000-0000-0000-000000000001';
const CONV_A_ID = 'ca000000-0000-0000-0000-00000000000a';
const CONV_B_ID = 'cb000000-0000-0000-0000-00000000000b';
const CONV_ACTIVE_ID = 'cc000000-0000-0000-0000-00000000000c';

const PAGE_URL = `/dashboard/chatbots/${CHATBOT_ID}/conversations`;

function makeConversation(
  overrides: Partial<{
    conversation_id: string;
    handoff_status: string;
    visitor_name: string;
    message_count: number;
  }> = {}
) {
  return {
    handoff_id: `h-${overrides.conversation_id ?? CONV_A_ID}`,
    conversation_id: overrides.conversation_id ?? CONV_A_ID,
    handoff_status: overrides.handoff_status ?? 'pending',
    agent_name: overrides.handoff_status === 'active' ? 'Agent Smith' : null,
    agent_source: null,
    handoff_created_at: new Date().toISOString(),
    resolved_at: null,
    visitor_name: overrides.visitor_name ?? 'Alice',
    visitor_email: 'alice@test.local',
    message_count: overrides.message_count ?? 3,
    last_message_at: new Date().toISOString(),
    last_message: {
      content: 'Hello there',
      role: 'user',
      is_agent: false,
      created_at: new Date().toISOString(),
    },
    language: 'en',
    escalation_reason: 'need_human_help',
    escalation_details: null,
  };
}

function makeMessage(id: string, role: 'user' | 'assistant', content: string) {
  return {
    id,
    conversation_id: CONV_A_ID,
    role,
    content,
    metadata: role === 'assistant' ? { is_human_agent: false } : null,
    created_at: new Date().toISOString(),
  };
}

const CONVERSATIONS_PAYLOAD = {
  success: true,
  data: {
    conversations: [
      makeConversation({ conversation_id: CONV_A_ID, visitor_name: 'Alice', handoff_status: 'pending' }),
      makeConversation({ conversation_id: CONV_B_ID, visitor_name: 'Bob', handoff_status: 'pending' }),
      makeConversation({ conversation_id: CONV_ACTIVE_ID, visitor_name: 'Charlie', handoff_status: 'active' }),
    ],
    stats: { pending: 2, active: 1, resolved: 0 },
  },
};

const MESSAGES_A = {
  success: true,
  data: {
    messages: [
      makeMessage('m1', 'user', 'I need help with billing'),
      makeMessage('m2', 'assistant', 'Let me connect you with an agent.'),
    ],
  },
};

const MESSAGES_B = {
  success: true,
  data: {
    messages: [
      makeMessage('m3', 'user', 'My order is missing'),
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Set up route interception for all API endpoints the Agent Console uses.
 * `delayMs` controls how long the mocked response is delayed, letting us
 * observe intermediate loading states.
 */
async function setupMocks(
  page: Page,
  opts: {
    conversationsDelay?: number;
    messagesDelay?: number;
    actionDelay?: number;
    filterDelay?: number;
  } = {}
) {
  const {
    conversationsDelay = 0,
    messagesDelay = 0,
    actionDelay = 0,
    filterDelay = 0,
  } = opts;

  // Chatbot details (needed by the page wrapper)
  await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID, name: 'Test Bot' } } }),
    });
  });

  // Agent conversations list
  let conversationsFetchCount = 0;
  await page.route(`**/api/widget/${CHATBOT_ID}/agent-conversations*`, async (route: Route) => {
    conversationsFetchCount++;
    const url = new URL(route.request().url(), 'http://localhost');
    const statusParam = url.searchParams.get('status');

    // Apply filter delay only on subsequent fetches (filter changes)
    const delay = conversationsFetchCount > 1 ? (filterDelay || conversationsDelay) : conversationsDelay;
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));

    let data = { ...CONVERSATIONS_PAYLOAD };
    if (statusParam) {
      const filtered = CONVERSATIONS_PAYLOAD.data.conversations.filter(
        (c) => c.handoff_status === statusParam
      );
      data = {
        success: true,
        data: { conversations: filtered, stats: CONVERSATIONS_PAYLOAD.data.stats },
      };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });

  // Messages for a conversation
  await page.route(`**/api/chatbots/${CHATBOT_ID}/conversations*`, async (route: Route) => {
    const url = new URL(route.request().url(), 'http://localhost');
    const convId = url.searchParams.get('conversationId');

    if (messagesDelay > 0) await new Promise((r) => setTimeout(r, messagesDelay));

    const payload = convId === CONV_B_ID ? MESSAGES_B : MESSAGES_A;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });

  // Agent actions (take over, resolve, return to AI)
  await page.route(`**/api/widget/${CHATBOT_ID}/agent-actions`, async (route: Route) => {
    if (actionDelay > 0) await new Promise((r) => setTimeout(r, actionDelay));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Supabase auth/realtime -- stub to prevent errors
  await page.route('**/auth/v1/**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route('**/realtime/**', async (route: Route) => {
    await route.abort('connectionrefused');
  });
}

/**
 * Navigate to the conversations page and wait for the initial data to load.
 */
async function gotoConversationsPage(page: Page) {
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  // Wait for the conversation list to finish its initial load
  await page.waitForSelector('[data-testid="conversation-list-body"]', { timeout: 15000 });
  // Wait until skeleton is gone (initial load completed)
  await expect(page.locator('[data-testid="conversation-list-skeleton"]')).not.toBeVisible({ timeout: 10000 });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Agent Console -- Conversation Selection Feedback', () => {
  test('clicking a conversation shows message skeleton immediately', async ({ page }) => {
    await setupMocks(page, { messagesDelay: 2000 });
    await gotoConversationsPage(page);

    // Verify the conversation items are rendered
    await expect(page.getByTestId(`conversation-item-${CONV_A_ID}`)).toBeVisible();

    // Click the first conversation
    await page.getByTestId(`conversation-item-${CONV_A_ID}`).click();

    // IMMEDIATELY expect the messages skeleton to be visible (the 2s delay
    // ensures the real response hasn't arrived yet)
    await expect(page.getByTestId('messages-skeleton')).toBeVisible({ timeout: 1000 });
  });

  test('old messages are cleared when selecting a different conversation', async ({ page }) => {
    // First load is fast so we can select conversation A and get its messages
    await setupMocks(page, { messagesDelay: 100 });
    await gotoConversationsPage(page);

    // Select conversation A and wait for messages to load
    await page.getByTestId(`conversation-item-${CONV_A_ID}`).click();
    await expect(page.getByText('I need help with billing')).toBeVisible({ timeout: 5000 });

    // Now slow down the next fetch so we can observe the transition
    await page.route(`**/api/chatbots/${CHATBOT_ID}/conversations*`, async (route: Route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MESSAGES_B),
      });
    });

    // Select conversation B
    await page.getByTestId(`conversation-item-${CONV_B_ID}`).click();

    // Old messages from conversation A must NOT be visible
    await expect(page.getByText('I need help with billing')).not.toBeVisible({ timeout: 1000 });

    // Skeleton should be showing instead
    await expect(page.getByTestId('messages-skeleton')).toBeVisible({ timeout: 1000 });
  });

  test('message skeleton resolves to actual messages after fetch', async ({ page }) => {
    await setupMocks(page, { messagesDelay: 500 });
    await gotoConversationsPage(page);

    await page.getByTestId(`conversation-item-${CONV_A_ID}`).click();

    // Skeleton appears first
    await expect(page.getByTestId('messages-skeleton')).toBeVisible({ timeout: 1000 });

    // Then real messages appear after the delay
    await expect(page.getByText('I need help with billing')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible();
  });
});

test.describe('Agent Console -- Filter Tab Feedback', () => {
  test('clicking a filter tab shows loading indicator on the active tab', async ({ page }) => {
    await setupMocks(page, { filterDelay: 2000 });
    await gotoConversationsPage(page);

    // Click the Pending filter
    await page.getByTestId('filter-pending').click();

    // The active filter button should contain a spinning loader
    const pendingBtn = page.getByTestId('filter-pending');
    await expect(pendingBtn.locator('.animate-spin')).toBeVisible({ timeout: 1000 });
  });

  test('conversation list shows reduced opacity while filter is loading', async ({ page }) => {
    await setupMocks(page, { filterDelay: 2000 });
    await gotoConversationsPage(page);

    // Verify conversations are visible at full opacity first
    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody).toBeVisible();

    // Click the Active filter
    await page.getByTestId('filter-active').click();

    // The list container should have reduced opacity (opacity-50 class)
    const staleList = listBody.locator('.opacity-50');
    await expect(staleList).toBeVisible({ timeout: 1000 });
  });

  test('stale list becomes interactive again after filter response', async ({ page }) => {
    await setupMocks(page, { filterDelay: 500 });
    await gotoConversationsPage(page);

    await page.getByTestId('filter-pending').click();

    // Wait for filter to complete
    await expect(page.getByTestId('filter-pending').locator('.animate-spin')).not.toBeVisible({ timeout: 5000 });

    // List should no longer have reduced opacity
    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody.locator('.opacity-50')).not.toBeVisible();
  });

  test('filter button variant changes immediately on click', async ({ page }) => {
    await setupMocks(page, { filterDelay: 2000 });
    await gotoConversationsPage(page);

    // Initially "All" is the active filter -- check it has non-ghost styling
    const allBtn = page.getByTestId('filter-all');
    const pendingBtn = page.getByTestId('filter-pending');

    // Click Pending
    await pendingBtn.click();

    // The "Pending" button's variant should change immediately (the hook
    // calls setFilter synchronously). The component renders variant='default'
    // for the active filter, which applies inline backgroundColor style.
    // Meanwhile "All" should revert to ghost variant.
    // We verify by checking that Pending button now has an inline style
    // (the Button component applies CSS-variable-based bg to 'default' variant)
    await expect(pendingBtn).toHaveAttribute('style', /.+/, { timeout: 1000 });

    // "All" button should no longer have the default variant inline style
    // (ghost variant gets no backgroundColor style from the Button component)
    // This is a proxy check: the variant switched immediately before the API responded.
    await expect(allBtn).not.toHaveAttribute('style', /primary-button-bg/);
  });
});

test.describe('Agent Console -- Action Button Feedback', () => {
  test('Take Over button shows spinner and disables on click', async ({ page }) => {
    await setupMocks(page, { actionDelay: 2000 });
    await gotoConversationsPage(page);

    // Select the pending conversation to see the Take Over button
    await page.getByTestId(`conversation-item-${CONV_A_ID}`).click();
    await expect(page.getByTestId('action-take-over')).toBeVisible({ timeout: 5000 });

    // Click Take Over
    await page.getByTestId('action-take-over').click();

    // IMMEDIATELY the button should be disabled and show a spinner
    const takeOverBtn = page.getByTestId('action-take-over');
    await expect(takeOverBtn).toBeDisabled({ timeout: 1000 });
    await expect(takeOverBtn.locator('.animate-spin')).toBeVisible({ timeout: 1000 });
  });

  test('Resolve button shows spinner and disables all action buttons', async ({ page }) => {
    await setupMocks(page, { actionDelay: 2000 });
    await gotoConversationsPage(page);

    // Select the active conversation to see Resolve and Return to AI buttons
    await page.getByTestId(`conversation-item-${CONV_ACTIVE_ID}`).click();
    await expect(page.getByTestId('action-resolve')).toBeVisible({ timeout: 5000 });

    // Click Resolve
    await page.getByTestId('action-resolve').click();

    // Resolve should show spinner
    const resolveBtn = page.getByTestId('action-resolve');
    await expect(resolveBtn).toBeDisabled({ timeout: 1000 });
    await expect(resolveBtn.locator('.animate-spin')).toBeVisible({ timeout: 1000 });

    // Return to AI should also be disabled (but no spinner since it's not the clicked one)
    const returnBtn = page.getByTestId('action-return-to-ai');
    await expect(returnBtn).toBeDisabled({ timeout: 1000 });
    await expect(returnBtn.locator('.animate-spin')).not.toBeVisible();
  });

  test('Return to AI button shows spinner and disables sibling buttons', async ({ page }) => {
    await setupMocks(page, { actionDelay: 2000 });
    await gotoConversationsPage(page);

    // Select the active conversation
    await page.getByTestId(`conversation-item-${CONV_ACTIVE_ID}`).click();
    await expect(page.getByTestId('action-return-to-ai')).toBeVisible({ timeout: 5000 });

    // Click Return to AI
    await page.getByTestId('action-return-to-ai').click();

    const returnBtn = page.getByTestId('action-return-to-ai');
    await expect(returnBtn).toBeDisabled({ timeout: 1000 });
    await expect(returnBtn.locator('.animate-spin')).toBeVisible({ timeout: 1000 });

    // Resolve should be disabled too
    await expect(page.getByTestId('action-resolve')).toBeDisabled({ timeout: 1000 });
  });
});

test.describe('Agent Console -- Conversation Highlight', () => {
  test('clicked conversation gets selected styling immediately', async ({ page }) => {
    await setupMocks(page, { messagesDelay: 2000 });
    await gotoConversationsPage(page);

    const convItem = page.getByTestId(`conversation-item-${CONV_A_ID}`);

    // Before clicking -- not selected
    await expect(convItem).toHaveAttribute('data-selected', 'false');

    // Click the conversation
    await convItem.click();

    // IMMEDIATELY it should have the selected attribute and selected CSS classes
    await expect(convItem).toHaveAttribute('data-selected', 'true', { timeout: 1000 });
    await expect(convItem).toHaveClass(/bg-primary-50/, { timeout: 1000 });
    await expect(convItem).toHaveClass(/border-l-2/, { timeout: 1000 });
    await expect(convItem).toHaveClass(/border-primary-500/, { timeout: 1000 });
  });

  test('selecting a different conversation moves the highlight', async ({ page }) => {
    await setupMocks(page, { messagesDelay: 200 });
    await gotoConversationsPage(page);

    const convA = page.getByTestId(`conversation-item-${CONV_A_ID}`);
    const convB = page.getByTestId(`conversation-item-${CONV_B_ID}`);

    // Select A
    await convA.click();
    await expect(convA).toHaveAttribute('data-selected', 'true', { timeout: 1000 });
    await expect(convB).toHaveAttribute('data-selected', 'false');

    // Select B
    await convB.click();
    await expect(convB).toHaveAttribute('data-selected', 'true', { timeout: 1000 });
    // A should no longer be selected
    await expect(convA).toHaveAttribute('data-selected', 'false', { timeout: 1000 });
    await expect(convA).not.toHaveClass(/bg-primary-50/);
  });

  test('highlight persists while messages are still loading', async ({ page }) => {
    await setupMocks(page, { messagesDelay: 3000 });
    await gotoConversationsPage(page);

    const convItem = page.getByTestId(`conversation-item-${CONV_A_ID}`);
    await convItem.click();

    // While messages are loading (skeleton visible) ...
    await expect(page.getByTestId('messages-skeleton')).toBeVisible({ timeout: 1000 });

    // ... the highlight should still be on the selected conversation
    await expect(convItem).toHaveAttribute('data-selected', 'true');
    await expect(convItem).toHaveClass(/border-primary-500/);
  });
});
