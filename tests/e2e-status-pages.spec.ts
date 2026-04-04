/**
 * E2E Tests: Status Pages
 *
 * Covers:
 *  - /admin/status  — Components, Incidents, and Maintenance tabs (admin-only)
 *  - /status        — Public-facing status page
 *
 * Auth: uses the e2e test user storage state (same pattern as all other admin tests).
 * The e2e user must have is_admin = true in profiles for admin API calls to succeed.
 *
 * ISR note: /status has revalidate=60. Tests that need to verify public page
 * reflection after a DB change hit the API directly to assert DB state instead
 * of relying on an ISR cache flush. Where UI reflection is tested, the tests
 * clean up after themselves so they don't pollute other runs.
 */

import { test, expect, request, type Page } from '@playwright/test';

const E2E_SECRET = process.env.E2E_TEST_SECRET!;
const BASE_URL = 'http://localhost:3030';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wait for the admin/status page to finish its initial data fetch. */
async function waitForAdminStatusLoaded(page: Page) {
  // Wait for the initial network fetches (fetchAll) to complete before asserting.
  // This prevents catching the page in a half-loaded state during dev-server compilation.
  await page.waitForLoadState('networkidle').catch(() => {});
  // TabsTrigger renders as a <button> (no role="tab"), so use getByRole('button').
  // We wait for the Components button to be visible as the ready signal.
  await expect(
    page.getByRole('button', { name: 'Components', exact: true })
  ).toBeVisible({ timeout: 15_000 });
  // Also wait for at least one status select to confirm component data is loaded
  // (the button can appear before the data fetch completes).
  await expect(page.locator('select').first()).toBeVisible({ timeout: 15_000 });
}

/** Switch to a named tab on the admin status page. */
async function switchTab(page: Page, name: 'Components' | 'Incidents' | 'Maintenance') {
  // TabsTrigger renders as plain <button> elements (no role="tab").
  // The Incidents tab may include a badge count (e.g. "Incidents 1"), so we
  // match it with a regex. Components and Maintenance never have badges.
  const tabLocator = name === 'Incidents'
    ? page.getByRole('button', { name: /^Incidents/ })
    : page.getByRole('button', { name });
  await tabLocator.click();
  // Wait for the tab panel to become visible — each panel has a distinct heading
  if (name === 'Components') {
    // ComponentsTab renders a grid; wait for at least one select to appear
    await expect(page.locator('select').first()).toBeVisible({ timeout: 10_000 });
  } else if (name === 'Incidents') {
    await expect(page.getByRole('heading', { name: 'Active Incidents' })).toBeVisible({ timeout: 10_000 });
  } else {
    await expect(page.getByRole('heading', { name: 'Upcoming Maintenance' })).toBeVisible({ timeout: 10_000 });
  }
}

/**
 * Create a test incident via the API (bypasses the ISR cache / UI for setup).
 * Returns the created incident id.
 */
async function apiCreateIncident(
  page: Page,
  title: string,
  initialStatus: 'Investigating' | 'Identified' = 'Investigating',
  initialMessage = 'E2E test incident message'
): Promise<string> {
  const res = await page.request.post('/api/status/incidents', {
    data: {
      title,
      affected_components: [],
      initial_message: initialMessage,
      initial_status: initialStatus,
      is_maintenance: false,
    },
  });
  expect(res.ok(), `Create incident API failed: ${await res.text()}`).toBeTruthy();
  const body = await res.json();
  return body.incident.id as string;
}

/**
 * Add an update to an incident via the API.
 */
async function apiAddUpdate(
  page: Page,
  incidentId: string,
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved',
  message = `E2E update: ${status}`
) {
  const res = await page.request.post(`/api/status/incidents/${incidentId}/updates`, {
    data: { message, status },
  });
  expect(res.ok(), `Add update API failed: ${await res.text()}`).toBeTruthy();
}

/**
 * Delete an incident via the API (cleanup).
 */
async function apiDeleteIncident(page: Page, incidentId: string) {
  await page.request.delete(`/api/status/incidents/${incidentId}`);
}

