import type { StoryObj } from '@storybook/react-vite';

import Checkbox from '@/components/ui/checkbox/checkbox';

const meta = {
  title: 'UI/Checkbox',
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
