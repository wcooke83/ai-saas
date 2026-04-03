import { test, expect } from '@playwright/test';

const BILLING_URL = '/dashboard/billing';

async function gotoBilling(page: import('@playwright/test').Page) {
  await page.goto(BILLING_URL);
  await page.waitForLoadState('domcontentloaded');
  // Billing heading only renders after auth + subscription data loads (skeleton has no heading)
  await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible({ timeout: 30000 });
}

async function waitForAutoTopup(page: import('@playwright/test').Page) {
  // AutoTopupSettings has its own loading state; wait for it to resolve
  await expect(page.getByRole('heading', { name: 'Auto Top-up' })).toBeVisible({ timeout: 30000 });
  // Wait for the status line which indicates data has loaded
  await expect(page.getByText('Status:').first()).toBeVisible({ timeout: 10000 });
}

test.describe('Auto Top-up – Section Rendering', () => {
  test('TOPUP-001: auto top-up section is visible on billing page', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    // Card title
    await expect(page.getByText('Auto Top-up').first()).toBeVisible();

    // Description
    await expect(
      page.getByText('Automatically purchase credits when your balance runs low')
    ).toBeVisible();
  });

  test('TOPUP-002: enable toggle is present', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    // Toggle label
    await expect(page.getByText('Enable Auto Top-up')).toBeVisible();

    // The toggle switch itself
    const toggle = page.getByRole('switch', { name: /auto top-up/i }).or(
      page.getByRole('switch').filter({ has: page.locator('[aria-checked]') })
    );
    // If the toggle does not have an accessible name, find by proximity
    const toggleButtons = page.locator('button[role="switch"]');
    expect(await toggleButtons.count()).toBeGreaterThan(0);
  });

  test('TOPUP-003: threshold input is present', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    await expect(page.getByText('Trigger Threshold (credits)')).toBeVisible();
    const thresholdInput = page.locator('input#threshold');
    await expect(thresholdInput).toBeVisible();
  });

  test('TOPUP-004: top-up amount input is present', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    await expect(page.getByText('Top-up Amount (credits)')).toBeVisible();
    const amountInput = page.locator('input#amount');
    await expect(amountInput).toBeVisible();
  });

  test('TOPUP-005: status badge shows Active or Disabled', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const statusSection = page.getByText('Status:').first().locator('..');
    const activeOrDisabled = statusSection.getByText(/Active|Disabled/);
    await expect(activeOrDisabled).toBeVisible();
  });

  test('TOPUP-006: Save Settings button is present', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const saveButton = page.getByRole('button', { name: /Save Settings/i });
    await expect(saveButton).toBeVisible();
  });
});

