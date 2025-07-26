import React from 'react';
import { render } from '@testing-library/react';
import Invoice from '@/components/UI/molecules/Invoice/Invoice';

describe('Invoice Component', () => {
  it('renders correctly with data passed to props', () => {
    const { container } = render(
      <Invoice
        billingName={'Jensen Huang'}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus="draft"
        invoiceStatusText="Draft"
        localeAmountDue={'en'}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
