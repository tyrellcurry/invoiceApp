import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { IntlProvider } from 'use-intl';
import InvoiceDetailRoute from '@/app/routes/invoice-detail';
import { deleteInvoice } from '@/features/invoices/api/delete-invoice';
import { getInvoice } from '@/features/invoices/api/get-invoice';
import { markInvoiceAsPaid } from '@/features/invoices/api/mark-invoice-as-paid';
import { updateInvoice } from '@/features/invoices/api/update-invoice';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import en from '../../../messages/en.json';

vi.mock('@/features/invoices/api/get-invoice', () => ({ getInvoice: vi.fn() }));
vi.mock('@/features/invoices/api/update-invoice', () => ({ updateInvoice: vi.fn() }));
vi.mock('@/features/invoices/api/delete-invoice', () => ({ deleteInvoice: vi.fn() }));
vi.mock('@/features/invoices/api/mark-invoice-as-paid', () => ({ markInvoiceAsPaid: vi.fn() }));

const invoiceFixture = {
  id: 'a1',
  reference: 'RT3080',
  description: 'Re-branding',
  status: InvoiceStatus.PENDING,
  invoiceDate: '18 Jul 2021',
  paymentTerms: 30,
  paymentDue: '17 Aug 2021',
  senderAddress: {
    street: '19 Union Terrace',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientName: 'Jensen Huang',
  clientEmail: 'jensenh@mail.com',
  clientAddress: {
    street: '106 Kendell Street',
    city: 'Sharrington',
    postCode: 'NR24 5WQ',
    country: 'United Kingdom',
  },
  items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.9 }],
  amountDue: 1800.9,
};

const renderDetailRoute = () => {
  const router = createMemoryRouter(
    [
      { path: '/invoices/:id', element: <InvoiceDetailRoute /> },
      { path: '/', element: <p>Home route</p> },
    ],
    { initialEntries: ['/invoices/a1'] }
  );
  render(
    <IntlProvider locale="en" messages={en}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

it('shows a not-found page for a missing invoice', async () => {
  const { ApiError } = await import('@/lib/api-client');
  vi.mocked(getInvoice).mockRejectedValue(new ApiError(404, 'invoice not found'));

  renderDetailRoute();

  await waitFor(() => expect(screen.getByText('404')).toBeInTheDocument());
});

it('marks the invoice as paid and refetches it', async () => {
  vi.mocked(getInvoice)
    .mockResolvedValueOnce(invoiceFixture)
    .mockResolvedValueOnce({ ...invoiceFixture, status: InvoiceStatus.PAID });
  vi.mocked(markInvoiceAsPaid).mockResolvedValue({ ...invoiceFixture, status: InvoiceStatus.PAID });

  renderDetailRoute();
  await waitFor(() => expect(screen.getByText('Jensen Huang')).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /mark as paid/i })[0]);

  await waitFor(() => expect(markInvoiceAsPaid).toHaveBeenCalledWith('a1'));
  await waitFor(() => expect(getInvoice).toHaveBeenCalledTimes(2));
});

it('edits the invoice and refetches it', async () => {
  vi.mocked(getInvoice).mockResolvedValue(invoiceFixture);
  vi.mocked(updateInvoice).mockResolvedValue({ ...invoiceFixture, clientName: 'Jensen H.' });

  renderDetailRoute();
  await waitFor(() => expect(screen.getByText('Jensen Huang')).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /^edit$/i })[0]);
  fireEvent.change(screen.getByLabelText(/client's name/i), { target: { value: 'Jensen H.' } });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() =>
    expect(updateInvoice).toHaveBeenCalledWith(
      'a1',
      expect.objectContaining({ clientName: 'Jensen H.' })
    )
  );
  await waitFor(() => expect(getInvoice).toHaveBeenCalledTimes(2));
});

it('deletes the invoice and navigates home', async () => {
  vi.mocked(getInvoice).mockResolvedValue(invoiceFixture);
  vi.mocked(deleteInvoice).mockResolvedValue(undefined);

  renderDetailRoute();
  await waitFor(() => expect(screen.getByText('Jensen Huang')).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /^delete$/i })[0]);
  const dialog = screen.getByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));

  await waitFor(() => expect(deleteInvoice).toHaveBeenCalledWith('a1'));
  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
});

it('shows an error and keeps the invoice when delete fails', async () => {
  vi.mocked(getInvoice).mockResolvedValue(invoiceFixture);
  vi.mocked(deleteInvoice).mockRejectedValue(new Error('server error'));

  renderDetailRoute();
  await waitFor(() => expect(screen.getByText('Jensen Huang')).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /^delete$/i })[0]);
  const dialog = screen.getByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));

  await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  expect(screen.getByText('Jensen Huang')).toBeInTheDocument();
});
