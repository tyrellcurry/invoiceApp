import type { StoryObj } from '@storybook/react';

import Text from '@/app/components/UI/atoms/Text/Text';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'h1',
    children: 'Hello, World!',
  },
};
