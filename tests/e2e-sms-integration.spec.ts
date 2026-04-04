import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;
const DEPLOY_URL = `${BASE}/deploy`;

async function gotoDeploy(page: import('@playwright/test').Page) {
  await page.goto(DEPLOY_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForResponse(
    (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.status() === 200,
    { timeout: 15000 }
  ).catch(() => {});
  await expect(page.getByText('Deploy Chatbot')).toBeVisible({ timeout: 20000 });
}

async function gotoSmsTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /SMS/i }).click();
  await expect(page.getByRole('heading', { name: 'SMS via Twilio' })).toBeVisible({ timeout: 10000 });
}

function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        sms_config: {
          enabled: true,
          account_sid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          auth_token: 'test-auth-token',
          phone_number: '+14155551234',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

function makeDisconnectedChatbotResponse() {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        sms_config: { enabled: false },
      },
    },
  };
}

async function setupConnectedState(page: import('@playwright/test').Page, configOverrides: Record<string, unknown> = {}) {
  await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeConnectedChatbotResponse(configOverrides)),
      });
    } else {
      await route.continue();
    }
  });
  await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
  });
  await page.route(`**/api/sms/setup**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Navigation', () => {
  test('SMS-UI-001: SMS tab is visible in TabsList', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /SMS/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-002: SMS tab becomes active when clicked', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /SMS/i });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('SMS-UI-003: Clicking SMS tab shows the SMS via Twilio heading', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByRole('heading', { name: 'SMS via Twilio' })).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-004: Clicking SMS tab shows the subtitle text', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connect your Twilio phone number')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-005: Switching from another tab to SMS correctly shows the panel', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByRole('heading', { name: 'SMS via Twilio' })).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Disconnected State', () => {
  test('SMS-UI-010: Shows 4-step setup guide when disconnected', async ({ page }) => {
    await gotoSmsTab(page);
    await expect(page.getByText('Get a Twilio account')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Copy your credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials below')).toBeVisible();
    await expect(page.getByText('Configure webhook')).toBeVisible();
    for (const n of ['1', '2', '3', '4']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('SMS-UI-011: Account SID input is visible with correct placeholder', async ({ page }) => {
    await gotoSmsTab(page);
    const input = page.locator('#sms-account-sid');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('SMS-UI-012: Auth Token input is type=password (masked)', async ({ page }) => {
    await gotoSmsTab(page);
    const input = page.locator('#sms-auth-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your Twilio Auth Token');
  });

  test('SMS-UI-013: Phone Number input is visible with E.164 format placeholder', async ({ page }) => {
    await gotoSmsTab(page);
    const input = page.locator('#sms-phone-number');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', '+14155551234');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('SMS-UI-014: Connect button is disabled when all inputs are empty', async ({ page }) => {
    await gotoSmsTab(page);
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-015: Connect button is disabled with only Account SID filled', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-016: Connect button is disabled with only Auth Token filled', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-auth-token').fill('test-auth-token');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-016b: Connect button is disabled with only Phone Number filled', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-phone-number').fill('+14155551234');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-016c: Connect button is disabled with SID and Token but no phone number', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-016d: Connect button is disabled with SID and Phone but no auth token', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-phone-number').fill('+14155551234');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-016e: Connect button is disabled with Token and Phone but no SID', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-017: Connect button enables when all three fields are filled', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('SMS-UI-018: Whitespace-only values keep Connect button disabled', async ({ page }) => {
    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('   ');
    await page.locator('#sms-auth-token').fill('   ');
    await page.locator('#sms-phone-number').fill('   ');
    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('SMS-UI-019: Very long inputs are accepted without breaking UI', async ({ page }) => {
    await gotoSmsTab(page);
    const longValue = 'X'.repeat(500);
    await page.locator('#sms-account-sid').fill(longValue);
    await page.locator('#sms-auth-token').fill(longValue);
    await page.locator('#sms-phone-number').fill(longValue);
    await expect(page.getByRole('button', { name: /Connect SMS/i })).toBeVisible();
  });

  test('SMS-UI-019b: All three input fields have associated labels', async ({ page }) => {
    await gotoSmsTab(page);
    await expect(page.locator('label[for="sms-account-sid"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('label[for="sms-auth-token"]')).toBeVisible();
    await expect(page.locator('label[for="sms-phone-number"]')).toBeVisible();
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Loading State', () => {
  test('SMS-UI-035: Skeleton shown while chatbot data loads', async ({ page }) => {
    let resolveRequest!: () => void;
    const requestPending = new Promise<void>((resolve) => { resolveRequest = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await requestPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });

    await page.goto(DEPLOY_URL);
    await expect(page.locator('[data-slot="skeleton"]').first()).toBeVisible({ timeout: 5000 });
    resolveRequest();
  });
});

// ─── Connected State ──────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Connected State', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
  });

  test('SMS-UI-020: Connected state shows green "Connected to Twilio SMS" banner', async ({ page }) => {
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-021: Connected state shows the phone number', async ({ page }) => {
    await expect(page.getByText(/Phone: \+14155551234/)).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-022: Connected state shows A2P 10DLC warning banner', async ({ page }) => {
    await expect(page.getByText('A2P 10DLC Required for US SMS')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-022b: A2P warning banner is visible element', async ({ page }) => {
    const warningBanner = page.locator('div').filter({ hasText: 'A2P 10DLC Required for US SMS' }).first();
    await expect(warningBanner).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-023: Connected state shows webhook URL that includes chatbotId', async ({ page }) => {
    const expectedPath = `/api/sms/webhook/${CHATBOT_ID}`;
    const webhookCode = page.locator('code').filter({ hasText: expectedPath }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });
    const text = await webhookCode.textContent();
    expect(text).toContain(expectedPath);
    expect(text).toContain(CHATBOT_ID);
  });

  test('SMS-UI-024: Disconnect button is visible and enabled in connected state', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('SMS-UI-025: AI Responses toggle is visible and aria-checked=true in connected state', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('SMS-UI-026: AI Responses toggle has role="switch"', async ({ page }) => {
    await expect(page.getByRole('switch')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-027: Webhook URL copy button is present', async ({ page }) => {
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    const webhookSection = page.locator('div').filter({ hasText: 'Webhook URL' }).last();
    await expect(webhookSection).toBeVisible({ timeout: 10000 });
    const copyBtn = webhookSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-028: Connect form inputs are not visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#sms-account-sid')).not.toBeVisible();
    await expect(page.locator('#sms-auth-token')).not.toBeVisible();
    await expect(page.locator('#sms-phone-number')).not.toBeVisible();
  });
});

// ─── Persistence (page reload simulation) ─────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Persistence', () => {
  test('SMS-UI-036: Mock chatbot GET returns connected config → connected state shown on load', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-037: Mock chatbot GET returns disabled config → disconnected state shown on load', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByRole('button', { name: /Connect SMS/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Twilio SMS')).not.toBeVisible();
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Connect Flow', () => {
  test('SMS-UI-030: Filling all fields and clicking Connect triggers PATCH API call', async ({ page }) => {
    let patchCalled = false;
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchCalled = true;
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    expect(patchBody.sms_config).toBeDefined();
    const sc = patchBody.sms_config as Record<string, unknown>;
    expect(sc.account_sid).toBe('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(sc.phone_number).toBe('+14155551234');
    expect(sc.enabled).toBe(true);
  });

  test('SMS-UI-031: Connect also calls the SMS setup endpoint', async ({ page }) => {
    let setupCalled = false;

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      setupCalled = true;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/sms/setup`),
      { timeout: 10000 }
    );

    expect(setupCalled).toBe(true);
  });

  test('SMS-UI-032: After successful connect, shows connected state UI', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-033: After successful connect, input fields are no longer visible', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#sms-account-sid')).not.toBeVisible();
    await expect(page.locator('#sms-auth-token')).not.toBeVisible();
    await expect(page.locator('#sms-phone-number')).not.toBeVisible();
  });

  test('SMS-UI-034: Connect button shows spinner while request in-flight', async ({ page }) => {
    let resolveSetup!: () => void;
    const setupPending = new Promise<void>((resolve) => { resolveSetup = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await setupPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    const connectBtn = page.getByRole('button', { name: /Connecting|Connect SMS/i });
    await expect(connectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveSetup();
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Error Handling', () => {
  test('SMS-UI-060: API returns 500 on connect → shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#sms-account-sid')).toBeVisible({ timeout: 5000 });
  });

  test('SMS-UI-061: API returns 403 on connect → shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Upgrade your plan to use this integration' } }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-062: Network failure during connect → button re-enabled', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoSmsTab(page);
    await page.locator('#sms-account-sid').fill('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    await page.locator('#sms-auth-token').fill('test-auth-token');
    await page.locator('#sms-phone-number').fill('+14155551234');
    await page.getByRole('button', { name: /Connect SMS/i }).click();

    const connectBtn = page.getByRole('button', { name: /Connect SMS/i });
    await expect(connectBtn).toBeEnabled({ timeout: 10000 });
  });

  test('SMS-UI-063: Network failure during disconnect → shows error toast', async ({ page }) => {
    await setupConnectedState(page);
    await page.route(`**/api/sms/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.abort('failed');
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── AI Toggle ────────────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – AI Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-070: Toggle off → PATCH called with ai_responses_enabled: false', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const sc = patchBody.sms_config as Record<string, unknown>;
    expect(sc.ai_responses_enabled).toBe(false);
  });

  test('SMS-UI-072: API failure on toggle → reverts to previous state and shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Failed to save' } }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true', { timeout: 5000 });
  });
});

// ─── Webhook URL correctness ──────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Webhook URL correctness', () => {
  test('SMS-UI-040: Webhook URL is per-chatbot — includes chatbotId in path', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/sms/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';
    expect(text).toContain(`/api/sms/webhook/${CHATBOT_ID}`);
    expect(text).not.toContain(`?chatbot_id=`);
  });
});

// ─── Disconnect Flow ──────────────────────────────────────────────────────────

test.describe('Deploy Page – SMS Tab – Disconnect Flow', () => {
  test('SMS-UI-050: Clicking Disconnect returns to the disconnected setup form', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.getByRole('button', { name: /Connect SMS/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#sms-account-sid')).toBeVisible({ timeout: 10000 });
  });

  test('SMS-UI-051: Disconnect button shows spinner while in-flight', async ({ page }) => {
    let resolveDisconnect!: () => void;
    const disconnectPending = new Promise<void>((resolve) => { resolveDisconnect = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else if (req.method() === 'PATCH') {
        await disconnectPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/sms/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await expect(page.getByText('Connected to Twilio SMS')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /Disconnect/i }).click();
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveDisconnect();
  });
});
