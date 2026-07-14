import { InvoiceLocale, InvoiceStatus } from '@/features/invoices/types/invoice';

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

/** All user-facing copy, passed in so the component stays presentation-only. */
export interface InvoiceDetailsLabels {
  goBack: string;
  status: string;
  statusText: string;
  edit: string;
  delete: string;
  markAsPaid: string;
  billTo: string;
  sentTo: string;
  invoiceDate: string;
  paymentDue: string;
  itemName: string;
  quantity: string;
  price: string;
  total: string;
  amountDue: string;
}

export interface IInvoiceDetailsProps {
  invoiceId: string;
  description: string;
  invoiceStatus: InvoiceStatus;
  invoiceDate: string;
  paymentDue: string;
  senderAddress: InvoiceAddress;
  clientName: string;
  clientEmail: string;
  clientAddress: InvoiceAddress;
  items: InvoiceLineItem[];
  invoiceAmountDue: number;
  localeAmountDue?: InvoiceLocale;
  labels: InvoiceDetailsLabels;
  onGoBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkAsPaid?: () => void;
}
