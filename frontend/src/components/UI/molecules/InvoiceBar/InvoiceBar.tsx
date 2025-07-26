import { JSX } from 'react';
import { IInvoiceBarProps } from '@/components/UI/molecules/InvoiceBar/InvoiceBar.interface';
import classNames from 'classnames';
import Button from '@/components/UI/atoms/Button/Button';
import Text from '@/components/UI/atoms/Text/Text';
import useVisibilityToggle from '@/utils/hooks/useVisibilityToggle';
import Checkbox from '@/components/UI/atoms/Input/Checkbox/Checkbox';

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
    draftText,
    pendingText,
    paidText,
    setFilters,
    filters,
    ...rest
  } = props;

  const { isVisible, setIsVisible, elementRef } = useVisibilityToggle();

  return (
    <menu className="flex items-center justify-between" {...rest}>
      <div>
        <Text className="text-gray-08 dark:text-white" tag={'h2'} variant="h2">
          {invoiceBarTitle}
        </Text>
        <Text className="text-gray-06 dark:text-white" tag={'p'}>
          <span className="block md:hidden">{totalInvoicesTextMobile}</span>
          <span className="hidden md:block">{totalInvoicesTextDesktop}</span>
        </Text>
      </div>
      <div className="flex items-center gap-x-[18px] md:gap-x-10">
        <div className="relative grid place-items-center">
          <Button
            className="flex items-center gap-x-3 font-bold text-xl dark:text-gray-05"
            iconRight={'chevron-down'}
            variant="custom"
            iconRightClassName={classNames('w-4 md:w-5 h-auto', {
              'rotate-180': !!isVisible,
            })}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            <span className="block md:hidden">{filterStatusBtnTextMobile}</span>
            <span className="hidden md:block">{filterStatusBtnTextDesktop}</span>
          </Button>

          {/* Children */}
          {isVisible && (
            <div
              className="absolute bg-white drop-shadow-xl p-6 w-[180px] lg:w-[220px] top-6 rounded-lg dark:bg-blue-04 z-10"
              ref={elementRef}
            >
              <div>
                <Checkbox
                  label={draftText}
                  labelId={'draft'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (setFilters) {
                      setFilters({
                        ...filters,
                        draft: e.target.checked,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Checkbox
                  label={pendingText}
                  labelId={'pending'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (setFilters) {
                      setFilters({
                        ...filters,
                        pending: e.target.checked,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Checkbox
                  label={paidText}
                  labelId={'paid'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (setFilters) {
                      setFilters({
                        ...filters,
                        paid: e.target.checked,
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <Button
          className="p-[6px] md:p-2 gap-x-2 items-center pr-[15px] text-xl md:text-lg"
          iconLeft={'circle-plus'}
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
          variant="primary"
          onClick={newInvoiceHandler}
        >
          <span className="block md:hidden">{newInvoiceBtnTextMobile}</span>
          <span className="hidden md:block">{newInvoiceBtnTextDesktop}</span>
        </Button>
      </div>
    </menu>
  );
};

export default InvoiceBar;
