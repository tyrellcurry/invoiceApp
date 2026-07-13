import { JSX } from 'react';
import { IInvoiceBarProps } from '@/features/invoices/components/invoice-bar/invoice-bar.types';
import classNames from 'classnames';
import Button from '@/components/ui/button/button';
import Text from '@/components/ui/text/text';
import useVisibilityToggle from '@/hooks/use-visibility-toggle';
import Checkbox from '@/components/ui/checkbox/checkbox';

const InvoiceBar = (props: IInvoiceBarProps): JSX.Element => {
  const {
    invoiceBarTitle,
    newInvoiceBtn,
    totalInvoicesText,
    filterStatusBtn,
    newInvoiceHandler,
    filterStatusText,
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
          <span className="block md:hidden">{totalInvoicesText?.mobile}</span>
          <span className="hidden md:block">{totalInvoicesText?.desktop}</span>
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
            label={
              <>
                <span className="block md:hidden">{filterStatusBtn?.mobile}</span>
                <span className="hidden md:block">{filterStatusBtn?.desktop}</span>
              </>
            }
            onClick={() => setIsVisible((prev) => !prev)}
          />

          {/* Children */}
          {isVisible && (
            <div
              className="absolute bg-white drop-shadow-xl p-6 w-[180px] lg:w-[220px] top-6 rounded-lg dark:bg-blue-04 z-10"
              ref={elementRef}
            >
              <div>
                <Checkbox
                  label={filterStatusText.draft}
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
                  label={filterStatusText.pending}
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
                  label={filterStatusText.paid}
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
          label={
            <>
              <span className="block md:hidden">{newInvoiceBtn?.mobile}</span>
              <span className="hidden md:block">{newInvoiceBtn?.desktop}</span>
            </>
          }
          onClick={newInvoiceHandler}
        />
      </div>
    </menu>
  );
};

export default InvoiceBar;
