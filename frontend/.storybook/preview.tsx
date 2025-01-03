import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/app/app.css';
import 'tailwindcss/tailwind.css';
import { withThemeByClassName } from '@storybook/addon-themes';

import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-leaguespartan',
});

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        Light: 'light',
        Dark: 'dark bg-gray-09',
      },
      defaultTheme: 'Light',
    }),
    (Story) => (
      <main className={`${leagueSpartan.variable} font-sans`}>
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
