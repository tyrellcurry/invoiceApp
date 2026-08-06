import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/** Fetches every invoice. */
export const getInvoices = (): Promise<Invoice[]> =>
  apiRequest<ApiInvoice[]>('/invoices').then((invoices) => invoices.map(fromApiInvoice));
