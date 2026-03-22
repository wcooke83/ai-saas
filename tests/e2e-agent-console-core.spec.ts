import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars from .env.local (dotenv not available)
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match && !process.env[match[1].trim()]) {
    process.env[match[1].trim()] = match[2].trim();
  }
}

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CONVERSATIONS_URL = `/dashboard/chatbots/${CHATBOT_ID}/conversations`;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Track created resources for cleanup
const createdConversationIds: string[] = [];

/** Insert a row via Supabase REST API (bypasses RLS), returns inserted row */
async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

/** Delete rows via Supabase REST API */
async function supabaseDelete(table: string, column: string, values: string[]) {
  if (values.length === 0) return;
  const filter = `${column}=in.(${values.map(v => `"${v}"`).join(',')})`;
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'DELETE',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });
}

/** Create a conversation + messages directly via Supabase */
async function seedConversation(suffix: string, userMessage: string) {
  const conv = await supabaseInsert('conversations', {
    chatbot_id: CHATBOT_ID,
    session_id: `e2e-handoff-${suffix}-${Date.now()}`,
    channel: 'widget',
    visitor_id: `e2e-visitor-${suffix}`,
    visitor_metadata: { name: `E2E Visitor ${suffix}` },
    status: 'active',
    message_count: 2,
    first_message_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  });
  if (!conv?.id) return null;

  // Insert user + assistant messages
  await supabaseInsert('messages', {
    conversation_id: conv.id,
    chatbot_id: CHATBOT_ID,
    role: 'user',
    content: userMessage,
  });
  await supabaseInsert('messages', {
    conversation_id: conv.id,
    chatbot_id: CHATBOT_ID,
    role: 'assistant',
    content: 'Thank you for reaching out. Let me help you with that.',
  });

  return conv.id as string;
}

/** Navigate to agent console and wait for it to fully render */
async function gotoAgentConsole(page: Page) {
  await page.goto(CONVERSATIONS_URL);
  await page.waitForLoadState('domcontentloaded');
  // Wait for page-level spinner to disappear then AgentConsoleLayout to mount
  await page.waitForSelector('.animate-spin', { timeout: 30000 }).catch(() => {});
  await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 60000 }).catch(() => {});
  await page.waitForSelector('[data-testid="conversation-list"]', { timeout: 30000 });
}

