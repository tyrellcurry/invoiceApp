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
import { IInvoiceProps } from '@/components/UI/molecules/Invoice/Invoice.interface';
import MobileView from '@/components/UI/molecules/Invoice/MobileView';
import DesktopView from '@/components/UI/molecules/Invoice/DesktopView';

const Invoice = (props: IInvoiceProps): JSX.Element => {
  return (
    <div>
      <MobileView {...props} />
      <DesktopView {...props} />
    </div>
  );
};

export default Invoice;
