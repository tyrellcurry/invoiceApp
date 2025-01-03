import Button from '@/app/components/UI/atoms/Button/Button';
import Text from '@/app/components/UI/atoms/Text/Text';
import { IInvoiceBarProps } from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar.interface';
import classNames from 'classnames';
import { JSX, useState } from 'react';

const InvoiceBar = (props: IInvoiceBarProps): JSX.Element => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const DropDown = (): JSX.Element => {
    return <div></div>;
  };
  /* eslint-disable */

  return (
    <menu className="flex items-center justify-between">
      <div>
        <Text className="text-gray-08 dark:text-white" tag={'h2'} variant="h2">
          {invoiceBarTitle}
        </Text>
        <Text className="text-gray-06 dark:text-white md:hidden" tag={'p'}>
          {totalInvoicesTextMobile}
        </Text>
        <Text className="text-gray-06 dark:text-white hidden md:block" tag={'p'}>
          {totalInvoicesTextDesktop}
        </Text>
      </div>
      <div className="flex items-center gap-x-[18px] md:gap-x-10">
        <Button
          className="flex items-center gap-x-3 font-bold text-xl dark:text-gray-05 md:hidden"
          variant="custom"
          iconRight={'chevron-down'}
          iconRightClassName={classNames('w-5 h-auto', {
            'rotate-180': !!isFilterOpen,
          })}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {filterStatusBtnTextMobile}
        </Button>
        <Button
          className="items-center gap-x-3 font-bold text-lg dark:text-gray-05 hidden md:flex"
          variant="custom"
          iconRight={'chevron-down'}
          iconRightClassName={classNames('w-4 h-auto', {
            'rotate-180': !!isFilterOpen,
          })}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {filterStatusBtnTextDesktop}
        </Button>
        <Button
          iconLeft={'circle-plus'}
          variant="primary"
          className="p-[6px] gap-x-2 items-center pr-[15px] text-xl md:hidden"
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
        >
          {newInvoiceBtnTextMobile}
        </Button>
        <Button
          iconLeft={'circle-plus'}
          variant="primary"
          className="p-2 gap-x-2 items-center pr-[15px] text-lg hidden md:flex"
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
        >
          {newInvoiceBtnTextDesktop}
        </Button>
      </div>
      {isFilterOpen && <div>I am open</div>}
    </menu>
  );
};

export default InvoiceBar;
