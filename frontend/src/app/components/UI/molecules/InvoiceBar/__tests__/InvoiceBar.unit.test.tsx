import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InvoiceBar from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar';

describe('Text Component - Unit Tests', () => {
  const testId = 'text-test-id';

  const RenderInvoiceBar = () => {
    render(
      <InvoiceBar
        data-testid={testId}
        invoiceBarTitle="Invoice"
        newInvoiceBtnTextMobile="new-mob"
        newInvoiceBtnTextDesktop="new-desktop"
        totalInvoicesTextMobile="total-mob"
        totalInvoicesTextDesktop="total-desktop"
        filterStatusBtnTextMobile="filter-mob"
        filterStatusBtnTextDesktop="filter-desktop"
        newInvoiceHandler={() => {}}
        paidText="Paid"
        draftText="Draft"
        pendingText="Pending"
        filters={{
          draft: false,
          pending: false,
          paid: false,
        }}
        setFilters={(updatedFilters) => {
          console.log(updatedFilters);
        }}
      />
    );
  };

  it('renders as menu', () => {
    RenderInvoiceBar();
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('MENU');
    expect(element).toBeInTheDocument();
  });

  it('renders as all data passed as props excluding dropdown', () => {
    RenderInvoiceBar();
    expect(screen.getByText(/Invoice/i)).toBeInTheDocument();
    expect(screen.getByText(/new-mob/i)).toBeInTheDocument();
    expect(screen.getByText(/new-desktop/i)).toBeInTheDocument();
    expect(screen.getByText(/total-mob/i)).toBeInTheDocument();
    expect(screen.getByText(/filter-mob/i)).toBeInTheDocument();
    expect(screen.getByText(/filter-desktop/i)).toBeInTheDocument();
  });
  it('dropdown displays with data when clicked', () => {
    RenderInvoiceBar();
    // Assert dropdown is initially not present
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();

    // Click to open the dropdown
    fireEvent.click(screen.getByText(/filter-desktop/i));
    expect(screen.getByText(/draft/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/paid/i)).toBeInTheDocument();

    // Click to close the dropdown
    fireEvent.click(screen.getByText(/filter-desktop/i));
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();

    // Click to open the dropdown (mobile)
    fireEvent.click(screen.getByText(/filter-mob/i));
    expect(screen.getByText(/draft/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/paid/i)).toBeInTheDocument();

    // Click to close the dropdown (mobile)
    fireEvent.click(screen.getByText(/filter-mob/i));
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();

    // Click to open the dropdown
    fireEvent.click(screen.getByText(/filter-desktop/i));
    // Escape key to close the dropdown
    fireEvent.keyDown(screen.getByText(/filter-desktop/i), {
      key: 'Escape',
      code: 'Escape',
      charCode: 27,
    });
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();

    // Click to open the dropdown
    fireEvent.click(screen.getByText(/filter-desktop/i));
    // Click outside dropdown to close the dropdown
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/draft/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/paid/i)).not.toBeInTheDocument();
  });
});