test.describe('Auto Top-up – Toggle Behavior', () => {
  test('TOPUP-010: toggling enable switch changes aria-checked', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const toggleArea = page.locator('div').filter({ hasText: /^Enable Auto Top-up/ }).first().locator('..');
    const toggle = toggleArea.locator('button[role="switch"]');
    await expect(toggle).toBeVisible({ timeout: 5000 });

    const isDisabled = await toggle.isDisabled();
    if (isDisabled) {
      // No payment method: verify toggle is correctly disabled with unchecked state
      await expect(toggle).toBeDisabled();
      const ariaChecked = await toggle.getAttribute('aria-checked');
      expect(ariaChecked).toBe('false');
      return;
    }

    const initialState = await toggle.getAttribute('aria-checked');

    await toggle.click();
    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);

    // Toggle back to restore original state
    await toggle.click();
    const restoredState = await toggle.getAttribute('aria-checked');
    expect(restoredState).toBe(initialState);
  });

  test('TOPUP-011: when disabled, settings inputs appear dimmed', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const toggleArea = page.locator('div').filter({ hasText: /^Enable Auto Top-up/ }).first().locator('..');
    const toggle = toggleArea.locator('button[role="switch"]');

    const isDisabled = await toggle.isDisabled();
    if (!isDisabled) {
      // Ensure toggle is off so settings appear dimmed
      const currentState = await toggle.getAttribute('aria-checked');
      if (currentState === 'true') {
        await toggle.click();
      }
    }

    // When toggle is disabled (no payment method) or off, settings should be dimmed
    const settingsSection = page.locator('.opacity-50.pointer-events-none');
    await expect(settingsSection).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Auto Top-up – Input Validation', () => {
  test('TOPUP-020: threshold input accepts valid numbers', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const thresholdInput = page.locator('input#threshold');
    await thresholdInput.fill('200');
    const value = await thresholdInput.inputValue();
    expect(value).toBe('200');
  });

  test('TOPUP-021: amount input accepts valid numbers', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const amountInput = page.locator('input#amount');
    await amountInput.fill('2000');
    const value = await amountInput.inputValue();
    expect(value).toBe('2000');
  });

  test('TOPUP-022: monthly cap checkbox toggles cap input visibility', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const capCheckbox = page.locator('input#use-monthly-cap');
    await expect(capCheckbox).toBeVisible();

    const isChecked = await capCheckbox.isChecked();
    const capInput = page.locator('input#max-monthly');

    // Helper to toggle checkbox via JS (bypasses pointer-events-none parent, triggers React onChange)
    const toggleCheckbox = async (checked: boolean) => {
      await page.evaluate((shouldBeChecked) => {
        const el = document.querySelector('input#use-monthly-cap') as HTMLInputElement;
        if (!el) throw new Error('Checkbox not found');
        if (el.checked === shouldBeChecked) return;
        // Find the React fiber and call its onChange directly
        const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
        if (fiberKey) {
          let fiber = (el as any)[fiberKey];
          while (fiber) {
            const props = fiber.memoizedProps || fiber.pendingProps;
            if (props && typeof props.onChange === 'function') {
              const syntheticEvent = { target: { checked: shouldBeChecked } };
              props.onChange(syntheticEvent);
              return;
            }
            fiber = fiber.return;
          }
        }
        // Fallback: native setter + change event
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked')!.set!;
        nativeSetter.call(el, shouldBeChecked);
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, checked);
    };

    if (isChecked) {
      // Cap input should be visible
      await expect(capInput).toBeVisible();

      // Uncheck
      await toggleCheckbox(false);
      await expect(capInput).not.toBeVisible();

      // Re-check to restore
      await toggleCheckbox(true);
      await expect(capInput).toBeVisible();
    } else {
      // Cap input should NOT be visible
      await expect(capInput).not.toBeVisible();

      // Check to show it
      await toggleCheckbox(true);
      await expect(capInput).toBeVisible({ timeout: 3000 });

      // Uncheck to restore
      await toggleCheckbox(false);
    }
  });
});

test.describe('Auto Top-up – No Payment Method Warning', () => {
  test('TOPUP-030: warning shown or not based on payment method status', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const toggle = page.locator('button[role="switch"]').first();
    await expect(toggle).toBeVisible();

    const noPaymentWarning = page.getByText('No payment method on file');
    const isWarningVisible = await noPaymentWarning.isVisible({ timeout: 3000 }).catch(() => false);

    if (isWarningVisible) {
      // Warning should include instruction text
      await expect(
        page.getByText(/Add a payment method from the Billing section/i)
      ).toBeVisible();
      // Toggle should be disabled when no payment method
      await expect(toggle).toBeDisabled();
    } else {
      // No warning — just verify the toggle renders (state depends on plan type)
      await expect(toggle).toBeVisible();
    }
  });
});

test.describe('Auto Top-up – Save Flow', () => {
  test('TOPUP-040: Save Settings button disabled when no changes made', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const saveButton = page.getByRole('button', { name: /Save Settings/i });
    // On initial load with no changes, button should be disabled
    await expect(saveButton).toBeDisabled();
  });

  test('TOPUP-041: modifying threshold enables Save Settings', async ({ page }) => {
    await gotoBilling(page);
    await waitForAutoTopup(page);

    const thresholdInput = page.locator('input#threshold');
    const saveButton = page.getByRole('button', { name: /Save Settings/i });

    // Get current value
    const currentValue = await thresholdInput.inputValue();
    const newValue = currentValue === '200' ? '300' : '200';

    // Change the value
    await thresholdInput.fill(newValue);

    // Save button should now be enabled
    await expect(saveButton).toBeEnabled();

    // Restore original value to avoid persisting test changes
    await thresholdInput.fill(currentValue);
  });
});
