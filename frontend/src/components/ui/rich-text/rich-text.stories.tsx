import type { StoryObj } from '@storybook/nextjs';

import RichText from '@/components/ui/rich-text/rich-text';

const meta = {
  title: 'UI/Rich Text',
  component: RichText,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: (
      <p>
        Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ),
  },
};
