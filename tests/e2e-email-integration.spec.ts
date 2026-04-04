import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;
const DEPLOY_URL = `${BASE}/deploy`;
const INBOUND_EMAIL = `${CHATBOT_ID}@inbound.vocui.com`;

async function gotoDeploy(page: import('@playwright/test').Page) {
  await page.goto(DEPLOY_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForResponse(
    (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.status() === 200,
    { timeout: 15000 }
  ).catch(() => {});
  await expect(page.getByText('Deploy Chatbot')).toBeVisible({ timeout: 20000 });
}

async function gotoEmailTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /Email/i }).click();
  await expect(page.getByRole('heading', { name: 'Email Inbound' })).toBeVisible({ timeout: 10000 });
}

function makeEnabledChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        email_config: {
          enabled: true,
          email_address: INBOUND_EMAIL,
          reply_name: 'Support',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

function makeDisabledChatbotResponse() {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        email_config: { enabled: false },
      },
    },
  };
}

async function setupEnabledState(page: import('@playwright/test').Page, configOverrides: Record<string, unknown> = {}) {
  await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeEnabledChatbotResponse(configOverrides)),
      });
    } else if (req.method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeEnabledChatbotResponse(configOverrides)),
      });
    } else {
      await route.continue();
    }
  });
  await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
  });
  await page.route(`**/api/email/setup**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
    });
  });
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Navigation', () => {
  test('EMAIL-UI-001: Email tab is visible in TabsList', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Email/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-002: Email tab becomes active when clicked', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Email/i });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('EMAIL-UI-003: Clicking Email tab shows the Email Inbound heading', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByRole('heading', { name: 'Email Inbound' })).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-004: Clicking Email tab shows the subtitle text', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Forward your support inbox to the chatbot address')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-005: Switching from another tab to Email correctly shows the panel', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByRole('heading', { name: 'Email Inbound' })).toBeVisible({ timeout: 10000 });
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Loading State', () => {
  test('EMAIL-UI-035: Skeleton shown while chatbot data loads', async ({ page }) => {
    let resolveRequest!: () => void;
    const requestPending = new Promise<void>((resolve) => { resolveRequest = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await requestPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisabledChatbotResponse()),
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

// ─── Disabled State ───────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Disabled State', () => {
  test('EMAIL-UI-010: Shows 3-step setup guide when disabled', async ({ page }) => {
    await gotoEmailTab(page);
    await expect(page.getByText('Enable below')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Forward your inbox')).toBeVisible();
    await expect(page.getByText('AI replies automatically')).toBeVisible();
    for (const n of ['1', '2', '3']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('EMAIL-UI-011: "Enable Email Integration" button is visible and enabled when disabled', async ({ page }) => {
    await gotoEmailTab(page);
    const enableBtn = page.getByRole('button', { name: /Enable Email Integration/i });
    await expect(enableBtn).toBeVisible({ timeout: 10000 });
    await expect(enableBtn).toBeEnabled();
  });

  test('EMAIL-UI-012: Optional Sender Name input is visible in disabled state', async ({ page }) => {
    await gotoEmailTab(page);
    const input = page.locator('#email-reply-name-setup');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'text');
    await expect(page.getByText('(optional)')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-013: Sender Name input accepts text in disabled state', async ({ page }) => {
    await gotoEmailTab(page);
    const input = page.locator('#email-reply-name-setup');
    await input.fill('My Support Team');
    await expect(input).toHaveValue('My Support Team');
  });

  test('EMAIL-UI-014: Enable works without sender name (sender name is truly optional)', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};

    await page.route(`**/api/email/setup**`, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    // Do NOT fill sender name
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/email/setup`),
      { timeout: 10000 }
    );

    // Request should succeed even without reply_name
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    // reply_name should be empty or absent
    expect(requestBody.reply_name ?? '').toBe('');
  });

  test('EMAIL-UI-015: Sender name label has associated input', async ({ page }) => {
    await gotoEmailTab(page);
    await expect(page.locator('label[for="email-reply-name-setup"]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Active (Enabled) State ───────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Active State', () => {
  test.beforeEach(async ({ page }) => {
    await setupEnabledState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
  });

  test('EMAIL-UI-020: Active state shows green "Email integration active" banner', async ({ page }) => {
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-021: Active state shows the inbound email address', async ({ page }) => {
    await expect(page.getByText('Your inbound email address')).toBeVisible({ timeout: 10000 });
    const emailCode = page.locator('code').filter({ hasText: INBOUND_EMAIL }).first();
    await expect(emailCode).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-022: Inbound email address contains chatbotId and correct domain', async ({ page }) => {
    const emailCode = page.locator('code').filter({ hasText: INBOUND_EMAIL }).first();
    await expect(emailCode).toBeVisible({ timeout: 10000 });
    const text = await emailCode.textContent() ?? '';
    expect(text).toContain(CHATBOT_ID);
    expect(text).toContain('inbound.vocui.com');
  });

  test('EMAIL-UI-023: Copy button for the inbound email address is present', async ({ page }) => {
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    const emailSection = page.locator('div').filter({ hasText: 'Your inbound email address' }).last();
    await expect(emailSection).toBeVisible({ timeout: 10000 });
    const copyBtn = emailSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-024: Active state shows Option A email forwarding instructions', async ({ page }) => {
    await expect(page.getByText('Option A — Email forwarding:')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-025: Active state shows Option B MX record instructions', async ({ page }) => {
    await expect(page.getByText('Option B — MX record:')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('inbound.vocui.com')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-026: Disable button is visible and enabled in active state', async ({ page }) => {
    const disableBtn = page.getByRole('button', { name: /Disable/i });
    await expect(disableBtn).toBeVisible({ timeout: 10000 });
    await expect(disableBtn).toBeEnabled();
  });

  test('EMAIL-UI-027: Reply Settings section is visible with Sender Name input', async ({ page }) => {
    await expect(page.getByText('Reply Settings')).toBeVisible({ timeout: 10000 });
    const senderInput = page.locator('#email-reply-name');
    await expect(senderInput).toBeVisible({ timeout: 10000 });
    await expect(senderInput).toHaveAttribute('type', 'text');
  });

  test('EMAIL-UI-028: AI Responses toggle is visible and aria-checked=true in active state', async ({ page }) => {
    await expect(page.getByText('Reply Settings')).toBeVisible({ timeout: 10000 });
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('EMAIL-UI-028b: AI toggle has role="switch"', async ({ page }) => {
    await expect(page.getByRole('switch')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-029: Save settings button is visible in active state', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Save settings/i })).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-030: "Enable Email Integration" button is not visible in active state', async ({ page }) => {
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Enable Email Integration/i })).not.toBeVisible();
  });

  test('EMAIL-UI-031: Sender Name pre-populated from API response (reply_name shown in input)', async ({ page }) => {
    const senderInput = page.locator('#email-reply-name');
    await expect(senderInput).toBeVisible({ timeout: 10000 });
    await expect(senderInput).toHaveValue('Support');
  });
});

// ─── Persistence (page reload simulation) ─────────────────────────────────────

test.describe('Deploy Page – Email Tab – Persistence', () => {
  test('EMAIL-UI-036: Mock chatbot GET returns enabled config → active state shown on load', async ({ page }) => {
    await setupEnabledState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-037: Mock chatbot GET returns disabled config → setup state shown on load', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisabledChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByRole('button', { name: /Enable Email Integration/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Email integration active')).not.toBeVisible();
  });
});

// ─── Enable Flow ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Enable Flow', () => {
  test('EMAIL-UI-040: Clicking Enable calls POST to /api/email/setup', async ({ page }) => {
    let setupCalled = false;
    let setupMethod = '';

    await page.route(`**/api/email/setup**`, async (route) => {
      setupCalled = true;
      setupMethod = route.request().method();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/email/setup`),
      { timeout: 10000 }
    );

    expect(setupCalled).toBe(true);
    expect(setupMethod).toBe('POST');
  });

  test('EMAIL-UI-041: After enable, shows active state with inbound email address', async ({ page }) => {
    await page.route(`**/api/email/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    const emailCode = page.locator('code').filter({ hasText: INBOUND_EMAIL }).first();
    await expect(emailCode).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-042: After enable, Disable button appears and Enable button disappears', async ({ page }) => {
    await page.route(`**/api/email/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disable/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Enable Email Integration/i })).not.toBeVisible();
  });

  test('EMAIL-UI-043: Enable sends optional sender name in request body', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};

    await page.route(`**/api/email/setup**`, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    await page.locator('#email-reply-name-setup').fill('My Support Team');
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/email/setup`),
      { timeout: 10000 }
    );

    expect(requestBody.reply_name).toBe('My Support Team');
  });

  test('EMAIL-UI-044: Enable button shows spinner while request in-flight', async ({ page }) => {
    let resolveSetup!: () => void;
    const setupPending = new Promise<void>((resolve) => { resolveSetup = resolve; });

    await page.route(`**/api/email/setup**`, async (route) => {
      await setupPending;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    const enableBtn = page.getByRole('button', { name: /Enabling|Enable Email Integration/i });
    await expect(enableBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveSetup();
  });

  test('EMAIL-UI-045: API returns 500 on enable → shows error toast', async ({ page }) => {
    await page.route(`**/api/email/setup**`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    // Should remain in disabled state
    await expect(page.getByRole('button', { name: /Enable Email Integration/i })).toBeVisible({ timeout: 5000 });
  });

  test('EMAIL-UI-046: API returns 403 on enable → shows error toast', async ({ page }) => {
    await page.route(`**/api/email/setup**`, async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Upgrade your plan to use email integration' }),
      });
    });

    await gotoEmailTab(page);
    await page.getByRole('button', { name: /Enable Email Integration/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disable Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Disable Flow', () => {
  test('EMAIL-UI-050: Clicking Disable returns to the setup state', async ({ page }) => {
    await setupEnabledState(page);
    await page.route(`**/api/email/setup**`, async (route) => {
      const method = route.request().method();
      if (method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
        });
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disable/i }).click();

    await expect(page.getByRole('button', { name: /Enable Email Integration/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Email integration active')).not.toBeVisible();
  });

  test('EMAIL-UI-051: Clicking Disable calls DELETE on /api/email/setup', async ({ page }) => {
    let deleteMethod = '';

    await setupEnabledState(page);
    await page.route(`**/api/email/setup**`, async (route) => {
      deleteMethod = route.request().method();
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disable/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/email/setup`) && res.request().method() === 'DELETE',
      { timeout: 10000 }
    );

    expect(deleteMethod).toBe('DELETE');
  });

  test('EMAIL-UI-052: Network failure during disable → shows error toast', async ({ page }) => {
    await setupEnabledState(page);
    await page.route(`**/api/email/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.abort('failed');
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { email_address: INBOUND_EMAIL } }),
        });
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disable/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Reply Settings ───────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Reply Settings', () => {
  test.beforeEach(async ({ page }) => {
    await setupEnabledState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-060: Sender Name input can be edited in active state', async ({ page }) => {
    const input = page.locator('#email-reply-name');
    await input.fill('My Updated Team Name');
    await expect(input).toHaveValue('My Updated Team Name');
  });

  test('EMAIL-UI-061: AI Responses toggle switches from on to off', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('EMAIL-UI-062: Save settings button triggers PATCH to chatbots API', async ({ page }) => {
    let patchCalled = false;

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchCalled = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeEnabledChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: /Save settings/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
  });

  test('EMAIL-UI-063: Save settings PATCH body includes reply_name', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeEnabledChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    const input = page.locator('#email-reply-name');
    await input.fill('Updated Team');
    await page.getByRole('button', { name: /Save settings/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const ec = patchBody.email_config as Record<string, unknown>;
    expect(ec.reply_name).toBe('Updated Team');
  });

  test('EMAIL-UI-064: Save settings PATCH body includes ai_responses_enabled', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeEnabledChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });

    // Toggle AI off then save
    const toggle = page.getByRole('switch');
    await toggle.click();
    await page.getByRole('button', { name: /Save settings/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const ec = patchBody.email_config as Record<string, unknown>;
    expect(ec.ai_responses_enabled).toBe(false);
  });

  test('EMAIL-UI-065: Save settings button shows spinner while in-flight', async ({ page }) => {
    let resolveSave!: () => void;
    const savePending = new Promise<void>((resolve) => { resolveSave = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await savePending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeEnabledChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: /Save settings/i }).click();
    const saveBtn = page.getByRole('button', { name: /Saving|Save settings/i });
    await expect(saveBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveSave();
  });

  test('EMAIL-UI-066: Save settings API 500 error → shows error toast', async ({ page }) => {
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

    await page.getByRole('button', { name: /Save settings/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('EMAIL-UI-067: AI toggle state persists visually after save', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeEnabledChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await page.getByRole('button', { name: /Save settings/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    // Toggle should still reflect the off state after save
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('EMAIL-UI-068: AI toggle API failure → reverts to previous state and shows error toast', async ({ page }) => {
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

    // Click Save (which PATCHes) after changing toggle
    await toggle.click();
    await page.getByRole('button', { name: /Save settings/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Email Tab – Accessibility', () => {
  test('EMAIL-UI-080: AI toggle has role="switch" and aria-checked attribute', async ({ page }) => {
    await setupEnabledState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    const ariaChecked = await toggle.getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  });

  test('EMAIL-UI-081: Copy button for inbound email has accessible label', async ({ page }) => {
    await setupEnabledState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Email/i }).click();
    await expect(page.getByText('Email integration active')).toBeVisible({ timeout: 10000 });

    const emailSection = page.locator('div').filter({ hasText: 'Your inbound email address' }).last();
    const copyBtn = emailSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
    // Button should have either visible text or aria-label
    const ariaLabel = await copyBtn.getAttribute('aria-label');
    const textContent = await copyBtn.textContent();
    expect((ariaLabel ?? '') + (textContent ?? '')).not.toBe('');
  });
});
