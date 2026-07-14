import type { Meta, StoryObj } from '@storybook/nextjs';

import Container from '@/components/ui/container/container';

const meta = {
  title: 'Utils/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Generic block-level layout wrapper. Renders a `div` by default and accepts an `as` prop to render any semantic element. All styling is supplied through `className`.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'Element or component to render.',
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: 'div' } },
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind/utility classes applied to the element.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description: 'Content rendered inside the container.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'p-6 bg-gray-05b rounded-lg',
    children: 'Container content',
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    className: 'p-6 bg-gray-05b rounded-lg',
    children: 'Rendered as a <section> element',
  },
};
