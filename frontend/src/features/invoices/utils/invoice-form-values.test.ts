import {
  emptyInvoiceFormValues,
  invoiceToFormValues,
} from '@/features/invoices/utils/invoice-form-values';
import { getInvoiceById } from '@/features/invoices/data/sample-invoices';

describe('emptyInvoiceFormValues', () => {
  it('returns blank fields and no items', () => {
    const values = emptyInvoiceFormValues();
    expect(values.clientName).toBe('');
    expect(values.items).toHaveLength(0);
    expect(values.paymentTerms).toBe(30);
  });
});

describe('invoiceToFormValues', () => {
  it('maps invoice fields into flat form values with an ISO date', () => {
    const invoice = getInvoiceById('XM9141')!;
    const values = invoiceToFormValues(invoice);
    expect(values.clientName).toBe('Alex Grim');
    expect(values.clientStreet).toBe('84 Church Way');
    expect(values.senderCity).toBe('London');
    expect(values.invoiceDate).toBe('2021-08-21');
    expect(values.items).toHaveLength(2);
    expect(values.items[0]).toEqual({ name: 'Banner Design', quantity: 1, price: 156 });
  });
});
