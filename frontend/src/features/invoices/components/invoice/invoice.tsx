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
import Container from '@/components/ui/container/container';
import DesktopView from '@/features/invoices/components/invoice/desktop-view';
import MobileView from '@/features/invoices/components/invoice/mobile-view';
import { IInvoiceProps } from '@/features/invoices/types/invoice';

const Invoice = (props: IInvoiceProps): JSX.Element => {
  return (
    <Container>
      <MobileView {...props} />
      <DesktopView {...props} />
    </Container>
  );
};

export default Invoice;
