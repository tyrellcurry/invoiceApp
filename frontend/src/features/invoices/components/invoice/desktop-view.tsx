import classNames from 'classnames';
import { JSX } from 'react';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Icon from '@/components/ui/icon/icon';
import Text from '@/components/ui/text/text';
import { IInvoiceProps } from '@/features/invoices/types/invoice';
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
    <Flex
      align="center"
      className="hidden md:flex py-4 px-6 bg-white drop-shadow-lg rounded-lg dark:bg-blue-03"
      justify="between"
      {...rest}
    >
      <Flex gapX={11}>
        {/* Invoice Details Section */}
        <Flex className="w-64" gapX={11}>
          <Text className="text-gray-08 font-bold dark:text-white" tag={'p'}>
            <Text className="text-gray-07" tag={'span'}>
              #
            </Text>
            {invoiceId}
          </Text>
          <Text className="text-gray-07 flex gap-1 whitespace-nowrap dark:text-gray-05" tag={'p'}>
            <Text className="text-gray-06 dark:text-gray-05" tag={'span'}>
              {dueText}
            </Text>
            {invoiceDueDate}
          </Text>
        </Flex>
        <Text className="text-gray-07b dark:text-white" tag={'p'}>
          {billingName}
        </Text>
      </Flex>

      {/* Amount Due and Status Section */}
      <Container>
        <Flex align="center" gapX={2}>
          <Text className="text-gray-08 font-bold text-right dark:text-white" tag={'p'}>
            <Text tag={'span'}>{getCurrencySymbol(localeAmountDue)}</Text>
            {formatInvoiceAmount(invoiceAmountDue, localeAmountDue)}
          </Text>
          <Container className="w-37.5">
            <Flex
              align="center"
              justify="center"
              className={classNames(
                'py-3.5 px-7.5 rounded-md leading-none self-center ml-auto w-36.25',
                statusStyles.badge
              )}
            >
              <Text className="font-bold text-center flex gap-x-1.5 items-center" tag={'span'}>
                <div className={classNames('w-2 h-2 rounded-full', statusStyles.dot)} />
                {invoiceStatusText}
              </Text>
            </Flex>
          </Container>

          {/* Chevron affordance (the whole row is a link) */}
          <Icon className="ml-3" name="chevron-right" />
        </Flex>
      </Container>
    </Flex>
  );
};
export default DesktopView;
