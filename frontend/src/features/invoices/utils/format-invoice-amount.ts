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

/**
 * Formats a currency symbol and amount as a single display string, joined by
 * a non-breaking space (written as \u00A0, not a literal character, so it
 * can't be silently normalized back to a plain one) rather than a plain
 * space. A plain space is a line-break opportunity, so on a long amount (or
 * a narrow container) the browser can wrap right after the symbol,
 * stranding it alone on its own line. Pair with a `break-words` class on the
 * container so an amount that's still too long to fit wraps mid-number
 * instead of overflowing it.
 */
export const formatCurrencyAmount = (amount: number, locale: InvoiceLocale = 'en'): string =>
  `${getCurrencySymbol(locale)}\u00A0${formatInvoiceAmount(amount, locale)}`;
