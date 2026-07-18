import type { StoryObj } from '@storybook/react-vite';

import Text from '@/components/ui/text/text';

const meta = {
  title: 'UI/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'h1',
    children: 'Hello, World!',
  },
};
