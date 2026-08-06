import { expect, invoiceList, test } from './fixtures';

test.describe('invoice list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  });

  test('shows the empty state for a fresh session', async ({ page }) => {
    await expect(page.getByText('There are 0 total invoices')).toBeVisible();
    await expect(page.getByText('There is nothing here')).toBeVisible();
  });

  test('shows only this session own invoices', async ({ page, createInvoice }) => {
    await createInvoice({ clientName: 'Jensen Huang', status: 'PENDING', description: 'Re-branding' });
    await createInvoice({ clientName: 'Alex Grim', status: 'PENDING', description: 'Graphic Design' });
    await page.reload();

    await expect(page.getByText('There are 2 total invoices')).toBeVisible();
    const list = invoiceList(page);
    await expect(list).toContainText('Jensen Huang');
    await expect(list).toContainText('Alex Grim');
  });

  test('filters the list by status', async ({ page, createInvoice }) => {
    const draft = await createInvoice({ clientName: 'John Morrison', status: 'DRAFT' });
    const pending = await createInvoice({ clientName: 'Alex Grim', status: 'PENDING' });
    await page.reload();
    await expect(page.getByText('There are 2 total invoices')).toBeVisible();

    await page.getByRole('button', { name: 'Filter by status' }).click();
    await page.getByRole('checkbox', { name: 'Draft' }).check();

    const list = invoiceList(page);
    await expect(list).toContainText(draft.reference);
    await expect(list).not.toContainText(pending.reference);
  });

  test('opens an invoice from the list', async ({ page, createInvoice }) => {
    const invoice = await createInvoice({
      clientName: 'Jensen Huang',
      status: 'PENDING',
      description: 'Re-branding',
    });
    await page.reload();

    await page.getByRole('link', { name: new RegExp(invoice.reference) }).click();

    await expect(page).toHaveURL(/\/invoices\/.+/);
    // The invoice-details view and the (closed, but always-mounted) edit
    // drawer both render some of the same labels/copy, so scope to the
    // first visible match rather than asserting exact single-element text.
    await expect(page.getByText('Jensen Huang').first()).toBeVisible();
    await expect(page.getByText('Re-branding')).toBeVisible();
  });
});
