import { apiRequest } from '@/features/invoices/api/client';
import { updateInvoice } from '@/features/invoices/api/update-invoice';
import { InvoiceFormValues } from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

vi.mock('@/features/invoices/api/client', () => ({ apiRequest: vi.fn() }));

const formValues: InvoiceFormValues = {
  senderStreet: '',
  senderCity: '',
  senderPostCode: '',
  senderCountry: '',
  clientName: 'Alysa W. Werner',
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

it('PUTs the mapped payload without a status and maps the response', async () => {
  vi.mocked(apiRequest).mockResolvedValue({
    id: '1',
    reference: 'FV2353',
    description: '',
    status: InvoiceStatus.PENDING,
    invoiceDate: null,
    paymentTerms: 30,
    paymentDue: null,
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientName: 'Alysa W. Werner',
    clientEmail: '',
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [],
    amountDue: 0,
  });

  const invoice = await updateInvoice('1', formValues);

  expect(apiRequest).toHaveBeenCalledWith(
    '/invoices/1',
    expect.objectContaining({ method: 'PUT' })
  );
  const body = JSON.parse(vi.mocked(apiRequest).mock.calls[0][1]?.body as string);
  expect(body.status).toBeUndefined();
  expect(invoice.clientName).toBe('Alysa W. Werner');
});
