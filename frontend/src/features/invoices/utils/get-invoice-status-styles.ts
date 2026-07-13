import { InvoiceStatus } from '@/features/invoices/types/invoice';

interface InvoiceStatusStyles {
  /** Class map for the status badge container. */
  badge: Record<string, boolean>;
  /** Class map for the small status indicator dot. */
  dot: Record<string, boolean>;
}

/**
 * Maps an invoice status to its badge and indicator-dot Tailwind classes.
 * Keeps status-to-style resolution out of the presentation components.
 */
export const getInvoiceStatusStyles = (status: InvoiceStatus): InvoiceStatusStyles => ({
  badge: {
    'bg-green-05a text-green-05': status === InvoiceStatus.PAID,
    'bg-orange-05a text-orange-05': status === InvoiceStatus.PENDING,
    'bg-gray-09a dark:bg-gray-09b text-gray-09 dark:text-gray-05': status === InvoiceStatus.DRAFT,
  },
  dot: {
    'bg-green-05': status === InvoiceStatus.PAID,
    'bg-orange-05': status === InvoiceStatus.PENDING,
    'bg-gray-09 dark:bg-gray-05': status === InvoiceStatus.DRAFT,
  },
});
