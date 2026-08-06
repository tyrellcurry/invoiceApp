import {
  ApiInvoice,
  fromApiInvoice,
  toApiInvoicePayload,
} from '@/features/invoices/api/invoice-mapper';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { Invoice } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/** Replaces an invoice's editable fields. Status is unaffected; use markInvoiceAsPaid for that. */
export const updateInvoice = (id: string, values: InvoiceFormValues): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiInvoicePayload(values)),
  }).then(fromApiInvoice);
