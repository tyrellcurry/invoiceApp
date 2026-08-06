import { ApiError, apiRequest } from '@/features/invoices/api/client';

const mockFetch = (response: Partial<Response> & { json?: () => Promise<unknown> }) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
      ...response,
    })
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiRequest', () => {
  it('requests the given path against the configured API base URL', async () => {
    mockFetch({ json: async () => ({ ok: true }) });

    await apiRequest('/invoices');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/invoices',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('returns the decoded JSON body on success', async () => {
    mockFetch({ json: async () => ({ id: '1', reference: 'RT3080' }) });

    const result = await apiRequest<{ id: string; reference: string }>('/invoices/1');

    expect(result).toEqual({ id: '1', reference: 'RT3080' });
  });

  it('returns undefined for a 204 response without reading a body', async () => {
    mockFetch({
      status: 204,
      json: async () => {
        throw new Error('should not be called');
      },
    });

    const result = await apiRequest<undefined>('/invoices/1', { method: 'DELETE' });

    expect(result).toBeUndefined();
  });

  it('throws an ApiError with the server message on a non-2xx response', async () => {
    mockFetch({ ok: false, status: 400, json: async () => ({ error: 'clientName is required' }) });

    await expect(apiRequest('/invoices', { method: 'POST' })).rejects.toEqual(
      new ApiError(400, 'clientName is required')
    );
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(apiRequest('/invoices')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed with status 500',
    });
  });
});
