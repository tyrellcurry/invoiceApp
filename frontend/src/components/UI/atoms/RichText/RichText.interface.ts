import { ComponentPropsWithoutRef } from 'react';

export interface IRichTextProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  value: React.ReactNode;
}
