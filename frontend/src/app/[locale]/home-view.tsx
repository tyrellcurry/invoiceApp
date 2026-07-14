'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import Flex from '@/components/ui/flex/flex';
import InvoiceBar from '@/features/invoices/components/invoice-bar/invoice-bar';
import type { FilterState } from '@/features/invoices/components/invoice-bar/invoice-bar.types';
import Invoice from '@/features/invoices/components/invoice/invoice';
import { sampleInvoices } from '@/features/invoices/data/sample-invoices';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

const STATUS_TO_FILTER_KEY: Record<InvoiceStatus, keyof FilterState> = {
  [InvoiceStatus.DRAFT]: 'draft',
  [InvoiceStatus.PENDING]: 'pending',
  [InvoiceStatus.PAID]: 'paid',
};

const HomeView = () => {
  const t = useTranslations('Dashboard');
  const [filters, setFilters] = useState<FilterState>({
    draft: false,
    pending: false,
    paid: false,
  });

  // @TODO: wire up new-invoice creation once the create flow exists.
  const handleNewInvoice = () => {};

  const statusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  const noFilterActive = !filters.draft && !filters.pending && !filters.paid;
  // @TODO: replace sampleInvoices with data from `features/invoices/api` once a backend exists.
  const visibleInvoices = sampleInvoices.filter(
    (invoice) => noFilterActive || filters[STATUS_TO_FILTER_KEY[invoice.status]]
  );

  return (
    <Flex className="mx-auto max-w-250" direction="col" gapY={8}>
      <InvoiceBar
        filters={filters}
        filterStatusBtn={{ mobile: t('filterMobile'), desktop: t('filterDesktop') }}
        invoiceBarTitle={t('title')}
        newInvoiceBtn={{ mobile: t('newInvoiceMobile'), desktop: t('newInvoiceDesktop') }}
        newInvoiceHandler={handleNewInvoice}
        setFilters={setFilters}
        filterStatusText={{
          draft: t('statusDraft'),
          pending: t('statusPending'),
          paid: t('statusPaid'),
        }}
        totalInvoicesText={{
          mobile: t('totalMobile', { count: sampleInvoices.length }),
          desktop: t('totalDesktop', { count: sampleInvoices.length }),
        }}
      />
      <Flex as="ul" direction="col" gapY={4}>
        {visibleInvoices.map((invoice) => (
          <li key={invoice.id}>
            <Link className="block" href={`/invoices/${invoice.id}`}>
              <Invoice
                billingName={invoice.clientName}
                dueText={t('due')}
                invoiceAmountDue={invoice.amountDue}
                invoiceDueDate={invoice.paymentDue}
                invoiceId={invoice.id}
                invoiceStatus={invoice.status}
                invoiceStatusText={statusLabels[invoice.status]}
              />
            </Link>
          </li>
        ))}
      </Flex>
    </Flex>
  );
};

export default HomeView;
