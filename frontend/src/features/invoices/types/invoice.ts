export enum InvoiceStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
}

export type InvoiceLocale = 'en' | 'fr';

export interface InvoiceAddress {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceLineItem {
  name: string;
  quantity: number;
  price: number;
}

/** Full invoice record @TODO:(stands in for the API model until a backend exists). */
export interface Invoice {
  id: string;
  description: string;
  status: InvoiceStatus;
  invoiceDate: string;
  /** Payment terms in days (e.g. 30 = Net 30 Days). */
  paymentTerms: number;
  paymentDue: string;
  senderAddress: InvoiceAddress;
  clientName: string;
  clientEmail: string;
  clientAddress: InvoiceAddress;
  items: InvoiceLineItem[];
  amountDue: number;
}

export interface IInvoiceProps {
  invoiceId: string;
  invoiceDueDate: string;
  billingName: string;
  invoiceAmountDue: number;
  invoiceStatus: InvoiceStatus;
  localeAmountDue?: InvoiceLocale;
  dueText: string;
  invoiceStatusText: string;
}
