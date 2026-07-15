export interface DeleteInvoiceDialogLabels {
  title: string;
  /** Full confirmation message, with the invoice id already interpolated. */
  message: string;
  cancel: string;
  delete: string;
}

export interface IDeleteInvoiceDialogProps {
  open: boolean;
  labels: DeleteInvoiceDialogLabels;
  onCancel: () => void;
  onConfirm: () => void;
}
