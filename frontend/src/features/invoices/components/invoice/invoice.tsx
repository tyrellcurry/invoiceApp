/**
 * @name Invoice
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for individual invoices
 *
 * @param invoiceId
 * @param invoiceDueDate
 * @param billingName
 * @param invoiceAmountDue
 * @param invoiceStatus
 * @param invoiceStatusText
 * @param dueText
 * @param localeAmountDue - default: 'en'
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import { IInvoiceProps } from '@/features/invoices/types/invoice';
import MobileView from '@/features/invoices/components/invoice/mobile-view';
import DesktopView from '@/features/invoices/components/invoice/desktop-view';

const Invoice = (props: IInvoiceProps): JSX.Element => {
  return (
    <div>
      <MobileView {...props} />
      <DesktopView {...props} />
    </div>
  );
};

export default Invoice;
