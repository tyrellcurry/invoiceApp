import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { FlexAlign, Spacing } from '@/components/ui/flex/flex.types';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export interface IGridProps extends ComponentPropsWithoutRef<'div'> {
  /** Element/component to render. Defaults to `div`. */
  as?: ElementType;
  /** Number of equal-width columns. Use `className` for arbitrary templates. */
  cols?: GridCols;
  align?: FlexAlign;
  /** Gap on both axes. */
  gap?: Spacing;
  /** Horizontal (column) gap. */
  gapX?: Spacing;
  /** Vertical (row) gap. */
  gapY?: Spacing;
  className?: string;
  children?: ReactNode;
}
