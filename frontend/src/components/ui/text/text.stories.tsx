import type { StoryObj } from '@storybook/nextjs';

import Text from '@/components/ui/text/text';

const meta = {
  title: 'Atoms/Text',
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
