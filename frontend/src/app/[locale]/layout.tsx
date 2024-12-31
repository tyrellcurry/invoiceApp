import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import React from 'react';
import '@/app/app.css';
import { Provider as ThemeProvider } from '@/app/ThemeProvider';
import { League_Spartan } from 'next/font/google';

export const dynamic = 'force-dynamic';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-leaguespartan',
});

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Created with NextJS',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${leagueSpartan.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-neutral-11 dark:bg-gray-12">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
