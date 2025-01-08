import { JSX, useEffect, useState } from 'react';
import { IInvoicePageProps } from '@/app/components/UI/organisms/Pages/InvoicePage/InvoicePage.interface';
import InvoiceBar from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar';
import Invoice from '@/app/components/UI/molecules/Invoice/Invoice';
import FilterDropDown from '@/app/components/UI/molecules/InvoiceBar/FilterDropdown';
import useVisibilityToggle from '@/utils/hooks/useVisibilityToggle';

const InvoicePage = (props: IInvoicePageProps): JSX.Element => {
  const { localization, initialInvoices } = props;
  const { isVisible, setIsVisible, elementRef } = useVisibilityToggle<HTMLDivElement>();
  /* eslint-disable */
  const [invoices, setInvoices] = useState(initialInvoices);
  /* eslint-disable */
  const [filters, setFilters] = useState({
    draft: false,
    pending: false,
    paid: false,
  });
  useEffect(() => {
    console.log('filters', filters);
  }, [filters]);

  const newInvoiceHandler = () => {
    console.log('clicked');
  };

  return (
    <div>
      <InvoiceBar
        invoiceBarTitle={localization.invoiceBarTitle}
        filterStatusBtnTextDesktop={localization.filterStatusBtnTextDesktop}
        filterStatusBtnTextMobile={localization.filterStatusBtnTextMobile}
        totalInvoicesTextDesktop={localization.totalInvoicesTextDesktop}
        totalInvoicesTextMobile={localization.totalInvoicesTextMobile}
        newInvoiceBtnTextDesktop={localization.newInvoiceBtnTextDesktop}
        newInvoiceBtnTextMobile={localization.newInvoiceBtnTextMobile}
        {...{ isVisible, setIsVisible, newInvoiceHandler }}
      >
        <FilterDropDown
          draftText={localization.draftText}
          pendingText={localization.pendingText}
          paidText={localization.paidText}
          {...{ setFilters, filters, elementRef }}
        />
      </InvoiceBar>
      <div className="pt-8 flex flex-col gap-y-4 md:pt-[55px] lg:pt-16">
        {!!invoices &&
          invoices.map((data) => {
            const { invoiceId } = data;
            return <Invoice key={invoiceId} {...data} />;
          })}
      </div>
    </div>
  );
};

export default InvoicePage;
