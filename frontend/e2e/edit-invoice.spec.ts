import { expect, test, visibleButton } from './fixtures';

test('edits an invoice from its detail page', async ({ page, createInvoice }) => {
  const invoice = await createInvoice({
    clientName: 'Original Client',
    status: 'PENDING',
    items: [{ name: 'Design work', quantity: 1, price: 10000 }],
  });

  await page.goto(`/invoices/${invoice.id}`);
  await expect(page.getByText('Original Client')).toBeVisible();

  await visibleButton(page, /^Edit$/).click();
  await expect(page.getByRole('heading', { name: /Edit/ })).toBeVisible();
  await page.getByLabel(/client's name/i).fill('Updated Client');
  await visibleButton(page, 'Save Changes').click();

  await expect(page.getByText('Updated Client')).toBeVisible();
  await expect(page.getByText('Original Client')).toHaveCount(0);

  // Reload to confirm the edit was actually persisted server-side, not just held in local state.
  await page.reload();
  await expect(page.getByText('Updated Client')).toBeVisible();
});
