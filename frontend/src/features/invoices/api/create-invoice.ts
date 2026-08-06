import {
  ApiInvoice,
  fromApiInvoice,
  toApiInvoicePayload,
} from '@/features/invoices/api/invoice-mapper';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

/** Creates an invoice with the given status (DRAFT for "Save as Draft", PENDING for "Save & Send"). */
export const createInvoice = (values: InvoiceFormValues, status: InvoiceStatus): Promise<Invoice> =>
  apiRequest<ApiInvoice>('/invoices', {
    method: 'POST',
    body: JSON.stringify(toApiInvoicePayload(values, status)),
  }).then(fromApiInvoice);
