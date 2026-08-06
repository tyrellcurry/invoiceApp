import { deleteInvoice } from '@/features/invoices/api/delete-invoice';
import { apiRequest } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({ apiRequest: vi.fn() }));

it('DELETEs /invoices/{id}', async () => {
  vi.mocked(apiRequest).mockResolvedValue(undefined);

  await deleteInvoice('1');

  expect(apiRequest).toHaveBeenCalledWith('/invoices/1', { method: 'DELETE' });
});
