import {
  ApiInvoice,
  fromApiInvoice,
  toApiInvoicePayload,
} from '@/features/invoices/api/invoice-mapper';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/**
 * Replaces an invoice's editable fields, including its status (the edit
 * drawer exposes a status selector). Omitting `status` keeps the current one.
 */
export const updateInvoice = (
  id: string,
  values: InvoiceFormValues,
  status?: InvoiceStatus
): Promise<Invoice> =>
  apiRequest<ApiInvoice>(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiInvoicePayload(values, status)),
  }).then(fromApiInvoice);
