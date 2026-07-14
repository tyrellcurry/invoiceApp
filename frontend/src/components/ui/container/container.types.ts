import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export interface IContainerProps extends ComponentPropsWithoutRef<'div'> {
  /** Element/component to render. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}
