import { InvoiceLocale } from '@/features/invoices/types/invoice';

const CURRENCY_SYMBOLS: Record<InvoiceLocale, string> = {
  en: '$',
  fr: '€',
};

/** Returns the currency symbol used for a supported invoice locale. */
export const getCurrencySymbol = (locale: InvoiceLocale): string => CURRENCY_SYMBOLS[locale];

/** Formats an invoice amount for display in the given locale (two decimal places). */
export const formatInvoiceAmount = (amount: number, locale: InvoiceLocale = 'en'): string =>
  amount.toLocaleString(locale, { minimumFractionDigits: 2 });
