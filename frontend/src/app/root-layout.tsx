import { JSX } from 'react';
import { Outlet } from 'react-router';
import { IntlProvider } from 'use-intl';
import { AppProvider } from '@/app/provider';
import { getMessages } from '@/lib/i18n/messages';
import { defaultLocale } from '@/lib/i18n/routing';

/**
 * App-wide providers only. The app shell / session gate lives in
 * SessionGate, not here, so /auth/callback can render outside it — that
 * route runs before any session exists (it's what creates one).
 */
const RootLayout = (): JSX.Element => (
  <IntlProvider locale={defaultLocale} messages={getMessages(defaultLocale)}>
    <AppProvider>
      <Outlet />
    </AppProvider>
  </IntlProvider>
);

export default RootLayout;
