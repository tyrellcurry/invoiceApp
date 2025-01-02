import Button from '@/app/components/UI/atoms/Button/Button';
import Text from '@/app/components/UI/atoms/Text/Text';
import { IInvoiceProps } from '@/app/components/UI/molecules/Invoice/Invoice.interface';
import { JSX } from 'react';
import classNames from 'classnames';

const Invoice = (props: IInvoiceProps): JSX.Element => {
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

  return (
    <div {...rest}>
      {/* Mobile View */}
      <div className="md:hidden bg-white p-6 rounded-lg drop-shadow-sm flex flex-col gap-y-6">
        <div className="flex justify-between">
          <Text tag={'p'} className="text-gray-08 font-bold">
            <Text tag={'span'} className="text-gray-07">
              #
            </Text>
            {invoiceId}
          </Text>
          <Text tag={'p'} className="text-gray-07b">
            {billingName}
          </Text>
        </div>

        <div className="flex justify-between">
          <div>
            <Text tag={'p'} className="text-gray-07 flex gap-1 pb-[9px]">
              <Text tag={'span'} className="text-gray-06">
                {dueText}
              </Text>
              {invoiceDueDate}
            </Text>
            <Text tag={'p'} className="text-gray-08 font-bold">
              <Text tag={'span'}>
                {localeAmountDue === 'en' && '$'}
                {localeAmountDue === 'fr' && '€'}
              </Text>
              {invoiceAmountDue.toLocaleString(localeAmountDue, { minimumFractionDigits: 2 })}
            </Text>
          </div>

          <div
            className={classNames(
              'py-[14px] px-[30px] rounded-md leading-none flex items-center self-center',
              {
                'bg-green-05a text-green-05': invoiceStatus === 'paid',
                'bg-orange-05a text-orange-05': invoiceStatus === 'pending',
                'bg-gray-09a text-gray-09': invoiceStatus === 'draft',
              }
            )}
          >
            <Text className="font-bold text-center flex gap-x-1.5 items-center" tag={'span'}>
              <div
                className={classNames('w-2 h-2 rounded-full', {
                  'bg-green-05': invoiceStatus === 'paid',
                  'bg-orange-05': invoiceStatus === 'pending',
                  'bg-gray-09': invoiceStatus === 'draft',
                })}
              />
              {invoiceStatusText}
            </Text>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center py-4 px-6 bg-white drop-shadow-lg rounded-lg">
        <div className="flex gap-x-11">
          {/* Invoice Details Section */}
          <div className="flex gap-x-11 w-[256px]">
            <Text tag={'p'} className="text-gray-08 font-bold">
              <Text tag={'span'} className="text-gray-07">
                #
              </Text>
              {invoiceId}
            </Text>
            <Text tag={'p'} className="text-gray-07 flex gap-1">
              <Text tag={'span'} className="text-gray-06">
                {dueText}
              </Text>
              {invoiceDueDate}
            </Text>
          </div>
          <Text tag={'p'} className="text-gray-07b">
            {billingName}
          </Text>
        </div>

        {/* Amount Due and Status Section */}
        <div>
          <div className="flex items-center gap-x-2">
            <Text tag={'p'} className="text-gray-08 font-bold text-right">
              <Text tag={'span'}>
                {localeAmountDue === 'en' && '$'}
                {localeAmountDue === 'fr' && '€'}
              </Text>
              {invoiceAmountDue.toLocaleString(localeAmountDue, { minimumFractionDigits: 2 })}
            </Text>
            <div className="w-[150px]">
              <div
                className={classNames(
                  'py-[14px] px-[30px] rounded-md leading-none flex items-center self-center w-fit ml-auto',
                  {
                    'bg-green-05a text-green-05': invoiceStatus === 'paid',
                    'bg-orange-05a text-orange-05': invoiceStatus === 'pending',
                    'bg-gray-09a text-gray-09': invoiceStatus === 'draft',
                  }
                )}
              >
                <Text className="font-bold text-center flex gap-x-1.5 items-center" tag={'span'}>
                  <div
                    className={classNames('w-2 h-2 rounded-full', {
                      'bg-green-05': invoiceStatus === 'paid',
                      'bg-orange-05': invoiceStatus === 'pending',
                      'bg-gray-09': invoiceStatus === 'draft',
                    })}
                  />
                  {invoiceStatusText}
                </Text>
              </div>
            </div>
            <Button className="p-1 ml-3" variant="custom" iconLeft={'chevron-right'}></Button>
          </div>
        </div>

        {/* Button Section */}
      </div>
    </div>
  );
};

export default Invoice;
