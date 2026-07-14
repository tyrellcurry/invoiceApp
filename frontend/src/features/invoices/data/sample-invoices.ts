import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';

/**
 * Sample invoice data. This stands in for the data layer.
 *
 * @TODO: replace with fetchers/hooks in `features/invoices/api` once a backend exists.
 */
export const sampleInvoices: Invoice[] = [
  {
    id: 'RT3080',
    description: 'Re-branding',
    status: InvoiceStatus.PAID,
    invoiceDate: '18 Jul 2021',
    paymentTerms: 30,
    paymentDue: '19 Aug 2021',
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
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.9 }],
    amountDue: 1800.9,
  },
  {
    id: 'XM9141',
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
  },
  {
    id: 'RG0314',
    description: 'Website Redesign',
    status: InvoiceStatus.DRAFT,
    invoiceDate: '30 Aug 2021',
    paymentTerms: 30,
    paymentDue: '01 Oct 2021',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientName: 'John Morrison',
    clientEmail: 'jm@myco.com',
    clientAddress: {
      street: '79 Dover Road',
      city: 'Westhall',
      postCode: 'IP19 3PF',
      country: 'United Kingdom',
    },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33 }],
    amountDue: 14002.33,
  },
];

/** Returns the invoice with the given id, or `undefined` if none matches. */
export const getInvoiceById = (id: string): Invoice | undefined =>
  sampleInvoices.find((invoice) => invoice.id === id);
