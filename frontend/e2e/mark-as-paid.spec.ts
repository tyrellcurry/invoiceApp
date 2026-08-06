import { expect, invoiceStatusBadge, test, visibleButton } from './fixtures';

test('marks a pending invoice as paid', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Awaiting Payment Co', status: 'PENDING' });

  await page.goto(`/invoices/${invoice.id}`);
  await expect(invoiceStatusBadge(page)).toHaveText('Pending');

  await visibleButton(page, 'Mark as Paid').click();

  await expect(invoiceStatusBadge(page)).toHaveText('Paid');

  // Reload to confirm the status change was persisted server-side.
  await page.reload();
  await expect(invoiceStatusBadge(page)).toHaveText('Paid');
});

test('reverts a paid invoice back to pending', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Already Paid Co', status: 'PENDING' });

  await page.goto(`/invoices/${invoice.id}`);
  await visibleButton(page, 'Mark as Paid').click();
  await expect(invoiceStatusBadge(page)).toHaveText('Paid');

  // Once paid, the primary action becomes the inverse.
  await expect(visibleButton(page, 'Mark as Paid')).toHaveCount(0);
  await visibleButton(page, 'Revert to Pending').click();

  await expect(invoiceStatusBadge(page)).toHaveText('Pending');

  await page.reload();
  await expect(invoiceStatusBadge(page)).toHaveText('Pending');
  await expect(visibleButton(page, 'Mark as Paid')).not.toHaveCount(0);
});

test('changes the status from the edit drawer', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Status Change Co', status: 'DRAFT' });

  await page.goto(`/invoices/${invoice.id}`);
  await expect(invoiceStatusBadge(page)).toHaveText('Draft');

  await visibleButton(page, /^Edit$/).click();
  await page.getByLabel('Status', { exact: true }).selectOption('PAID');
  await visibleButton(page, 'Save Changes').click();

  await expect(invoiceStatusBadge(page)).toHaveText('Paid');

  await page.reload();
  await expect(invoiceStatusBadge(page)).toHaveText('Paid');
});
