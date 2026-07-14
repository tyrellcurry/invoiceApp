'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import MainMenu from '@/components/layouts/main-menu/main-menu';
import InvoiceBar from '@/features/invoices/components/invoice-bar/invoice-bar';
import type { FilterState } from '@/features/invoices/components/invoice-bar/invoice-bar.types';
import Invoice from '@/features/invoices/components/invoice/invoice';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { useDarkMode } from '@/hooks/use-dark-mode';

interface SampleInvoice {
  invoiceId: string;
  billingName: string;
  invoiceDueDate: string;
  invoiceAmountDue: number;
  invoiceStatus: InvoiceStatus;
}

// Sample data stands in for the (not yet built) data layer; when an API is
// added this should come from `features/invoices/api`.
const SAMPLE_INVOICES: SampleInvoice[] = [
  {
    invoiceId: 'RT3080',
    billingName: 'Jensen Huang',
    invoiceDueDate: '19 Aug 2021',
    invoiceAmountDue: 1800.9,
    invoiceStatus: InvoiceStatus.PAID,
  },
  {
    invoiceId: 'XM9141',
    billingName: 'Alex Grim',
    invoiceDueDate: '20 Sep 2021',
    invoiceAmountDue: 556.0,
    invoiceStatus: InvoiceStatus.PENDING,
  },
  {
    invoiceId: 'RG0314',
    billingName: 'John Morrison',
    invoiceDueDate: '01 Oct 2021',
    invoiceAmountDue: 14002.33,
    invoiceStatus: InvoiceStatus.DRAFT,
  },
];

const STATUS_TO_FILTER_KEY: Record<InvoiceStatus, keyof FilterState> = {
  [InvoiceStatus.DRAFT]: 'draft',
  [InvoiceStatus.PENDING]: 'pending',
  [InvoiceStatus.PAID]: 'paid',
};

const HomeView = () => {
  const t = useTranslations('Dashboard');
  const tMenu = useTranslations('MainMenu');
  const { theme, toggleTheme } = useDarkMode();
  const [filters, setFilters] = useState<FilterState>({
    draft: false,
    pending: false,
    paid: false,
  });

  const statusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  const noFilterActive = !filters.draft && !filters.pending && !filters.paid;
  const visibleInvoices = SAMPLE_INVOICES.filter(
    (invoice) => noFilterActive || filters[STATUS_TO_FILTER_KEY[invoice.invoiceStatus]]
  );

  return (
    <div className="min-h-screen lg:pl-25">
      <MainMenu
        darkmode={theme}
        darkmodeBtn={{ darkAria: tMenu('switchToDark'), lightAria: tMenu('switchToLight') }}
        darkmodeToggle={toggleTheme}
        profile={{ profileImageAlt: tMenu('profileImageAlt') }}
      />
      <main className="mx-auto flex max-w-250 flex-col gap-y-8 px-6 py-8 md:py-12 lg:py-16">
        <InvoiceBar
          filters={filters}
          filterStatusBtn={{ mobile: t('filterMobile'), desktop: t('filterDesktop') }}
          invoiceBarTitle={t('title')}
          newInvoiceBtn={{ mobile: t('newInvoiceMobile'), desktop: t('newInvoiceDesktop') }}
          newInvoiceHandler={() => {}}
          setFilters={setFilters}
          filterStatusText={{
            draft: t('statusDraft'),
            pending: t('statusPending'),
            paid: t('statusPaid'),
          }}
          totalInvoicesText={{
            mobile: t('totalMobile', { count: SAMPLE_INVOICES.length }),
            desktop: t('totalDesktop', { count: SAMPLE_INVOICES.length }),
          }}
        />
        <ul className="flex flex-col gap-y-4">
          {visibleInvoices.map((invoice) => (
            <li key={invoice.invoiceId}>
              <Invoice
                {...invoice}
                dueText={t('due')}
                invoiceStatusText={statusLabels[invoice.invoiceStatus]}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomeView;
