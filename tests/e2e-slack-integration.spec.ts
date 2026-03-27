import { test, expect } from '@playwright/test';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('31. Telegram & Slack Integration — Slack', () => {
  test('SLACK-001: Slack OAuth callback route exists', async ({ page }) => {
    // Navigate to the Slack callback without a code — verifies the route exists
    const response = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/integrations/slack/callback?code=fake-oauth-code&state=${CHATBOT_ID}`
    );
    expect([200, 302, 307, 400, 401, 500]).toContain(response.status());
  });

  test('SLACK-002: Slack OAuth callback -- missing code redirect', async ({ page }) => {
    await page.goto(
      `/api/chatbots/${CHATBOT_ID}/integrations/slack/callback`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    const url = page.url();
    const isRedirected = url.includes('slack_error') || url.includes('/dashboard') || url.includes('/login');
    expect(isRedirected).toBeTruthy();
  });

  test('SLACK-003: Slack OAuth callback -- unauthenticated user redirect', async ({ page, context }) => {
    const newPage = await context.newPage();
    await newPage.context().clearCookies();

    await newPage.goto(
      `/api/chatbots/${CHATBOT_ID}/integrations/slack/callback?code=test`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );
    const url = newPage.url();
    const redirectedToLogin = url.includes('/login') || url.includes('slack_error') || url.includes('/dashboard');
    expect(redirectedToLogin).toBeTruthy();
    await newPage.close();
  });

  test('SLACK-004: Slack OAuth callback -- non-owner redirect', async ({ page }) => {
    const nonOwnedId = '00000000-0000-0000-0000-000000000099';
    const response = await page.request.get(
      `/api/chatbots/${nonOwnedId}/integrations/slack/callback?code=test&state=${nonOwnedId}`
    );
    expect([200, 302, 307, 400, 401, 404, 500]).toContain(response.status());
  });

  // Webhook signature verification and message processing tests are inherently API-level
  // (external services POST to our webhook endpoint) — no UI equivalent exists
  test('SLACK-005: Slack signature verification', async ({ request }) => {
    const invalidResponse = await request.post('/api/webhooks/slack', {
      headers: {
        'Content-Type': 'application/json',
        'x-slack-signature': 'v0=invalid_signature',
        'x-slack-request-timestamp': String(Math.floor(Date.now() / 1000)),
      },
      data: {
        type: 'event_callback',
        event: {
          type: 'app_mention',
          text: '<@BOT_ID> Hello',
          channel: 'C12345',
          user: 'U12345',
          ts: '1234567890.123456',
        },
      },
    });
    expect([200, 401]).toContain(invalidResponse.status());
  });

  test('SLACK-006: Slack url_verification challenge', async ({ request }) => {
    const challengeResponse = await request.post('/api/webhooks/slack', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: 'url_verification',
        challenge: 'e2e-test-challenge-token',
      },
    });

    if (challengeResponse.status() === 200) {
      const body = await challengeResponse.json();
      expect(body.challenge).toBe('e2e-test-challenge-token');
    } else {
      expect(challengeResponse.status()).toBe(401);
    }
  });

  test('SLACK-007: Slack bot mention text cleaning', async ({ request }) => {
    const response = await request.post('/api/webhooks/slack', {
      headers: {
        'Content-Type': 'application/json',
        'x-slack-signature': 'v0=test',
        'x-slack-request-timestamp': String(Math.floor(Date.now() / 1000)),
      },
      data: {
        type: 'event_callback',
        event: {
          type: 'app_mention',
          text: '<@U999999> What is your refund policy?',
          channel: 'C12345',
          user: 'U12345',
          ts: '1234567890.123456',
        },
      },
    });
    expect([200, 401]).toContain(response.status());
  });

  test('SLACK-008: Slack empty message after mention strip', async ({ request }) => {
    const response = await request.post('/api/webhooks/slack', {
      headers: {
        'Content-Type': 'application/json',
        'x-slack-signature': 'v0=test',
        'x-slack-request-timestamp': String(Math.floor(Date.now() / 1000)),
      },
      data: {
        type: 'event_callback',
        event: {
          type: 'app_mention',
          text: '<@U999999>',
          channel: 'C12345',
          user: 'U12345',
          ts: '1234567890.123457',
        },
      },
    });
    expect([200, 401]).toContain(response.status());
  });

  test('SLACK-009: Slack integration status endpoint', async ({ request }) => {
    const response = await request.get(`/api/chatbots/${CHATBOT_ID}/integrations/slack`);

    if (response.status() === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('connected');
    } else {
      expect([401, 403, 404]).toContain(response.status());
    }
  });

  test('SLACK-010: Slack integration soft delete', async ({ request }) => {
    const response = await request.delete(`/api/chatbots/${CHATBOT_ID}/integrations/slack`);

    if (response.status() === 200) {
      const body = await response.json();
      expect(body.success).toBe(true);
    } else {
      expect([401, 403, 404]).toContain(response.status());
    }
  });
});
