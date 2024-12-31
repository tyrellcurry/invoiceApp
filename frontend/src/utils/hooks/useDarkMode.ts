'use client';
import { useTheme } from 'next-themes';

export const useDarkMode = () => {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = (isDarkMode: boolean) => {
    setTheme(isDarkMode ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleDarkMode, toggleTheme };
};
