import { apiRequest } from '@/features/invoices/api/client';
import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';

/** Fetches a single invoice by id. Rejects with ApiError(404) if it doesn't exist. */
export const getInvoice = (id: string): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}`).then(fromApiInvoice);
