import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  // Used when no locale matches
  defaultLocale: 'en',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
