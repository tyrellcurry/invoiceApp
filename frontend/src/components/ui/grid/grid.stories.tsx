import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactNode } from 'react';

import Grid from '@/components/ui/grid/grid';

const Box = ({ children }: { children: ReactNode }) => (
  <div className="bg-blue-01 text-white rounded-md px-4 py-3 text-center">{children}</div>
);

const items = Array.from({ length: 6 }, (_, i) => <Box key={i}>{i + 1}</Box>);

const spacingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 11, 12];

const meta = {
  title: 'Utils/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { children: items },
  parameters: {
    docs: {
      description: {
        component:
          'CSS grid layout primitive. Exposes column count, gap and alignment as props and renders a `div` by default (or any element via `as`). Arbitrary column templates and responsive variants are passed through `className`.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'text',
      description: 'Element or component to render.',
      table: { type: { summary: 'ElementType' }, defaultValue: { summary: 'div' } },
    },
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 12],
      description: 'Number of equal-width columns. Use `className` for arbitrary templates.',
      table: { type: { summary: 'GridCols' } },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Block-axis alignment of items (`align-items`).',
      table: { type: { summary: 'FlexAlign' } },
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
      description: 'Additional classes, including arbitrary templates and responsive variants.',
      table: { type: { summary: 'string' } },
    },
    children: {
      control: false,
      description: 'Content rendered inside the grid container.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
  args: { cols: 2, gap: 4 },
};

export const ThreeColumns: Story = {
  args: { cols: 3, gap: 4 },
};

export const SeparateAxisGaps: Story = {
  args: { cols: 3, gapX: 2, gapY: 8 },
};
