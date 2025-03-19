export interface IInvoiceBarProps {
  invoiceBarTitle: string;
  totalInvoicesTextDesktop: string;
  totalInvoicesTextMobile: string;
  filterStatusBtnTextDesktop: string;
  filterStatusBtnTextMobile: string;
  newInvoiceBtnTextDesktop: string;
  newInvoiceBtnTextMobile: string;
  newInvoiceHandler: () => void;
  draftText: string;
  pendingText: string;
  paidText: string;
  filters: FilterState;
  setFilters: (updatedFilters: FilterState) => void;
}

interface FilterState {
  draft: boolean;
  pending: boolean;
  paid: boolean;
}
