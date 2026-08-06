import { expect, invoiceList, test } from './fixtures';
import { SEED_REFERENCES } from './global-setup';

test.describe('invoice list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  });

  test('shows every seeded invoice', async ({ page }) => {
    await expect(page.getByText('There are 5 total invoices')).toBeVisible();

    const list = invoiceList(page);
    for (const reference of SEED_REFERENCES) {
      await expect(list).toContainText(reference);
    }
  });

  test('filters the list by status', async ({ page }) => {
    await page.getByRole('button', { name: 'Filter by status' }).click();
    await page.getByRole('checkbox', { name: 'Draft' }).check();

    const list = invoiceList(page);
    await expect(list).toContainText('RG0314');
    await expect(list).not.toContainText('RT3080');
    await expect(list).not.toContainText('XM9141');
  });

  test('opens an invoice from the list', async ({ page }) => {
    await page.getByRole('link', { name: /RT3080/ }).click();

    await expect(page).toHaveURL(/\/invoices\/.+/);
    // The invoice-details view and the (closed, but always-mounted) edit
    // drawer both render some of the same labels/copy, so scope to the
    // first visible match rather than asserting exact single-element text.
    await expect(page.getByText('Jensen Huang').first()).toBeVisible();
    await expect(page.getByText('Re-branding')).toBeVisible();
  });
});
