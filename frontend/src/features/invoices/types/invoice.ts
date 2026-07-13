export enum InvoiceStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
}

export type InvoiceLocale = 'en' | 'fr';

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
