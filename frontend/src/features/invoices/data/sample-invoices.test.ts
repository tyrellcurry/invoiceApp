import { getInvoiceById, sampleInvoices } from '@/features/invoices/data/sample-invoices';
import { getLineItemTotal } from '@/features/invoices/utils/get-line-item-total';

describe('sampleInvoices', () => {
  it('has a stated amount due matching the sum of its line items', () => {
    sampleInvoices.forEach((invoice) => {
      const total = invoice.items.reduce(
        (sum, item) => sum + getLineItemTotal(item.quantity, item.price),
        0
      );
      expect(invoice.amountDue).toBeCloseTo(total, 2);
    });
  });
});

describe('getInvoiceById', () => {
  it('returns the matching invoice', () => {
    expect(getInvoiceById('XM9141')?.clientName).toBe('Alex Grim');
  });

  it('returns undefined for an unknown id', () => {
    expect(getInvoiceById('NOPE00')).toBeUndefined();
  });
});
