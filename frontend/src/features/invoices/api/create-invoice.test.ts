import { createInvoice } from '@/features/invoices/api/create-invoice';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { apiRequest } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({ apiRequest: vi.fn() }));

const formValues: InvoiceFormValues = {
  senderStreet: '',
  senderCity: '',
  senderPostCode: '',
  senderCountry: '',
  clientName: 'Jensen Huang',
  clientEmail: '',
  clientStreet: '',
  clientCity: '',
  clientPostCode: '',
  clientCountry: '',
  invoiceDate: '',
  paymentTerms: 30,
  description: '',
  items: [],
};

it('POSTs the mapped payload with the given status and maps the response', async () => {
  vi.mocked(apiRequest).mockResolvedValue({
    id: '1',
    reference: 'FM4468',
    description: '',
    status: InvoiceStatus.DRAFT,
    invoiceDate: null,
    paymentTerms: 30,
    paymentDue: null,
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientName: 'Jensen Huang',
    clientEmail: '',
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [],
    amountDue: 0,
  });

  const invoice = await createInvoice(formValues, InvoiceStatus.DRAFT);

  expect(apiRequest).toHaveBeenCalledWith(
    '/invoices',
    expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"status":"DRAFT"'),
    })
  );
  expect(invoice.reference).toBe('FM4468');
});
