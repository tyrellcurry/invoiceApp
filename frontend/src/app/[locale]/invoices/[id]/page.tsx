import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/features/invoices/data/sample-invoices';
import InvoiceDetailView from './invoice-detail-view';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  // @TODO: fetch the invoice from `features/invoices/api` once a backend exists.
  const invoice = getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailView invoice={invoice} />;
}
