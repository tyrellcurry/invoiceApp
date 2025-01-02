import type { StoryObj } from '@storybook/react';

import InvoiceBar from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar';

const meta = {
  title: 'Molecules/Invoice Bar',
  component: InvoiceBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filterStatusBtnTextMobile: 'Filter',
    filterStatusBtnTextDesktop: 'Filter by status',
    invoiceBarTitle: 'Invoices',
    newInvoiceBtnTextMobile: 'New',
    newInvoiceBtnTextDesktop: 'New Invoice',
    totalInvoicesTextMobile: '7 invoices',
    totalInvoicesTextDesktop: 'There are 7 total invoices',
    paidText: 'Paid',
    draftText: 'Draft',
    pendingText: 'Pending',
  },
};
