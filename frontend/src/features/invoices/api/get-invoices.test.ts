import { getInvoices } from '@/features/invoices/api/get-invoices';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({ apiRequest: vi.fn() }));

it('fetches /invoices and maps each result', async () => {
  vi.mocked(apiRequest).mockResolvedValue([
    {
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
      amountDue: 180090,
    },
  ]);

  const invoices = await getInvoices();

  expect(apiRequest).toHaveBeenCalledWith('/invoices');
  expect(invoices).toHaveLength(1);
  expect(invoices[0].reference).toBe('RT3080');
  expect(invoices[0].amountDue).toBe(1800.9);
});
