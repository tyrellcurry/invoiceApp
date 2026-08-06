import { expect, invoiceList, test, visibleButton } from './fixtures';

test('deletes an invoice from its detail page', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Client To Delete', status: 'DRAFT' });

  await page.goto(`/invoices/${invoice.id}`);
  await expect(page.getByText('Client To Delete')).toBeVisible();

  await visibleButton(page, /^Delete$/).click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(invoice.reference);

  await dialog.locator('button:visible', { hasText: /^Delete$/ }).click();

  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  await expect(invoiceList(page)).not.toContainText(invoice.reference);
});

test('cancelling the delete dialog keeps the invoice', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Client To Keep', status: 'DRAFT' });

  await page.goto(`/invoices/${invoice.id}`);
  await visibleButton(page, /^Delete$/).click();
  const dialog = page.getByRole('alertdialog');
  await dialog.locator('button:visible', { hasText: 'Cancel' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText('Client To Keep')).toBeVisible();
});
