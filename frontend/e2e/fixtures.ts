import { test as base, Page } from '@playwright/test';

const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

export interface CreatedInvoice {
  id: string;
  reference: string;
  status: string;
}

interface CreateInvoicePayload {
  clientName: string;
  clientEmail?: string;
  description?: string;
  status?: 'DRAFT' | 'PENDING';
  invoiceDate?: string;
  paymentTerms?: number;
  items?: { name: string; quantity: number; price: number }[];
}

interface Fixtures {
  /** Creates an invoice directly via the API (bypassing the UI) for test setup. */
  createInvoice: (payload: CreateInvoicePayload) => Promise<CreatedInvoice>;
}

/**
 * Extends the base Playwright test with a `createInvoice` fixture for
 * seeding data outside the UI under test, with automatic cleanup: every
 * invoice a test creates is deleted via the API once the test finishes,
 * pass or fail, so specs never leak data into the next run.
 */
export const test = base.extend<Fixtures>({
  createInvoice: async ({}, use) => {
    const created: CreatedInvoice[] = [];

    await use(async (payload) => {
      const response = await fetch(`${apiURL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: '',
          description: '',
          senderAddress: { street: '', city: '', postCode: '', country: '' },
          clientAddress: { street: '', city: '', postCode: '', country: '' },
          items: [],
          ...payload,
        }),
      });
      const invoice = (await response.json()) as CreatedInvoice;
      created.push(invoice);
      return invoice;
    });

    await Promise.all(
      created.map((invoice) => fetch(`${apiURL}/invoices/${invoice.id}`, { method: 'DELETE' }))
    );
  },
});

export { expect } from '@playwright/test';

/**
 * Locates a `<button>` by its visible text, excluding CSS-hidden duplicates.
 * This app renders separate mobile/desktop copies of several action bars
 * (e.g. invoice-details, the form drawer footer) that differ only in which
 * breakpoint shows them, so a plain role/text query can match a hidden
 * element as well as the visible one.
 */
export const visibleButton = (page: Page, name: string | RegExp) =>
  page.locator('button:visible', { hasText: name });

/**
 * Locates the invoice list `<ul>`. Not `page.getByRole('list')` — the
 * invoice bar's `<menu>` has an implicit ARIA role of "list" too, so that
 * query matches both elements.
 */
export const invoiceList = (page: Page) => page.locator('ul');
