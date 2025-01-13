import type { StoryObj } from '@storybook/react';

import Invoice from '@/app/components/UI/molecules/Invoice/Invoice';

const meta = {
  title: 'Molecules/Invoice',
  component: Invoice,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    invoiceId: 'RT3080',
    billingName: 'Jensen Huang',
    invoiceDueDate: '19 Aug 2021',
    invoiceAmountDue: 1800.9,
    invoiceStatus: 'draft',
    dueText: 'Due',
    invoiceStatusText: 'Draft',
  },
};
