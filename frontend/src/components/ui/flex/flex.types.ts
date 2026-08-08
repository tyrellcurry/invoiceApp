import { ComponentPropsWithoutRef, ElementType, ReactNode, RefObject } from 'react';

export type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

/** Supported spacing steps for gap props (maps to Tailwind's spacing scale). */
export type Spacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 11 | 12;

export interface IFlexProps extends ComponentPropsWithoutRef<'div'> {
  /** Element/component to render. Defaults to `div`. */
  as?: ElementType;
  /** Renders `inline-flex` instead of `flex`. */
  inline?: boolean;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
  /** Gap on both axes. */
  gap?: Spacing;
  /** Horizontal (column) gap. */
  gapX?: Spacing;
  /** Vertical (row) gap. */
  gapY?: Spacing;
  className?: string;
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
}
