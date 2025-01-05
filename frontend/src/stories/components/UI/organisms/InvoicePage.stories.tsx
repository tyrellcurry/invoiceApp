import type { StoryObj } from '@storybook/react';
import InvoicePage from '@/app/components/UI/organisms/Pages/InvoicePage/InvoicePage';

const meta = {
  title: 'Organisms/Invoice Page',
  component: InvoicePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    newInvoiceHandler: () => {},
    filters: {
      draft: false,
      pending: false,
      paid: false,
    },
    setFilters: (updatedFilters) => {
      console.log(updatedFilters);
    },
    localization: {
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
    invoices: [
      {
        invoiceId: 'RT3080',
        billingName: 'Jensen Huang',
        invoiceDueDate: '19 Aug 2021',
        invoiceAmountDue: 1800.9,
        invoiceStatus: 'draft',
        dueText: 'Due',
        invoiceStatusText: 'Draft',
      },
      {
        invoiceId: 'XM9141',
        billingName: 'Alex Grim',
        invoiceDueDate: '20 Sept 2021',
        invoiceAmountDue: 556,
        invoiceStatus: 'pending',
        dueText: 'Due',
        invoiceStatusText: 'Pending',
      },
      {
        invoiceId: 'RG0314',
        billingName: 'John Morrison',
        invoiceDueDate: '12 Oct 2021',
        invoiceAmountDue: 14002.33,
        invoiceStatus: 'paid',
        dueText: 'Due',
        invoiceStatusText: 'Paid',
      },
    ],
  },
};
