import { test, expect } from '@playwright/test';

// These tests don't need auth - test public pages render
const publicPages = [
  { path: '/', label: 'home' },
  { path: '/login', label: 'login' },
  { path: '/pricing', label: 'pricing' },
  { path: '/tools', label: 'tools hub' },
  { path: '/tools/email-writer', label: 'email writer' },
  { path: '/tools/blog-writer', label: 'blog writer' },
  { path: '/tools/social-post', label: 'social post' },
  { path: '/tools/ad-copy', label: 'ad copy' },
  { path: '/tools/meeting-notes', label: 'meeting notes' },
  { path: '/tools/proposal-generator', label: 'proposal generator' },
];

test.describe('Public Pages', () => {
  for (const { path, label } of publicPages) {
    test(`${label} page loads`, async ({ page }) => {
      const response = await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      // Page should load (even if it redirects)
      const status = response?.status() ?? 200;
      // Allow 200, 301, 302, 304 — just not 500
      expect(status).toBeLessThan(500);
    });
  }
});
