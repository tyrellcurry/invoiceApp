import { expect, invoiceList, test, visibleButton } from './fixtures';

test('creates an invoice as a draft from the list page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'New Invoice' }).click();
  await expect(page.getByRole('heading', { name: 'New Invoice' })).toBeVisible();

  await page.getByLabel(/client's name/i).fill('Playwright Client');
  await page.getByLabel(/client's email/i).fill('playwright@example.com');
  await visibleButton(page, '+ Add New Item').click();
  await page.getByLabel(/item name/i).fill('Automated testing');
  await page.locator('[id^="item-qty-"]:visible').fill('1');
  await page.locator('[id^="item-price-"]:visible').fill('99');

  await visibleButton(page, 'Save as Draft').click();

  const list = invoiceList(page);
  await expect(list).toContainText('Playwright Client');
  await expect(list).toContainText('Draft');

  // Clean up through the UI itself: open the invoice this test created and delete it.
  await page.getByRole('link', { name: /Playwright Client/ }).click();
  await visibleButton(page, /^Delete$/).click();
  await page.getByRole('alertdialog').locator('button:visible', { hasText: /^Delete$/ }).click();
  await expect(page.getByRole('heading', { name: 'Invoices' })).toBeVisible();
  // Back to just the 3 example invoices every fresh guest session is preloaded with.
  await expect(page.getByText('There are 3 total invoices')).toBeVisible();
});

test('a new item starts with a blank price, not a literal 0', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'New Invoice' }).click();
  await visibleButton(page, '+ Add New Item').click();

  await expect(page.locator('[id^="item-price-"]:visible')).toHaveValue('');
});

test('shows the save error inside the still-open drawer, not on the page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'New Invoice' }).click();
  // Leaving the required client name blank fails server-side validation.
  await visibleButton(page, 'Save as Draft').click();

  const drawer = page.getByRole('dialog', { name: 'New Invoice' });
  await expect(drawer.getByText(/couldn't save this invoice/i)).toBeVisible();
  await expect(drawer).toBeVisible();
});
