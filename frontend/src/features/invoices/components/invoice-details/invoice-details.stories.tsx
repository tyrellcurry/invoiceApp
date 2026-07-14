import type { Meta, StoryObj } from '@storybook/nextjs';

import InvoiceDetails from '@/features/invoices/components/invoice-details/invoice-details';
import { InvoiceStatus } from '@/features/invoices/types/invoice';

const meta = {
  title: 'Features/Invoices/Invoice Details',
  component: InvoiceDetails,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[730px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InvoiceDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  goBack: 'Go back',
  status: 'Status',
  statusText: 'Pending',
  edit: 'Edit',
  delete: 'Delete',
  markAsPaid: 'Mark as Paid',
  billTo: 'Bill To',
  sentTo: 'Sent to',
  invoiceDate: 'Invoice Date',
  paymentDue: 'Payment Due',
  itemName: 'Item Name',
  quantity: 'QTY.',
  price: 'Price',
  total: 'Total',
  amountDue: 'Amount Due',
};

const baseArgs = {
  invoiceId: 'XM9141',
  description: 'Graphic Design',
  invoiceStatus: InvoiceStatus.PENDING,
  invoiceDate: '21 Aug 2021',
  paymentDue: '20 Sep 2021',
  senderAddress: {
    street: '19 Union Terrace',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientName: 'Alex Grim',
  clientEmail: 'alexgrim@mail.com',
  clientAddress: {
    street: '84 Church Way',
    city: 'Bradford',
    postCode: 'BD1 9PB',
    country: 'United Kingdom',
  },
  items: [
    { name: 'Banner Design', quantity: 1, price: 156 },
    { name: 'Email Design', quantity: 2, price: 200 },
  ],
  invoiceAmountDue: 556,
  localeAmountDue: 'en' as const,
  labels,
};

export const Pending: Story = {
  args: baseArgs,
};

export const Paid: Story = {
  args: {
    ...baseArgs,
    invoiceStatus: InvoiceStatus.PAID,
    labels: { ...labels, statusText: 'Paid' },
  },
};

export const Draft: Story = {
  args: {
    ...baseArgs,
    invoiceStatus: InvoiceStatus.DRAFT,
    labels: { ...labels, statusText: 'Draft' },
  },
};
