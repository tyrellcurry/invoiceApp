/**
 * @name InvoiceFormDrawer
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Slide-in drawer used to create or edit an invoice. Presentation + local form
 * state only: it holds the editable values, calls back on submit/close, and
 * leaves persistence to the caller. The `mode` prop swaps the title and footer
 * actions between "edit" and "create".
 *
 * @param props - see {@link IInvoiceFormDrawerProps}
 *
 * @returns {JSX.Element}
 */

import classNames from 'classnames';
import { JSX, ReactNode, useEffect, useState } from 'react';
import Button from '@/components/ui/button/button';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Grid from '@/components/ui/grid/grid';
import Text from '@/components/ui/text/text';
import {
  IInvoiceFormDrawerProps,
  InvoiceFormItem,
  InvoiceFormValues,
} from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { formatCurrencyAmount } from '@/features/invoices/utils/format-invoice-amount';
import { getLineItemTotal } from '@/features/invoices/utils/get-line-item-total';

const inputClass =
  'w-full rounded-sm border border-gray-05 dark:border-blue-04 bg-white dark:bg-blue-03 px-5 py-4 text-[15px] font-bold leading-none text-gray-08 dark:text-white outline-none focus:border-blue-01';

const sectionHeadingClass = 'text-blue-01 font-bold text-[15px]';

const Field = ({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}): JSX.Element => (
  <Flex className={className} direction="col" gapY={2}>
    <label className="text-[13px] font-medium text-gray-07 dark:text-gray-05" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
  </Flex>
);

