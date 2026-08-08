import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/** Fetches a single invoice by id. Rejects with ApiError(404) if it doesn't exist. */
export const getInvoice = (id: string): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}`).then(fromApiInvoice);
