import { renderHook, waitFor } from '@testing-library/react';
import { getInvoice } from '@/features/invoices/api/get-invoice';
import { useInvoice } from '@/features/invoices/api/use-invoice';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { ApiError } from '@/lib/api-client';

vi.mock('@/features/invoices/api/get-invoice', () => ({ getInvoice: vi.fn() }));

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

it('loads the invoice for the given id', async () => {
  vi.mocked(getInvoice).mockResolvedValue(invoiceFixture);

  const { result } = renderHook(() => useInvoice('1'));

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(getInvoice).toHaveBeenCalledWith('1');
  expect(result.current.invoice).toEqual(invoiceFixture);
});

it('leaves invoice undefined and skips fetching without an id', async () => {
  const { result } = renderHook(() => useInvoice(undefined));

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(getInvoice).not.toHaveBeenCalled();
  expect(result.current.invoice).toBeUndefined();
});

it('treats a 404 as not-found rather than an error', async () => {
  vi.mocked(getInvoice).mockRejectedValue(new ApiError(404, 'invoice not found'));

  const { result } = renderHook(() => useInvoice('missing'));

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.invoice).toBeUndefined();
  expect(result.current.error).toBeNull();
});

it('surfaces a non-404 failure as an error', async () => {
  vi.mocked(getInvoice).mockRejectedValue(new Error('network down'));

  const { result } = renderHook(() => useInvoice('1'));

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.error).toBe('network down');
});
