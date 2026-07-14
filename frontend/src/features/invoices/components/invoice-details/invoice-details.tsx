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
  <div
    className={classNames('text-gray-07 dark:text-gray-05 flex flex-col leading-[18px]', className)}
  >
    <Text tag={'span'}>{address.street}</Text>
    <Text tag={'span'}>{address.city}</Text>
    <Text tag={'span'}>{address.postCode}</Text>
    <Text tag={'span'}>{address.country}</Text>
  </div>
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
    <div className="flex items-center gap-x-2">
      <Button label={labels.edit} variant="secondary" onClick={onEdit} />
      <Button label={labels.delete} variant="danger" onClick={onDelete} />
      <Button label={labels.markAsPaid} variant="primary" onClick={onMarkAsPaid} />
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <Button
        className="flex items-center gap-x-6 w-fit font-bold text-gray-08 dark:text-white"
        iconLeft={'chevron-right'}
        iconLeftClassName="rotate-180 shrink-0"
        label={labels.goBack}
        variant="custom"
        onClick={onGoBack}
      />

      {/* Status / actions bar */}
      <div className="flex flex-col gap-y-6 md:flex-row md:items-center md:justify-between rounded-lg bg-white px-6 py-5 md:px-8 drop-shadow-lg dark:bg-blue-03">
        <div className="flex items-center justify-between gap-x-4 md:justify-start md:gap-x-4">
          <Text className="text-gray-07b dark:text-gray-05" tag={'span'}>
            {labels.status}
          </Text>
          <div
            className={classNames(
              'flex items-center justify-center gap-x-1.5 rounded-md px-[18px] py-3 leading-none w-[104px]',
              statusStyles.badge
            )}
          >
            <div className={classNames('w-2 h-2 rounded-full', statusStyles.dot)} />
            <Text className="font-bold" tag={'span'}>
              {labels.statusText}
            </Text>
          </div>
        </div>
        <div className="hidden md:block">{actions}</div>
      </div>

      {/* Invoice detail card */}
      <div className="rounded-lg bg-white p-6 md:p-12 drop-shadow-lg dark:bg-blue-03">
        {/* Header: id + description / sender address */}
        <div className="flex flex-col gap-y-8 md:flex-row md:justify-between">
          <div>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              <Text className="text-gray-06" tag={'span'}>
                #
              </Text>
              {invoiceId}
            </Text>
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {description}
            </Text>
          </div>
          <AddressBlock address={senderAddress} className="md:text-right" />
        </div>

        {/* Meta: dates / bill to / sent to */}
        <div className="mt-8 grid grid-cols-2 gap-y-8 md:mt-11 md:grid-cols-3">
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-3">
              <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
                {labels.invoiceDate}
              </Text>
              <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
                {invoiceDate}
              </Text>
            </div>
            <div className="flex flex-col gap-y-3">
              <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
                {labels.paymentDue}
              </Text>
              <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
                {paymentDue}
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {labels.billTo}
            </Text>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              {clientName}
            </Text>
            <AddressBlock address={clientAddress} className="mt-1" />
          </div>
          <div className="flex flex-col gap-y-3">
            <Text className="text-gray-07 dark:text-gray-05" tag={'p'}>
              {labels.sentTo}
            </Text>
            <Text className="font-bold text-gray-08 dark:text-white" tag={'p'}>
              {clientEmail}
            </Text>
          </div>
        </div>

        {/* Line items */}
        <div className="mt-11 overflow-hidden rounded-lg">
          <div className="bg-gray-05b p-6 md:p-8 dark:bg-blue-04">
            <div className="hidden grid-cols-[2fr_0.5fr_1fr_1fr] gap-x-4 md:grid">
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
            </div>
            <ul className="flex flex-col gap-y-6 md:gap-y-8 md:mt-8">
              {items.map((item) => (
                <li
                  className="grid grid-cols-2 items-center md:grid-cols-[2fr_0.5fr_1fr_1fr] md:gap-x-4"
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
                </li>
              ))}
            </ul>
          </div>

          {/* Amount due footer */}
          <div className="flex items-center justify-between bg-gray-09 px-6 py-6 md:px-8 dark:bg-gray-12">
            <Text className="text-white" tag={'span'}>
              {labels.amountDue}
            </Text>
            <Text className="font-bold text-white text-2xl" tag={'span'}>
              {`${currency} ${formatInvoiceAmount(invoiceAmountDue, localeAmountDue)}`}
            </Text>
          </div>
        </div>
      </div>

      {/* Actions bar (mobile: pinned below the card) */}
      <div className="md:hidden rounded-lg bg-white px-6 py-5 drop-shadow-lg dark:bg-blue-03">
        {actions}
      </div>
    </div>
  );
};

export default InvoiceDetails;
