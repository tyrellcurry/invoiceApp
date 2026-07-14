import { JSX } from 'react';
import { IInvoiceProps } from '@/features/invoices/types/invoice';
import classNames from 'classnames';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import {
  formatInvoiceAmount,
  getCurrencySymbol,
} from '@/features/invoices/utils/format-invoice-amount';
import { getInvoiceStatusStyles } from '@/features/invoices/utils/get-invoice-status-styles';

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

  const statusStyles = getInvoiceStatusStyles(invoiceStatus);
  return (
    <Flex
      className="md:hidden bg-white p-6 rounded-lg drop-shadow-sm dark:bg-blue-03"
      direction="col"
      gapY={6}
    >
      <Flex justify="between">
        <Text className="text-gray-08 font-bold dark:text-white" tag={'p'}>
          <Text className="text-gray-07" tag={'span'}>
            #
          </Text>
          {invoiceId}
        </Text>
        <Text className="text-gray-07b dark:text-white" tag={'p'}>
          {billingName}
        </Text>
      </Flex>
      <Flex justify="between">
        <Container>
          <Text className="text-gray-07 flex gap-1 pb-[9px] dark:text-gray-05" tag={'p'}>
            <Text className="text-gray-06 dark:text-gray-05" tag={'span'}>
              {dueText}
            </Text>
            {invoiceDueDate}
          </Text>
          <Text className="text-gray-08 font-bold dark:text-white" tag={'p'}>
            <Text tag={'span'}>{getCurrencySymbol(localeAmountDue)}</Text>
            {formatInvoiceAmount(invoiceAmountDue, localeAmountDue)}
          </Text>
        </Container>

        <Flex
          align="center"
          justify="center"
          className={classNames(
            'py-[14px] px-[30px] rounded-md leading-none self-center',
            statusStyles.badge
          )}
        >
          <Text
            className="font-bold text-center flex gap-x-1.5 items-center text-[15px]"
            tag={'span'}
          >
            <div className={classNames('w-2 h-2 rounded-full', statusStyles.dot)} />
            {invoiceStatusText}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MobileView;
