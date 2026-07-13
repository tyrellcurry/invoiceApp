import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { type Locale, routing } from '@/lib/i18n/routing';
import type { Metadata } from 'next';
import React from 'react';
import '@/styles/app.css';
import { AppProvider } from '@/app/provider';
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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html className={`${leagueSpartan.variable} font-sans`} lang={locale} suppressHydrationWarning>
      <body className="bg-neutral-11 dark:bg-gray-12">
        <NextIntlClientProvider messages={messages}>
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
