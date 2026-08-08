import { ReactNode } from 'react';

export interface IInvoicesEmptyStateProps {
  title: string;
  /** Supporting copy; a ReactNode so the caller can emphasise part of it. */
  description: ReactNode;
}
