import React from 'react';
import { render } from '@testing-library/react';
import Invoice from '@/app/components/UI/molecules/Invoice/Invoice';

describe('Invoice Component', () => {
  it('renders correctly with data passed to props', () => {
    const { container } = render(
      <Invoice
        invoiceId={'RT3080'}
        invoiceStatus="draft"
        dueText={'Due'}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceStatusText="Draft"
        billingName={'Jensen Huang'}
        invoiceAmountDue={1800.9}
        localeAmountDue={'en'}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
