import type { StoryObj } from '@storybook/nextjs';
import MainMenu from '@/components/layouts/main-menu/main-menu';
import { DARK_MODE } from '@/config/constants';

const meta = {
  title: 'Molecules/Main Menu',
  component: MainMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    darkmode: DARK_MODE,
    darkmodeToggle: () => {},
    profile: {
      profileImageAlt: 'lorem ipsum',
    },
  },
  decorators: [
    (Story) => (
      <div className="relative" style={{ position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};