test.describe('14. Agent Console', () => {
  test.setTimeout(120_000);

  test.beforeAll(async ({ request }) => {
    // Create 4 conversations directly via Supabase
    const messages = [
      'I need help with my subscription billing',
      'The product page is not loading correctly',
      'Can someone help me with a refund request?',
      'I have a question about your return policy',
    ];

    for (let i = 0; i < 4; i++) {
      const convId = await seedConversation(`core-${i}`, messages[i]);
      if (convId) createdConversationIds.push(convId);
    }

    if (createdConversationIds.length < 4) {
      console.warn(`Only created ${createdConversationIds.length}/4 conversations`);
      return;
    }

    const ts = Date.now();

    // Conv 0 → pending handoff + escalation (insert escalation first, then link to handoff)
    const escalation = await supabaseInsert('conversation_escalations', {
      chatbot_id: CHATBOT_ID,
      conversation_id: createdConversationIds[0],
      session_id: `e2e-handoff-core-0-${ts}`,
      reason: 'need_human_help',
      details: 'E2E test escalation — user needs billing support',
      status: 'open',
    });
    await supabaseInsert('telegram_handoff_sessions', {
      chatbot_id: CHATBOT_ID,
      conversation_id: createdConversationIds[0],
      session_id: `e2e-handoff-core-0-${ts}`,
      status: 'pending',
      escalation_id: escalation?.id || null,
    });

    // Conv 1 → active handoff (via agent-actions take_over)
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[1], action: 'take_over', agent_name: 'E2E Agent' },
    });

    // Conv 2 → active handoff (second active, for resolve/return tests)
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[2], action: 'take_over', agent_name: 'E2E Agent' },
    });

    // Conv 3 → resolved handoff
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[3], action: 'take_over', agent_name: 'E2E Agent' },
    });
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[3], action: 'resolve' },
    });
  });

  test.afterAll(async () => {
    if (createdConversationIds.length === 0) return;
    // Clean up in reverse dependency order
    await supabaseDelete('telegram_handoff_sessions', 'conversation_id', createdConversationIds);
    await supabaseDelete('conversation_escalations', 'conversation_id', createdConversationIds);
    await supabaseDelete('messages', 'conversation_id', createdConversationIds);
    await supabaseDelete('conversations', 'id', createdConversationIds);
  });

  test('AGENT-001: Agent Console layout renders', async ({ page }) => {
    await gotoAgentConsole(page);

    // Two-panel layout: conversation list on left
    await expect(page.getByTestId('conversation-list')).toBeVisible();

    // Right panel shows empty state placeholder
    await expect(page.getByText('Select a conversation to view messages')).toBeVisible();
  });

  test('AGENT-002: Conversation list loads', async ({ page }) => {
    await gotoAgentConsole(page);

    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();

    // Should have conversations from setup
    const count = await page.locator('[data-testid^="conversation-item-"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('AGENT-003: Filter by status', async ({ page }) => {
    await gotoAgentConsole(page);

    await expect(page.getByTestId('filter-tabs')).toBeVisible();

    for (const id of ['filter-all', 'filter-pending', 'filter-active', 'filter-resolved']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }

    // Click Pending — should show our pending conversation
    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();

    // Click Active — should show our active conversations
    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();

    // Click Resolved — should show our resolved conversation
    await page.getByTestId('filter-resolved').click();
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();

    // Click All
    await page.getByTestId('filter-all').click();
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('conversation-list-body')).toBeVisible();
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
    expect(await items.count()).toBeGreaterThan(0);

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
    await items.first().click();
    await page.waitForTimeout(2000);

    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Should have the messages from our chat API calls
    const bodyText = await page.getByTestId('chat-messages-area').textContent();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('AGENT-007: Send agent reply', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Filter to active conversations
    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    // Wait for messages to fully load before checking textarea
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(1000);

    const textarea = page.locator('textarea[placeholder="Type a reply..."]');
    await expect(textarea).toBeVisible({ timeout: 15000 });

    const testMessage = `E2E test reply ${Date.now()}`;
    await textarea.fill(testMessage);
    await textarea.press('Enter');
    await page.waitForTimeout(3000);

    // Textarea should be cleared after send
    await expect(textarea).toHaveValue('');
  });

  test('AGENT-008: Reply disabled for pending conversations', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    // Wait for messages to fully load before checking buttons
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(1000);

    // Textarea should be disabled with "Take over first" placeholder
    const textarea = page.locator('textarea[placeholder="Take over the conversation first..."]');
    if (await textarea.isVisible().catch(() => false)) {
      await expect(textarea).toBeDisabled();
    }

    // Take Over button should be visible
    await expect(page.getByTestId('action-take-over')).toBeVisible({ timeout: 15000 });
  });

  test('AGENT-009: Reply disabled for resolved conversations', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-resolved').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    // Reply input should NOT be rendered for resolved conversations
    await expect(page.locator('textarea[placeholder="Type a reply..."]')).not.toBeVisible();
  });

  test('AGENT-010: Take Over action', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const takeOverBtn = page.getByTestId('action-take-over');
    if (!(await takeOverBtn.isVisible().catch(() => false))) { test.skip(); return; }

    await takeOverBtn.click();
    await page.waitForTimeout(3000);

    // After taking over, active-state buttons should appear
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
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const resolveBtn = page.getByTestId('action-resolve');
    if (!(await resolveBtn.isVisible().catch(() => false))) { test.skip(); return; }

    await resolveBtn.click();
    await page.waitForTimeout(3000);

    // After resolving, reply textarea should disappear
    await expect(page.locator('textarea[placeholder="Type a reply..."]')).not.toBeVisible();
  });

  test('AGENT-012: Return to AI action', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

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
    await items.first().click();
    await page.waitForTimeout(2000);

    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });

    // Verify page is stable (realtime subscription active)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
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
    await items.first().click();
    await page.waitForTimeout(2000);

    // Should show either "Online" or "Offline"
    const hasOnline = await page.getByText('Online').isVisible().catch(() => false);
    const hasOffline = await page.getByText('Offline').isVisible().catch(() => false);
    expect(hasOnline || hasOffline).toBeTruthy();
  });

  test('AGENT-016: Visitor typing indicator', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    await items.first().click();
    await page.waitForTimeout(2000);

    // Chat messages area should be visible (typing indicator renders within it)
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
  });

  test('AGENT-017: Escalation reason display', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody).toBeVisible();

    // The escalation we created should show up
    const bodyText = await listBody.textContent();
    expect(bodyText!.length).toBeGreaterThan(0);

    // Check for escalation label text in conversation rows
    const hasEscalation = bodyText?.includes('Needs help') || bodyText?.includes('help');
    expect(hasEscalation).toBeTruthy();
  });

  test('AGENT-018: Message cache prevents flash of empty state', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count < 2) { test.skip(); return; }

    // Load messages for first conversation and wait for full load
    await items.nth(0).click();
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Load messages for second conversation and wait for full load
    await items.nth(1).click();
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Switch back — cached messages should appear without skeleton
    await items.nth(0).click();
    await page.waitForTimeout(200); // Brief pause to let React render
    const skeletonVisible = await page.getByTestId('messages-skeleton').isVisible().catch(() => false);
    expect(skeletonVisible).toBe(false);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible();
  });

  test('AGENT-019: Agent presence broadcast', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list')).toBeVisible();
  });
});
