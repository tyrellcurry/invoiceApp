import { apiRequest } from '@/lib/api-client';

export interface GuestSession {
  token: string;
  expiresAt: string;
}

/** Creates a short-lived, unowned guest session. */
export const continueAsGuest = (): Promise<GuestSession> =>
  apiRequest<GuestSession>('/auth/guest', { method: 'POST' });
