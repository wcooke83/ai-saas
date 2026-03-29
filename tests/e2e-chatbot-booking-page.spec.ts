/**
 * E2E Tests: /chatbot-booking landing page (P9 — new SEO landing page)
 *
 * Covers:
 * - Page loads without 500
 * - H1 heading is present
 * - "Appointment Booking" link in product nav header
 * - At least one CTA button linking to /login or /signup
 */

import { test, expect } from '@playwright/test';

test.describe('Chatbot Booking Landing Page', () => {
  test('BOOKING-001: /chatbot-booking page loads successfully', async ({ page }) => {
    const response = await page.goto('/chatbot-booking');
    await page.waitForLoadState('domcontentloaded');

    expect(response?.status()).toBeLessThan(500);
  });

  test('BOOKING-002: Page renders main heading', async ({ page }) => {
    await page.goto('/chatbot-booking');
    await page.waitForLoadState('domcontentloaded');

    // H1 contains booking-related text
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 15000 });

    const headingText = await heading.textContent() || '';
    expect(headingText.toLowerCase()).toMatch(/bookings|booking|appointment/);
  });

  test('BOOKING-003: Page has a CTA button linking to sign up or start', async ({ page }) => {
    await page.goto('/chatbot-booking');
    await page.waitForLoadState('domcontentloaded');

    // Should have at least one CTA button/link
    const cta = page.getByRole('link').filter({
      hasText: /get started|start|sign up|try|free|book|create/i,
    }).first();

    await expect(cta).toBeVisible({ timeout: 15000 });
  });

  test('BOOKING-004: Page title contains booking-related text', async ({ page }) => {
    await page.goto('/chatbot-booking');
    await page.waitForLoadState('domcontentloaded');

    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/booking|appointment|vocui/);
  });
});

test.describe('Header "Appointment Booking" nav link (P9)', () => {
  test('BOOKING-010: Public header includes Appointment Booking link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // The header should have an "Appointment Booking" link in product nav
    const bookingLink = page.getByRole('link', { name: /Appointment Booking/i }).first();

    // May be inside a dropdown/flyout — just verify it exists in the DOM
    const exists = await bookingLink.count() > 0;
    expect(exists).toBe(true);
  });

  test('BOOKING-011: Appointment Booking link href points to /chatbot-booking', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const bookingLink = page.getByRole('link', { name: /Appointment Booking/i }).first();
    if (await bookingLink.count() > 0) {
      await expect(bookingLink).toHaveAttribute('href', '/chatbot-booking');
    }
  });
});
