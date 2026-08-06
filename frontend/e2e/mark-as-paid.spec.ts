import { expect, test, visibleButton } from './fixtures';

test('marks a pending invoice as paid', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({ clientName: 'Awaiting Payment Co', status: 'PENDING' });

  await page.goto(`/invoices/${invoice.id}`);
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();

  await visibleButton(page, 'Mark as Paid').click();

  await expect(page.getByText('Paid', { exact: true })).toBeVisible();
  await expect(page.getByText('Pending', { exact: true })).toHaveCount(0);

  // Reload to confirm the status change was persisted server-side.
  await page.reload();
  await expect(page.getByText('Paid', { exact: true })).toBeVisible();
});
