import React from 'react';
import type { Preview } from '@storybook/nextjs';
import '../src/styles/app.css';
import { withThemeByClassName } from '@storybook/addon-themes';

import { Lexend } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        Light: 'light storybook_light',
        Dark: 'dark storybook_dark',
      },
      defaultTheme: 'Light',
    }),
    (Story) => (
      <main className={`${lexend.variable} font-sans`}>
        <Story />
      </main>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
