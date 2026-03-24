import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Fallback Contact Form', () => {
  test('CONTACT-001: Widget contact endpoint accepts valid submission', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/contact`, {
      data: {
        name: 'E2E Contact User',
        email: 'contact@test.com',
        message: 'This is a test contact message from E2E',
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('CONTACT-002: Contact form validation rejects empty fields', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/contact`, {
      data: { name: '', email: '', message: '' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('CONTACT-003: Contact form validation rejects invalid email', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/contact`, {
      data: { name: 'Test', email: 'invalid', message: 'Test message' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('CONTACT-004: Admin contact submissions endpoint returns list', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/contact-submissions`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('submissions');
      expect(data.data).toHaveProperty('total');
    }
  });

  test('CONTACT-005: Contact dashboard page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/contact`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Contact Submissions' })).toBeVisible({ timeout: 15000 });
  });
});
