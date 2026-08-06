import {
  ApiInvoice,
  fromApiInvoice,
  toApiInvoicePayload,
} from '@/features/invoices/api/invoice-mapper';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

const apiInvoiceFixture: ApiInvoice = {
  id: 'a1111111-1111-1111-1111-111111111111',
  reference: 'RT3080',
  description: 'Re-branding',
  status: InvoiceStatus.PENDING,
  invoiceDate: '2021-07-18',
  paymentTerms: 30,
  paymentDue: '2021-08-17',
  senderAddress: {
    street: '19 Union Terrace',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientName: 'Jensen Huang',
  clientEmail: 'jensenh@mail.com',
  clientAddress: {
    street: '106 Kendell Street',
    city: 'Sharrington',
    postCode: 'NR24 5WQ',
    country: 'United Kingdom',
  },
  items: [{ name: 'Brand Guidelines', quantity: 1, price: 180090 }],
  amountDue: 180090,
};

describe('fromApiInvoice', () => {
  it('converts cents to major units', () => {
    const invoice = fromApiInvoice(apiInvoiceFixture);
    expect(invoice.amountDue).toBe(1800.9);
    expect(invoice.items[0]).toEqual({ name: 'Brand Guidelines', quantity: 1, price: 1800.9 });
  });

  it('converts ISO dates to display dates', () => {
    const invoice = fromApiInvoice(apiInvoiceFixture);
    expect(invoice.invoiceDate).toBe('18 Jul 2021');
    expect(invoice.paymentDue).toBe('17 Aug 2021');
  });

  it('keeps id and reference separate', () => {
    const invoice = fromApiInvoice(apiInvoiceFixture);
    expect(invoice.id).toBe('a1111111-1111-1111-1111-111111111111');
    expect(invoice.reference).toBe('RT3080');
  });

  it('maps null dates and payment terms for a draft', () => {
    const invoice = fromApiInvoice({
      ...apiInvoiceFixture,
      status: InvoiceStatus.DRAFT,
      invoiceDate: null,
      paymentTerms: null,
      paymentDue: null,
    });
    expect(invoice.invoiceDate).toBe('');
    expect(invoice.paymentDue).toBe('');
    expect(invoice.paymentTerms).toBe(30);
  });
});

describe('toApiInvoicePayload', () => {
  const formValues: InvoiceFormValues = {
    senderStreet: '19 Union Terrace',
    senderCity: 'London',
    senderPostCode: 'E1 3EZ',
    senderCountry: 'United Kingdom',
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    clientStreet: '106 Kendell Street',
    clientCity: 'Sharrington',
    clientPostCode: 'NR24 5WQ',
    clientCountry: 'United Kingdom',
    invoiceDate: '2021-07-18',
    paymentTerms: 30,
    description: 'Re-branding',
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.9 }],
  };

  it('converts major units to whole cents, rounding away float drift', () => {
    const payload = toApiInvoicePayload(formValues);
    expect(payload.items[0]).toEqual({ name: 'Brand Guidelines', quantity: 1, price: 180090 });
  });

  it('includes status only when provided', () => {
    expect(toApiInvoicePayload(formValues).status).toBeUndefined();
    expect(toApiInvoicePayload(formValues, InvoiceStatus.DRAFT).status).toBe(InvoiceStatus.DRAFT);
  });

  it('sends null instead of an empty invoice date', () => {
    const payload = toApiInvoicePayload({ ...formValues, invoiceDate: '' });
    expect(payload.invoiceDate).toBeNull();
  });
});
