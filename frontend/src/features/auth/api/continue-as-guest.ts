import { apiRequest } from '@/lib/api-client';

export interface GuestSession {
  token: string;
  expiresAt: string;
  /** Always true: every guest session is brand new, so it's always just been preloaded. */
  preloaded: boolean;
}

/** Creates a short-lived, unowned guest session. */
export const continueAsGuest = (): Promise<GuestSession> =>
  apiRequest<GuestSession>('/auth/guest', { method: 'POST' });
