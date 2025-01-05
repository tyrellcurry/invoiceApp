import { JSX } from 'react';
import { IInvoicePageProps } from '@/app/components/UI/organisms/Pages/InvoicePage/InvoicePage.interface';
import InvoiceBar from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar';
import Invoice from '@/app/components/UI/molecules/Invoice/Invoice';

const InvoicePage = (props: IInvoicePageProps): JSX.Element => {
  const { localization, filters, setFilters, newInvoiceHandler, invoices } = props;
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
        draftText={localization.draftText}
        pendingText={localization.pendingText}
        paidText={localization.paidText}
        {...{ filters, setFilters, newInvoiceHandler }}
      />
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
