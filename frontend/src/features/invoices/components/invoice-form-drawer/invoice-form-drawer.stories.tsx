import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import InvoiceFormDrawer from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer';
import type {
  InvoiceFormLabels,
  InvoiceFormValues,
  PaymentTermOption,
} from '@/features/invoices/components/invoice-form-drawer/invoice-form-drawer.types';
import { InvoiceStatus } from '@/features/invoices/types/invoice';
import { emptyInvoiceFormValues } from '@/features/invoices/utils/invoice-form-values';

const labels: InvoiceFormLabels = {
  editTitle: 'Edit',
  createTitle: 'New Invoice',
  status: 'Status',
  statusDraft: 'Draft',
  statusPending: 'Pending',
  statusPaid: 'Paid',
  billFrom: 'Bill From',
  billTo: 'Bill To',
  streetAddress: 'Street Address',
  city: 'City',
  postCode: 'Post Code',
  country: 'Country',
  clientName: "Client's Name",
  clientEmail: "Client's Email",
  invoiceDate: 'Invoice Date',
  paymentTerms: 'Payment Terms',
  projectDescription: 'Project Description',
  itemList: 'Item List',
  itemName: 'Item Name',
  quantity: 'Qty.',
  price: 'Price',
  total: 'Total',
  addNewItem: '+ Add New Item',
  removeItem: 'Remove item',
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  discard: 'Discard',
  saveAsDraft: 'Save as Draft',
  saveAndSend: 'Save & Send',
};

const paymentTermOptions: PaymentTermOption[] = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
];

const editValues: InvoiceFormValues = {
  status: InvoiceStatus.PENDING,
  senderStreet: '19 Union Terrace',
  senderCity: 'London',
  senderPostCode: 'E1 3EZ',
  senderCountry: 'United Kingdom',
  clientName: 'Alex Grim',
  clientEmail: 'alexgrim@mail.com',
  clientStreet: '84 Church Way',
  clientCity: 'Bradford',
  clientPostCode: 'BD1 9PB',
  clientCountry: 'United Kingdom',
  invoiceDate: '2021-08-21',
  paymentTerms: 30,
  description: 'Graphic Design',
  items: [
    { name: 'Banner Design', quantity: 1, price: 156 },
    { name: 'Email Design', quantity: 2, price: 200 },
  ],
};

const meta = {
  title: 'Features/Invoices/Invoice Form Drawer',
  component: InvoiceFormDrawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    labels,
    paymentTermOptions,
    onClose: fn(),
    onSubmit: fn(),
    onSaveDraft: fn(),
  },
} satisfies Meta<typeof InvoiceFormDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  args: {
    mode: 'edit',
    invoiceId: 'XM9141',
    initialValues: editValues,
  },
};

export const NewInvoice: Story = {
  args: {
    mode: 'create',
    initialValues: emptyInvoiceFormValues(),
  },
};
