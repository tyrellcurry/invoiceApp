import { JSX } from 'react';
import { IInvoiceProps } from '@/app/components/UI/molecules/Invoice/Invoice.interface';
import classNames from 'classnames';
import Text from '@/app/components/UI/atoms/Text/Text';
import Button from '@/app/components/UI/atoms/Button/Button';
const MobileView = (props: IInvoiceProps): JSX.Element => {
  const {
    invoiceId,
    invoiceDueDate,
    billingName,
    invoiceAmountDue,
    invoiceStatus,
    invoiceStatusText,
    dueText,
    localeAmountDue = 'en',
  } = props;
  return (
    <Button variant="custom" className="w-full border-none">
      <div className="md:hidden bg-white p-6 rounded-lg drop-shadow-sm flex flex-col gap-y-6 dark:bg-blue-03">
        <div className="flex justify-between">
          <Text tag={'p'} className="text-gray-08 font-bold dark:text-white">
            <Text tag={'span'} className="text-gray-07">
              #
            </Text>
            {invoiceId}
          </Text>
          <Text tag={'p'} className="text-gray-07b dark:text-white">
            {billingName}
          </Text>
        </div>
        <div className="flex justify-between">
          <div>
            <Text tag={'p'} className="text-gray-07 flex gap-1 pb-[9px] dark:text-gray-05">
              <Text tag={'span'} className="text-gray-06 dark:text-gray-05">
                {dueText}
              </Text>
              {invoiceDueDate}
            </Text>
            <Text tag={'p'} className="text-gray-08 font-bold dark:text-white">
              <Text tag={'span'}>
                {localeAmountDue === 'en' && '$'}
                {localeAmountDue === 'fr' && '€'}
              </Text>
              {invoiceAmountDue.toLocaleString(localeAmountDue, { minimumFractionDigits: 2 })}
            </Text>
          </div>

          <div
            className={classNames(
              'py-[14px] px-[30px] rounded-md leading-none flex items-center justify-center self-center',
              {
                'bg-green-05a text-green-05': invoiceStatus === 'paid',
                'bg-orange-05a text-orange-05': invoiceStatus === 'pending',
                'bg-gray-09a dark:bg-gray-09b text-gray-09 dark:text-gray-05':
                  invoiceStatus === 'draft',
              }
            )}
          >
            <Text
              className="font-bold text-center flex gap-x-1.5 items-center text-[15px]"
              tag={'span'}
            >
              <div
                className={classNames('w-2 h-2 rounded-full', {
                  'bg-green-05': invoiceStatus === 'paid',
                  'bg-orange-05': invoiceStatus === 'pending',
                  'bg-gray-09 dark:bg-gray-05': invoiceStatus === 'draft',
                })}
              />
              {invoiceStatusText}
            </Text>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default MobileView;
