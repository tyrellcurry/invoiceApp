export interface IInvoiceProps {
  invoiceId: string;
  invoiceDueDate: string;
  billingName: string;
  invoiceAmountDue: number;
  invoiceStatus: 'paid' | 'pending' | 'draft';
  localeAmountDue?: 'en' | 'fr';
  dueText: string;
  invoiceStatusText: string;
}
