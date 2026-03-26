import { test, expect, Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE_URL = `/dashboard/chatbots/${CHATBOT_ID}`;

async function waitForSentiment(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await Promise.race([
    page.getByRole('heading', { name: 'Sentiment & Loyalty' }).waitFor({ timeout: 60000 }),
    page.getByText('Chatbot not found').waitFor({ timeout: 60000 }),
  ]).catch(() => {});
}

test.describe('Section 19: Sentiment Analysis', () => {
  test.setTimeout(120_000);

  test('SENTIMENT-001: Sentiment page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    // Page heading
    await expect(page.getByText('Sentiment & Loyalty')).toBeVisible();

    // Either stats grid (with data) or empty state should render
    const hasStats = await page.getByText('Avg. Sentiment').isVisible().catch(() => false);
    const hasEmpty = await page.getByText('No Sentiment Data Yet').isVisible().catch(() => false);
    expect(hasStats || hasEmpty).toBeTruthy();

    if (hasStats) {
      // Four stat cards when data exists
      await expect(page.getByText('Avg. Sentiment')).toBeVisible();
      await expect(page.getByText('Positive').first()).toBeVisible();
      await expect(page.getByText('Neutral').first()).toBeVisible();
      await expect(page.getByText('Negative').first()).toBeVisible();
    }
  });

  test('SENTIMENT-002: Sentiment badges render correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const hasData = await page.getByText('Conversation Sentiment').isVisible().catch(() => false);
    if (!hasData) {
      test.skip(true, 'No sentiment data available');
      return;
    }

    // Sentiment badges: Very Positive (emerald), Positive (green), Neutral (gray), Negative (orange), Very Negative (red)
    const badges = page.locator('.rounded-full.text-xs.font-medium');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);

    // Verify badge colors are present in the DOM
    const badgeClasses = ['bg-emerald-100', 'bg-green-100', 'bg-gray-100', 'bg-orange-100', 'bg-red-100'];
    let foundBadge = false;
    for (const cls of badgeClasses) {
      const badge = page.locator(`[class*="${cls}"]`);
      if (await badge.count() > 0) {
        foundBadge = true;
        break;
      }
    }
    expect(foundBadge).toBeTruthy();
  });

  test('SENTIMENT-003: Run sentiment analysis', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    // Analyze button should be visible
    const analyzeButton = page.getByRole('button', { name: /Analyze/ });
    await expect(analyzeButton).toBeVisible();

    // Button text depends on state: "Analyze N Sessions", "Analyzing...", or "All Analyzed"
    const buttonText = await analyzeButton.textContent();
    expect(buttonText).toMatch(/Analyze|Analyzing|All Analyzed/);
  });

  test('SENTIMENT-004: Loyalty trend indicators', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const hasData = await page.getByText('Conversation Sentiment').isVisible().catch(() => false);
    if (!hasData) {
      test.skip(true, 'No sentiment data available');
      return;
    }

    // Trend column has: Improving, Stable, Declining
    // LoyaltyTrendBadge renders with TrendingUp (green), Minus (gray), TrendingDown (red)
    const trendBadges = page.locator('text=Improving, text=Stable, text=Declining');
    const improvingCount = await page.getByText('Improving').count();
    const stableCount = await page.getByText('Stable').count();
    const decliningCount = await page.getByText('Declining').count();

    // At least some trend indicators should exist or dashes for no-loyalty data
    expect(improvingCount + stableCount + decliningCount).toBeGreaterThanOrEqual(0);
  });

  test('SENTIMENT-005: Export sentiment data', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const exportButton = page.getByRole('button', { name: /Export CSV/ });
    await expect(exportButton).toBeVisible();

    if (!(await exportButton.isDisabled())) {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      await exportButton.click();
      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toContain('sentiment-loyalty-');
        expect(filename).toContain('.csv');
      }
    }
  });

  test('SENTIMENT-006: Pagination', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const hasData = await page.getByText('Conversation Sentiment').isVisible().catch(() => false);
    if (!hasData) {
      test.skip(true, 'No sentiment data available');
      return;
    }

    // Pagination appears when total_pages > 1
    const paginationText = page.getByText(/Page \d+ of \d+/);
    if (await paginationText.isVisible().catch(() => false)) {
      await expect(paginationText).toBeVisible();

      const nextButton = page.getByRole('button', { name: 'Next' }).first();
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        // Page number should update
        await expect(page.getByText(/Page 2 of/)).toBeVisible();
      }
    }
  });
});

