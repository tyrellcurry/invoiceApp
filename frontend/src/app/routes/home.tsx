import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTranslations } from 'use-intl';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import { createInvoice } from '@/features/invoices/api/create-invoice';
import { useInvoices } from '@/features/invoices/api/use-invoices';
import Invoice from '@/features/invoices/components/invoice/invoice';
import InvoiceBar from '@/features/invoices/components/invoice-bar/invoice-bar';
import type { FilterState } from '@/features/invoices/components/invoice-bar/invoice-bar.types';
import InvoiceFormDrawer from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer';
import type { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import InvoicesEmptyState from '@/features/invoices/components/invoices-empty-state/invoices-empty-state';
import { useInvoiceFormLabels } from '@/features/invoices/hooks/use-invoice-form-labels';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { emptyInvoiceFormValues } from '@/features/invoices/utils/invoice-form-values';

const STATUS_TO_FILTER_KEY: Record<InvoiceStatus, keyof FilterState> = {
  [InvoiceStatus.DRAFT]: 'draft',
  [InvoiceStatus.PENDING]: 'pending',
  [InvoiceStatus.PAID]: 'paid',
};

const HomeView = () => {
  const t = useTranslations('Dashboard');
  const { labels: formLabels, paymentTermOptions } = useInvoiceFormLabels();
  const { invoices, isLoading, error, refetch } = useInvoices();
  const [filters, setFilters] = useState<FilterState>({
    draft: false,
    pending: false,
    paid: false,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const emptyValues = useMemo(() => emptyInvoiceFormValues(), []);

  const submitNewInvoice = async (values: InvoiceFormValues, status: InvoiceStatus) => {
    setCreateError(null);
    try {
      await createInvoice(values, status);
      setIsCreating(false);
      refetch();
    } catch {
      setCreateError(t('loadError'));
    }
  };

  const statusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.DRAFT]: t('statusDraft'),
    [InvoiceStatus.PENDING]: t('statusPending'),
    [InvoiceStatus.PAID]: t('statusPaid'),
  };

  const noFilterActive = !filters.draft && !filters.pending && !filters.paid;
  const visibleInvoices = invoices.filter(
    (invoice) => noFilterActive || filters[STATUS_TO_FILTER_KEY[invoice.status]]
  );

  return (
    <Flex className="mx-auto max-w-250" direction="col" gapY={8}>
      <InvoiceBar
        filters={filters}
        filterStatusBtn={{ mobile: t('filterMobile'), desktop: t('filterDesktop') }}
        invoiceBarTitle={t('title')}
        newInvoiceBtn={{ mobile: t('newInvoiceMobile'), desktop: t('newInvoiceDesktop') }}
        newInvoiceHandler={() => setIsCreating(true)}
        setFilters={setFilters}
        filterStatusText={{
          draft: t('statusDraft'),
          pending: t('statusPending'),
          paid: t('statusPaid'),
        }}
        totalInvoicesText={{
          mobile: t('totalMobile', { count: invoices.length }),
          desktop: t('totalDesktop', { count: invoices.length }),
        }}
      />
      {error ? (
        <Text className="text-red-08 text-center" tag={'p'}>
          {t('loadError')}
        </Text>
      ) : isLoading ? (
        <Text className="text-gray-06 dark:text-gray-05 text-center" tag={'p'}>
          {t('loading')}
        </Text>
      ) : visibleInvoices.length === 0 ? (
        <Flex align="center" className="py-10 md:py-20" direction="col">
          <InvoicesEmptyState
            title={t('emptyTitle')}
            description={t.rich('emptyDescription', {
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          />
        </Flex>
      ) : (
        <Flex as="ul" direction="col" gapY={4}>
          {visibleInvoices.map((invoice) => (
            <li key={invoice.id}>
              <Link className="block" to={`/invoices/${invoice.id}`}>
                <Invoice
                  billingName={invoice.clientName}
                  dueText={t('due')}
                  invoiceAmountDue={invoice.amountDue}
                  invoiceDueDate={invoice.paymentDue}
                  invoiceId={invoice.reference}
                  invoiceStatus={invoice.status}
                  invoiceStatusText={statusLabels[invoice.status]}
                />
              </Link>
            </li>
          ))}
        </Flex>
      )}

      <InvoiceFormDrawer
        initialValues={emptyValues}
        labels={formLabels}
        mode="create"
        open={isCreating}
        paymentTermOptions={paymentTermOptions}
        onClose={() => {
          setIsCreating(false);
          setCreateError(null);
        }}
        onSaveDraft={(values) => void submitNewInvoice(values, InvoiceStatus.DRAFT)}
        onSubmit={(values) => void submitNewInvoice(values, InvoiceStatus.PENDING)}
      />
      {createError && (
        <Text className="text-red-08 fixed bottom-4 left-1/2 -translate-x-1/2" tag={'p'}>
          {createError}
        </Text>
      )}
    </Flex>
  );
};

export default HomeView;
