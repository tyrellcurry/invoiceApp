import { JSX } from 'react';
import { IInvoiceProps } from '@/app/components/UI/molecules/Invoice/Invoice.interface';
import MobileView from '@/app/components/UI/molecules/Invoice/MobileView';
import DesktopView from '@/app/components/UI/molecules/Invoice/DesktopView';

const Invoice = (props: IInvoiceProps): JSX.Element => {
  const { ...rest } = props;
  return (
    <div {...rest}>
      <MobileView {...props} />
      <DesktopView {...props} />
    </div>
  );
};

export default Invoice;
