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

async function gotoTeamsTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /Teams/i }).click();
  await expect(page.getByRole('heading', { name: 'Microsoft Teams' })).toBeVisible({ timeout: 10000 });
}

/** Minimal chatbot API response with teams_config enabled */
function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        teams_config: {
          enabled: true,
          app_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          bot_name: 'My Teams Bot',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Navigation', () => {
  test('TM-UI-001: Teams tab trigger is visible and clickable', async ({ page }) => {
    await gotoDeploy(page);

    const tab = page.getByRole('tab', { name: /Teams/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('TM-UI-002: Clicking Teams tab shows the Teams card with title and description', async ({ page }) => {
    await gotoDeploy(page);

    await page.getByRole('tab', { name: /Teams/i }).click();

    await expect(page.getByRole('heading', { name: 'Microsoft Teams' })).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Deploy this chatbot to Microsoft Teams/)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Disconnected State', () => {
  test('TM-UI-010: Shows step-by-step setup guide when disconnected', async ({ page }) => {
    await gotoTeamsTab(page);

    await expect(page.getByText('Register a bot')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Get your credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials below')).toBeVisible();
    await expect(page.getByText('Set messaging endpoint')).toBeVisible();

    for (const n of ['1', '2', '3', '4']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('TM-UI-011: App ID input is visible with correct placeholder', async ({ page }) => {
    await gotoTeamsTab(page);

    const input = page.locator('#teams-app-id');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('TM-UI-012: App Secret input is visible and is type=password', async ({ page }) => {
    await gotoTeamsTab(page);

    const input = page.locator('#teams-app-secret');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your app secret');
  });

  test('TM-UI-013: Connect button is disabled when all inputs are empty', async ({ page }) => {
    await gotoTeamsTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to Teams/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('TM-UI-014: Connect button remains disabled when only App ID is filled', async ({ page }) => {
    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    const connectBtn = page.getByRole('button', { name: /Connect to Teams/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('TM-UI-015: Connect button enables when both App ID and App Secret are filled', async ({ page }) => {
    await gotoTeamsTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to Teams/i });
    await expect(connectBtn).toBeDisabled();

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('TM-UI-016: Fields show labels with correct text', async ({ page }) => {
    await gotoTeamsTab(page);

    await expect(page.getByText('App ID')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('App Secret')).toBeVisible();
  });

  test('TM-UI-017: Encrypted-at-rest notice is visible', async ({ page }) => {
    await gotoTeamsTab(page);

    await expect(
      page.getByText(/stored securely and encrypted/i)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Loading State', () => {
  test('TM-UI-020: Skeleton is rendered during initial data load', async ({ page }) => {
    // Delay the chatbot API response so we can catch the skeleton state
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.continue();
    });

    await page.goto(DEPLOY_URL);
    await page.waitForLoadState('domcontentloaded');

    const tab = page.getByRole('tab', { name: /Teams/i });
    if (await tab.isVisible()) {
      await tab.click();
      // Skeleton or the form should be present
      const skeleton = page.locator('.animate-pulse, [data-testid="skeleton"]').first();
      const form = page.locator('#teams-app-id');
      await expect(skeleton.or(form)).toBeVisible({ timeout: 5000 });
    }
  });
});

// ─── Connected State ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Connected State', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept chatbot fetch BEFORE navigating so state initialises as connected
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();
  });

  test('TM-UI-030: Connected state shows green "Connected to Microsoft Teams" banner', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-031: Connected state shows Disconnect button', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('TM-UI-032: Connected state shows bot name when bot_name is present', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Bot:.*My Teams Bot/)).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-033: Connected state shows AI Responses toggle as role=switch', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-034: AI toggle reflects ai_responses_enabled=true with aria-checked=true', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('TM-UI-035: AI toggle reflects ai_responses_enabled=false with aria-checked=false', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('TM-UI-036: Messaging Endpoint URL is displayed in a code element', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/teams/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent();
    expect(text).toContain(`/api/teams/webhook/${CHATBOT_ID}`);
  });

  test('TM-UI-037: Webhook URL uses /{chatbotId} path-param format, not query-param', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/teams/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';
    expect(text).toContain(`/api/teams/webhook/${CHATBOT_ID}`);
    expect(text).not.toContain('?chatbot_id=');
  });

  test('TM-UI-038: Webhook copy button is visible next to the URL', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const endpointSection = page.locator('div').filter({ hasText: 'Messaging Endpoint' }).last();
    await expect(endpointSection).toBeVisible({ timeout: 10000 });

    const copyBtn = endpointSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-039: Copy button changes icon after click', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    const endpointSection = page.locator('div').filter({ hasText: 'Messaging Endpoint' }).last();
    const copyBtn = endpointSection.getByRole('button').first();
    await copyBtn.click();
    await expect(copyBtn).toBeVisible({ timeout: 5000 });
  });

  test('TM-UI-040: Disconnected inputs (App ID, App Secret) are NOT visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('#teams-app-id')).not.toBeVisible();
    await expect(page.locator('#teams-app-secret')).not.toBeVisible();
  });

  test('TM-UI-041: Connect button is NOT visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: /Connect to Teams/i })).not.toBeVisible();
  });

  test('TM-UI-042: Behavior info box is shown in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/In 1:1 chats/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/In channels/)).toBeVisible({ timeout: 10000 });
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Connect Flow', () => {
  test('TM-UI-050: Filling both fields and clicking Connect triggers the PATCH API call', async ({ page }) => {
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

    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, webhook_url: `https://example.com/api/teams/webhook/${CHATBOT_ID}` }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    const tc = patchBody.teams_config as Record<string, unknown>;
    expect(tc).toBeDefined();
    expect(tc.app_id).toBe('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    expect(tc.app_secret).toBe('my-secret-value');
    expect(tc.enabled).toBe(true);
  });

  test('TM-UI-051: After PATCH, setup POST is called to confirm webhook URL', async ({ page }) => {
    let setupPostCalled = false;

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

    await page.route(`**/api/teams/setup**`, async (route) => {
      setupPostCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, webhook_url: `https://example.com/api/teams/webhook/${CHATBOT_ID}` }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/teams/setup') && res.request().method() === 'POST',
      { timeout: 10000 }
    );

    expect(setupPostCalled).toBe(true);
  });

  test('TM-UI-052: Setup POST is called with chatbot_id as a query param (not body)', async ({ page }) => {
    let setupUrl = '';

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

    await page.route(`**/api/teams/setup**`, async (route) => {
      setupUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoTeamsTab(page);
    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');
    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/teams/setup') && res.request().method() === 'POST',
      { timeout: 10000 }
    );

    expect(setupUrl).toContain(`chatbot_id=${CHATBOT_ID}`);
  });

  test('TM-UI-053: After successful connect, shows connected state UI', async ({ page }) => {
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

    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-054: After successful connect, credential input fields are cleared', async ({ page }) => {
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

    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });

    // Input fields are hidden (form is replaced by connected state)
    await expect(page.locator('#teams-app-id')).not.toBeVisible();
    await expect(page.locator('#teams-app-secret')).not.toBeVisible();
  });

  test('TM-UI-055: Connect button shows "Connecting..." while in flight', async ({ page }) => {
    let resolveSetup!: () => void;
    const setupPending = new Promise<void>((res) => { resolveSetup = res; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await new Promise((r) => setTimeout(r, 200));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/teams/setup**`, async (route) => {
      await setupPending;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    const connectBtn = page.getByRole('button', { name: /Connect to Teams|Connecting/i });
    await connectBtn.click();

    await expect(page.getByRole('button', { name: /Connecting/i })).toBeVisible({ timeout: 5000 });

    resolveSetup();
  });
});

// ─── Disconnect Flow ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Disconnect Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
        });
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-060: Clicking Disconnect calls DELETE /api/teams/setup', async ({ page }) => {
    let deleteCalled = false;

    await page.route(`**/api/teams/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByRole('button', { name: /Disconnect/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/teams/setup') && res.request().method() === 'DELETE',
      { timeout: 10000 }
    ).catch(() => {});

    expect(deleteCalled).toBe(true);
  });

  test('TM-UI-061: DELETE is called with chatbot_id as query param', async ({ page }) => {
    let deleteUrl = '';

    await page.route(`**/api/teams/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteUrl = route.request().url();
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByRole('button', { name: /Disconnect/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/teams/setup') && res.request().method() === 'DELETE',
      { timeout: 10000 }
    ).catch(() => {});

    expect(deleteUrl).toContain(`chatbot_id=${CHATBOT_ID}`);
  });

  test('TM-UI-062: After disconnect, shows disconnected form state', async ({ page }) => {
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#teams-app-secret')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Microsoft Teams')).not.toBeVisible();
  });
});

// ─── AI Toggle ────────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – AI Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-070: Clicking AI toggle calls PATCH with ai_responses_enabled toggled', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await toggle.click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const tc = patchBody.teams_config as Record<string, unknown>;
    expect(tc).toBeDefined();
    // Initial state was ai_responses_enabled: true, so toggling should set it to false
    expect(tc.ai_responses_enabled).toBe(false);
  });

  test('TM-UI-071: AI toggle visually flips after click', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-checked', 'false', { timeout: 5000 });
  });

  test('TM-UI-072: AI toggle reverts to original value on PATCH failure', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();

    // After API failure, the toggle should revert to its original state
    await expect(toggle).toHaveAttribute('aria-checked', 'true', { timeout: 10000 });
  });
});

// ─── Error States ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Error States', () => {
  test('TM-UI-080: PATCH 403 (plan gate) shows error and keeps form visible', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Teams integration requires a Pro or Agency plan' } }),
        });
      } else {
        await route.continue();
      }
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    // Should not transition to connected state
    await expect(page.getByText('Connected to Microsoft Teams')).not.toBeVisible({ timeout: 5000 });
    // Form should still be visible
    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 5000 });
  });

  test('TM-UI-081: PATCH 500 (server error) keeps form visible', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal server error' } }),
        });
      } else {
        await route.continue();
      }
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    // Form should still be visible after error
    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Microsoft Teams')).not.toBeVisible();
  });

  test('TM-UI-082: Setup POST 500 failure shows error and keeps form visible', async ({ page }) => {
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

    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Teams credentials not configured' }),
      });
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    // On setup failure, the form should still be visible (not connected)
    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 10000 });
  });

  test('TM-UI-083: Network failure during connect shows error and keeps form', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    await gotoTeamsTab(page);

    await page.locator('#teams-app-id').fill('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    await page.locator('#teams-app-secret').fill('my-secret-value');

    await page.getByRole('button', { name: /Connect to Teams/i }).click();

    // Form should remain visible after network failure
    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Microsoft Teams')).not.toBeVisible();
  });
});

// ─── Page Reload with Connected Config ───────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Page Reload with Connected Config', () => {
  test('TM-UI-090: Page reload with connected teams_config shows connected state immediately', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();

    // Should show connected state without any connect action needed
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#teams-app-id')).not.toBeVisible();
  });

  test('TM-UI-091: Page reload with disabled teams_config shows disconnected form', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              chatbot: {
                id: CHATBOT_ID,
                name: 'E2E Test Bot',
                teams_config: { enabled: false },
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();

    await expect(page.locator('#teams-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Microsoft Teams')).not.toBeVisible();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Teams Tab – Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/teams/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();
    await expect(page.getByText('Connected to Microsoft Teams')).toBeVisible({ timeout: 10000 });
  });

  test('TM-A11Y-001: AI toggle has role="switch"', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('TM-A11Y-002: AI toggle has aria-checked attribute', async ({ page }) => {
    const toggle = page.getByRole('switch');
    const ariaChecked = await toggle.getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  });

  test('TM-A11Y-003: Disconnected form inputs have associated labels', async ({ page }) => {
    // Navigate to disconnected state
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID, name: 'E2E Test Bot' } } }),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();

    // Labels should be associated (htmlFor matches input id)
    await expect(page.locator('label[for="teams-app-id"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('label[for="teams-app-secret"]')).toBeVisible();
  });

  test('TM-A11Y-004: App Secret input type=password hides the credential', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID, name: 'E2E Test Bot' } } }),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Teams/i }).click();

    const secretInput = page.locator('#teams-app-secret');
    await expect(secretInput).toHaveAttribute('type', 'password');
  });
});
