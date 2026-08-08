import { API_URL } from '@/config/constants';
import { clearToken, getToken } from '@/lib/session-token';

/** Thrown when the API responds with a non-2xx status. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ErrorBody {
  error?: string;
}

/**
 * Sends a JSON request to the API, attaching the current session's bearer
 * token when one is stored, and decodes the JSON response. A 401 on any
 * route other than /auth/* means the session died mid-use (expired or was
 * revoked) rather than "not signed in yet" (which /auth/me legitimately
 * returns as 401) — clear the stale token and send the user back to the
 * splash gate.
 */
export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && !path.startsWith('/auth/')) {
    clearToken();
    window.location.href = '/';
  }

  if (!response.ok) {
    const body: ErrorBody | null = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      body?.error ?? `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
