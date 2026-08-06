import { markInvoiceAsPaid } from '@/features/invoices/api/mark-invoice-as-paid';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({ apiRequest: vi.fn() }));

it('POSTs /invoices/{id}/mark-as-paid and maps the response', async () => {
  vi.mocked(apiRequest).mockResolvedValue({
    id: '1',
    reference: 'RT3080',
    description: '',
    status: InvoiceStatus.PAID,
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

  const invoice = await markInvoiceAsPaid('1');

  expect(apiRequest).toHaveBeenCalledWith('/invoices/1/mark-as-paid', { method: 'POST' });
  expect(invoice.status).toBe(InvoiceStatus.PAID);
});
