import { apiRequest } from '@/features/invoices/api/client';
import { ApiInvoice, fromApiInvoice } from '@/features/invoices/api/invoice-mapper';
import { Invoice } from '@/features/invoices/types/invoice';

/** Fetches every invoice. */
export const getInvoices = (): Promise<Invoice[]> =>
  apiRequest<ApiInvoice[]>('/invoices').then((invoices) => invoices.map(fromApiInvoice));
