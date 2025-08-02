interface deviceText {
  desktop: string;
  mobile: string;
}

interface FilterState {
  draft: boolean;
  pending: boolean;
  paid: boolean;
}

export interface IInvoiceBarProps {
  invoiceBarTitle: string;
  totalInvoicesText: deviceText;
  filterStatusBtn: deviceText;
  newInvoiceBtn: deviceText;
  newInvoiceHandler: () => void;
  filterStatusText: {
    draft: string;
    pending: string;
    paid: string;
  };
  filters: FilterState;
  setFilters: (updatedFilters: FilterState) => void;
}
