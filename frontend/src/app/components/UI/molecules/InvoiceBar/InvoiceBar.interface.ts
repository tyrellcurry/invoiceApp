export interface IInvoiceBarProps {
  invoiceBarTitle: string;
  totalInvoicesTextDesktop: string;
  totalInvoicesTextMobile: string;
  filterStatusBtnTextDesktop: string;
  filterStatusBtnTextMobile: string;
  newInvoiceBtnTextDesktop: string;
  newInvoiceBtnTextMobile: string;
  newInvoiceHandler: () => void;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}
