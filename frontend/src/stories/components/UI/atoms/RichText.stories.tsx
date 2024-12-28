import type { StoryObj } from '@storybook/react';

import RichText from '@/app/components/UI/atoms/RichText/RichText';

const meta = {
  title: 'Atoms/Rich Text',
  component: RichText,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: (
      <p>
        Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ),
  },
};
