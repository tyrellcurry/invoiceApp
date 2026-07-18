import type { Meta, StoryObj } from '@storybook/react-vite';

import Flex from '@/components/ui/flex/flex';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-01 text-white rounded-md px-4 py-3 text-center">{children}</div>
);

const items = [<Box key="1">1</Box>, <Box key="2">2</Box>, <Box key="3">3</Box>];

const spacingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 11, 12];

const meta = {
  title: 'Utils/Flex',
  component: Flex,
  tags: ['autodocs'],
  args: { children: items },
  parameters: {
    docs: {
      description: {
        component:
          'Flexbox layout primitive. Exposes the common flex controls as props and renders a `div` by default (or any element via `as`). Responsive/breakpoint variants are passed through `className`.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'Element or component to render.',
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: 'div' } },
    },
    inline: {
      control: 'boolean',
      description: 'Render `inline-flex` instead of `flex`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    direction: {
      control: 'select',
      options: ['row', 'col', 'row-reverse', 'col-reverse'],
      description: 'Main axis direction (`flex-direction`).',
      table: { type: { summary: 'FlexDirection' }, defaultValue: { summary: 'row' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Cross-axis alignment (`align-items`).',
      table: { type: { summary: 'FlexAlign' } },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis distribution (`justify-content`).',
      table: { type: { summary: 'FlexJustify' } },
    },
    wrap: {
      control: 'select',
      options: ['wrap', 'nowrap', 'wrap-reverse'],
      description: 'Wrapping behaviour (`flex-wrap`).',
      table: { type: { summary: 'FlexWrap' } },
    },
    gap: {
      control: 'select',
      options: spacingOptions,
      description: 'Gap on both axes (Tailwind spacing scale).',
      table: { type: { summary: 'Spacing' } },
    },
    gapX: {
      control: 'select',
      options: spacingOptions,
      description: 'Horizontal (column) gap.',
      table: { type: { summary: 'Spacing' } },
    },
    gapY: {
      control: 'select',
      options: spacingOptions,
      description: 'Vertical (row) gap.',
      table: { type: { summary: 'Spacing' } },
    },
    className: {
      control: 'text',
      description: 'Additional classes, including responsive/breakpoint variants.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description: 'Content rendered inside the flex container.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: { gap: 4 },
};

export const Column: Story = {
  args: { direction: 'col', gap: 4 },
};

export const SpaceBetween: Story = {
  args: { justify: 'between', className: 'w-full' },
};

export const Centered: Story = {
  args: { align: 'center', justify: 'center', gap: 4, className: 'h-40 bg-gray-05b rounded-lg' },
};

export const Wrap: Story = {
  args: {
    gap: 2,
    wrap: 'wrap',
    className: 'w-40',
    children: Array.from({ length: 8 }, (_, i) => <Box key={i}>{i + 1}</Box>),
  },
};
