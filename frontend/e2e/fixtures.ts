import { test as base, Page } from '@playwright/test';

const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';

interface GuestSession {
  token: string;
  expiresAt: string;
}

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
  /**
   * The guest session `page` is signed into for this test (see the `page`
   * override below). Exposed so `createInvoice` can create data under the
   * same session the page is using, and to build API requests directly
   * when a test needs to.
   */
  guestSession: GuestSession;
  /** Creates an invoice directly via the API (bypassing the UI) for test setup, owned by guestSession. */
  createInvoice: (payload: CreateInvoicePayload) => Promise<CreatedInvoice>;
}

/**
 * Every test gets its own guest session (every endpoint under test requires
 * one now), injected into the page's localStorage before any app script
 * runs so specs start already past the splash gate. The session is revoked
 * on teardown, which cascade-deletes every invoice created under it — no
 * per-invoice cleanup needed.
 */
export const test = base.extend<Fixtures>({
  guestSession: async ({}, use) => {
    const response = await fetch(`${apiURL}/auth/guest`, { method: 'POST' });
    const session = (await response.json()) as GuestSession;

    await use(session);

    await fetch(`${apiURL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
    }).catch(() => {});
  },

  page: async ({ page, guestSession }, use) => {
    await page.addInitScript((session) => {
      window.localStorage.setItem(
        'invoiceapp.session',
        JSON.stringify({ token: session.token, expiresAt: session.expiresAt })
      );
    }, guestSession);
    await use(page);
  },

  createInvoice: async ({ guestSession }, use) => {
    await use(async (payload) => {
      const response = await fetch(`${apiURL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${guestSession.token}` },
        body: JSON.stringify({
          clientEmail: '',
          description: '',
          senderAddress: { street: '', city: '', postCode: '', country: '' },
          clientAddress: { street: '', city: '', postCode: '', country: '' },
          items: [],
          ...payload,
        }),
      });
      return (await response.json()) as CreatedInvoice;
    });
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
