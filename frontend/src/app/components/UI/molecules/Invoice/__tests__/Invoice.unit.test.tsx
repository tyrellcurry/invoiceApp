import React from 'react';
import { render, screen } from '@testing-library/react';
import Invoice from '@/app/components/UI/molecules/Invoice/Invoice';

describe('Invoice Component - Unit Tests', () => {
  const testId = 'text-test-id';
  const RenderInvoice = () =>
    render(
      <Invoice
        invoiceId={'RT3080'}
        invoiceStatus="draft"
        dueText={'Due'}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceStatusText="Draft"
        billingName={'Jensen Huang'}
        invoiceAmountDue={1800.9}
        localeAmountDue={'en'}
        data-testid={testId}
      />
    );

  it('renders correctly with data passed to props', () => {
    RenderInvoice();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  it('renders correct visual data from props passed', () => {
    RenderInvoice();
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
        invoiceId={'RT3080'}
        invoiceStatus="draft"
        dueText={'Due'}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceStatusText="Draft"
        billingName={'Jensen Huang'}
        invoiceAmountDue={1800.9}
        localeAmountDue={'fr'}
        data-testid={testId}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/\€1 800\,90/);
  });

  it('renders correct status text for pending', () => {
    render(
      <Invoice
        invoiceId={'RT3080'}
        invoiceStatus="pending"
        dueText={'Due'}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceStatusText="Pending"
        billingName={'Jensen Huang'}
        invoiceAmountDue={1800.9}
        localeAmountDue={'fr'}
        data-testid={testId}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/Pending/);
  });

  it('renders correct status text for paid', () => {
    render(
      <Invoice
        invoiceId={'RT3080'}
        invoiceStatus="paid"
        dueText={'Due'}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceStatusText="Paid"
        billingName={'Jensen Huang'}
        invoiceAmountDue={1800.9}
        localeAmountDue={'fr'}
        data-testid={testId}
      />
    );
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(/Paid/);
  });
});
