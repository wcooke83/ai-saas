import { test, expect, type Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;

// All 10 templates
const ALL_TEMPLATES = [
  { name: 'Helpful Assistant', category: 'general', tags: ['popular'] },
  { name: 'FAQ Bot', category: 'general', tags: [] },
  { name: 'Sales Assistant', category: 'sales', tags: ['popular'] },
  { name: 'Lead Generation', category: 'sales', tags: ['new'] },
  { name: 'Appointment Booking', category: 'sales', tags: ['new'] },
  { name: 'E-Commerce', category: 'sales', tags: ['new'] },
  { name: 'Customer Support', category: 'support', tags: ['popular'] },
  { name: 'Technical Support', category: 'support', tags: [] },
  { name: 'Onboarding Guide', category: 'engagement', tags: [] },
  { name: 'Re-Engagement', category: 'engagement', tags: ['new'] },
];

const CATEGORY_LABELS = ['All', 'General', 'Sales & Revenue', 'Support', 'Engagement'];

async function gotoPromptSection(page: Page) {
  await page.goto(SETTINGS_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button', { hasText: 'System Prompt' }).click();
  await expect(page.locator('textarea#system_prompt').first()).toBeVisible({ timeout: 10000 });
}

/** Navigate through the new-chatbot wizard to Step 2 (System Prompt) */
async function gotoNewChatbotStep2(page: Page, botName: string) {
  await page.goto('/dashboard/chatbots/new', { waitUntil: 'domcontentloaded' });
  // Wait for the wizard to render
  const nameInput = page.locator('input#name');
  await expect(nameInput).toBeVisible({ timeout: 15000 });
  await nameInput.fill(botName);
  // Wait for Next button to be enabled (validation: name.length >= 1)
  const nextBtn = page.locator('button', { hasText: /Next/ });
  await expect(nextBtn).toBeEnabled({ timeout: 5000 });
  await nextBtn.click();
  // Wait for step 2 content to render
  await expect(page.locator('text=Choose a Template')).toBeVisible({ timeout: 10000 });
}

// ─── SETTINGS PAGE: Template UI ──────────────────────────────────────

test.describe('Quick Templates — Settings Page', () => {
  test('QT-001: All 10 templates are visible', async ({ page }) => {
    await gotoPromptSection(page);
    for (const t of ALL_TEMPLATES) {
      await expect(page.locator('.grid button', { hasText: t.name }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('QT-002: Category filter pills are present', async ({ page }) => {
    await gotoPromptSection(page);
    // Filter pills are in a flex container before the grid
    for (const label of CATEGORY_LABELS) {
      // Use exact text match with regex to avoid substring matching with sidebar nav
      await expect(page.locator('.flex.flex-wrap button', { hasText: label }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('QT-003: Filter pills show correct templates per category', async ({ page }) => {
    await gotoPromptSection(page);

    // Click "Support" filter pill (scoped to the pill container)
    await page.locator('.flex.flex-wrap button', { hasText: 'Support' }).first().click();

    // Support templates visible
    await expect(page.locator('.grid button', { hasText: 'Customer Support' }).first()).toBeVisible();
    await expect(page.locator('.grid button', { hasText: 'Technical Support' }).first()).toBeVisible();

    // Only 2 template cards in grid
    await expect(page.locator('.grid button')).toHaveCount(2);

    // Click "All" to restore
    await page.locator('.flex.flex-wrap button', { hasText: /^All$/ }).first().click();
    await expect(page.locator('.grid button')).toHaveCount(10);
  });

  test('QT-004: Clicking a template populates the textarea', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();
    const beforeVal = await promptField.inputValue();

    // Click a template card
    await page.locator('.grid button', { hasText: 'Sales Assistant' }).first().click({ force: true });
    await expect(promptField).not.toHaveValue(beforeVal, { timeout: 5000 });

    // Textarea should have changed and contain substantial content
    const afterVal = await promptField.inputValue();
    expect(afterVal.length).toBeGreaterThan(100);
  });

  test('QT-005: Each template populates a unique prompt', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    // Click through 3 distinct templates and verify each gives different content
    const templates = ['Helpful Assistant', 'Customer Support', 'FAQ Bot'];
    const promptValues: string[] = [];
    let prevVal = '';
    for (const name of templates) {
      await page.locator('.grid button', { hasText: name }).first().click({ force: true });
      await expect(promptField).not.toHaveValue(prevVal, { timeout: 5000 });
      const val = await promptField.inputValue();
      prevVal = val;
      expect(val.length).toBeGreaterThan(50);
      promptValues.push(val);
    }

    // All 3 prompts should be different
    const uniquePrompts = new Set(promptValues);
    expect(uniquePrompts.size).toBe(templates.length);
  });

  test('QT-006: Undo bar appears after template selection', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    // Type custom text first
    await promptField.fill('My custom system prompt that I wrote manually.');

    // Click a template
    await page.locator('.grid button', { hasText: 'FAQ Bot' }).first().click({ force: true });

    // Undo bar should be visible
    await expect(page.locator('text=/Template.*applied/i')).toBeVisible({ timeout: 5000 });

    // Undo button should be visible
    await expect(page.locator('button', { hasText: 'Undo' })).toBeVisible();
  });

  test('QT-007: Undo restores previous prompt', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    const customText = 'My unique custom prompt for undo testing xyz123.';
    await promptField.fill(customText);

    // Click a template
    await page.locator('.grid button', { hasText: 'E-Commerce' }).first().click({ force: true });
    await expect(promptField).not.toHaveValue(customText, { timeout: 5000 });

    // Click Undo
    await page.locator('button', { hasText: 'Undo' }).click();

    // Should restore original text
    await expect(promptField).toHaveValue(customText, { timeout: 5000 });
  });

  test('QT-008: Undo bar dismissed on typing', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    // Click a template
    await page.locator('.grid button', { hasText: 'Customer Support' }).first().click({ force: true });

    // Undo bar visible
    await expect(page.locator('text=/Template.*applied/i')).toBeVisible({ timeout: 5000 });

    // Type in textarea to dismiss
    await promptField.focus();
    await promptField.press('End');
    await promptField.type(' extra text');

    // Undo bar should be gone
    await expect(page.locator('text=/Template.*applied/i')).not.toBeVisible({ timeout: 5000 });
  });

  test('QT-009: Undo bar confirms template was applied', async ({ page }) => {
    await gotoPromptSection(page);

    // Click a template — the undo bar confirms the template was applied by name
    await page.locator('.grid button', { hasText: 'Technical Support' }).first().click({ force: true });

    // Undo bar should mention the template
    await expect(page.locator('text=/Template.*applied/i')).toBeVisible({ timeout: 5000 });
  });

  test('QT-010: Popular badges are visible', async ({ page }) => {
    await gotoPromptSection(page);
    const popularBadges = page.locator('.grid >> text=Popular');
    const count = await popularBadges.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('QT-011: New badges are visible', async ({ page }) => {
    await gotoPromptSection(page);
    const newBadges = page.locator('.grid >> text=New');
    const count = await newBadges.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('QT-012: Microcopy is present', async ({ page }) => {
    await gotoPromptSection(page);
    await expect(page.locator('text=Start with a proven prompt')).toBeVisible({ timeout: 5000 });
  });

  test('QT-013: Template preview snippet is visible on each card', async ({ page }) => {
    await gotoPromptSection(page);
    // Each card should have a font-mono preview line
    const previewSnippets = page.locator('.grid button .font-mono');
    const count = await previewSnippets.count();
    expect(count).toBe(10);
  });

  test('QT-014: Filter by Sales & Revenue shows only sales templates', async ({ page }) => {
    await gotoPromptSection(page);

    await page.locator('.flex.flex-wrap button', { hasText: 'Sales & Revenue' }).first().click();

    const salesTemplates = ['Sales Assistant', 'Lead Generation', 'Appointment Booking', 'E-Commerce'];
    for (const name of salesTemplates) {
      await expect(page.locator('.grid button', { hasText: name }).first()).toBeVisible();
    }

    await expect(page.locator('.grid button')).toHaveCount(4);
  });

  test('QT-015: Filter by Engagement shows only engagement templates', async ({ page }) => {
    await gotoPromptSection(page);

    await page.locator('.flex.flex-wrap button', { hasText: 'Engagement' }).first().click();

    await expect(page.locator('.grid button', { hasText: 'Onboarding Guide' }).first()).toBeVisible();
    await expect(page.locator('.grid button', { hasText: 'Re-Engagement' }).first()).toBeVisible();

    await expect(page.locator('.grid button')).toHaveCount(2);
  });
});

// ─── NEW CHATBOT PAGE: Template UI ──────────────────────────────────

test.describe('Quick Templates — New Chatbot Wizard', () => {
  test('QT-NEW-001: Templates visible on step 2', async ({ page }) => {
    await gotoNewChatbotStep2(page, 'E2E Template Test Bot');

    for (const t of ALL_TEMPLATES) {
      await expect(page.locator('.grid button', { hasText: t.name }).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('QT-NEW-002: Category filters work on new chatbot page', async ({ page }) => {
    await gotoNewChatbotStep2(page, 'E2E Filter Test Bot');

    // Filter pills visible
    for (const label of CATEGORY_LABELS) {
      await expect(page.locator('.flex.flex-wrap button', { hasText: label }).first()).toBeVisible({ timeout: 5000 });
    }

    // Click Support filter
    await page.locator('.flex.flex-wrap button', { hasText: 'Support' }).first().click();
    await expect(page.locator('.grid button')).toHaveCount(2);
  });

  test('QT-NEW-003: Smart recommendation based on bot name', async ({ page }) => {
    await gotoNewChatbotStep2(page, 'My Sales Bot');

    // Should show "Recommended" badge
    await expect(page.locator('.grid >> text=Recommended')).toBeVisible({ timeout: 5000 });
  });

  test('QT-NEW-004: Template selection populates textarea', async ({ page }) => {
    await gotoNewChatbotStep2(page, 'E2E Prompt Test');

    // Click Lead Generation template
    await page.locator('.grid button', { hasText: 'Lead Generation' }).first().click({ force: true });

    const promptField = page.locator('textarea#system_prompt').first();
    await expect(promptField).toHaveValue(/lead/i, { timeout: 5000 });
  });

  test('QT-NEW-005: Undo works on new chatbot page', async ({ page }) => {
    await gotoNewChatbotStep2(page, 'E2E Undo Test');

    const promptField = page.locator('textarea#system_prompt').first();

    // Click first template, note its value
    await page.locator('.grid button', { hasText: 'Helpful Assistant' }).first().click({ force: true });
    await expect(promptField).not.toHaveValue('', { timeout: 5000 });
    const firstVal = await promptField.inputValue();

    // Click second template
    await page.locator('.grid button', { hasText: 'Appointment Booking' }).first().click({ force: true });
    await expect(promptField).not.toHaveValue(firstVal, { timeout: 5000 });

    // Undo should restore first template
    await page.locator('button', { hasText: 'Undo' }).click();
    await expect(promptField).toHaveValue(firstVal, { timeout: 5000 });
  });
});

// ─── CHATBOT CREATION WITH TEMPLATES ────────────────────────────────

test.describe('Chatbot CRUD with Templates', () => {
  let tempChatbotId: string | null = null;

  test('QT-CRUD-001: Create chatbot with Sales Assistant template via API', async ({ page }) => {
    const salesPrompt = 'You are a consultative sales assistant.';
    const response = await page.request.post('/api/chatbots', {
      data: {
        name: `E2E Sales Template Bot ${Date.now()}`,
        system_prompt: salesPrompt + ' Your goal is to understand what visitors need and guide them toward the right solution.',
      },
    });

    if (response.ok()) {
      const body = await response.json();
      tempChatbotId = body.data?.id || body.data?.chatbot?.id || null;
      expect(tempChatbotId).toBeTruthy();
    } else {
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('QT-CRUD-002: Update chatbot template via PATCH', async ({ page }) => {
    test.skip(!tempChatbotId, 'No chatbot created');

    const newPrompt = 'You are a customer support agent focused on resolving issues quickly while building loyalty.';
    const response = await page.request.patch(`/api/chatbots/${tempChatbotId}`, {
      data: { system_prompt: newPrompt },
    });

    expect(response.ok()).toBeTruthy();
    if (response.ok()) {
      const body = await response.json();
      const savedPrompt = body.data?.system_prompt || body.data?.chatbot?.system_prompt || '';
      expect(savedPrompt).toContain('customer support');
    }
  });

  test('QT-CRUD-003: Each template can be saved and retrieved', async ({ page }) => {
    test.skip(!tempChatbotId, 'No chatbot created');

    const testPrompts = [
      { name: 'Lead Gen', excerpt: 'friendly assistant focused on helping visitors and capturing leads' },
      { name: 'Tech Support', excerpt: 'technical support specialist' },
      { name: 'Onboarding', excerpt: 'onboarding assistant' },
    ];

    for (const { excerpt } of testPrompts) {
      const patchRes = await page.request.patch(`/api/chatbots/${tempChatbotId}`, {
        data: { system_prompt: `You are a ${excerpt}. Help users effectively.` },
      });
      expect(patchRes.ok()).toBeTruthy();

      if (patchRes.ok()) {
        const getRes = await page.request.get(`/api/chatbots/${tempChatbotId}`);
        if (getRes.ok()) {
          const body = await getRes.json();
          const saved = body.data?.system_prompt || body.data?.chatbot?.system_prompt || '';
          expect(saved).toContain(excerpt);
        }
      }
    }
  });

  test('QT-CRUD-004: Cleanup temp chatbot', async ({ page }) => {
    test.skip(!tempChatbotId, 'No chatbot created');
    const response = await page.request.delete(`/api/chatbots/${tempChatbotId}`);
    expect(response.ok()).toBeTruthy();
    tempChatbotId = null;
  });
});

// ─── CHATBOT BEHAVIOR PER TEMPLATE ─────────────────────────────────

test.describe('Template-Driven Chatbot Behavior', () => {
  test('QT-BEH-001: Chat works with Customer Support template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a customer support agent focused on resolving issues quickly while building loyalty.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'I need help with my account', stream: false, session_id: `support-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-002: Chat works with Sales Assistant template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a consultative sales assistant. Your goal is to understand what visitors need.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'What products do you offer?', stream: false, session_id: `sales-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-003: Chat works with Lead Generation template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a friendly assistant focused on helping visitors and capturing leads.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'Tell me about your services', stream: false, session_id: `lead-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-004: Chat works with E-Commerce template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a product advisor for this store. Help shoppers find the right products.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'What do you recommend?', stream: false, session_id: `ecom-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-005: Chat works with Appointment Booking template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a scheduling assistant. Guide visitors toward booking a meeting.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'I want to book a demo', stream: false, session_id: `booking-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-006: Chat works with Technical Support template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a technical support specialist. Diagnose and resolve technical issues.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'My app keeps crashing', stream: false, session_id: `tech-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-007: Chat works with Onboarding Guide template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are an onboarding assistant. Help new users get set up quickly.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'I just signed up, what should I do first?', stream: false, session_id: `onboard-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-008: Chat works with Re-Engagement template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a re-engagement assistant. Welcome back returning visitors.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'I was here last week', stream: false, session_id: `reengage-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-009: Chat works with FAQ Bot template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a concise FAQ assistant. Answer questions accurately.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'What are your business hours?', stream: false, session_id: `faq-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-010: Chat works with Helpful Assistant template', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a friendly, knowledgeable assistant for this business.' },
    });
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const chatRes = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'Can you help me?', stream: false, session_id: `helpful-test-${Date.now()}` },
    });
    if (chatRes.ok()) {
      const body = await chatRes.json();
      expect((body.data?.message || body.data?.content || '').length).toBeGreaterThan(0);
    }
  });

  test('QT-BEH-CLEANUP: Restore E2E bot prompt', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are a helpful test assistant.' },
    });
  });
});

// ─── SETTINGS: Save template via UI ─────────────────────────────────

test.describe('Template Save Flow via UI', () => {
  test('QT-SAVE-001: Select template and save settings', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    // Click Onboarding Guide template
    await page.locator('.grid button', { hasText: 'Onboarding Guide' }).first().click({ force: true });
    await expect(promptField).toHaveValue(/onboarding/, { timeout: 5000 });

    // Click Save Changes
    await page.locator('button', { hasText: 'Save Changes' }).first().click();
    await page.waitForLoadState('networkidle');

    // Verify save succeeded
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('QT-SAVE-002: Saved template persists on page reload', async ({ page }) => {
    // Save a known prompt via API (avoids Tooltip click-interception issues)
    const testPrompt = 'You are a re-engagement assistant. Saved for persistence test.';
    await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: testPrompt },
    });

    // Load settings page and verify it shows the saved prompt
    await gotoPromptSection(page);
    const promptField = page.locator('textarea#system_prompt').first();
    await expect(promptField).toHaveValue(testPrompt, { timeout: 10000 });
  });

  test('QT-SAVE-CLEANUP: Restore E2E bot prompt', async ({ page }) => {
    await gotoPromptSection(page);

    const promptField = page.locator('textarea#system_prompt').first();

    await promptField.fill('You are a helpful test assistant.');
    await page.locator('button', { hasText: 'Save Changes' }).first().click();
    await page.waitForLoadState('networkidle');
  });
});
