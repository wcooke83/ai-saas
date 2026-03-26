import { test, expect } from '@playwright/test';

// Uses the pre-seeded E2E test bot
const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

const chatbotSubPages = [
  { path: '', label: 'overview' },
  { path: '/settings', label: 'settings' },
  { path: '/knowledge', label: 'knowledge' },
  { path: '/customize', label: 'customize' },
  { path: '/deploy', label: 'deploy' },
  { path: '/conversations', label: 'conversations' },
  { path: '/analytics', label: 'analytics' },
  { path: '/performance', label: 'performance' },
  { path: '/sentiment', label: 'sentiment' },
  { path: '/issues', label: 'issues' },
  { path: '/surveys', label: 'surveys' },
  { path: '/leads', label: 'leads' },
];

test.describe('Chatbot Sub-Pages', () => {
  for (const { path, label } of chatbotSubPages) {
    test(`${label} page loads without errors`, async ({ page }) => {
      await page.goto(`/dashboard/chatbots/${CHATBOT_ID}${path}`);
      await page.waitForLoadState('domcontentloaded');

      // No error boundary
      await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

      // Page has content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(50);
    });
  }
});
