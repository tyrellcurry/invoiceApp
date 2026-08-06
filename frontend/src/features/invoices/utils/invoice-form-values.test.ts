import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import {
  emptyInvoiceFormValues,
  invoiceToFormValues,
} from '@/features/invoices/utils/invoice-form-values';

const invoiceFixture: Invoice = {
  id: 'a1111111-1111-1111-1111-111111111111',
  reference: 'XM9141',
  description: 'Graphic Design',
  status: InvoiceStatus.PENDING,
  invoiceDate: '21 Aug 2021',
  paymentTerms: 30,
  paymentDue: '20 Sep 2021',
  senderAddress: {
    street: '19 Union Terrace',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientName: 'Alex Grim',
  clientEmail: 'alexgrim@mail.com',
  clientAddress: {
    street: '84 Church Way',
    city: 'Bradford',
    postCode: 'BD1 9PB',
    country: 'United Kingdom',
  },
  items: [
    { name: 'Banner Design', quantity: 1, price: 156.0 },
    { name: 'Email Design', quantity: 2, price: 200.0 },
  ],
  amountDue: 556.0,
};

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
    const values = invoiceToFormValues(invoiceFixture);
    expect(values.clientName).toBe('Alex Grim');
    expect(values.clientStreet).toBe('84 Church Way');
    expect(values.senderCity).toBe('London');
    expect(values.invoiceDate).toBe('2021-08-21');
    expect(values.items).toHaveLength(2);
    expect(values.items[0]).toEqual({ name: 'Banner Design', quantity: 1, price: 156 });
  });
});
