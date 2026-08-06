// Deliberately uses Playwright's own `test`, not the ./fixtures override —
// that override injects a guest session before every test specifically so
// specs can skip the splash gate, which is exactly what this file needs to
// see.
import { expect, test } from '@playwright/test';

test('shows the splash screen on a first visit with no session', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welcome to Invoice App')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByText(/deleted when your session ends/i)).toBeVisible();
});

test('continuing without logging in reveals the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Welcome to Invoice App')).toBeVisible();

  await page.getByRole('button', { name: 'Continue without logging in' }).click();

  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();

  const stored = await page.evaluate(() => window.localStorage.getItem('invoiceapp.session'));
  expect(stored).not.toBeNull();
});

test('reloading with a stored session skips the splash screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continue without logging in' }).click();
  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  await expect(page.getByText('Welcome to Invoice App')).not.toBeVisible();
});
