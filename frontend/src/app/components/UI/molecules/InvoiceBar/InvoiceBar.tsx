import Button from '@/app/components/UI/atoms/Button/Button';
import { IInvoiceBarProps } from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar.interface';
import { JSX } from 'react';

const InvoiceBar = (props: IInvoiceBarProps): JSX.Element => {
  /* eslint-disable */
  const {
    invoiceBarTitle,
    totalInvoicesTextDesktop,
    totalInvoicesTextMobile,
    filterStatusBtnTextDesktop,
    filterStatusBtnTextMobile,
    newInvoiceBtnTextDesktop,
    newInvoiceBtnTextMobile,
    draftText,
    pendingText,
    paidText,
  } = props;
  /* eslint-disable */
  return (
    <menu>
      <div>
        <p>{invoiceBarTitle}</p>
        <p>{totalInvoicesTextMobile}</p>
      </div>
      <div>
        <Button iconRight={'chevron-down'} iconRightClassName="min-w-5 min-h-5">
          {filterStatusBtnTextMobile}
        </Button>
        <Button
          iconLeft={'circle-plus'}
          variant="primary"
          className="p-1"
          iconLeftClassName="min-w-8 min-h-8"
        >
          {newInvoiceBtnTextMobile}
        </Button>
      </div>
    </menu>
  );
};

export default InvoiceBar;
