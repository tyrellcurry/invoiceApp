import { apiRequest } from '@/lib/api-client';

export interface MeUser {
  email: string;
  name: string;
}

export interface Me {
  authenticated: boolean;
  user: MeUser | null;
  expiresAt: string | null;
}

/** Resolves the current bearer token to a session, or a 401 if there isn't a valid one. */
export const getMe = (): Promise<Me> => apiRequest<Me>('/auth/me');
