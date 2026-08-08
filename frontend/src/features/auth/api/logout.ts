import { apiRequest } from '@/lib/api-client';

/** Revokes the current session immediately, rather than waiting for it to expire. */
export const logout = (): Promise<void> => apiRequest<void>('/auth/logout', { method: 'POST' });
