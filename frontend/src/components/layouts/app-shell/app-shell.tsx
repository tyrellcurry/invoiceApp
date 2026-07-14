/**
 * @name AppShell
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * App shell shared by every page: the persistent MainMenu sidebar (wired to
 * dark mode + menu translations) and a padded `main` region for page content.
 * Pages provide their own max-width container inside `children`.
 *
 * @param children
 *
 * @returns {JSX.Element}
 */
'use client';

import { JSX, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import MainMenu from '@/components/layouts/main-menu/main-menu';
import Container from '@/components/ui/container/container';
import { useDarkMode } from '@/hooks/use-dark-mode';

const AppShell = ({ children }: { children: ReactNode }): JSX.Element => {
  const tMenu = useTranslations('MainMenu');
  const { theme, toggleTheme } = useDarkMode();

  return (
    <Container className="min-h-screen lg:pl-25">
      <MainMenu
        darkmode={theme}
        darkmodeBtn={{ darkAria: tMenu('switchToDark'), lightAria: tMenu('switchToLight') }}
        darkmodeToggle={toggleTheme}
        profile={{ profileImageAlt: tMenu('profileImageAlt') }}
      />
      <main className="px-6 py-8 md:py-12 lg:py-16">{children}</main>
    </Container>
  );
};

export default AppShell;
