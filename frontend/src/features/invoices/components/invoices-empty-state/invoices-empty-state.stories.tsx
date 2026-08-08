import type { Meta, StoryObj } from '@storybook/react-vite';

import InvoicesEmptyState from '@/features/invoices/components/invoices-empty-state/invoices-empty-state';

const meta = {
  title: 'Features/Invoices/Invoices Empty State',
  component: InvoicesEmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InvoicesEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'There is nothing here',
    description: (
      <>
        Create an invoice by clicking the <span className="font-bold">New Invoice</span> button and
        get started
      </>
    ),
  },
};
