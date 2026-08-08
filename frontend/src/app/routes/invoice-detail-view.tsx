import { JSX, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslations } from 'use-intl';
import Container from '@/components/ui/container/container';
import Text from '@/components/ui/text/text';
import { deleteInvoice } from '@/features/invoices/api/delete-invoice';
import { setInvoiceStatus } from '@/features/invoices/api/set-invoice-status';
import { updateInvoice } from '@/features/invoices/api/update-invoice';
import DeleteInvoiceDialog from '@/features/invoices/components/delete-invoice-dialog/delete-invoice-dialog';
import InvoiceDetails from '@/features/invoices/components/invoice-details/invoice-details';
import InvoiceFormDrawer from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer';
import type { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { useInvoiceFormLabels } from '@/features/invoices/hooks/use-invoice-form-labels';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { invoiceToFormValues } from '@/features/invoices/utils/invoice-form-values';

const InvoiceDetailView = ({
  invoice,
  onInvoiceChange,
}: {
  invoice: Invoice;
  /** Called after a successful edit, delete or mark-as-paid so the caller can refetch. */
  onInvoiceChange: () => void;
}): JSX.Element => {
  const t = useTranslations('InvoiceDetails');
  const tForm = useTranslations('InvoiceForm');
  const tDelete = useTranslations('DeleteInvoice');
  const navigate = useNavigate();
  const { labels: formLabels, paymentTermOptions } = useInvoiceFormLabels();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Delete and mark-as-paid/revert failures aren't tied to an open drawer or
  // dialog, so they render on the page. An edit failure happens while the
  // drawer is still open, so it renders inside it instead (formError, below).
  const [actionError, setActionError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const formValues = useMemo(() => invoiceToFormValues(invoice), [invoice]);

  const statusText: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  const handleSubmit = async (values: InvoiceFormValues) => {
    setFormError(null);
    try {
      await updateInvoice(invoice.id, values, values.status);
      setIsEditing(false);
      onInvoiceChange();
    } catch {
      setFormError(tForm('submitError'));
    }
  };

  const handleConfirmDelete = async () => {
    setActionError(null);
    try {
      await deleteInvoice(invoice.id);
      setIsDeleting(false);
      navigate('/');
    } catch {
      setIsDeleting(false);
      setActionError(t('actionError'));
    }
  };

  const handleStatusChange = async (status: InvoiceStatus) => {
    setActionError(null);
    try {
      await setInvoiceStatus(invoice.id, status);
      onInvoiceChange();
    } catch {
      setActionError(t('actionError'));
    }
  };

  return (
    <Container className="mx-auto max-w-182.5">
      <InvoiceDetails
        clientAddress={invoice.clientAddress}
        clientEmail={invoice.clientEmail}
        clientName={invoice.clientName}
        description={invoice.description}
        invoiceAmountDue={invoice.amountDue}
        invoiceDate={invoice.invoiceDate}
        invoiceId={invoice.reference}
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
          revertToPending: t('revertToPending'),
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
        onMarkAsPaid={() => void handleStatusChange(InvoiceStatus.PAID)}
        onRevertToPending={() => void handleStatusChange(InvoiceStatus.PENDING)}
      />

      {actionError && (
        <Text className="text-red-08 mt-4 text-center" tag={'p'}>
          {actionError}
        </Text>
      )}

      <InvoiceFormDrawer
        error={formError}
        initialValues={formValues}
        invoiceId={invoice.reference}
        labels={formLabels}
        mode="edit"
        open={isEditing}
        paymentTermOptions={paymentTermOptions}
        onClose={() => {
          setIsEditing(false);
          setFormError(null);
        }}
        onSubmit={(values) => void handleSubmit(values)}
      />

      <DeleteInvoiceDialog
        open={isDeleting}
        labels={{
          title: tDelete('title'),
          message: tDelete('message', { id: invoice.reference }),
          cancel: tDelete('cancel'),
          delete: tDelete('delete'),
        }}
        onCancel={() => setIsDeleting(false)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </Container>
  );
};

export default InvoiceDetailView;
