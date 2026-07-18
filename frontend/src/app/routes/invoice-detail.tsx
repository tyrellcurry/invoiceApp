import { JSX } from 'react';
import { useParams } from 'react-router';
import InvoiceDetailView from '@/app/routes/invoice-detail-view';
import NotFound from '@/app/routes/not-found';
import { getInvoiceById } from '@/features/invoices/data/sample-invoices';

const InvoiceDetailRoute = (): JSX.Element => {
  const { id } = useParams();
  // @TODO: fetch the invoice from `features/invoices/api` once a backend exists.
  const invoice = id ? getInvoiceById(id) : undefined;

  if (!invoice) {
    return <NotFound />;
  }

  return <InvoiceDetailView invoice={invoice} />;
};

export default InvoiceDetailRoute;
