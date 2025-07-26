import React from 'react';
import { render } from '@testing-library/react';
import InvoiceBar from '@/components/UI/molecules/InvoiceBar/InvoiceBar';

describe('Invoice Bar Component', () => {
  it('renders correctly with filled props', () => {
    const { container } = render(
      <InvoiceBar
        draftText="draft"
        filterStatusBtnTextDesktop="filter-desktop"
        filterStatusBtnTextMobile="filter-mob"
        invoiceBarTitle="Invoice"
        newInvoiceBtnTextDesktop="new-desktop"
        newInvoiceBtnTextMobile="new-mob"
        newInvoiceHandler={() => {}}
        paidText="paid"
        pendingText="pending"
        setFilters={() => {}}
        totalInvoicesTextDesktop="total-desktop"
        totalInvoicesTextMobile="total-mob"
        filters={{
          draft: false,
          pending: false,
          paid: false,
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
