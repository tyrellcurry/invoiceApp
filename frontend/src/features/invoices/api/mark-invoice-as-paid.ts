import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/** Transitions an invoice's status to PAID. */
export const markInvoiceAsPaid = (id: string): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}/mark-as-paid`, { method: 'POST' }).then(fromApiInvoice);
