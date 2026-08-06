/**
 * Landed on after a Google login redirect: backend/internal/auth's callback
 * handler sends the browser to
 * `/auth/callback#token=...&expiresAt=...&preloaded=...`. Stores the token
 * and bounces straight to the app; there's nothing to see here in the
 * success path.
 */
import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { markPreloaded } from '@/lib/preload-banner';
import { setToken } from '@/lib/session-token';

const AuthCallbackRoute = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('token');
    const expiresAt = params.get('expiresAt');
    if (token && expiresAt) {
      setToken(token, expiresAt);
      if (params.get('preloaded') === 'true') {
        markPreloaded();
      }
    }
    navigate('/', { replace: true });
  }, [navigate]);

  return <></>;
};

export default AuthCallbackRoute;
