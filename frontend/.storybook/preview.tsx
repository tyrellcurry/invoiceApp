import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import '../src/styles/app.css';
import '@fontsource-variable/lexend';

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
      <MemoryRouter>
        <main className="font-sans">
          <Story />
        </main>
      </MemoryRouter>
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
