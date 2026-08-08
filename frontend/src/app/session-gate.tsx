/**
 * Gates every route below it on having a session. Loading: render nothing
 * yet. Anonymous: show the splash screen (full-screen, no app chrome)
 * instead of the route tree. Guest or authenticated: render the app shell
 * (sidebar nav) with the requested route inside it.
 */
import { JSX, useState } from 'react';
import { Outlet } from 'react-router';
import { useTranslations } from 'use-intl';
import AppShell from '@/components/layouts/app-shell/app-shell';
import { AUTHOR_URL } from '@/config/constants';
import { googleLoginUrl } from '@/features/auth/api/google-login-url';
import SplashScreen from '@/features/auth/components/splash-screen/splash-screen';
import WelcomeModal from '@/features/auth/components/welcome-modal/welcome-modal';
import { useSession } from '@/features/auth/hooks/use-session';

const SessionGate = (): JSX.Element | null => {
  const t = useTranslations('Splash');
  const { status, continueAsGuest, logout, user } = useSession();
  const [isContinuingAsGuest, setIsContinuingAsGuest] = useState(false);

  if (status === 'loading') {
    return null;
  }

  if (status === 'anonymous') {
    const handleContinueAsGuest = async () => {
      setIsContinuingAsGuest(true);
      try {
        await continueAsGuest();
      } finally {
        setIsContinuingAsGuest(false);
      }
    };

    return (
      <SplashScreen
        authorUrl={AUTHOR_URL}
        googleLoginUrl={googleLoginUrl}
        isContinuingAsGuest={isContinuingAsGuest}
        labels={{
          title: t('title'),
          description: t('description'),
          continueWithGoogle: t('continueWithGoogle'),
          continueAsGuest: t('continueAsGuest'),
          guestWarning: t('guestWarning'),
          madeWith: t('madeWith'),
          authorName: t('authorName'),
        }}
        onContinueAsGuest={() => void handleContinueAsGuest()}
      />
    );
  }

  return (
    <AppShell userEmail={user?.email} userImage={user?.picture} onLogout={() => void logout()}>
      <WelcomeModal />
      <Outlet />
    </AppShell>
  );
};

export default SessionGate;
