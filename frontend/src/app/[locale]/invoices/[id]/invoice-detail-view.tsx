'use client';

import { JSX, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import Container from '@/components/ui/container/container';
import InvoiceDetails from '@/features/invoices/components/invoice-details/invoice-details';
import InvoiceFormDrawer from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer';
import type { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { useInvoiceFormLabels } from '@/features/invoices/hooks/use-invoice-form-labels';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';
import { invoiceToFormValues } from '@/features/invoices/utils/invoice-form-values';

const InvoiceDetailView = ({ invoice }: { invoice: Invoice }): JSX.Element => {
  const t = useTranslations('InvoiceDetails');
  const router = useRouter();
  const { labels: formLabels, paymentTermOptions } = useInvoiceFormLabels();
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <Container className="mx-auto max-w-[730px]">
      {/* @TODO: wire onDelete/onMarkAsPaid once the invoice mutation flow exists. */}
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
        onEdit={() => setIsEditing(true)}
        onGoBack={() => router.push('/')}
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
    </Container>
  );
};

export default InvoiceDetailView;
