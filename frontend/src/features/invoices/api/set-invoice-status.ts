import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/**
 * Transitions an invoice to `status`. Every transition is allowed, so this
 * covers both marking an invoice as paid and reverting a paid one to pending.
 */
export const setInvoiceStatus = (id: string, status: InvoiceStatus): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }).then(fromApiInvoice);
