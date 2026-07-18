import { JSX } from 'react';
import { Outlet } from 'react-router';
import { IntlProvider } from 'use-intl';
import { AppProvider } from '@/app/provider';
import AppShell from '@/components/layouts/app-shell/app-shell';
import { getMessages } from '@/lib/i18n/messages';
import { defaultLocale } from '@/lib/i18n/routing';

const RootLayout = (): JSX.Element => (
  <IntlProvider locale={defaultLocale} messages={getMessages(defaultLocale)}>
    <AppProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </AppProvider>
  </IntlProvider>
);

export default RootLayout;
