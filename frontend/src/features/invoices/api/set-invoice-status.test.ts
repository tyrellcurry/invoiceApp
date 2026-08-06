import { setInvoiceStatus } from '@/features/invoices/api/set-invoice-status';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({ apiRequest: vi.fn() }));

const apiInvoice = (status: InvoiceStatus) => ({
  id: '1',
  reference: 'RT3080',
  description: '',
  status,
  invoiceDate: null,
  paymentTerms: null,
  paymentDue: null,
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: 'Jensen Huang',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
  amountDue: 0,
});

it('POSTs the requested status and maps the response', async () => {
  vi.mocked(apiRequest).mockResolvedValue(apiInvoice(InvoiceStatus.PAID));

  const invoice = await setInvoiceStatus('1', InvoiceStatus.PAID);

  expect(apiRequest).toHaveBeenCalledWith('/invoices/1/status', {
    method: 'POST',
    body: JSON.stringify({ status: InvoiceStatus.PAID }),
  });
  expect(invoice.status).toBe(InvoiceStatus.PAID);
});

it('reverts a paid invoice back to pending', async () => {
  vi.mocked(apiRequest).mockResolvedValue(apiInvoice(InvoiceStatus.PENDING));

  const invoice = await setInvoiceStatus('1', InvoiceStatus.PENDING);

  expect(apiRequest).toHaveBeenCalledWith('/invoices/1/status', {
    method: 'POST',
    body: JSON.stringify({ status: InvoiceStatus.PENDING }),
  });
  expect(invoice.status).toBe(InvoiceStatus.PENDING);
});
