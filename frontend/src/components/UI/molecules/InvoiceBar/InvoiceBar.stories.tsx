import type { StoryObj } from '@storybook/nextjs';

import InvoiceBar from '@/components/UI/molecules/InvoiceBar/InvoiceBar';

const meta = {
  title: 'Molecules/Invoice Bar',
  component: InvoiceBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filterStatusBtn: {
      mobile: 'Filter',
      desktop: 'Filter by status',
    },
    invoiceBarTitle: 'Invoices',
    newInvoiceBtn: {
      mobile: 'New',
      desktop: 'New Invoice',
    },
    totalInvoicesText: {
      mobile: '7 invoices',
      desktop: 'There are 7 total invoices',
    },
    filterStatusText: {
      paid: 'Paid',
      draft: 'Draft',
      pending: 'Pending',
    },
    newInvoiceHandler: () => {},
    filters: {
      draft: false,
      pending: false,
      paid: false,
    },
    setFilters: () => {},
  },
};
