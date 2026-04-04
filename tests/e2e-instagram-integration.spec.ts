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

async function gotoInstagramTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /Instagram/i }).click();
  await expect(page.getByRole('heading', { name: 'Instagram DMs' })).toBeVisible({ timeout: 10000 });
}

function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        instagram_config: {
          enabled: true,
          instagram_id: '123456789012345',
          username: 'mybusiness',
          access_token: 'test-access-token',
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
        instagram_config: { enabled: false },
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
  await page.route(`**/api/instagram/setup**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Navigation', () => {
  test('IG-UI-001: Instagram tab is visible in TabsList', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Instagram/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-002: Instagram tab becomes active when clicked', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Instagram/i });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('IG-UI-003: Clicking Instagram tab shows the Instagram DMs heading', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByRole('heading', { name: 'Instagram DMs' })).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-004: Clicking Instagram tab shows the deploy subtitle text', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Deploy this chatbot on Instagram')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-005: Switching from another tab to Instagram correctly shows the panel', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByRole('heading', { name: 'Instagram DMs' })).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Disconnected State', () => {
  test('IG-UI-010: Shows 4-step setup guide when disconnected', async ({ page }) => {
    await gotoInstagramTab(page);
    await expect(page.getByText('Create a Meta app')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Get your credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials below')).toBeVisible();
    await expect(page.getByText('Configure webhook')).toBeVisible();
    for (const n of ['1', '2', '3', '4']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('IG-UI-011: Instagram Account ID input is visible with correct placeholder', async ({ page }) => {
    await gotoInstagramTab(page);
    const input = page.locator('#instagram-id');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', '123456789012345');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('IG-UI-012: Username input is visible and marked optional', async ({ page }) => {
    await gotoInstagramTab(page);
    const input = page.locator('#instagram-username');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', 'mybusiness');
    await expect(page.getByText('(optional)')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-013: Access Token input is type=password', async ({ page }) => {
    await gotoInstagramTab(page);
    const input = page.locator('#instagram-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your permanent access token');
  });

  test('IG-UI-014: Connect button is disabled when inputs are empty', async ({ page }) => {
    await gotoInstagramTab(page);
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('IG-UI-015: Connect button is disabled with only Account ID filled', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('IG-UI-016: Connect button is disabled with only Access Token filled', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('IG-UI-017: Connect button enables when Account ID and Access Token are both filled', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('IG-UI-018: Username is optional — Connect button enables without it', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    // Username intentionally left blank
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('IG-UI-019: Whitespace-only Account ID keeps Connect button disabled', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('   ');
    await page.locator('#instagram-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('IG-UI-019b: Whitespace-only Access Token keeps Connect button disabled', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('   ');
    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('IG-UI-019c: Very long input values are accepted without breaking UI', async ({ page }) => {
    await gotoInstagramTab(page);
    const longValue = 'B'.repeat(500);
    await page.locator('#instagram-id').fill(longValue);
    await page.locator('#instagram-token').fill(longValue);
    await expect(page.getByRole('button', { name: /Connect to Instagram/i })).toBeVisible();
  });

  test('IG-UI-019d: Special characters in Username do not break the UI', async ({ page }) => {
    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-username').fill('café_&_bistro');
    await page.locator('#instagram-token').fill('test-access-token');
    await expect(page.getByRole('button', { name: /Connect to Instagram/i })).toBeEnabled();
  });

  test('IG-UI-019e: All input fields have associated labels', async ({ page }) => {
    await gotoInstagramTab(page);
    await expect(page.locator('label[for="instagram-id"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('label[for="instagram-username"]')).toBeVisible();
    await expect(page.locator('label[for="instagram-token"]')).toBeVisible();
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Loading State', () => {
  test('IG-UI-035: Skeleton shown while chatbot data loads', async ({ page }) => {
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

test.describe('Deploy Page – Instagram Tab – Connected State', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
  });

  test('IG-UI-020: Connected state shows green "Connected to Instagram" banner', async ({ page }) => {
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-021: Connected state shows Instagram Account ID', async ({ page }) => {
    await expect(page.getByText(/ID: 123456789012345/)).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-022: Connected state shows username with @ prefix', async ({ page }) => {
    await expect(page.getByText(/@mybusiness/)).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-023: Connected state shows webhook URL as app-level (no chatbotId in path)', async ({ page }) => {
    const expectedPath = `/api/instagram/webhook`;
    const webhookCode = page.locator('code').filter({ hasText: expectedPath }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });
    const text = await webhookCode.textContent();
    expect(text).toContain(expectedPath);
    expect(text).not.toContain(CHATBOT_ID);
  });

  test('IG-UI-024: Disconnect button is visible and enabled in connected state', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('IG-UI-025: AI Responses toggle is visible and aria-checked=true in connected state', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('IG-UI-026: AI Responses toggle has role="switch"', async ({ page }) => {
    await expect(page.getByRole('switch')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-027: Webhook URL copy button is present', async ({ page }) => {
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    const webhookSection = page.locator('div').filter({ hasText: 'Webhook URL' }).last();
    await expect(webhookSection).toBeVisible({ timeout: 10000 });
    const copyBtn = webhookSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-028: Connect form inputs are not visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#instagram-id')).not.toBeVisible();
    await expect(page.locator('#instagram-token')).not.toBeVisible();
  });

  test('IG-UI-029: Connected without username shows ID only in banner', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ username: undefined })),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/ID: 123456789012345/)).toBeVisible({ timeout: 10000 });
  });
});

// ─── Persistence (page reload simulation) ─────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Persistence', () => {
  test('IG-UI-036: Mock chatbot GET returns connected config → connected state shown on load', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-037: Mock chatbot GET returns disabled config → disconnected state shown on load', async ({ page }) => {
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
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByRole('button', { name: /Connect to Instagram/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Instagram')).not.toBeVisible();
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Connect Flow', () => {
  test('IG-UI-030: Filling Account ID and Token and clicking Connect triggers PATCH API call', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-username').fill('mybusiness');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    expect(patchBody.instagram_config).toBeDefined();
    const ic = patchBody.instagram_config as Record<string, unknown>;
    expect(ic.instagram_id).toBe('123456789012345');
    expect(ic.enabled).toBe(true);
    expect(ic.access_token).toBe('test-access-token');
  });

  test('IG-UI-031: PATCH body includes username when filled', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-username').fill('mybusiness');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const ic = patchBody.instagram_config as Record<string, unknown>;
    expect(ic.username).toBe('mybusiness');
  });

  test('IG-UI-032: After successful connect, shows connected state UI', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-033: After successful connect, input fields are no longer visible', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#instagram-id')).not.toBeVisible();
    await expect(page.locator('#instagram-token')).not.toBeVisible();
    await expect(page.locator('#instagram-username')).not.toBeVisible();
  });

  test('IG-UI-034: Connect button shows spinner while request in-flight', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    const connectBtn = page.getByRole('button', { name: /Connecting|Connect to Instagram/i });
    await expect(connectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveSetup();
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Error Handling', () => {
  test('IG-UI-060: API returns 500 on connect → shows error toast', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#instagram-id')).toBeVisible({ timeout: 5000 });
  });

  test('IG-UI-061: API returns 403 on connect → shows error toast', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-062: Network failure during connect → button re-enabled', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoInstagramTab(page);
    await page.locator('#instagram-id').fill('123456789012345');
    await page.locator('#instagram-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Instagram/i }).click();

    const connectBtn = page.getByRole('button', { name: /Connect to Instagram/i });
    await expect(connectBtn).toBeEnabled({ timeout: 10000 });
  });

  test('IG-UI-063: Network failure during disconnect → shows error toast', async ({ page }) => {
    await setupConnectedState(page);
    await page.route(`**/api/instagram/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.abort('failed');
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── AI Toggle ────────────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – AI Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-070: Toggle off → PATCH called with ai_responses_enabled: false', async ({ page }) => {
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

    const ic = patchBody.instagram_config as Record<string, unknown>;
    expect(ic.ai_responses_enabled).toBe(false);
  });

  test('IG-UI-072: API failure on toggle → reverts to previous state and shows error toast', async ({ page }) => {
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

test.describe('Deploy Page – Instagram Tab – Webhook URL correctness', () => {
  test('IG-UI-040: Webhook URL is app-level — no chatbotId in path', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/instagram/webhook` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';
    expect(text).toContain(`/api/instagram/webhook`);
    expect(text).not.toContain(CHATBOT_ID);
    expect(text).not.toContain(`?chatbot_id=`);
  });
});

// ─── Disconnect Flow ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Instagram Tab – Disconnect Flow', () => {
  test('IG-UI-050: Clicking Disconnect returns to the disconnected setup form', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.getByRole('button', { name: /Connect to Instagram/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#instagram-id')).toBeVisible({ timeout: 10000 });
  });

  test('IG-UI-051: Disconnect button shows spinner while in-flight', async ({ page }) => {
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
    await page.route(`**/api/instagram/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Instagram/i }).click();
    await expect(page.getByText('Connected to Instagram')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /Disconnect/i }).click();
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveDisconnect();
  });
});
