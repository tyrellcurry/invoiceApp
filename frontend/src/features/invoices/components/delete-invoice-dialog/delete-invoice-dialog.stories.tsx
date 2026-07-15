import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import DeleteInvoiceDialog from '@/features/invoices/components/delete-invoice-dialog/delete-invoice-dialog';

const meta = {
  title: 'Features/Invoices/Delete Invoice Dialog',
  component: DeleteInvoiceDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    labels: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete invoice #XM9141? This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    onCancel: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof DeleteInvoiceDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
