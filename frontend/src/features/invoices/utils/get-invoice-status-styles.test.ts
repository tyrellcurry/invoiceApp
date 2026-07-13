import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { getInvoiceStatusStyles } from './get-invoice-status-styles';

describe('getInvoiceStatusStyles', () => {
  it('marks only the paid classes as active for a paid invoice', () => {
    const { badge, dot } = getInvoiceStatusStyles(InvoiceStatus.PAID);
    expect(badge['bg-green-05a text-green-05']).toBe(true);
    expect(badge['bg-orange-05a text-orange-05']).toBe(false);
    expect(dot['bg-green-05']).toBe(true);
  });

  it('marks only the pending classes as active for a pending invoice', () => {
    const { badge, dot } = getInvoiceStatusStyles(InvoiceStatus.PENDING);
    expect(badge['bg-orange-05a text-orange-05']).toBe(true);
    expect(dot['bg-orange-05']).toBe(true);
  });

  it('marks only the draft classes as active for a draft invoice', () => {
    const { badge, dot } = getInvoiceStatusStyles(InvoiceStatus.DRAFT);
    expect(badge['bg-gray-09a dark:bg-gray-09b text-gray-09 dark:text-gray-05']).toBe(true);
    expect(dot['bg-gray-09 dark:bg-gray-05']).toBe(true);
  });
});
