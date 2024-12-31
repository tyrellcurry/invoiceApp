import type { StoryObj } from '@storybook/react';
import MainMenu from '@/app/components/UI/molecules/MainMenu/MainMenu';

const meta = {
  title: 'Molecules/MainMenu',
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
    darkmode: false,
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
