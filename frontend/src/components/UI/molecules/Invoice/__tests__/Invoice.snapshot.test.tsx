import React from 'react';
import { render } from '@testing-library/react';
import DesktopView from '../DesktopView';
import { InvoiceStatus } from '../Invoice.interface';

describe('Invoice Component', () => {
  it('renders correctly with data passed to props', () => {
    const { container } = render(
      <DesktopView
        billingName={'Jensen Huang'}
        dueText={'Due'}
        invoiceAmountDue={1800.9}
        invoiceDueDate={'Jan 1st, 2025'}
        invoiceId={'RT3080'}
        invoiceStatus={InvoiceStatus.DRAFT}
        invoiceStatusText="Draft"
        localeAmountDue={'en'}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
