import { useTranslations } from 'use-intl';
import {
  InvoiceFormLabels,
  PaymentTermOption,
} from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';

/** Builds the invoice form drawer's labels and payment term options from i18n. */
export const useInvoiceFormLabels = (): {
  labels: InvoiceFormLabels;
  paymentTermOptions: PaymentTermOption[];
} => {
  const t = useTranslations('InvoiceForm');

  const labels: InvoiceFormLabels = {
    editTitle: t('editTitle'),
    createTitle: t('createTitle'),
    status: t('status'),
    statusDraft: t('statusDraft'),
    statusPending: t('statusPending'),
    statusPaid: t('statusPaid'),
    billFrom: t('billFrom'),
    billTo: t('billTo'),
    streetAddress: t('streetAddress'),
    city: t('city'),
    postCode: t('postCode'),
    country: t('country'),
    clientName: t('clientName'),
    clientEmail: t('clientEmail'),
    invoiceDate: t('invoiceDate'),
    paymentTerms: t('paymentTerms'),
    projectDescription: t('projectDescription'),
    itemList: t('itemList'),
    itemName: t('itemName'),
    quantity: t('quantity'),
    price: t('price'),
    total: t('total'),
    addNewItem: t('addNewItem'),
    removeItem: t('removeItem'),
    cancel: t('cancel'),
    saveChanges: t('saveChanges'),
    discard: t('discard'),
    saveAsDraft: t('saveAsDraft'),
    saveAndSend: t('saveAndSend'),
  };

  const paymentTermOptions: PaymentTermOption[] = [
    { value: 1, label: t('term1') },
    { value: 7, label: t('term7') },
    { value: 14, label: t('term14') },
    { value: 30, label: t('term30') },
  ];

  return { labels, paymentTermOptions };
};
