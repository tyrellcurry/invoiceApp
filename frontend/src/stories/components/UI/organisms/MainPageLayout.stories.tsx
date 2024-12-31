import type { StoryObj } from '@storybook/react';
import MainPageLayout from '@/app/components/UI/organisms/PageLayout/MainPageLayout';

const meta = {
  title: 'Organisms/Main Page Layout',
  component: MainPageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="text-black text-xl font-bold">Hello world</div>,
    profileImageAlt: 'lorem',
  },
  decorators: [
    (Story) => (
      <div className="relative">
        <Story />
      </div>
    ),
  ],
};
