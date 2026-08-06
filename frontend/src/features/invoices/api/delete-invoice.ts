import { apiRequest } from '@/features/invoices/api/client';

/** Deletes an invoice. */
export const deleteInvoice = (id: string): Promise<void> =>
  apiRequest<void>(`/invoices/${id}`, { method: 'DELETE' });
