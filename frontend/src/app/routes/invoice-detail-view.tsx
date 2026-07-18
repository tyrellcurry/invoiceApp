import { JSX, useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { useNavigate } from 'react-router';
import Container from '@/components/ui/container/container';
import DeleteInvoiceDialog from '@/features/invoices/components/delete-invoice-dialog/delete-invoice-dialog';
import InvoiceDetails from '@/features/invoices/components/invoice-details/invoice-details';
import InvoiceFormDrawer from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer';
import type { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { useInvoiceFormLabels } from '@/features/invoices/hooks/use-invoice-form-labels';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { invoiceToFormValues } from '@/features/invoices/utils/invoice-form-values';

const InvoiceDetailView = ({ invoice }: { invoice: Invoice }): JSX.Element => {
  const t = useTranslations('InvoiceDetails');
  const tDelete = useTranslations('DeleteInvoice');
  const navigate = useNavigate();
  const { labels: formLabels, paymentTermOptions } = useInvoiceFormLabels();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formValues = useMemo(() => invoiceToFormValues(invoice), [invoice]);

  const statusText: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  // @TODO: persist edits via `features/invoices/api` once a backend exists.
  const handleSubmit = (_values: InvoiceFormValues) => {
    setIsEditing(false);
  };

  // @TODO: delete via `features/invoices/api` once a backend exists.
  const handleConfirmDelete = () => {
    setIsDeleting(false);
    navigate('/');
  };

  return (
    <Container className="mx-auto max-w-182.5">
      {/* @TODO: wire onMarkAsPaid once the invoice mutation flow exists. */}
      <InvoiceDetails
        clientAddress={invoice.clientAddress}
        clientEmail={invoice.clientEmail}
        clientName={invoice.clientName}
        description={invoice.description}
        invoiceAmountDue={invoice.amountDue}
        invoiceDate={invoice.invoiceDate}
        invoiceId={invoice.id}
        invoiceStatus={invoice.status}
        items={invoice.items}
        paymentDue={invoice.paymentDue}
        senderAddress={invoice.senderAddress}
        labels={{
          goBack: t('goBack'),
          status: t('status'),
          statusText: statusText[invoice.status],
          edit: t('edit'),
          delete: t('delete'),
          markAsPaid: t('markAsPaid'),
          billTo: t('billTo'),
          sentTo: t('sentTo'),
          invoiceDate: t('invoiceDate'),
          paymentDue: t('paymentDue'),
          itemName: t('itemName'),
          quantity: t('quantity'),
          price: t('price'),
          total: t('total'),
          amountDue: t('amountDue'),
        }}
        onDelete={() => setIsDeleting(true)}
        onEdit={() => setIsEditing(true)}
        onGoBack={() => navigate('/')}
      />

      <InvoiceFormDrawer
        initialValues={formValues}
        invoiceId={invoice.id}
        labels={formLabels}
        mode="edit"
        open={isEditing}
        paymentTermOptions={paymentTermOptions}
        onClose={() => setIsEditing(false)}
        onSubmit={handleSubmit}
      />

      <DeleteInvoiceDialog
        open={isDeleting}
        labels={{
          title: tDelete('title'),
          message: tDelete('message', { id: invoice.id }),
          cancel: tDelete('cancel'),
          delete: tDelete('delete'),
        }}
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
};

export default InvoiceDetailView;
