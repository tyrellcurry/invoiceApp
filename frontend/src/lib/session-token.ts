const STORAGE_KEY = 'invoiceapp.session';

interface StoredSession {
  token: string;
  expiresAt: string;
}

/**
 * Persists the current session's bearer token in localStorage, shared
 * between `features/auth` (which sets it after a guest/Google sign-in) and
 * `features/invoices/api` (which reads it for the Authorization header).
 * Lives outside both features since bulletproof-react's boundary rules
 * forbid a feature importing another feature.
 */
export const getToken = (): string | null => {
  const stored = readStored();
  if (!stored) {
    return null;
  }
  if (new Date(stored.expiresAt).getTime() <= Date.now()) {
    clearToken();
    return null;
  }
  return stored.token;
};

export const setToken = (token: string, expiresAt: string): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt } satisfies StoredSession));
};

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

const readStored = (): StoredSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};
