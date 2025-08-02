export enum InvoiceStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
}
export interface IInvoiceProps {
  invoiceId: string;
  invoiceDueDate: string;
  billingName: string;
  invoiceAmountDue: number;
  invoiceStatus: InvoiceStatus;
  localeAmountDue?: 'en' | 'fr';
  dueText: string;
  invoiceStatusText: string;
}
