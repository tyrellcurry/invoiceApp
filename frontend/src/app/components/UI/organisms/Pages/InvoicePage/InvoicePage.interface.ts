import { IInvoiceProps } from '@/app/components/UI/molecules/Invoice/Invoice.interface';
import { IFilterDropdownProps } from '@/app/components/UI/molecules/InvoiceBar/FilterDropdown';
import { IInvoiceBarProps } from '@/app/components/UI/molecules/InvoiceBar/InvoiceBar.interface';

export interface IInvoicePageProps {
  localization: {
    invoiceBarTitle: IInvoiceBarProps['invoiceBarTitle'];
    filterStatusBtnTextDesktop: IInvoiceBarProps['filterStatusBtnTextDesktop'];
    filterStatusBtnTextMobile: IInvoiceBarProps['filterStatusBtnTextMobile'];
    totalInvoicesTextDesktop: IInvoiceBarProps['totalInvoicesTextDesktop'];
    totalInvoicesTextMobile: IInvoiceBarProps['totalInvoicesTextMobile'];
    newInvoiceBtnTextDesktop: IInvoiceBarProps['newInvoiceBtnTextDesktop'];
    newInvoiceBtnTextMobile: IInvoiceBarProps['newInvoiceBtnTextMobile'];
    draftText: IInvoiceBarProps['draftText'];
    pendingText: IInvoiceBarProps['pendingText'];
    paidText: IInvoiceBarProps['paidText'];
  };
  filters: IFilterDropdownProps['filters'];
  setFilters: IFilterDropdownProps['setFilters'];
  newInvoiceHandler: IInvoiceBarProps['newInvoiceHandler'];
  invoices: IInvoiceProps[];
}
