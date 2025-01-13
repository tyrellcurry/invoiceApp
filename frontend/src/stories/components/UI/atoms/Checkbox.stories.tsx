import type { StoryObj } from '@storybook/react';

import Checkbox from '@/app/components/UI/atoms/Input/Checkbox/Checkbox';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelId: 'a123',
    label: 'Lorem ipsum',
  },
};
