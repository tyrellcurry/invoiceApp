import type { StoryObj } from '@storybook/react';
import MainMenu from '@/app/components/UI/molecules/MainMenu/MainMenu';

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
    darkmode: 'dark',
    darkmodeToggle: () => {},
    profileImageAlt: 'lorem ipsum',
  },
  decorators: [
    (Story) => (
      <div className="relative">
        <Story />
      </div>
    ),
  ],
};
