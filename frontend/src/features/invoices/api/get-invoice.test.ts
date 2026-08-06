import { apiRequest } from '@/features/invoices/api/client';
import { getInvoice } from '@/features/invoices/api/get-invoice';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

vi.mock('@/features/invoices/api/client', () => ({ apiRequest: vi.fn() }));

it('fetches /invoices/{id} and maps the result', async () => {
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

  const invoice = await getInvoice('1');

  expect(apiRequest).toHaveBeenCalledWith('/invoices/1');
  expect(invoice.id).toBe('1');
  expect(invoice.reference).toBe('RT3080');
});
