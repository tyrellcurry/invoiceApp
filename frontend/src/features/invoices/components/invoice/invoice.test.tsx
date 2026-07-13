import React from 'react';
import { render, screen } from '@testing-library/react';
import Invoice from '@/features/invoices/components/invoice/invoice';
import { InvoiceStatus } from '../../types/invoice';

describe('Invoice Component - Unit Tests', () => {
  const testId = 'text-test-id';

  it('renders correctly with data passed to props', () => {
    render(
      <Invoice
        billingName={'Jensen Huang'}
        data-testid={testId}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.DRAFT}
        invoiceStatusText="Draft"
        localeAmountDue={'en'}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  it('renders correct visual data from props passed', () => {
    render(
      <Invoice
        billingName={'Jensen Huang'}
        data-testid={testId}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.DRAFT}
        invoiceStatusText="Draft"
        localeAmountDue={'en'}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/#RT3080/);
    expect(element).toHaveTextContent(/DueJan 1st, 2025/);
    expect(element).toHaveTextContent(/Jensen Huang/);
    expect(element).toHaveTextContent(/\$1,800\.90/);
    expect(element).toHaveTextContent(/Draft/);
  });

  it('renders correct currency symbol and format for fr locale', () => {
    render(
      <Invoice
        billingName={'Jensen Huang'}
        data-testid={testId}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.DRAFT}
        invoiceStatusText="Draft"
        localeAmountDue={'fr'}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/\€1 800\,90/);
  });

  it('renders correct status text for pending', () => {
    render(
      <Invoice
        billingName={'Jensen Huang'}
        data-testid={testId}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.PENDING}
        invoiceStatusText="Pending"
        localeAmountDue={'fr'}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/Pending/);
  });

  it('renders correct status text for paid', () => {
    render(
      <Invoice
        billingName={'Jensen Huang'}
        data-testid={testId}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.PAID}
        invoiceStatusText="Paid"
        localeAmountDue={'fr'}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/Paid/);
  });
});
