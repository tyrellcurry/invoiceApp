import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { Invoice } from '@/features/invoices/types/invoice';
import { toDateInputValue } from '@/features/invoices/utils/invoice-date';

/** Blank form values for creating a new invoice. */
export const emptyInvoiceFormValues = (): InvoiceFormValues => ({
  senderStreet: '',
  senderCity: '',
  senderPostCode: '',
  senderCountry: '',
  clientName: '',
  clientEmail: '',
  clientStreet: '',
  clientCity: '',
  clientPostCode: '',
  clientCountry: '',
  invoiceDate: '',
  paymentTerms: 30,
  description: '',
  items: [],
});

/** Maps an existing invoice to editable form values (for the edit drawer). */
export const invoiceToFormValues = (invoice: Invoice): InvoiceFormValues => ({
  senderStreet: invoice.senderAddress.street,
  senderCity: invoice.senderAddress.city,
  senderPostCode: invoice.senderAddress.postCode,
  senderCountry: invoice.senderAddress.country,
  clientName: invoice.clientName,
  clientEmail: invoice.clientEmail,
  clientStreet: invoice.clientAddress.street,
  clientCity: invoice.clientAddress.city,
  clientPostCode: invoice.clientAddress.postCode,
  clientCountry: invoice.clientAddress.country,
  invoiceDate: toDateInputValue(invoice.invoiceDate),
  paymentTerms: invoice.paymentTerms,
  description: invoice.description,
  items: invoice.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  })),
});
