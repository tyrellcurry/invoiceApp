import { JSX } from 'react';
import { IInvoiceProps } from '@/features/invoices/types/invoice';
import Text from '@/components/ui/text/text';
import classNames from 'classnames';
import Button from '@/components/ui/button/button';
import {
  formatInvoiceAmount,
  getCurrencySymbol,
} from '@/features/invoices/utils/format-invoice-amount';
import { getInvoiceStatusStyles } from '@/features/invoices/utils/get-invoice-status-styles';

const DesktopView = (props: IInvoiceProps): JSX.Element => {
  const {
    invoiceId,
    invoiceDueDate,
    billingName,
    invoiceAmountDue,
    invoiceStatus,
    invoiceStatusText,
    dueText,
    localeAmountDue = 'en',
    ...rest
  } = props;

  const statusStyles = getInvoiceStatusStyles(invoiceStatus);
  return (
    <div
      className="hidden md:flex justify-between items-center py-4 px-6 bg-white drop-shadow-lg rounded-lg dark:bg-blue-03"
      {...rest}
    >
      <div className="flex gap-x-11">
        {/* Invoice Details Section */}
        <div className="flex gap-x-11 w-[256px]">
          <Text className="text-gray-08 font-bold dark:text-white" tag={'p'}>
            <Text className="text-gray-07" tag={'span'}>
              #
            </Text>
            {invoiceId}
          </Text>
          <Text className="text-gray-07 flex gap-1 dark:text-gray-05" tag={'p'}>
            <Text className="text-gray-06 dark:text-gray-05" tag={'span'}>
              {dueText}
            </Text>
            {invoiceDueDate}
          </Text>
        </div>
        <Text className="text-gray-07b dark:text-white" tag={'p'}>
          {billingName}
        </Text>
      </div>

      {/* Amount Due and Status Section */}
      <div>
        <div className="flex items-center gap-x-2">
          <Text className="text-gray-08 font-bold text-right dark:text-white" tag={'p'}>
            <Text tag={'span'}>{getCurrencySymbol(localeAmountDue)}</Text>
            {formatInvoiceAmount(invoiceAmountDue, localeAmountDue)}
          </Text>
          <div className="w-[150px]">
            <div
              className={classNames(
                'py-[14px] px-[30px] rounded-md leading-none flex items-center self-center justify-center ml-auto w-[145px]',
                statusStyles.badge
              )}
            >
              <Text className="font-bold text-center flex gap-x-1.5 items-center" tag={'span'}>
                <div className={classNames('w-2 h-2 rounded-full', statusStyles.dot)} />
                {invoiceStatusText}
              </Text>
            </div>
          </div>

          {/* Button Section */}
          <Button className="p-1 ml-3" iconLeft={'chevron-right'} variant="custom"></Button>
        </div>
      </div>
    </div>
  );
};
export default DesktopView;
