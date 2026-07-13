import React from 'react';
import { render } from '@testing-library/react';
import InvoiceBar from '@/features/invoices/components/invoice-bar/invoice-bar';

describe('Invoice Bar Component', () => {
  it('renders correctly with filled props', () => {
    const { container } = render(
      <InvoiceBar
        data-testid={'snapshot'}
        invoiceBarTitle="Invoice"
        newInvoiceHandler={() => {}}
        filters={{
          draft: false,
          pending: false,
          paid: false,
        }}
        filterStatusBtn={{
          desktop: 'filter-desktop',
          mobile: 'filter-mob',
        }}
        filterStatusText={{
          draft: 'Draft',
          paid: 'Paid',
          pending: 'Pending',
        }}
        newInvoiceBtn={{
          desktop: 'new-desktop',
          mobile: 'new-mob',
        }}
        setFilters={(updatedFilters) => {
          console.log(updatedFilters);
        }}
        totalInvoicesText={{
          desktop: 'total-desktop',
          mobile: 'total-mob',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
