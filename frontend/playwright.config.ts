import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

/**
 * These tests exercise the real Go API against a real Postgres database (see
 * e2e/fixtures.ts), not a mocked one. Every test gets its own guest session
 * (see the `guestSession`/`page` fixtures), so specs are fully isolated from
 * each other and can run concurrently. `webServer` starts both the frontend
 * and the backend if they aren't already running (`reuseExistingServer:
 * true` so an already-running dev setup, local or CI, is reused rather than
 * duplicated); Postgres itself must already be up (`docker compose up -d
 * db` locally, a service container in CI).
 */
export default defineConfig({
  testDir: './e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run dev',
      cwd: '.',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'go run .',
      cwd: '../backend',
      url: `${apiURL}/healthz`,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
