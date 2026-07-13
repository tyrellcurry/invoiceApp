'use client';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

export const useDarkMode = () => {
  const { resolvedTheme, setTheme } = useTheme();

  // Hydration-safe mount flag: `false` on the server and during the initial
  // client render, `true` afterwards. This keeps the first client render
  // identical to the server render (avoiding a hydration mismatch on
  // theme-dependent UI) without calling setState inside an effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const theme = mounted ? resolvedTheme : undefined;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleDarkMode = (isDarkMode: boolean) => {
    setTheme(isDarkMode ? 'dark' : 'light');
  };

  return { theme, toggleTheme, toggleDarkMode };
};
