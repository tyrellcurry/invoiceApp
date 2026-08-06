import { useCallback, useEffect, useState } from 'react';
import { continueAsGuest as continueAsGuestRequest } from '@/features/auth/api/continue-as-guest';
import { getMe, MeUser } from '@/features/auth/api/get-me';
import { logout as logoutRequest } from '@/features/auth/api/logout';
import { clearToken, getToken, setToken } from '@/lib/session-token';

export type SessionStatus = 'loading' | 'authenticated' | 'guest' | 'anonymous';

interface UseSessionResult {
  status: SessionStatus;
  user: MeUser | null;
  /** Creates a guest session and stores its token. */
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Resolves whether the browser already has a valid session (guest or
 * Google-authenticated) on mount, and exposes the actions that change it.
 * `status` starts as 'loading' until that resolves; 'anonymous' means no
 * session at all, which callers render the splash screen for.
 */
export const useSession = (): UseSessionResult => {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!getToken()) {
      setStatus('anonymous');
      return;
    }

    getMe()
      .then((me) => {
        if (cancelled) {
          return;
        }
        if (!me.authenticated) {
          clearToken();
          setStatus('anonymous');
          return;
        }
        setUser(me.user);
        setStatus(me.user ? 'authenticated' : 'guest');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        clearToken();
        setStatus('anonymous');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const continueAsGuest = useCallback(async () => {
    const session = await continueAsGuestRequest();
    setToken(session.token, session.expiresAt);
    setStatus('guest');
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => {
      // Best-effort: even if revoking server-side fails, drop the local
      // token so the splash gate reappears.
    });
    clearToken();
    setUser(null);
    setStatus('anonymous');
  }, []);

  return { status, user, continueAsGuest, logout };
};
