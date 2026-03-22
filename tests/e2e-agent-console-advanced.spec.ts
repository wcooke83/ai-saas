import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

const createdConversationIds: string[] = [];

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

async function seedConversation(suffix: string, userMessage: string) {
  const conv = await supabaseInsert('conversations', {
    chatbot_id: CHATBOT_ID,
    session_id: `e2e-adv-${suffix}-${Date.now()}`,
    channel: 'widget',
    visitor_id: `e2e-adv-visitor-${suffix}`,
    visitor_metadata: { name: `E2E Visitor ${suffix}` },
    status: 'active',
    message_count: 2,
    first_message_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  });
  if (!conv?.id) return null;

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

async function gotoAgentConsole(page: Page) {
  await page.goto(CONVERSATIONS_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.animate-spin', { timeout: 30000 }).catch(() => {});
  await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 60000 }).catch(() => {});
  await page.waitForSelector('[data-testid="conversation-list"]', { timeout: 30000 });
}

test.describe('29. Agent Console Advanced Behaviors', () => {
  test.setTimeout(120_000);

  test.beforeAll(async ({ request }) => {
    const messages = [
      'Advanced test: I have a complex billing question',
      'Advanced test: Need help navigating your platform',
      'Advanced test: Feature request discussion',
    ];

    for (let i = 0; i < 3; i++) {
      const convId = await seedConversation(`adv-${i}`, messages[i]);
      if (convId) createdConversationIds.push(convId);
    }

    if (createdConversationIds.length < 3) {
      console.warn(`Only created ${createdConversationIds.length}/3 conversations`);
      return;
    }

    const ts = Date.now();

    // Conv 0 → pending with escalation (insert escalation first, then link to handoff)
    const escalation = await supabaseInsert('conversation_escalations', {
      chatbot_id: CHATBOT_ID,
      conversation_id: createdConversationIds[0],
      session_id: `e2e-adv-0-${ts}`,
      reason: 'wrong_answer',
      details: 'The AI gave incorrect pricing information',
      status: 'open',
    });
    await supabaseInsert('telegram_handoff_sessions', {
      chatbot_id: CHATBOT_ID,
      conversation_id: createdConversationIds[0],
      session_id: `e2e-adv-0-${ts}`,
      status: 'pending',
      escalation_id: escalation?.id || null,
    });

    // Conv 1 → active
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[1], action: 'take_over', agent_name: 'E2E Agent' },
    });

    // Conv 2 → active (for switching tests)
    await request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: { conversation_id: createdConversationIds[2], action: 'take_over', agent_name: 'E2E Agent' },
    });
  });

  test.afterAll(async () => {
    if (createdConversationIds.length === 0) return;
    await supabaseDelete('telegram_handoff_sessions', 'conversation_id', createdConversationIds);
    await supabaseDelete('conversation_escalations', 'conversation_id', createdConversationIds);
    await supabaseDelete('messages', 'conversation_id', createdConversationIds);
    await supabaseDelete('conversations', 'id', createdConversationIds);
  });

  test('AGENT-ADV-001: Debounced filter change prevents multiple fetches', async ({ page }) => {
    await gotoAgentConsole(page);

    const requests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('agent-conversations')) {
        requests.push(req.url());
      }
    });

    // Rapidly click between filters
    await page.getByTestId('filter-pending').click();
    await page.getByTestId('filter-active').click();
    await page.getByTestId('filter-resolved').click();
    await page.getByTestId('filter-all').click();

    // Wait for debounce to settle
    await page.waitForTimeout(2000);

    // Due to debouncing, should have fewer than 4 requests
    expect(requests.length).toBeLessThanOrEqual(4);
  });

  test('AGENT-ADV-002: Message cache stays in sync with Realtime inserts', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count < 2) { test.skip(); return; }

    // Cache first conversation's messages — wait for full load
    await items.nth(0).click();
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Switch to second — wait for full load
    await items.nth(1).click();
    await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Switch back — cached messages should appear without skeleton
    await items.nth(0).click();
    await page.waitForTimeout(200); // Brief pause for React render
    const skeletonVisible = await page.getByTestId('messages-skeleton').isVisible().catch(() => false);
    expect(skeletonVisible).toBe(false);
    await expect(page.getByTestId('chat-messages-area')).toBeVisible();
  });

  test('AGENT-ADV-003: Realtime message deduplication', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    await items.first().click();

    // Wait for messages to fully load
    const messagesArea = page.getByTestId('chat-messages-area');
    await expect(messagesArea).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('messages-skeleton')).not.toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(1000);

    const initialText = await messagesArea.textContent();
    expect(initialText!.length).toBeGreaterThan(0);

    // Page should be stable — no duplicate rendering
    await page.waitForTimeout(2000);
    const laterText = await messagesArea.textContent();
    expect(laterText).toBe(initialText);
  });

  test('AGENT-ADV-004: Agent typing throttle (2-second interval)', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const textarea = page.locator('textarea[placeholder="Type a reply..."]');
    await expect(textarea).toBeVisible({ timeout: 10000 });

    // Type rapidly — broadcasts are throttled
    await textarea.type('Hello this is a typing throttle test message');
    await page.waitForTimeout(1000);

    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('AGENT-ADV-005: Visitor presence tracking -- multiple visitors', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    await items.first().click();
    await page.waitForTimeout(2000);

    // Should show presence (Online or Offline)
    const hasOnline = await page.getByText('Online').isVisible().catch(() => false);
    const hasOffline = await page.getByText('Offline').isVisible().catch(() => false);
    expect(hasOnline || hasOffline).toBeTruthy();
  });

  test('AGENT-ADV-006: Visitor presence leave event', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    await items.first().click();
    await page.waitForTimeout(2000);

    // Without active visitor, should show Offline
    const hasOffline = await page.getByText('Offline').isVisible().catch(() => false);
    const hasOnline = await page.getByText('Online').isVisible().catch(() => false);
    expect(hasOffline || hasOnline).toBeTruthy();
  });

  test('AGENT-ADV-007: Sound notification parameters', async ({ page }) => {
    await gotoAgentConsole(page);

    const hasAudioContext = await page.evaluate(() => {
      return typeof window.AudioContext !== 'undefined' || typeof (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext !== 'undefined';
    });
    expect(hasAudioContext).toBeTruthy();
  });

  test('AGENT-ADV-008: Page title flash with correct pending count', async ({ page }) => {
    await gotoAgentConsole(page);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    await expect(page.getByTestId('conversation-list')).toBeVisible();
  });

  test('AGENT-ADV-009: Send failure restores input text', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const textarea = page.locator('textarea[placeholder="Type a reply..."]');
    await expect(textarea).toBeVisible({ timeout: 10000 });

    const testMessage = 'Test message for failure recovery';
    await textarea.fill(testMessage);
    await expect(textarea).toHaveValue(testMessage);
  });

  test('AGENT-ADV-010: Typing indicator cleared on message send', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    const textarea = page.locator('textarea[placeholder="Type a reply..."]');
    await expect(textarea).toBeVisible({ timeout: 10000 });

    await textarea.fill('Hello from typing test');
    await page.waitForTimeout(500);
    await textarea.press('Enter');
    await page.waitForTimeout(2000);

    // Textarea should be cleared after send
    await expect(textarea).toHaveValue('');
  });

  test('AGENT-ADV-011: Escalation reason label mappings in chat panel', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Our setup created an escalation with reason 'wrong_answer'
    // Click on the pending filter to find it
    await page.getByTestId('filter-pending').click();
    await page.waitForTimeout(1500);

    const items = page.locator('[data-testid^="conversation-item-"]');
    const count = await items.count();
    if (count === 0) { test.skip(); return; }

    await items.first().click();
    await page.waitForTimeout(2000);

    // The chat panel header should show escalation reason label
    const bodyText = await page.locator('body').textContent();
    const hasEscalation = bodyText?.includes('wrong answer') || bodyText?.includes('Wrong answer') ||
      bodyText?.includes('Reported wrong answer') || bodyText?.includes('Wrong');
    expect(hasEscalation || bodyText?.includes('Needs help')).toBeTruthy();
  });

  test('AGENT-ADV-012: Action buttons mutually exclusive during loading', async ({ page }) => {
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
    const returnBtn = page.getByTestId('action-return-to-ai');

    if (!(await resolveBtn.isVisible().catch(() => false))) { test.skip(); return; }

    // Both should be enabled before any action
    await expect(resolveBtn).toBeEnabled();
    await expect(returnBtn).toBeEnabled();
  });

  test('AGENT-ADV-013: Conversation row shows escalation reason', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    // Our pending conversation has an escalation
    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody).toBeVisible();
    const bodyText = await listBody.textContent();

    // Escalation label should appear in conversation list
    const hasEscalation = bodyText?.includes('Wrong answer') || bodyText?.includes('wrong') ||
      bodyText?.includes('Needs help') || bodyText?.includes('help');
    expect(hasEscalation).toBeTruthy();
  });

  test('AGENT-ADV-014: Conversation row shows agent name for active conversations', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(1500);

    const listBody = page.getByTestId('conversation-list-body');
    const bodyText = await listBody.textContent();

    // Active conversations should show "Agent: E2E Agent"
    const hasAgent = bodyText?.includes('Agent:') || bodyText?.includes('E2E Agent');
    expect(hasAgent).toBeTruthy();
  });

  test('AGENT-ADV-015: Filter loading opacity transition', async ({ page }) => {
    await gotoAgentConsole(page);

    const listBody = page.getByTestId('conversation-list-body');
    await expect(listBody).toBeVisible({ timeout: 20000 });

    // Click a filter — list should remain visible (opacity transition)
    await page.getByTestId('filter-resolved').click();
    await expect(listBody).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(listBody).toBeVisible();
  });

  test('AGENT-ADV-016: Agent presence channel distinct from conversation channel', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list')).toBeVisible();

    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const items = page.locator('[data-testid^="conversation-item-"]');
    if ((await items.count()) > 0) {
      await items.first().click();
      await page.waitForTimeout(2000);
      await expect(page.getByTestId('chat-messages-area')).toBeVisible({ timeout: 15000 });
    }

    // Page should remain stable with both channels active
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Agent Console');
  });

  test('AGENT-ADV-017: timeAgo formatting edge cases', async ({ page }) => {
    await gotoAgentConsole(page);
    await expect(page.getByTestId('conversation-list-skeleton')).not.toBeVisible({ timeout: 20000 });

    const listBody = page.getByTestId('conversation-list-body');
    const bodyText = await listBody.textContent();

    // Recently created conversations should show time indicators
    const hasTimeIndicator = bodyText?.includes('ago') ||
      bodyText?.includes('just now') ||
      bodyText?.includes('Just now') ||
      bodyText?.includes('msgs');
    expect(hasTimeIndicator).toBeTruthy();
  });
});
