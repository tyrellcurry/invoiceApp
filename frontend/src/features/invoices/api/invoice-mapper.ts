import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import {
  Invoice,
  InvoiceAddress,
  InvoiceLineItem,
  InvoiceStatus,
} from '@/features/invoices/types/invoice';
import { fromDateInputValue } from '@/features/invoices/utils/invoice-date';

/** Raw invoice item shape as returned by the API (money in minor units). */
export interface ApiInvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

/** Raw invoice shape as returned by the API (money in minor units, ISO dates). */
export interface ApiInvoice {
  id: string;
  reference: string;
  description: string;
  status: InvoiceStatus;
  invoiceDate: string | null;
  paymentTerms: number | null;
  paymentDue: string | null;
  senderAddress: InvoiceAddress;
  clientName: string;
  clientEmail: string;
  clientAddress: InvoiceAddress;
  items: ApiInvoiceItem[];
  amountDue: number;
}

/** Request body shape accepted by POST/PUT /invoices. */
export interface ApiInvoicePayload {
  description: string;
  status?: InvoiceStatus;
  invoiceDate: string | null;
  paymentTerms: number | null;
  senderAddress: InvoiceAddress;
  clientName: string;
  clientEmail: string;
  clientAddress: InvoiceAddress;
  items: ApiInvoiceItem[];
}

/** Converts an amount in cents (API) to major units (frontend display). */
const centsToAmount = (cents: number): number => cents / 100;

/** Converts a major-unit amount (frontend) to whole cents (API). */
const amountToCents = (amount: number): number => Math.round(amount * 100);

/** Maps an API invoice to the frontend's display shape. */
export const fromApiInvoice = (raw: ApiInvoice): Invoice => ({
  id: raw.id,
  reference: raw.reference,
  description: raw.description,
  status: raw.status,
  invoiceDate: raw.invoiceDate ? fromDateInputValue(raw.invoiceDate) : '',
  paymentTerms: raw.paymentTerms ?? 30,
  paymentDue: raw.paymentDue ? fromDateInputValue(raw.paymentDue) : '',
  senderAddress: raw.senderAddress,
  clientName: raw.clientName,
  clientEmail: raw.clientEmail,
  clientAddress: raw.clientAddress,
  items: raw.items.map((item): InvoiceLineItem => ({
    name: item.name,
    quantity: item.quantity,
    price: centsToAmount(item.price),
  })),
  amountDue: centsToAmount(raw.amountDue),
});

/** Builds a create/update request body from the form drawer's values. */
export const toApiInvoicePayload = (
  values: InvoiceFormValues,
  status?: InvoiceStatus
): ApiInvoicePayload => ({
  description: values.description,
  ...(status ? { status } : {}),
  invoiceDate: values.invoiceDate || null,
  paymentTerms: values.paymentTerms,
  senderAddress: {
    street: values.senderStreet,
    city: values.senderCity,
    postCode: values.senderPostCode,
    country: values.senderCountry,
  },
  clientName: values.clientName,
  clientEmail: values.clientEmail,
  clientAddress: {
    street: values.clientStreet,
    city: values.clientCity,
    postCode: values.clientPostCode,
    country: values.clientCountry,
  },
  items: values.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: amountToCents(item.price),
  })),
});
