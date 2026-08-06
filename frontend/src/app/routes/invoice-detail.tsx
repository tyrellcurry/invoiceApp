import { JSX } from 'react';
import { useParams } from 'react-router';
import { useTranslations } from 'use-intl';
import InvoiceDetailView from '@/app/routes/invoice-detail-view';
import NotFound from '@/app/routes/not-found';
import { useInvoice } from '@/features/invoices/api/use-invoice';

const InvoiceDetailRoute = (): JSX.Element => {
  const t = useTranslations('InvoiceDetails');
  const { id } = useParams();
  const { invoice, isLoading, error, refetch } = useInvoice(id);

  if (isLoading) {
    return <p className="text-gray-06 dark:text-gray-05 text-center py-20">{t('loading')}</p>;
  }

  if (error) {
    return <p className="text-red-08 text-center py-20">{t('loadError')}</p>;
  }

  if (!invoice) {
    return <NotFound />;
  }

  return <InvoiceDetailView invoice={invoice} onInvoiceChange={refetch} />;
};

export default InvoiceDetailRoute;
