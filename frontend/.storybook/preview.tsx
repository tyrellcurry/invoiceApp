import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/app/app.css';
import 'tailwindcss/tailwind.css';

import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-leaguespartan',
});

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'moon',
      items: ['light mode', 'dark mode'],
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      return (
        <main
          className={`${leagueSpartan.variable} ${theme === 'dark' ? 'dark' : 'light'} font-sans`}
        >
          <Story />
        </main>
      );
    },
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