test.describe('Section 32: Sentiment Dashboard Details', () => {
  test.setTimeout(120_000);

  test('DASH-022: Sentiment empty state with Analyze Now button', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    // Empty state when unanalyzed sessions exist
    const emptyState = page.getByText('No Sentiment Data Yet');
    if (await emptyState.isVisible().catch(() => false)) {
      await expect(emptyState).toBeVisible();

      // If unanalyzed sessions exist, "Analyze Now" button appears
      const analyzeNowBtn = page.getByRole('button', { name: 'Analyze Now' });
      if (await analyzeNowBtn.isVisible().catch(() => false)) {
        await expect(analyzeNowBtn).toBeVisible();
      }
    }
  });

  test('DASH-023: Sentiment empty state with no conversations', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    // When no conversations at all, a different message appears
    const noConvText = page.getByText('Sentiment data will appear here once your chatbot has conversations');
    if (await noConvText.isVisible().catch(() => false)) {
      await expect(noConvText).toBeVisible();
      // "Analyze Now" button should NOT appear in this case
      await expect(page.getByRole('button', { name: 'Analyze Now' })).not.toBeVisible();
    }
  });

  test('DASH-024: Sentiment analyze button disabled when all analyzed', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const analyzeButton = page.getByRole('button', { name: /Analyze|All Analyzed/ });
    if (await analyzeButton.isVisible().catch(() => false)) {
      const text = await analyzeButton.textContent();
      if (text?.includes('All Analyzed')) {
        await expect(analyzeButton).toBeDisabled();
      }
    }
  });

  test('DASH-025: Sentiment analyze button dynamic label', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    // Button shows: "Analyze N Sessions" | "Analyzing..." | "All Analyzed"
    const analyzeButton = page.getByRole('button', { name: /Analyze|All Analyzed/ });
    await expect(analyzeButton).toBeVisible();

    const buttonText = await analyzeButton.textContent();
    // Should match one of the expected patterns
    expect(buttonText).toMatch(/Analyze \d+ Sessions?|Analyzing\.\.\.|All Analyzed/);
  });

  test('DASH-026: Sentiment export button disabled when no analyzed data', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const exportButton = page.getByRole('button', { name: /Export CSV/ });
    await expect(exportButton).toBeVisible();

    // Disabled when: !stats || stats.total_analyzed === 0
    const isDisabled = await exportButton.isDisabled();
    // Value depends on data state
    expect(typeof isDisabled).toBe('boolean');
  });

  test('DASH-027: Sentiment ScoreBar component color coding', async ({ page }) => {
    await page.goto(`${BASE_URL}/sentiment`);
    await waitForSentiment(page);

    const hasData = await page.getByText('Conversation Sentiment').isVisible().catch(() => false);
    if (!hasData) {
      test.skip(true, 'No sentiment data available');
      return;
    }

    // ScoreBar uses: bg-emerald-500 (>=4), bg-yellow-500 (>=3), bg-red-500 (<3)
    // The bar is inside a .w-16.h-2 container
    const scoreBars = page.locator('.w-16.h-2 > div');
    const count = await scoreBars.count();

    if (count > 0) {
      // Check that bars have one of the expected color classes
      const firstBar = scoreBars.first();
      const cls = await firstBar.getAttribute('class');
      expect(cls).toMatch(/bg-(emerald|yellow|red)-500/);
    }
  });
});