const InvoiceFormDrawer = (props: IInvoiceFormDrawerProps): JSX.Element => {
  const {
    open,
    mode,
    invoiceId,
    initialValues,
    paymentTermOptions,
    localeAmountDue = 'en',
    labels,
    error,
    onClose,
    onSubmit,
    onSaveDraft,
  } = props;

  const [values, setValues] = useState<InvoiceFormValues>(initialValues);

  // Reset the form to the caller's values each time the drawer opens. Adjusting
  // state during render (vs. an effect) is React's recommended pattern for this.
  const [wasOpen, setWasOpen] = useState(open);
  // Kept true while the close animation plays, so the panel can slide out before
  // the container is hidden.
  const [isMounted, setIsMounted] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(initialValues);
      setIsMounted(true);
    }
  }

  // Close on Escape while open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const setField = <K extends keyof InvoiceFormValues>(key: K, value: InvoiceFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setItem = (index: number, key: keyof InvoiceFormItem, value: string | number) => {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addItem = () => {
    setValues((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setValues((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const title =
    mode === 'edit' ? (
      <>
        {labels.editTitle} <span className="text-gray-06">#</span>
        {invoiceId}
      </>
    ) : (
      labels.createTitle
    );

  return (
    <Container
      aria-hidden={!open}
      className={classNames(
        'fixed inset-0 z-10',
        open || isMounted ? 'visible' : 'invisible',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <Container
        className={classNames(
          'absolute inset-0 bg-black/50 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
        onClick={onClose}
      />

      {/* Panel */}
      <Flex
        aria-label={mode === 'edit' ? labels.editTitle : labels.createTitle}
        as="section"
        direction="col"
        role="dialog"
        className={classNames(
          'absolute left-0 top-0 h-full w-full max-w-170 bg-white dark:bg-gray-12 lg:left-15 lg:rounded-r-[20px] transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-[calc(100%+104px)]'
        )}
        aria-modal
        onTransitionEnd={() => {
          if (!open) {
            setIsMounted(false);
          }
        }}
      >
        <Text
          className="text-gray-08 dark:text-white px-6 pt-8 md:px-14 md:pt-12"
          tag={'h2'}
          variant="h2"
        >
          {title}
        </Text>

        <form
          className="flex-1 overflow-y-auto px-6 md:px-14 pb-8"
          id="invoice-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(values);
          }}
        >
          {/* Status. Edit mode only: in create mode the footer's Save as Draft /
              Save & Send buttons are what choose the status. */}
          {mode === 'edit' && (
            <Field className="mt-6" htmlFor="invoice-status" label={labels.status}>
              <select
                className={inputClass}
                id="invoice-status"
                value={values.status}
                onChange={(event) => setField('status', event.target.value as InvoiceStatus)}
              >
                <option value={InvoiceStatus.DRAFT}>{labels.statusDraft}</option>
                <option value={InvoiceStatus.PENDING}>{labels.statusPending}</option>
                <option value={InvoiceStatus.PAID}>{labels.statusPaid}</option>
              </select>
            </Field>
          )}

          {/* Bill From */}
          <Text className={classNames(sectionHeadingClass, 'mt-6')} tag={'p'}>
            {labels.billFrom}
          </Text>
          <Flex className="mt-4" direction="col" gapY={6}>
            <Field htmlFor="sender-street" label={labels.streetAddress}>
              <input
                className={inputClass}
                id="sender-street"
                value={values.senderStreet}
                onChange={(event) => setField('senderStreet', event.target.value)}
              />
            </Field>
            <Grid className="md:grid-cols-3" cols={2} gapX={6} gapY={6}>
              <Field htmlFor="sender-city" label={labels.city}>
                <input
                  className={inputClass}
                  id="sender-city"
                  value={values.senderCity}
                  onChange={(event) => setField('senderCity', event.target.value)}
                />
              </Field>
              <Field htmlFor="sender-postcode" label={labels.postCode}>
                <input
                  className={inputClass}
                  id="sender-postcode"
                  value={values.senderPostCode}
                  onChange={(event) => setField('senderPostCode', event.target.value)}
                />
              </Field>
              <Field
                className="col-span-2 md:col-span-1"
                htmlFor="sender-country"
                label={labels.country}
              >
                <input
                  className={inputClass}
                  id="sender-country"
                  value={values.senderCountry}
                  onChange={(event) => setField('senderCountry', event.target.value)}
                />
              </Field>
            </Grid>
          </Flex>

          {/* Bill To */}
          <Text className={classNames(sectionHeadingClass, 'mt-10')} tag={'p'}>
            {labels.billTo}
          </Text>
          <Flex className="mt-4" direction="col" gapY={6}>
            <Field htmlFor="client-name" label={labels.clientName}>
              <input
                className={inputClass}
                id="client-name"
                value={values.clientName}
                onChange={(event) => setField('clientName', event.target.value)}
              />
            </Field>
            <Field htmlFor="client-email" label={labels.clientEmail}>
              <input
                className={inputClass}
                id="client-email"
                type="email"
                value={values.clientEmail}
                onChange={(event) => setField('clientEmail', event.target.value)}
              />
            </Field>
            <Field htmlFor="client-street" label={labels.streetAddress}>
              <input
                className={inputClass}
                id="client-street"
                value={values.clientStreet}
                onChange={(event) => setField('clientStreet', event.target.value)}
              />
            </Field>
            <Grid className="md:grid-cols-3" cols={2} gapX={6} gapY={6}>
              <Field htmlFor="client-city" label={labels.city}>
                <input
                  className={inputClass}
                  id="client-city"
                  value={values.clientCity}
                  onChange={(event) => setField('clientCity', event.target.value)}
                />
              </Field>
              <Field htmlFor="client-postcode" label={labels.postCode}>
                <input
                  className={inputClass}
                  id="client-postcode"
                  value={values.clientPostCode}
                  onChange={(event) => setField('clientPostCode', event.target.value)}
                />
              </Field>
              <Field
                className="col-span-2 md:col-span-1"
                htmlFor="client-country"
                label={labels.country}
              >
                <input
                  className={inputClass}
                  id="client-country"
                  value={values.clientCountry}
                  onChange={(event) => setField('clientCountry', event.target.value)}
                />
              </Field>
            </Grid>
          </Flex>

          {/* Dates + description */}
          <Grid className="mt-10" cols={2} gapX={6} gapY={6}>
            <Field htmlFor="invoice-date" label={labels.invoiceDate}>
              <input
                className={inputClass}
                id="invoice-date"
                type="date"
                value={values.invoiceDate}
                onChange={(event) => setField('invoiceDate', event.target.value)}
              />
            </Field>
            <Field htmlFor="payment-terms" label={labels.paymentTerms}>
              <select
                className={inputClass}
                id="payment-terms"
                value={values.paymentTerms}
                onChange={(event) => setField('paymentTerms', Number(event.target.value))}
              >
                {paymentTermOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </Grid>
          <Field className="mt-6" htmlFor="description" label={labels.projectDescription}>
            <input
              className={inputClass}
              id="description"
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
            />
          </Field>

          {/* Item list */}
          <Text className="text-[18px] font-bold text-[#777f98] mt-12" tag={'p'}>
            {labels.itemList}
          </Text>
          <Flex className="mt-4" direction="col" gapY={4}>
            {values.items.map((item, index) => (
              // Each item is its own card (light background, rounded) with its
              // fields spread across two rows, rather than one cramped row of
              // five controls competing for width.
              <Flex
                className="rounded-lg bg-gray-05b p-4 dark:bg-blue-04 md:p-5"
                direction="col"
                gapY={4}
                key={index}
              >
                <Field htmlFor={`item-name-${index}`} label={labels.itemName}>
                  <input
                    className={inputClass}
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(event) => setItem(index, 'name', event.target.value)}
                  />
                </Field>
                <Flex align="end" className="flex-wrap md:flex-nowrap" gapX={4} gapY={4}>
                  <Field
                    className="w-20 shrink-0"
                    htmlFor={`item-qty-${index}`}
                    label={labels.quantity}
                  >
                    <input
                      id={`item-qty-${index}`}
                      min={0}
                      type="number"
                      // Backspacing to empty fires onChange with '', and
                      // Number('') is 0, not NaN, so without this the
                      // controlled value snaps straight back to a literal
                      // "0" and the field never visibly clears. Same fix
                      // already used for price, below.
                      value={item.quantity || ''}
                      // appearance-none drops the spinner in Firefox and
                      // current Chrome/Safari; the two arbitrary-variant
                      // rules clear WebKit's older spin-button pseudo
                      // elements for full coverage on older WebKit builds.
                      className={classNames(
                        inputClass,
                        'appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
                      )}
                      onChange={(event) => setItem(index, 'quantity', Number(event.target.value))}
                    />
                  </Field>
                  {/* Price and total are the two fields most likely to hold a
                      long number, so they're the dominant, evenly-split
                      flexible columns; quantity and delete stay small and fixed. */}
                  <Field
                    className="min-w-0 flex-1"
                    htmlFor={`item-price-${index}`}
                    label={labels.price}
                  >
                    <input
                      className={inputClass}
                      id={`item-price-${index}`}
                      min={0}
                      step="0.01"
                      type="number"
                      // A freshly added item's price is 0 internally (so its
                      // total computes correctly before the user fills it in),
                      // but showing a literal "0" reads like a real value the
                      // user has to notice and delete. Blank invites typing.
                      value={item.price || ''}
                      onChange={(event) => setItem(index, 'price', Number(event.target.value))}
                    />
                  </Field>
                  {/* min-w-0 overrides the flex item's default min-width:auto,
                      which would otherwise force the row wider instead of
                      letting a very long total wrap inside it. */}
                  <Flex className="min-w-0 flex-1" direction="col" gapY={2}>
                    <Text
                      className="text-[13px] font-medium text-gray-07 dark:text-gray-05"
                      tag={'span'}
                    >
                      {labels.total}
                    </Text>
                    <Text
                      className="text-gray-07b dark:text-gray-06 py-4 font-bold break-words"
                      tag={'span'}
                    >
                      {formatCurrencyAmount(
                        getLineItemTotal(item.quantity, item.price),
                        localeAmountDue
                      )}
                    </Text>
                  </Flex>
                  <Button
                    aria-label={labels.removeItem}
                    className="pb-5 text-gray-06 hover:text-red-08"
                    iconLeft={'trash'}
                    type="button"
                    variant="custom"
                    onClick={() => removeItem(index)}
                  />
                </Flex>
              </Flex>
            ))}
            <Button
              className="w-full justify-center bg-gray-05b dark:bg-blue-04 text-gray-07 dark:text-gray-05 hover:bg-gray-05 rounded-full py-4 font-bold"
              label={labels.addNewItem}
              type="button"
              variant="custom"
              onClick={addItem}
            />
          </Flex>
        </form>

        {/* Footer */}
        <Container className="px-6 md:px-14 py-6 shadow-[0_-10px_10px_-10px_rgba(72,84,159,0.1)]">
          {error && (
            <Text className="text-red-08 mb-4 text-center text-[13px]" tag={'p'}>
              {error}
            </Text>
          )}
          {mode === 'edit' ? (
            <Flex className="md:justify-end" gap={2}>
              <Button
                className="flex-1 justify-center md:flex-none"
                label={labels.cancel}
                type="button"
                variant="secondary"
                onClick={onClose}
              />
              <Button
                className="flex-1 justify-center md:flex-none"
                form="invoice-form"
                label={labels.saveChanges}
                type="submit"
                variant="primary"
              />
            </Flex>
          ) : (
            <>
              {/* Mobile: Discard + Save as Draft on one row, Save & Send full width */}
              <Flex className="md:hidden" direction="col" gap={2}>
                <Flex gapX={2}>
                  <Button
                    className="flex-1 justify-center"
                    label={labels.discard}
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  />
                  <Button
                    className="flex-1 justify-center"
                    label={labels.saveAsDraft}
                    type="button"
                    variant="dark"
                    onClick={() => onSaveDraft?.(values)}
                  />
                </Flex>
                <Button
                  className="w-full justify-center"
                  form="invoice-form"
                  label={labels.saveAndSend}
                  type="submit"
                  variant="primary"
                />
              </Flex>
              {/* Desktop: Discard left, save actions right */}
              <Flex align="center" className="hidden md:flex" justify="between">
                <Button
                  label={labels.discard}
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                />
                <Flex align="center" gapX={2}>
                  <Button
                    label={labels.saveAsDraft}
                    type="button"
                    variant="dark"
                    onClick={() => onSaveDraft?.(values)}
                  />
                  <Button
                    form="invoice-form"
                    label={labels.saveAndSend}
                    type="submit"
                    variant="primary"
                  />
                </Flex>
              </Flex>
            </>
          )}
        </Container>
      </Flex>
    </Container>
  );
};

export default InvoiceFormDrawer;
