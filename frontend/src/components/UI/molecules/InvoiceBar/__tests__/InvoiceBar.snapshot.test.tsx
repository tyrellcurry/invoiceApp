import React from 'react';
import { render } from '@testing-library/react';
import InvoiceBar from '@/components/UI/molecules/InvoiceBar/InvoiceBar';

describe('Invoice Bar Component', () => {
  it('renders correctly with filled props', () => {
    const { container } = render(
      <InvoiceBar
        paidText="paid"
        draftText="draft"
        pendingText="pending"
        invoiceBarTitle="Invoice"
        newInvoiceBtnTextMobile="new-mob"
        newInvoiceBtnTextDesktop="new-desktop"
        totalInvoicesTextMobile="total-mob"
        totalInvoicesTextDesktop="total-desktop"
        filterStatusBtnTextMobile="filter-mob"
        filterStatusBtnTextDesktop="filter-desktop"
        newInvoiceHandler={() => {}}
        filters={{
          draft: false,
          pending: false,
          paid: false,
        }}
        setFilters={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
