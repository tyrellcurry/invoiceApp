/**
 * @name DeleteInvoiceDialog
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Centered confirmation modal for deleting an invoice. Presentation only: it
 * renders the copy passed via `labels` and calls back on cancel/confirm. Fades
 * in on open and out on close (or backdrop click / Escape).
 *
 * @param props - see {@link IDeleteInvoiceDialogProps}
 *
 * @returns {JSX.Element}
 */

import { JSX, useEffect, useState } from 'react';
import classNames from 'classnames';
import Button from '@/components/ui/button/button';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import { IDeleteInvoiceDialogProps } from '@/features/invoices/components/delete-invoice-dialog/delete-invoice-dialog.types';

const DeleteInvoiceDialog = (props: IDeleteInvoiceDialogProps): JSX.Element => {
  const { open, labels, onCancel, onConfirm } = props;

  // Kept true while the close animation plays, so the dialog can fade out before
  // the container is hidden.
  const [isMounted, setIsMounted] = useState(open);
  if (open && !isMounted) {
    setIsMounted(true);
  }

  // Close on Escape while open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  return (
    <Container
      aria-hidden={!open}
      className={classNames(
        'fixed inset-0 z-50 flex items-center justify-center p-6',
        open || isMounted ? 'visible' : 'invisible',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <Container
        className={classNames(
          'absolute inset-0 bg-black/50 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
        onClick={onCancel}
      />

      {/* Dialog */}
      <Flex
        as="section"
        direction="col"
        gapY={3}
        role="alertdialog"
        className={classNames(
          'relative z-10 w-full max-w-120 rounded-lg bg-white dark:bg-blue-03 p-8 md:p-12 shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)] transition duration-200',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        aria-modal
        onTransitionEnd={() => {
          if (!open) {
            setIsMounted(false);
          }
        }}
      >
        <Text className="text-gray-08 dark:text-white" tag={'h2'} variant="h2">
          {labels.title}
        </Text>
        <Text className="text-gray-06 dark:text-gray-05 leading-5.5" tag={'p'} variant="body-alt">
          {labels.message}
        </Text>
        <Flex align="center" className="mt-4" gapX={2} justify="end">
          <Button label={labels.cancel} type="button" variant="secondary" onClick={onCancel} />
          <Button label={labels.delete} type="button" variant="danger" onClick={onConfirm} />
        </Flex>
      </Flex>
    </Container>
  );
};

export default DeleteInvoiceDialog;
