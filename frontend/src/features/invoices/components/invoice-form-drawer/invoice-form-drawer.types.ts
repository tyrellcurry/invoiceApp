import { InvoiceLocale, InvoiceStatus } from '@/features/invoices/types/invoice';

export type InvoiceFormMode = 'create' | 'edit';

export interface InvoiceFormItem {
  name: string;
  quantity: number;
  price: number;
}

/** Editable values held by the drawer form. */
export interface InvoiceFormValues {
  /**
   * Edit mode only: the drawer exposes a status selector, and the caller
   * sends this along with the update. Ignored in create mode, where the
   * footer's Save as Draft / Save & Send buttons pick the status instead.
   */
  status: InvoiceStatus;
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;
  clientName: string;
  clientEmail: string;
  clientStreet: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  /** `input[type=date]` value, e.g. "2021-08-21". */
  invoiceDate: string;
  /** Payment terms in days. */
  paymentTerms: number;
  description: string;
  items: InvoiceFormItem[];
}

/** All user-facing copy, passed in so the drawer stays presentation-only. */
export interface InvoiceFormLabels {
  editTitle: string;
  createTitle: string;
  status: string;
  statusDraft: string;
  statusPending: string;
  statusPaid: string;
  billFrom: string;
  billTo: string;
  streetAddress: string;
  city: string;
  postCode: string;
  country: string;
  clientName: string;
  clientEmail: string;
  invoiceDate: string;
  paymentTerms: string;
  projectDescription: string;
  itemList: string;
  itemName: string;
  quantity: string;
  price: string;
  total: string;
  addNewItem: string;
  removeItem: string;
  cancel: string;
  saveChanges: string;
  discard: string;
  saveAsDraft: string;
  saveAndSend: string;
}

export interface PaymentTermOption {
  /** Number of days. */
  value: number;
  label: string;
}

export interface IInvoiceFormDrawerProps {
  open: boolean;
  mode: InvoiceFormMode;
  /** For the "Edit #XXXX" title. */
  invoiceId?: string;
  initialValues: InvoiceFormValues;
  paymentTermOptions: PaymentTermOption[];
  localeAmountDue?: InvoiceLocale;
  labels: InvoiceFormLabels;
  onClose: () => void;
  /** Edit mode: Save Changes. Create mode: Save & Send. */
  onSubmit: (values: InvoiceFormValues) => void;
  /** Create mode only: Save as Draft. */
  onSaveDraft?: (values: InvoiceFormValues) => void;
}
