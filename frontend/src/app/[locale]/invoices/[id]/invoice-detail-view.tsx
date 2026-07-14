'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import Container from '@/components/ui/container/container';
import InvoiceDetails from '@/features/invoices/components/invoice-details/invoice-details';
import { Invoice, InvoiceStatus } from '@/features/invoices/types/invoice';

const InvoiceDetailView = ({ invoice }: { invoice: Invoice }): JSX.Element => {
  const t = useTranslations('InvoiceDetails');
  const router = useRouter();

  const statusText: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  return (
    <Container className="mx-auto max-w-[730px]">
      {/* @TODO: wire onEdit/onDelete/onMarkAsPaid once the invoice mutation flow exists. */}
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
        onGoBack={() => router.push('/')}
      />
    </Container>
  );
};

export default InvoiceDetailView;
