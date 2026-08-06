import { apiRequest } from '@/lib/api-client';

/** Deletes an invoice. */
export const deleteInvoice = (id: string): Promise<void> =>
  apiRequest<void>(`/invoices/${id}`, { method: 'DELETE' });
