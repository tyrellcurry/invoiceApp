import { useCallback, useEffect, useState } from 'react';
import { getInvoice } from '@/features/invoices/api/get-invoice';
import { Invoice } from '@/features/invoices/types/invoice';
import { ApiError } from '@/lib/api-client';

interface UseInvoiceResult {
  invoice: Invoice | undefined;
  isLoading: boolean;
  error: string | null;
  /** Re-runs the fetch, e.g. after a mutation. */
  refetch: () => void;
}

/** Loads a single invoice by id on mount and whenever id or refetch() changes. */
export const useInvoice = (id: string | undefined): UseInvoiceResult => {
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!id) {
      setInvoice(undefined);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getInvoice(id)
      .then((data) => {
        if (!cancelled) {
          setInvoice(data);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setInvoice(undefined);
        // A 404 means "no such invoice", which callers render as a not-found
        // page rather than an error state.
        if (!(err instanceof ApiError && err.status === 404)) {
          setError(err instanceof Error ? err.message : 'Failed to load invoice');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { invoice, isLoading, error, refetch };
};
