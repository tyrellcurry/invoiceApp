/**
 * @name Grid
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * CSS grid layout primitive. Exposes column count, gap and alignment as props
 * and renders a `div` by default, or any element via `as`. Arbitrary column
 * templates and responsive variants are passed through `className`.
 *
 * @param as - element/component to render (default: 'div')
 * @param cols - number of equal-width columns
 * @param align
 * @param gap - gap on both axes
 * @param gapX - horizontal gap
 * @param gapY - vertical gap
 * @param className
 * @param children
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import classNames from 'classnames';
import { FlexAlign, Spacing } from '@/components/ui/flex/flex.types';
import { GridCols, IGridProps } from '@/components/ui/grid/grid.types';

const colsClasses: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const alignClasses: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const gapClasses: Record<Spacing, string> = {
  0: 'gap-0',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  2.5: 'gap-2.5',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  11: 'gap-11',
  12: 'gap-12',
};

const gapXClasses: Record<Spacing, string> = {
  0: 'gap-x-0',
  0.5: 'gap-x-0.5',
  1: 'gap-x-1',
  1.5: 'gap-x-1.5',
  2: 'gap-x-2',
  2.5: 'gap-x-2.5',
  3: 'gap-x-3',
  4: 'gap-x-4',
  5: 'gap-x-5',
  6: 'gap-x-6',
  8: 'gap-x-8',
  10: 'gap-x-10',
  11: 'gap-x-11',
  12: 'gap-x-12',
};

const gapYClasses: Record<Spacing, string> = {
  0: 'gap-y-0',
  0.5: 'gap-y-0.5',
  1: 'gap-y-1',
  1.5: 'gap-y-1.5',
  2: 'gap-y-2',
  2.5: 'gap-y-2.5',
  3: 'gap-y-3',
  4: 'gap-y-4',
  5: 'gap-y-5',
  6: 'gap-y-6',
  8: 'gap-y-8',
  10: 'gap-y-10',
  11: 'gap-y-11',
  12: 'gap-y-12',
};

const Grid = (props: IGridProps): JSX.Element => {
  const {
    as: Component = 'div',
    cols,
    align,
    gap,
    gapX,
    gapY,
    className,
    children,
    ...rest
  } = props;

  const classes = classNames(
    'grid',
    cols && colsClasses[cols],
    align && alignClasses[align],
    gap !== undefined && gapClasses[gap],
    gapX !== undefined && gapXClasses[gapX],
    gapY !== undefined && gapYClasses[gapY],
    className
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Grid;
