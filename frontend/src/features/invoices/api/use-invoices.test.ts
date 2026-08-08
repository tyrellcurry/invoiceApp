import { act, renderHook, waitFor } from '@testing-library/react';
import { getInvoices } from '@/features/invoices/api/get-invoices';
import { useInvoices } from '@/features/invoices/api/use-invoices';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

vi.mock('@/features/invoices/api/get-invoices', () => ({ getInvoices: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

const invoiceFixture = {
  id: '1',
  reference: 'RT3080',
  description: '',
  status: InvoiceStatus.PAID,
  invoiceDate: '',
  paymentTerms: 30,
  paymentDue: '',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: 'Jensen Huang',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
  amountDue: 0,
};

it('loads invoices on mount', async () => {
  vi.mocked(getInvoices).mockResolvedValue([invoiceFixture]);

  const { result } = renderHook(() => useInvoices());

  expect(result.current.isLoading).toBe(true);
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.invoices).toEqual([invoiceFixture]);
  expect(result.current.error).toBeNull();
});

it('surfaces a load failure', async () => {
  vi.mocked(getInvoices).mockRejectedValue(new Error('network down'));

  const { result } = renderHook(() => useInvoices());

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.error).toBe('network down');
  expect(result.current.invoices).toEqual([]);
});

it('refetch() re-runs the fetch', async () => {
  vi.mocked(getInvoices).mockResolvedValue([]);
  const { result } = renderHook(() => useInvoices());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  vi.mocked(getInvoices).mockResolvedValue([invoiceFixture]);
  act(() => result.current.refetch());

  await waitFor(() => expect(result.current.invoices).toEqual([invoiceFixture]));
  expect(getInvoices).toHaveBeenCalledTimes(2);
});
