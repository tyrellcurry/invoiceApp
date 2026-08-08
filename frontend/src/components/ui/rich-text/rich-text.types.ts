import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface IRichTextProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  value: ReactNode;
}
