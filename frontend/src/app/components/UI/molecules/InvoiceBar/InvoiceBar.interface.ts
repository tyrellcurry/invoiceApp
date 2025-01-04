import { IFilterDropdownProps } from '@/app/components/UI/molecules/InvoiceBar/FilterDropdown';

export interface IInvoiceBarProps {
  invoiceBarTitle: string;
  totalInvoicesTextDesktop: string;
  totalInvoicesTextMobile: string;
  filterStatusBtnTextDesktop: string;
  filterStatusBtnTextMobile: string;
  newInvoiceBtnTextDesktop: string;
  newInvoiceBtnTextMobile: string;
  draftText: string;
  pendingText: string;
  paidText: string;
  filters: IFilterDropdownProps['filters'];
  setFilters: IFilterDropdownProps['setFilters'];
  newInvoiceHandler: () => void;
}
