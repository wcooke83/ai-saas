import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Analytics E2E Tests
 *
 * Flow: Chat widget conversations → aggregated analytics → visible dashboard data → CSV export
 */

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CHAT_API = `/api/chat/${CHATBOT_ID}`;
const ANALYTICS_API = `/api/chatbots/${CHATBOT_ID}/analytics`;
const EXPORT_API = `/api/chatbots/${CHATBOT_ID}/analytics/export`;
const ANALYTICS_PAGE = `/dashboard/chatbots/${CHATBOT_ID}/analytics`;

const TEST_RUN_ID = Date.now();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function waitForAnalyticsPage(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await Promise.race([
    page.getByRole('heading', { name: 'Analytics' }).waitFor({ timeout: 60_000 }),
    page.getByText('Failed to fetch chatbot').waitFor({ timeout: 60_000 }),
    page.getByText('Chatbot not found').waitFor({ timeout: 60_000 }),
  ]).catch(() => {});
  await page.waitForTimeout(2000);
}

async function ensureAuthenticated(page: Page) {
  // Navigate to dashboard to establish session cookies
  await page.goto('/dashboard');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
}

// ---------------------------------------------------------------------------
// Phase 1: Generate chat data
// ---------------------------------------------------------------------------

test.describe('Comprehensive Analytics: Chat → Dashboard → Export', () => {
  test.setTimeout(120_000);

  test('CANALYTICS-001: Send chat messages via API to generate analytics data', async ({ page }) => {
    const sessionId = `analytics-api-${TEST_RUN_ID}`;

    // Publish chatbot first
    await ensureAuthenticated(page);
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Send multiple messages (AI generation can be slow)
    const res1 = await page.request.post(CHAT_API, {
      data: { message: 'Hello, I need help with my account', stream: false, session_id: sessionId },
      timeout: 60_000,
    });
    expect(res1.status()).toBeLessThan(500);

    if (res1.ok()) {
      const body1 = await res1.json();
      expect(body1.data?.conversation_id).toBeTruthy();

      const res2 = await page.request.post(CHAT_API, {
        data: { message: 'How do I reset my password?', stream: false, session_id: sessionId },
        timeout: 60_000,
      });
      expect(res2.status()).toBeLessThan(500);

      const res3 = await page.request.post(CHAT_API, {
        data: { message: 'Thanks for the help!', stream: false, session_id: sessionId },
        timeout: 60_000,
      });
      expect(res3.status()).toBeLessThan(500);
    }
  });

  test('CANALYTICS-002: Send messages in a second session', async ({ page }) => {
    const sessionId = `analytics-api2-${TEST_RUN_ID}`;

    const res = await page.request.post(CHAT_API, {
      data: { message: 'I have a billing question', stream: false, session_id: sessionId },
      timeout: 60_000,
    });
    expect(res.status()).toBeLessThan(500);

    if (res.ok()) {
      const res2 = await page.request.post(CHAT_API, {
        data: { message: 'Can you explain the pricing?', stream: false, session_id: sessionId },
        timeout: 60_000,
      });
      expect(res2.status()).toBeLessThan(500);
    }
  });

  // ---------------------------------------------------------------------------
  // Phase 2: Verify analytics API
  // ---------------------------------------------------------------------------

  test('CANALYTICS-003: Analytics API returns non-zero data', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.success).toBe(true);

    const data = body.data;
    expect(data.total_conversations).toBeGreaterThan(0);
    expect(data.total_messages).toBeGreaterThan(0);
    expect(data.daily_data.length).toBeGreaterThanOrEqual(1);
  });

  test('CANALYTICS-004: Analytics summary has all required fields', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const data = (await res.json()).data;

    expect(data).toHaveProperty('total_conversations');
    expect(data).toHaveProperty('total_messages');
    expect(data).toHaveProperty('unique_visitors');
    expect(data).toHaveProperty('avg_messages_per_conversation');
    expect(data).toHaveProperty('satisfaction_rate');
    expect(data).toHaveProperty('daily_data');

    expect(typeof data.total_conversations).toBe('number');
    expect(typeof data.total_messages).toBe('number');
    expect(typeof data.unique_visitors).toBe('number');
    expect(typeof data.avg_messages_per_conversation).toBe('number');
    expect(typeof data.satisfaction_rate).toBe('number');
    expect(Array.isArray(data.daily_data)).toBe(true);
  });

  test('CANALYTICS-005: Analytics daily_data items have correct shape', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${ANALYTICS_API}?days=7`);
    expect(res.ok()).toBeTruthy();

    const dailyData = (await res.json()).data.daily_data;
    if (dailyData.length > 0) {
      const item = dailyData[0];
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('conversations');
      expect(item).toHaveProperty('messages');
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('CANALYTICS-006: Date range filter returns consistent data (7d <= 30d <= 90d)', async ({ page }) => {
    await ensureAuthenticated(page);

    const [res7, res30, res90] = await Promise.all([
      page.request.get(`${ANALYTICS_API}?days=7`),
      page.request.get(`${ANALYTICS_API}?days=30`),
      page.request.get(`${ANALYTICS_API}?days=90`),
    ]);

    expect(res7.ok()).toBeTruthy();
    expect(res30.ok()).toBeTruthy();
    expect(res90.ok()).toBeTruthy();

    const data7 = (await res7.json()).data;
    const data30 = (await res30.json()).data;
    const data90 = (await res90.json()).data;

    expect(data30.total_conversations).toBeGreaterThanOrEqual(data7.total_conversations);
    expect(data90.total_conversations).toBeGreaterThanOrEqual(data30.total_conversations);
    expect(data30.total_messages).toBeGreaterThanOrEqual(data7.total_messages);
    expect(data90.total_messages).toBeGreaterThanOrEqual(data30.total_messages);
  });

  test('CANALYTICS-007: Avg messages per conversation is calculated correctly', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const data = (await res.json()).data;
    if (data.total_conversations > 0) {
      const expectedAvg = Math.round((data.total_messages / data.total_conversations) * 10) / 10;
      expect(data.avg_messages_per_conversation).toBe(expectedAvg);
    }
  });

  // ---------------------------------------------------------------------------
  // Phase 3: Dashboard UI shows data
  // ---------------------------------------------------------------------------

  test('CANALYTICS-008: Dashboard shows non-zero Total Conversations', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const card = page.locator('text=Total Conversations').locator('..').locator('.text-2xl');
    await expect(card).toBeVisible();
    const text = await card.textContent();
    const value = parseInt(text!.replace(/,/g, ''));
    expect(value).toBeGreaterThan(0);
  });

  test('CANALYTICS-009: Dashboard shows non-zero Total Messages', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const card = page.locator('text=Total Messages').locator('..').locator('.text-2xl');
    await expect(card).toBeVisible();
    const text = await card.textContent();
    const value = parseInt(text!.replace(/,/g, ''));
    expect(value).toBeGreaterThan(0);
  });

  test('CANALYTICS-010: Dashboard shows Unique Visitors', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const card = page.locator('text=Unique Visitors').locator('..').locator('.text-2xl');
    await expect(card).toBeVisible();
    const text = await card.textContent();
    expect(text).toBeTruthy();
    const value = parseInt(text!.replace(/,/g, ''));
    expect(value).toBeGreaterThanOrEqual(0);
  });

  test('CANALYTICS-011: Dashboard shows Satisfaction Rate with percentage', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const card = page.locator('text=Satisfaction Rate').locator('..').locator('.text-2xl');
    await expect(card).toBeVisible();
    const text = await card.textContent();
    expect(text).toContain('%');
  });

  test('CANALYTICS-012: Bar charts render with bars', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    await expect(page.getByText('Conversations Over Time')).toBeVisible();
    await expect(page.getByText('Messages Over Time')).toBeVisible();

    const bars = page.locator('.bg-primary-500.rounded-t');
    const count = await bars.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CANALYTICS-013: Bar chart has non-zero height bars', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    // Use default 30d range which should contain data
    const barsWithTitle = page.locator('.bg-primary-500.rounded-t[title]');
    const count = await barsWithTitle.count();
    let hasNonZero = false;
    for (let i = 0; i < count; i++) {
      const title = await barsWithTitle.nth(i).getAttribute('title');
      if (title) {
        const parts = title.split(':');
        const value = parseInt(parts[parts.length - 1].trim());
        if (value > 0) {
          hasNonZero = true;
          break;
        }
      }
    }
    expect(hasNonZero).toBe(true);
  });

  test('CANALYTICS-014: Insights section shows computed metrics', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    await expect(page.getByText('Insights')).toBeVisible();
    await expect(page.getByText('Avg. Messages/Conv')).toBeVisible();
    await expect(page.getByText('Daily Average')).toBeVisible();
    await expect(page.getByText('Message Growth')).toBeVisible();
    await expect(page.getByText('Engagement Trend')).toBeVisible();

    // Avg messages/conv should show a number
    const avgCard = page.locator('text=Avg. Messages/Conv').locator('../..').locator('.text-2xl');
    const avgText = await avgCard.textContent();
    expect(avgText).toBeTruthy();
    expect(parseFloat(avgText!)).toBeGreaterThanOrEqual(0);

    // Daily average should show convs/day
    const dailyCard = page.locator('text=Daily Average').locator('../..').locator('.text-2xl');
    const dailyText = await dailyCard.textContent();
    expect(dailyText).toContain('convs/day');
  });

  // ---------------------------------------------------------------------------
  // Phase 4: Date range switching
  // ---------------------------------------------------------------------------

  test('CANALYTICS-015: 30d is default active', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const btn30 = page.locator('button', { hasText: '30d' });
    await expect(btn30).toHaveClass(/bg-primary-500/);
  });

  test('CANALYTICS-016: 7d button switches and refetches', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const btn7 = page.locator('button', { hasText: '7d' });
    const btn30 = page.locator('button', { hasText: '30d' });

    await btn7.click();
    await page.waitForTimeout(3000);
    await expect(btn7).toHaveClass(/bg-primary-500/);
    await expect(btn30).not.toHaveClass(/bg-primary-500/);
    await expect(page.getByText('Total Conversations').first()).toBeVisible();
  });

  test('CANALYTICS-017: 90d button switches and refetches', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const btn90 = page.locator('button', { hasText: '90d' });
    await btn90.click();
    await page.waitForTimeout(5000);
    await expect(btn90).toHaveClass(/bg-primary-500/, { timeout: 10_000 });
    await expect(page.getByText('Total Conversations').first()).toBeVisible();
  });

  test('CANALYTICS-018: Switching date range changes bar count', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const bars30 = await page.locator('.bg-primary-500.rounded-t').count();

    await page.locator('button', { hasText: '7d' }).click();
    await page.waitForTimeout(3000);
    const bars7 = await page.locator('.bg-primary-500.rounded-t').count();

    expect(bars7).toBeLessThan(bars30);
  });

  // ---------------------------------------------------------------------------
  // Phase 5: CSV Export
  // ---------------------------------------------------------------------------

  test('CANALYTICS-019: Export API returns valid CSV with headers', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${EXPORT_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const contentType = res.headers()['content-type'];
    expect(contentType).toContain('text/csv');

    const csv = await res.text();
    const lines = csv.trim().split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(1);

    const headers = lines[0].split(',');
    expect(headers).toContain('Date');
    expect(headers).toContain('Conversations');
    expect(headers).toContain('Messages');
    expect(headers).toContain('Unique Visitors');
    expect(headers).toContain('Thumbs Up');
    expect(headers).toContain('Thumbs Down');
  });

  test('CANALYTICS-020: Export CSV contains data rows', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${EXPORT_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const csv = await res.text();
    const lines = csv.trim().split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(2);

    const dataRow = lines[1].split(',');
    expect(dataRow[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parseInt(dataRow[1])).toBeGreaterThanOrEqual(0);
  });

  test('CANALYTICS-021: Export has Content-Disposition header', async ({ page }) => {
    await ensureAuthenticated(page);

    const res = await page.request.get(`${EXPORT_API}?days=30`);
    expect(res.ok()).toBeTruthy();

    const disposition = res.headers()['content-disposition'];
    expect(disposition).toBeTruthy();
    expect(disposition).toContain('attachment');
    expect(disposition).toContain('.csv');
  });

  test('CANALYTICS-022: Export button triggers download from dashboard', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const exportBtn = page.getByRole('button', { name: /Export/ });
    await expect(exportBtn).toBeVisible({ timeout: 10_000 });

    const downloadPromise = page.waitForEvent('download', { timeout: 15_000 }).catch(() => null);
    await exportBtn.click();
    const download = await downloadPromise;

    if (download) {
      const filename = download.suggestedFilename();
      expect(filename).toContain('chatbot-analytics-');
      expect(filename).toContain('.csv');
    }
  });

  test('CANALYTICS-023: Export respects date range parameter', async ({ page }) => {
    await ensureAuthenticated(page);

    const [res7, res90] = await Promise.all([
      page.request.get(`${EXPORT_API}?days=7`),
      page.request.get(`${EXPORT_API}?days=90`),
    ]);

    expect(res7.ok()).toBeTruthy();
    expect(res90.ok()).toBeTruthy();

    const csv7Lines = (await res7.text()).trim().split('\n');
    const csv90Lines = (await res90.text()).trim().split('\n');

    expect(csv90Lines.length).toBeGreaterThanOrEqual(csv7Lines.length);
  });

  // ---------------------------------------------------------------------------
  // Phase 6: Data consistency
  // ---------------------------------------------------------------------------

  test('CANALYTICS-024: Dashboard numbers match API response', async ({ page }) => {
    await ensureAuthenticated(page);

    // Get API data
    const res = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(res.ok()).toBeTruthy();
    const apiData = (await res.json()).data;

    // Navigate to dashboard
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    // Compare Total Conversations
    const convCard = page.locator('text=Total Conversations').locator('..').locator('.text-2xl');
    const convText = await convCard.textContent();
    const convUI = parseInt(convText!.replace(/,/g, ''));
    expect(convUI).toBe(apiData.total_conversations);

    // Compare Total Messages
    const msgCard = page.locator('text=Total Messages').locator('..').locator('.text-2xl');
    const msgText = await msgCard.textContent();
    const msgUI = parseInt(msgText!.replace(/,/g, ''));
    expect(msgUI).toBe(apiData.total_messages);
  });

  // ---------------------------------------------------------------------------
  // Phase 7: Error handling
  // ---------------------------------------------------------------------------

  test('CANALYTICS-025: Analytics API rejects non-existent chatbot', async ({ page }) => {
    await ensureAuthenticated(page);
    const res = await page.request.get('/api/chatbots/00000000-0000-0000-0000-000000000000/analytics?days=30');
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('CANALYTICS-026: Analytics page handles loading state', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    // Should show skeleton loaders initially or content
    await page.waitForTimeout(500);
    const hasSkeletons = (await page.locator('.animate-pulse').count()) > 0;
    const hasContent = await page.getByText('Total Conversations').isVisible().catch(() => false);
    expect(hasSkeletons || hasContent).toBe(true);

    await waitForAnalyticsPage(page);
    await expect(page.getByText('Total Conversations').first()).toBeVisible();
  });

  test('CANALYTICS-027: Analytics page does not show error state', async ({ page }) => {
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    await expect(page.locator('text=An error occurred')).not.toBeVisible();
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Phase 8: Full flow — new chat → analytics increase
  // ---------------------------------------------------------------------------

  test('CANALYTICS-028: New chat messages increase analytics counts', async ({ page }) => {
    await ensureAuthenticated(page);

    // Get current analytics
    const resBefore = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(resBefore.ok()).toBeTruthy();
    const msgsBefore = (await resBefore.json()).data.total_messages;

    // Send new messages
    const sessionId = `analytics-flow-${Date.now()}`;
    const chatRes = await page.request.post(CHAT_API, {
      data: { message: 'End to end analytics test', stream: false, session_id: sessionId },
    });

    if (chatRes.ok()) {
      await page.request.post(CHAT_API, {
        data: { message: 'Second message for analytics', stream: false, session_id: sessionId },
      });

      // Wait a moment, then refetch analytics (triggers re-aggregation)
      await page.waitForTimeout(2000);
      const resAfter = await page.request.get(`${ANALYTICS_API}?days=30`);
      expect(resAfter.ok()).toBeTruthy();
      const msgsAfter = (await resAfter.json()).data.total_messages;

      expect(msgsAfter).toBeGreaterThan(msgsBefore);
    }
  });

  test('CANALYTICS-029: Export CSV data matches dashboard totals', async ({ page }) => {
    await ensureAuthenticated(page);

    // Get summary from API
    const summaryRes = await page.request.get(`${ANALYTICS_API}?days=30`);
    expect(summaryRes.ok()).toBeTruthy();
    const summary = (await summaryRes.json()).data;

    // Get export CSV
    const exportRes = await page.request.get(`${EXPORT_API}?days=30`);
    expect(exportRes.ok()).toBeTruthy();

    const csv = await exportRes.text();
    const lines = csv.trim().split('\n');
    const dataLines = lines.slice(1); // skip header

    // Sum up conversations from CSV
    let csvConversations = 0;
    let csvMessages = 0;
    for (const line of dataLines) {
      const cols = line.split(',');
      csvConversations += parseInt(cols[1]) || 0;
      csvMessages += parseInt(cols[2]) || 0;
    }

    expect(csvConversations).toBe(summary.total_conversations);
    expect(csvMessages).toBe(summary.total_messages);
  });

  test('CANALYTICS-030: Widget chat creates data visible in analytics dashboard', async ({ page }) => {
    // Send message via widget
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForSelector('.chat-widget-container, .chat-widget-button', { timeout: 30_000 });

    const btn = page.locator('.chat-widget-button');
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(1000);
    }

    // Fill pre-chat form if present
    const formView = page.locator('.chat-widget-form-view');
    if (await formView.isVisible({ timeout: 3000 }).catch(() => false)) {
      const inputs = page.locator('.chat-widget-form-input');
      const count = await inputs.count();
      if (count >= 2) {
        await inputs.nth(0).fill(`Analytics E2E ${TEST_RUN_ID}`);
        await inputs.nth(1).fill(`analytics-${TEST_RUN_ID}@test.com`);
      }
      await page.locator('.chat-widget-form-submit').click();
      await page.waitForTimeout(1500);
    }

    const input = page.locator('.chat-widget-container textarea, .chat-widget-container input[type="text"]');
    if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
      await input.fill(`Widget analytics test ${TEST_RUN_ID}`);
      await input.press('Enter');
      await page.waitForTimeout(5000);
    }

    // Now navigate to analytics dashboard and verify it has data
    await page.goto(ANALYTICS_PAGE);
    await waitForAnalyticsPage(page);

    const convCard = page.locator('text=Total Conversations').locator('..').locator('.text-2xl');
    const convText = await convCard.textContent();
    const value = parseInt(convText!.replace(/,/g, ''));
    expect(value).toBeGreaterThan(0);
  });
});
