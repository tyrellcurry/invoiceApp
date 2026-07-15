/**
 * @name InvoiceDetails
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Full "view invoice" page content: go-back link, status/actions bar and the
 * invoice detail card (meta, line items and amount due). Presentation only —
 * all copy, data and handlers arrive via props.
 *
 * @param props - see {@link IInvoiceDetailsProps}
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import classNames from 'classnames';
import Button from '@/components/ui/button/button';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Grid from '@/components/ui/grid/grid';
import Text from '@/components/ui/text/text';
import {
  IInvoiceDetailsProps,
  InvoiceAddress,
} from '@/features/invoices/components/invoice-details/invoice-details.types';
import {
  formatInvoiceAmount,
  getCurrencySymbol,
} from '@/features/invoices/utils/format-invoice-amount';
import { getInvoiceStatusStyles } from '@/features/invoices/utils/get-invoice-status-styles';
import { getLineItemTotal } from '@/features/invoices/utils/get-line-item-total';

const AddressBlock = ({
  address,
  className,
}: {
  address: InvoiceAddress;
  className?: string;
}): JSX.Element => (
  <Flex
    className={classNames('text-gray-07 dark:text-gray-05 leading-[18px]', className)}
    direction="col"
  >
    <Text tag={'span'}>{address.street}</Text>
    <Text tag={'span'}>{address.city}</Text>
    <Text tag={'span'}>{address.postCode}</Text>
    <Text tag={'span'}>{address.country}</Text>
  </Flex>
);

const InvoiceDetails = (props: IInvoiceDetailsProps): JSX.Element => {
  const {
    invoiceId,
    description,
    invoiceStatus,
    invoiceDate,
    paymentDue,
    senderAddress,
    clientName,
    clientEmail,
    clientAddress,
    items,
    invoiceAmountDue,
    localeAmountDue = 'en',
    labels,
    onGoBack,
    onEdit,
    onDelete,
    onMarkAsPaid,
  } = props;

  const currency = getCurrencySymbol(localeAmountDue);
  const statusStyles = getInvoiceStatusStyles(invoiceStatus);

  const actions = (
    <Flex align="center" className="md:flex-row md:gap-x-2" direction="col" gap={2}>
      <Flex className="w-full md:contents" gapX={2}>
        <Button
          className="flex-1 justify-center md:flex-none"
          label={labels.edit}
          variant="secondary"
          onClick={onEdit}
        />
        <Button
          className="flex-1 justify-center md:flex-none"
          label={labels.delete}
          variant="danger"
          onClick={onDelete}
        />
      </Flex>
      <Button
        className="w-full justify-center md:w-fit"
        label={labels.markAsPaid}
        variant="primary"
        onClick={onMarkAsPaid}
      />
    </Flex>
  );

  return (
    <Flex direction="col" gapY={6}>
      <Button
        className="flex items-center gap-x-6 w-fit font-bold text-gray-08 dark:text-white"
        iconLeft={'chevron-right'}
        iconLeftClassName="rotate-180 shrink-0"
        label={labels.goBack}
        variant="custom"
        onClick={onGoBack}
      />

      {/* Status / actions bar */}
      <Flex
        className="md:flex-row md:items-center md:justify-between rounded-lg bg-white px-6 py-5 md:px-8 drop-shadow-lg dark:bg-blue-03"
        direction="col"
        gapY={6}
      >
        <Flex align="center" className="md:justify-start md:gap-x-4" gapX={4} justify="between">
          <Text className="text-gray-07b dark:text-gray-05" tag={'span'}>
            {labels.status}
          </Text>
          <Flex
            align="center"
            gapX={1.5}
            justify="center"
            className={classNames(
              'rounded-md px-[18px] py-3 leading-none w-[104px]',
              statusStyles.badge
            )}
          >
            <div className={classNames('w-2 h-2 rounded-full', statusStyles.dot)} />
            <Text className="font-bold" tag={'span'}>
              {labels.statusText}
            </Text>
          </Flex>
        </Flex>
        <Container className="hidden md:block">{actions}</Container>
      </Flex>

      {/* Invoice detail card */}
      <Container className="rounded-lg bg-white p-6 md:p-12 drop-shadow-lg dark:bg-blue-03">
        {/* Header: id + description / sender address */}
        <Flex className="md:flex-row md:justify-between" direction="col" gapY={8}>
          <Container>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              <Text className="text-gray-06" tag={'span'}>
                #
              </Text>
              {invoiceId}
            </Text>
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {description}
            </Text>
          </Container>
          <AddressBlock address={senderAddress} className="md:text-right" />
        </Flex>

        {/* Divider between the header row and the invoice meta */}
        <hr className="mt-8 md:mt-11 h-px border-0 bg-gray-05 dark:bg-blue-04" />

        {/* Meta: dates / bill to / sent to */}
        <Grid className="mt-8 md:mt-11 md:grid-cols-3" cols={2} gapY={8}>
          <Flex direction="col" gapY={8}>
            <Flex direction="col" gapY={3}>
              <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
                {labels.invoiceDate}
              </Text>
              <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
                {invoiceDate}
              </Text>
            </Flex>
            <Flex direction="col" gapY={3}>
              <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
                {labels.paymentDue}
              </Text>
              <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
                {paymentDue}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="col" gapY={2}>
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {labels.billTo}
            </Text>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              {clientName}
            </Text>
            <AddressBlock address={clientAddress} className="mt-1" />
          </Flex>
          <Flex direction="col" gapY={3}>
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {labels.sentTo}
            </Text>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              {clientEmail}
            </Text>
          </Flex>
        </Grid>

        {/* Line items */}
        <Container className="mt-11 overflow-hidden rounded-lg">
          <Container className="bg-gray-05b p-6 md:p-8 dark:bg-blue-04">
            <Grid className="hidden grid-cols-[2fr_0.5fr_1fr_1fr] md:grid" gapX={4}>
              <Text className="text-gray-07 dark:text-gray-05" tag={'span'}>
                {labels.itemName}
              </Text>
              <Text className="text-gray-07 text-center dark:text-gray-05" tag={'span'}>
                {labels.quantity}
              </Text>
              <Text className="text-gray-07 text-right dark:text-gray-05" tag={'span'}>
                {labels.price}
              </Text>
              <Text className="text-gray-07 text-right dark:text-gray-05" tag={'span'}>
                {labels.total}
              </Text>
            </Grid>
            <Flex as="ul" className="md:gap-y-8 md:mt-8" direction="col" gapY={6}>
              {items.map((item) => (
                <Grid
                  align="center"
                  as="li"
                  className="md:grid-cols-[2fr_0.5fr_1fr_1fr] md:gap-x-4"
                  cols={2}
                  key={item.name}
                >
                  <Text className="font-bold text-gray-08 dark:text-white" tag={'span'}>
                    {item.name}
                  </Text>
                  <Text
                    className="text-gray-07 font-bold row-start-2 dark:text-gray-06 md:row-start-auto md:text-center"
                    tag={'span'}
                  >
                    <span className="md:hidden">{`${item.quantity} x ${currency} ${formatInvoiceAmount(item.price, localeAmountDue)}`}</span>
                    <span className="hidden md:inline">{item.quantity}</span>
                  </Text>
                  <Text
                    className="hidden text-gray-07 font-bold text-right dark:text-gray-06 md:block"
                    tag={'span'}
                  >
                    {`${currency} ${formatInvoiceAmount(item.price, localeAmountDue)}`}
                  </Text>
                  <Text
                    className="font-bold text-gray-08 text-right row-start-1 col-start-2 dark:text-white md:row-start-auto md:col-start-auto"
                    tag={'span'}
                  >
                    {`${currency} ${formatInvoiceAmount(getLineItemTotal(item.quantity, item.price), localeAmountDue)}`}
                  </Text>
                </Grid>
              ))}
            </Flex>
          </Container>

          {/* Amount due footer */}
          <Flex
            align="center"
            className="bg-gray-09 px-6 py-6 md:px-8 dark:bg-gray-12"
            justify="between"
          >
            <Text className="text-white" tag={'span'}>
              {labels.amountDue}
            </Text>
            <Text className="font-bold text-white text-2xl" tag={'span'}>
              {`${currency} ${formatInvoiceAmount(invoiceAmountDue, localeAmountDue)}`}
            </Text>
          </Flex>
        </Container>
      </Container>

      {/* Actions bar (mobile: pinned below the card) */}
      <Container className="md:hidden rounded-lg bg-white px-6 py-5 drop-shadow-lg dark:bg-blue-03">
        {actions}
      </Container>
    </Flex>
  );
};

export default InvoiceDetails;
