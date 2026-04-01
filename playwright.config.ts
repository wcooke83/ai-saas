import { defineConfig, devices } from '@playwright/test';
import { loadEnvConfig } from '@next/env';

// Load .env.local so E2E_TEST_SECRET, CRON_SECRET, etc. are available
loadEnvConfig(process.cwd());

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 60000,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3030',
    trace: 'off',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'e2e-setup',
      testMatch: /e2e-auth\.setup\.ts/,
    },
    {
      name: 'e2e',
      testMatch: /e2e-.*\.spec\.ts/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/e2e-storage.json',
      },
    },
    {
      name: 'e2e-public',
      testMatch: /e2e-public-pages\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // No auth needed for public pages
    },
    {
      name: 'chromium',
      testIgnore: /e2e-.*\.(spec|setup)\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: undefined, // Server is already running
});
