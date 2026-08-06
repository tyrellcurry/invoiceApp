import { apiRequest } from '@/features/invoices/api/client';
import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';

/** Transitions an invoice's status to PAID. */
export const markInvoiceAsPaid = (id: string): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}/mark-as-paid`, { method: 'POST' }).then(fromApiInvoice);