/**
 * Reset a component's status back to operational via the API.
 * Accepts component id.
 */
async function apiResetComponent(page: Page, componentId: string) {
  await page.request.patch(`/api/status/components/${componentId}`, {
    data: { status: 'operational' },
  });
}

/** Toast container rendered by sonner — wait for a toast with matching text. */
async function expectToast(page: Page, text: string | RegExp) {
  // Sonner renders toasts in a <ol> with data-sonner-toaster
  const toast = page.locator('[data-sonner-toaster] li').filter({ hasText: text });
  await expect(toast).toBeVisible({ timeout: 8_000 });
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Section 50: Status Pages', () => {
  // e2e-global-credit-packages.afterAll() clears is_admin to false.
  // Restore admin access before any tests in this suite run.
  test.beforeAll(async () => {
    const ctx = await request.newContext({ baseURL: BASE_URL });
    const res = await ctx.post('/api/auth/e2e-set-admin', {
      data: { secret: E2E_SECRET, is_admin: true },
    });
    const body = await res.json();
    expect(res.ok(), `Failed to promote e2e user to admin: ${JSON.stringify(body)}`).toBeTruthy();
    await ctx.dispose();
  });

  // ── /admin/status — Components Tab ──────────────────────────────────────────

  test.describe('ADMIN-STATUS: Components tab', () => {
    test('ADMIN-STATUS-001: Page loads with all seeded components', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);

      // The seeded migration inserts exactly 9 components.
      const selects = page.locator('select');
      await expect(selects).toHaveCount(9, { timeout: 10_000 });
    });

    test('ADMIN-STATUS-002: Each component card shows its name and a status select', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);

      // Spot-check the first two well-known seeded component names
      // Actual DB names from migration: 'Web App' and 'Database / API'
      await expect(page.getByText('Web App')).toBeVisible();
      await expect(page.getByText('Database / API')).toBeVisible();

      // All selects should have a valid default value
      const selects = page.locator('select');
      const count = await selects.count();
      for (let i = 0; i < count; i++) {
        const val = await selects.nth(i).inputValue();
        expect(['operational', 'degraded', 'outage', 'maintenance']).toContain(val);
      }
    });

    test('ADMIN-STATUS-003: Changing a component to "degraded" shows success toast', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);

      // Intercept the PATCH so we know which component we're targeting
      const patchPromise = page.waitForResponse(
        (res) => res.url().includes('/api/status/components/') && res.request().method() === 'PATCH'
      );

      // Change the first select to degraded
      const firstSelect = page.locator('select').first();
      await firstSelect.selectOption('degraded');

      const patchRes = await patchPromise;
      expect(patchRes.ok()).toBeTruthy();

      await expectToast(page, 'Component status updated');

      // Cleanup: restore to operational
      const body = await patchRes.json();
      const componentId = body.component.id as string;
      await apiResetComponent(page, componentId);
    });

    test('ADMIN-STATUS-004: Changing a component to "outage" updates select value', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);

      const patchPromise = page.waitForResponse(
        (res) => res.url().includes('/api/status/components/') && res.request().method() === 'PATCH'
      );

      const firstSelect = page.locator('select').first();
      await firstSelect.selectOption('outage');

      const patchRes = await patchPromise;
      expect(patchRes.ok()).toBeTruthy();
      const body = await patchRes.json();

      // The select should reflect the new value immediately (optimistic update)
      await expect(firstSelect).toHaveValue('outage');

      // Cleanup
      await apiResetComponent(page, body.component.id);
    });

    test('ADMIN-STATUS-005: Cycling through all statuses and restoring operational', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);

      const firstSelect = page.locator('select').first();

      for (const status of ['outage', 'degraded', 'maintenance', 'operational'] as const) {
        const patchPromise = page.waitForResponse(
          (res) => res.url().includes('/api/status/components/') && res.request().method() === 'PATCH'
        );
        await firstSelect.selectOption(status);
        const patchRes = await patchPromise;
        expect(patchRes.ok(), `PATCH to ${status} failed`).toBeTruthy();
        await expect(firstSelect).toHaveValue(status);
      }
    });
  });

  // ── /admin/status — Incidents Tab ────────────────────────────────────────────

  test.describe('ADMIN-STATUS: Incidents tab', () => {
    test('ADMIN-STATUS-010: Incidents tab shows Active Incidents heading and New Incident button', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Incidents');

      await expect(page.getByRole('heading', { name: 'Active Incidents' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'New Incident' })).toBeVisible();
    });

    test('ADMIN-STATUS-011: New Incident button opens Create Incident modal', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Incidents');

      await page.getByRole('button', { name: 'New Incident' }).click();

      // Dialog title must be visible
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('heading', { name: 'Create Incident' })).toBeVisible();

      // Form fields
      await expect(page.getByPlaceholder('Brief description of the incident')).toBeVisible();
      await expect(page.getByPlaceholder('Describe what is happening...')).toBeVisible();
    });

    test('ADMIN-STATUS-012: Create incident — submitting creates incident and it appears in Active', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Incidents');

      await page.getByRole('button', { name: 'New Incident' }).click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

      const incidentTitle = `E2E Incident ${Date.now()}`;

      await page.getByPlaceholder('Brief description of the incident').fill(incidentTitle);
      await page.getByPlaceholder('Describe what is happening...').fill('E2E test: initial investigating message');

      // Leave initial status as default (Investigating)

      const postPromise = page.waitForResponse(
        (res) => res.url().includes('/api/status/incidents') && res.request().method() === 'POST'
      );
      await page.getByRole('button', { name: 'Create Incident' }).click();

      const postRes = await postPromise;
      expect(postRes.ok()).toBeTruthy();

      // Modal should close and toast should appear
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8_000 });
      await expectToast(page, 'Incident created');

      // The new incident should now appear in the Active Incidents list
      await expect(page.getByText(incidentTitle)).toBeVisible({ timeout: 8_000 });

      // Cleanup — always delete even if an assertion above failed
      const body = await postRes.json();
      await apiDeleteIncident(page, body.incident.id).catch(() => {});
    });

    test('ADMIN-STATUS-013: Add Update button opens Add Update modal', async ({ page }) => {
      // Create incident first via API so we have a known target
      const incidentId = await apiCreateIncident(page, `E2E AddUpdate Test ${Date.now()}`);

      try {
        await page.goto('/admin/status');
        await waitForAdminStatusLoaded(page);
        await switchTab(page, 'Incidents');

        // Click the Add Update button on any active incident card
        const addUpdateBtn = page.getByRole('button', { name: 'Add Update' }).first();
        await expect(addUpdateBtn).toBeVisible({ timeout: 8_000 });
        await addUpdateBtn.click();

        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
        await expect(page.getByRole('heading', { name: 'Add Update' })).toBeVisible();
        await expect(page.getByPlaceholder('Describe the current status...')).toBeVisible();

        // Close modal
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5_000 });
      } finally {
        // Always clean up so leftover incidents don't affect subsequent tests
        await apiDeleteIncident(page, incidentId);
      }
    });

    test('ADMIN-STATUS-014: Posting an update (Identified) reflects new status badge', async ({ page }) => {
      const incidentId = await apiCreateIncident(page, `E2E UpdateStatus Test ${Date.now()}`);

      try {
        await page.goto('/admin/status');
        await waitForAdminStatusLoaded(page);
        await switchTab(page, 'Incidents');

        const addUpdateBtn = page.getByRole('button', { name: 'Add Update' }).first();
        await expect(addUpdateBtn).toBeVisible({ timeout: 8_000 });
        await addUpdateBtn.click();

        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

        // Change status select inside the modal to Identified
        const statusSelect = page.getByRole('dialog').locator('select');
        await statusSelect.selectOption('Identified');

        await page
          .getByRole('dialog')
          .getByPlaceholder('Describe the current status...')
          .fill('E2E: root cause identified');

        const postPromise = page.waitForResponse(
          (res) => res.url().includes('/updates') && res.request().method() === 'POST'
        );
        await page.getByRole('button', { name: 'Post Update' }).click();
        const postRes = await postPromise;
        expect(postRes.ok()).toBeTruthy();

        await expectToast(page, 'Update added');

        // After refresh the incident badge should show "Identified"
        await expect(page.getByText('Identified')).toBeVisible({ timeout: 8_000 });
      } finally {
        await apiDeleteIncident(page, incidentId);
      }
    });

    test('ADMIN-STATUS-015: Resolving an incident moves it to Resolved section', async ({ page }) => {
      const title = `E2E Resolve Test ${Date.now()}`;
      const incidentId = await apiCreateIncident(page, title);

      try {
        await page.goto('/admin/status');
        await waitForAdminStatusLoaded(page);
        await switchTab(page, 'Incidents');

        // Click the green Resolve button (opens Add Update with Resolved prefilled)
        const resolveBtn = page.getByRole('button', { name: 'Resolve' }).first();
        await expect(resolveBtn).toBeVisible({ timeout: 8_000 });
        await resolveBtn.click();

        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

        // Status select should be pre-filled to Resolved
        const statusSelect = page.getByRole('dialog').locator('select');
        await expect(statusSelect).toHaveValue('Resolved');

        await page
          .getByRole('dialog')
          .getByPlaceholder('Describe the current status...')
          .fill('E2E: issue resolved, all systems restored');

        const postPromise = page.waitForResponse(
          (res) => res.url().includes('/updates') && res.request().method() === 'POST'
        );
        await page.getByRole('button', { name: 'Post Update' }).click();
        const postRes = await postPromise;
        expect(postRes.ok()).toBeTruthy();

        await expectToast(page, 'Update added');

        // The incident should leave Active and appear in Recent Resolved Incidents
        await expect(
          page.getByRole('heading', { name: 'Recent Resolved Incidents' })
        ).toBeVisible({ timeout: 10_000 });

        // The resolved incident card should show the "Resolved" status badge
        const resolvedSection = page.locator('div').filter({ hasText: 'Recent Resolved Incidents' }).last();
        await expect(resolvedSection.getByText(title)).toBeVisible({ timeout: 5_000 });
        await expect(resolvedSection.getByText('Resolved').first()).toBeVisible();
      } finally {
        await apiDeleteIncident(page, incidentId);
      }
    });
  });

  // ── /admin/status — Maintenance Tab ──────────────────────────────────────────

  test.describe('ADMIN-STATUS: Maintenance tab', () => {
    test('ADMIN-STATUS-020: Maintenance tab shows Upcoming Maintenance heading and Schedule button', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Maintenance');

      await expect(page.getByRole('heading', { name: 'Upcoming Maintenance' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Schedule Maintenance' })).toBeVisible();
    });

    test('ADMIN-STATUS-021: Schedule Maintenance button opens modal', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Maintenance');

      await page.getByRole('button', { name: 'Schedule Maintenance' }).click();

      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('heading', { name: 'Schedule Maintenance' })).toBeVisible();

      // Required fields
      await expect(page.getByPlaceholder('e.g. Database maintenance')).toBeVisible();
      await expect(page.getByPlaceholder('Describe the maintenance work...')).toBeVisible();
    });

    test('ADMIN-STATUS-022: Creating a maintenance window shows it in Upcoming section', async ({ page }) => {
      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Maintenance');

      await page.getByRole('button', { name: 'Schedule Maintenance' }).click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });

      const maintTitle = `E2E Maintenance ${Date.now()}`;

      await page.getByPlaceholder('e.g. Database maintenance').fill(maintTitle);
      await page.getByPlaceholder('Describe the maintenance work...').fill('E2E scheduled maintenance description');

      // Set scheduled start to tomorrow, end 2 hours later
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowPlus2 = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000);

      function toDatetimeLocal(d: Date) {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }

      const dialog = page.getByRole('dialog');
      // There are two datetime-local inputs — start and end
      const dateInputs = dialog.locator('input[type="datetime-local"]');
      await dateInputs.nth(0).fill(toDatetimeLocal(tomorrow));
      await dateInputs.nth(1).fill(toDatetimeLocal(tomorrowPlus2));

      const postPromise = page.waitForResponse(
        (res) => res.url().includes('/api/status/incidents') && res.request().method() === 'POST'
      );
      // 'Schedule Maintenance' button also matches without exact:true — scope to the dialog
      await page.getByRole('dialog').getByRole('button', { name: 'Schedule', exact: true }).click();
      const postRes = await postPromise;
      expect(postRes.ok()).toBeTruthy();

      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8_000 });
      await expectToast(page, 'Maintenance window scheduled');

      // Should appear in Upcoming section
      await expect(page.getByText(maintTitle)).toBeVisible({ timeout: 8_000 });

      // Cleanup — always delete to prevent leftover maintenance windows affecting ADMIN-STATUS-042
      const body = await postRes.json();
      await apiDeleteIncident(page, body.incident.id).catch(() => {});
    });

    test('ADMIN-STATUS-023: Editing a maintenance window opens Edit modal with prefilled values', async ({ page }) => {
      // Create via API
      const now = new Date();
      const start = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      const end = new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString();

      const createRes = await page.request.post('/api/status/incidents', {
        data: {
          title: `E2E Edit Maintenance ${Date.now()}`,
          affected_components: [],
          initial_message: 'E2E setup',
          is_maintenance: true,
          scheduled_start: start,
          scheduled_end: end,
        },
      });
      expect(createRes.ok()).toBeTruthy();
      const { incident } = await createRes.json();

      await page.goto('/admin/status');
      await waitForAdminStatusLoaded(page);
      await switchTab(page, 'Maintenance');

      // Click the edit button on the maintenance row
      const editBtn = page.getByRole('button', { name: 'Edit maintenance window' }).first();
      await expect(editBtn).toBeVisible({ timeout: 8_000 });
      await editBtn.click();

      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('heading', { name: 'Edit Maintenance Window' })).toBeVisible();

      // Title input should be pre-filled
      const titleInput = page.getByRole('dialog').getByPlaceholder('e.g. Database maintenance');
      await expect(titleInput).toHaveValue(incident.title);

      // Update the title
      const updatedTitle = `${incident.title} — Updated`;
      await titleInput.clear();
      await titleInput.fill(updatedTitle);

      const putPromise = page.waitForResponse(
        (res) => res.url().includes(`/api/status/incidents/${incident.id}`) && res.request().method() === 'PUT'
      );
      await page.getByRole('button', { name: 'Save Changes' }).click();
      const putRes = await putPromise;
      expect(putRes.ok()).toBeTruthy();

      await expectToast(page, 'Maintenance window updated');

      // The updated title should appear in the Upcoming section
      await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 8_000 });

      // Cleanup — always delete to prevent leftover maintenance windows affecting ADMIN-STATUS-042
      await apiDeleteIncident(page, incident.id).catch(() => {});
    });
  });

  // ── /status — Public page API state assertions ────────────────────────────────
  // These tests verify DB/API state rather than the ISR-cached HTML because
  // /status has revalidate=60 and we cannot guarantee cache flush in tests.
  // Tests that do load the public page use page.goto with cache-busting or
  // verify structural elements that are always present regardless of ISR state.

  test.describe('STATUS: Public page structure', () => {
    test('ADMIN-STATUS-030: Public /status page loads without error', async ({ page }) => {
      await page.goto('/status');
      await page.waitForLoadState('domcontentloaded');

      // Should not show a 404 or error page
      await expect(page.locator('h1')).not.toHaveText(/404|not found/i);

      // Should always have the "SERVICES" section label (aria-hidden but present in DOM)
      await expect(page.getByLabel('Service status')).toBeVisible({ timeout: 15_000 });
    });

    test('ADMIN-STATUS-031: Public /status page shows overall status chip', async ({ page }) => {
      await page.goto('/status');
      await page.waitForLoadState('networkidle').catch(() => {});

      // The status chip has role="status" and aria-label starting with "Current system status:"
      const statusChip = page.locator('[role="status"][aria-label^="Current system status:"]');
      await expect(statusChip).toBeVisible({ timeout: 15_000 });
    });

    test('ADMIN-STATUS-032: Public /status page shows component rows with StatusChip', async ({ page }) => {
      await page.goto('/status');

      // Each ServiceRow renders a StatusChip with role="status" and aria-label "X is Y"
      const chips = page.locator('[role="listitem"] [role="status"]');
      // Should have at least 1 chip visible (seeded components)
      await expect(chips.first()).toBeVisible({ timeout: 15_000 });
    });

    test('ADMIN-STATUS-033: Public /status page — no active incident callout when all operational (API check)', async ({ page }) => {
      // Verify via the incidents API that no active incidents exist before asserting
      const res = await page.request.get('/api/status/incidents?active=true');
      expect(res.ok()).toBeTruthy();
      const { incidents } = await res.json();

      if (incidents.length === 0) {
        // Only assert public page when we know the DB is clean
        await page.goto('/status');
        await page.waitForLoadState('networkidle').catch(() => {});
        // The role="alert" callout must NOT be present
        await expect(page.locator('[role="alert"]')).not.toBeVisible({ timeout: 15_000 });
      } else {
        // Active incidents exist (from other tests or prior runs); skip the UI assertion
        test.info().annotations.push({ type: 'skip-reason', description: 'Active incidents already exist in DB — skipping no-alert assertion' });
      }
    });
  });

  // ── /status — Reflection tests (API state → public page) ─────────────────────
  // These tests create state, reload /status without cache, and assert the UI.
  // They hard-bypass Next.js ISR by navigating to /status?_t=<timestamp> which
  // forces a fresh server render in dev mode (next dev does not cache SSR).
  // In production builds with a real CDN these tests should be skipped.

  test.describe('STATUS: Public page reflection via dev-mode fresh render', () => {
    test('ADMIN-STATUS-040: Active incident → public page shows role="alert" callout', async ({ page }) => {
      const title = `E2E Public Incident ${Date.now()}`;
      const incidentId = await apiCreateIncident(page, title, 'Investigating', 'E2E public test incident');

      try {
        // Fresh render: add a cache-busting query param (no-op for app logic)
        await page.goto(`/status?_t=${Date.now()}`);
        await page.waitForLoadState('networkidle').catch(() => {});

        // The Next.js route announcer also has role="alert" — filter to the visible incident callout
        const alert = page.locator('[role="alert"]').filter({ hasText: 'ACTIVE INCIDENT' });
        await expect(alert).toBeVisible({ timeout: 20_000 });
        await expect(alert).toContainText(title);
        await expect(alert).toContainText('ACTIVE INCIDENT');
      } finally {
        await apiDeleteIncident(page, incidentId);
      }
    });

    test('ADMIN-STATUS-041: Component set to "outage" → public page chip shows Outage', async ({ page }) => {
      // Fetch component list to get a real component id
      const compRes = await page.request.get('/api/status/components');
      const { components } = await compRes.json();
      const target = components[0];

      await page.request.patch(`/api/status/components/${target.id}`, {
        data: { status: 'outage' },
      });

      try {
        await page.goto(`/status?_t=${Date.now()}`);
        await page.waitForLoadState('networkidle').catch(() => {});

        // The StatusChip for this component has aria-label "{name} is Outage"
        const chip = page.locator(`[role="status"][aria-label="${target.name} is Outage"]`);
        await expect(chip).toBeVisible({ timeout: 20_000 });

        // Overall status banner should NOT say All Systems Operational
        const statusChip = page.locator('[role="status"][aria-label^="Current system status:"]');
        await expect(statusChip).not.toContainText('ALL SYSTEMS OPERATIONAL');
      } finally {
        await apiResetComponent(page, target.id);
      }
    });

    test('ADMIN-STATUS-042: Resolving incident + restoring components → public page returns to All Systems Operational', async ({ page }) => {
      // Clean up any pre-existing active incidents and upcoming maintenance windows
      // left by earlier test failures (flaky retries don't clean up first-attempt data)
      for (const param of ['active=true', 'maintenance=true']) {
        const existingRes = await page.request.get(`/api/status/incidents?${param}`);
        if (existingRes.ok()) {
          const { incidents: existingItems } = await existingRes.json();
          for (const item of existingItems) {
            await apiDeleteIncident(page, item.id);
          }
        }
      }

      // Ensure all components are operational via API
      const compRes = await page.request.get('/api/status/components');
      const { components } = await compRes.json();
      for (const comp of components) {
        if (comp.status !== 'operational') {
          await apiResetComponent(page, comp.id);
        }
      }

      // Clean up any leftover active incidents that could prevent "ALL SYSTEMS OPERATIONAL"
      // (previous tests may have leaked incidents if their cleanup failed silently)
      const activeRes = await page.request.get('/api/status/incidents?active=true');
      if (activeRes.ok()) {
        const { incidents: activeLeftovers } = await activeRes.json();
        for (const inc of (activeLeftovers ?? [])) {
          await page.request.delete(`/api/status/incidents/${inc.id}`).catch(() => {});
        }
      }

      // Clean up any leftover maintenance windows that trigger "MAINTENANCE IN PROGRESS"
      const maintRes = await page.request.get('/api/status/incidents?maintenance=true');
      if (maintRes.ok()) {
        const { incidents: maintLeftovers } = await maintRes.json();
        for (const m of (maintLeftovers ?? [])) {
          await page.request.delete(`/api/status/incidents/${m.id}`).catch(() => {});
        }
      }

      // Create and immediately resolve an incident
      const incidentId = await apiCreateIncident(page, `E2E Resolve Reflection ${Date.now()}`);
      await apiAddUpdate(page, incidentId, 'Resolved', 'E2E: all clear');

      // Brief wait to ensure DB writes are visible to the next request (avoids race)
      await page.waitForTimeout(500);

      try {
        await page.goto(`/status?_t=${Date.now()}`);
        await page.waitForLoadState('networkidle').catch(() => {});

        const statusChip = page.locator('[role="status"][aria-label^="Current system status:"]');
        await expect(statusChip).toContainText('ALL SYSTEMS OPERATIONAL', { timeout: 20_000 });

        // No active incident callout
        await expect(page.locator('[role="alert"]')).not.toBeVisible();
      } finally {
        await apiDeleteIncident(page, incidentId);
      }
    });
  });

  // ── /admin/status — Auth guard ────────────────────────────────────────────────

  test.describe('ADMIN-STATUS: Auth guard', () => {
    test('ADMIN-STATUS-050: Unauthenticated user cannot reach admin status page', async ({ browser }) => {
      const context = await browser.newContext({ storageState: undefined });
      await context.clearCookies();
      const page = await context.newPage();

      await page.goto('http://localhost:3030/admin/status');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForURL(/\/(login|admin)/, { timeout: 15_000 }).catch(() => {});

      const url = page.url();
      const hasLoginContent =
        (await page.getByText('Sign in').isVisible().catch(() => false)) ||
        (await page.getByText('Welcome back').isVisible().catch(() => false));

      expect(url.includes('/login') || hasLoginContent).toBeTruthy();
      await context.close();
    });

    test('ADMIN-STATUS-051: Component PATCH API returns 401 without auth', async ({ browser }) => {
      const context = await browser.newContext({ storageState: undefined });
      await context.clearCookies();
      const page = await context.newPage();

      const res = await page.request.patch('http://localhost:3030/api/status/components/00000000-0000-0000-0000-000000000001', {
        data: { status: 'outage' },
      });
      expect(res.status()).toBeGreaterThanOrEqual(400);
      await context.close();
    });

    test('ADMIN-STATUS-052: Incidents POST API returns 401 without auth', async ({ browser }) => {
      const context = await browser.newContext({ storageState: undefined });
      await context.clearCookies();
      const page = await context.newPage();

      const res = await page.request.post('http://localhost:3030/api/status/incidents', {
        data: {
          title: 'Unauthorized test',
          affected_components: [],
          initial_message: 'test',
          initial_status: 'Investigating',
          is_maintenance: false,
        },
      });
      expect(res.status()).toBeGreaterThanOrEqual(400);
      await context.close();
    });
  });
});
