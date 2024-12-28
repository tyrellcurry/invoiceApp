import type { Metadata } from 'next';
import './globals.css';

import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-leaguespartan',
});

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Created with NextJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
