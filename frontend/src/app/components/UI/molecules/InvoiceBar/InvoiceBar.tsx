import { JSX } from 'react';
import { IInvoiceBarProps } from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar.interface';
import classNames from 'classnames';
import Button from '@/app/components/UI/atoms/Button/Button';
import Text from '@/app/components/UI/atoms/Text/Text';

const InvoiceBar = (props: IInvoiceBarProps): JSX.Element => {
  const {
    invoiceBarTitle,
    totalInvoicesTextDesktop,
    totalInvoicesTextMobile,
    filterStatusBtnTextDesktop,
    filterStatusBtnTextMobile,
    newInvoiceBtnTextDesktop,
    newInvoiceBtnTextMobile,
    newInvoiceHandler,
    isVisible,
    setIsVisible,
    children,
    ...rest
  } = props;

  return (
    <menu className="flex items-center justify-between" {...rest}>
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
        <div className="relative grid place-items-center">
          <Button
            className="flex items-center gap-x-3 font-bold text-xl dark:text-gray-05 md:hidden"
            variant="custom"
            iconRight={'chevron-down'}
            iconRightClassName={classNames('w-5 h-auto', {
              'rotate-180': !!isVisible,
            })}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {filterStatusBtnTextMobile}
          </Button>
          <Button
            className="items-center gap-x-3 font-bold text-lg dark:text-gray-05 hidden md:flex"
            variant="custom"
            iconRight={'chevron-down'}
            iconRightClassName={classNames('w-4 h-auto', {
              'rotate-180': !!isVisible,
            })}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {filterStatusBtnTextDesktop}
          </Button>
          {isVisible && children}
        </div>
        <Button
          iconLeft={'circle-plus'}
          variant="primary"
          className="p-[6px] gap-x-2 items-center pr-[15px] text-xl md:hidden"
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
          onClick={newInvoiceHandler}
        >
          {newInvoiceBtnTextMobile}
        </Button>
        <Button
          iconLeft={'circle-plus'}
          variant="primary"
          className="p-2 gap-x-2 items-center pr-[15px] text-lg hidden md:flex"
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
          onClick={newInvoiceHandler}
        >
          {newInvoiceBtnTextDesktop}
        </Button>
      </div>
    </menu>
  );
};

export default InvoiceBar;
