import { API_URL } from '@/config/constants';

/**
 * Where "Continue with Google" navigates to. Not a fetch call — the backend
 * owns the whole OAuth handshake, so the browser needs a real top-level
 * navigation to it (and eventually to Google's consent screen).
 */
export const googleLoginUrl = `${API_URL}/auth/google/login`;
