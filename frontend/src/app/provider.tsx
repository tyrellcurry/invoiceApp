import { useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { makeStore } from '@/stores/store';

/**
 * Application-wide client providers. Composes the Redux store and the theme
 * provider so route layouts only need to render a single `<AppProvider>`.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Lazily create the store once per provider instance (per-request on the server).
  const [store] = useState(makeStore);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
