import { useCallback, useEffect, useState } from 'react';
import { getInvoices } from '@/features/invoices/api/get-invoices';
import { Invoice } from '@/features/invoices/types/invoice';

interface UseInvoicesResult {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  /** Re-runs the fetch, e.g. after a mutation. */
  refetch: () => void;
}

/** Loads every invoice on mount and whenever refetch() is called. */
export const useInvoices = (): UseInvoicesResult => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getInvoices()
      .then((data) => {
        if (!cancelled) {
          setInvoices(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load invoices');
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
  }, [reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { invoices, isLoading, error, refetch };
};
