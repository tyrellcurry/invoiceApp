import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { IntlProvider } from 'use-intl';
import HomeView from '@/app/routes/home';
import { createInvoice } from '@/features/invoices/api/create-invoice';
import { getInvoices } from '@/features/invoices/api/get-invoices';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import en from '../../../messages/en.json';

vi.mock('@/features/invoices/api/get-invoices', () => ({ getInvoices: vi.fn() }));
vi.mock('@/features/invoices/api/create-invoice', () => ({ createInvoice: vi.fn() }));

const invoiceFixture = {
  id: 'a1',
  reference: 'RT3080',
  description: 'Re-branding',
  status: InvoiceStatus.PAID,
  invoiceDate: '18 Jul 2021',
  paymentTerms: 30,
  paymentDue: '17 Aug 2021',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: 'Jensen Huang',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
  amountDue: 1800.9,
};

const renderHome = () =>
  render(
    <IntlProvider locale="en" messages={en}>
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    </IntlProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

it('shows a loading state, then the fetched invoices', async () => {
  vi.mocked(getInvoices).mockResolvedValue([invoiceFixture]);

  renderHome();

  expect(screen.getByText(/loading invoices/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByText('Jensen Huang').length).toBeGreaterThan(0));
  expect(screen.getAllByText('RT3080').length).toBeGreaterThan(0);
});

it('shows the empty state when there are no invoices', async () => {
  vi.mocked(getInvoices).mockResolvedValue([]);

  renderHome();

  await waitFor(() => expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument());
});

it('shows a load error when the fetch fails', async () => {
  vi.mocked(getInvoices).mockRejectedValue(new Error('network down'));

  renderHome();

  await waitFor(() => expect(screen.getByText(/couldn't load invoices/i)).toBeInTheDocument());
});

it('creates a draft invoice and refreshes the list', async () => {
  vi.mocked(getInvoices).mockResolvedValueOnce([]).mockResolvedValueOnce([invoiceFixture]);
  vi.mocked(createInvoice).mockResolvedValue(invoiceFixture);

  renderHome();
  await waitFor(() => expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /new invoice|new/i })[0]);
  fireEvent.change(screen.getByLabelText(/client's name/i), { target: { value: 'Jensen Huang' } });
  fireEvent.click(screen.getAllByRole('button', { name: /save as draft/i })[0]);

  await waitFor(() =>
    expect(createInvoice).toHaveBeenCalledWith(
      expect.objectContaining({ clientName: 'Jensen Huang' }),
      InvoiceStatus.DRAFT
    )
  );
  await waitFor(() => expect(getInvoices).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.getAllByText('Jensen Huang').length).toBeGreaterThan(0));
});

it('keeps the drawer open and shows an error when create fails', async () => {
  vi.mocked(getInvoices).mockResolvedValue([]);
  vi.mocked(createInvoice).mockRejectedValue(new Error('server error'));

  renderHome();
  await waitFor(() => expect(screen.getByText(/there is nothing here/i)).toBeInTheDocument());

  fireEvent.click(screen.getAllByRole('button', { name: /new invoice|new/i })[0]);
  fireEvent.change(screen.getByLabelText(/client's name/i), { target: { value: 'Jensen Huang' } });
  fireEvent.click(screen.getAllByRole('button', { name: /save as draft/i })[0]);

  await waitFor(() => expect(screen.getByText(/couldn't load invoices/i)).toBeInTheDocument());
  expect(screen.getByLabelText(/client's name/i)).toBeInTheDocument();
});
