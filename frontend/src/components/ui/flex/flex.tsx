/**
 * @name Flex
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Flexbox layout primitive. Exposes the common flex controls as props
 * (direction, align, justify, wrap, gap) and renders a `div` by default, or any
 * element via `as`. Responsive/breakpoint variants are passed through
 * `className`.
 *
 * @param as - element/component to render (default: 'div')
 * @param inline - render `inline-flex` instead of `flex`
 * @param direction - default: 'row'
 * @param align
 * @param justify
 * @param wrap
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
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  FlexWrap,
  IFlexProps,
  Spacing,
} from '@/components/ui/flex/flex.types';

const directionClasses: Record<FlexDirection, string> = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
};

const alignClasses: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const wrapClasses: Record<FlexWrap, string> = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
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

const Flex = (props: IFlexProps): JSX.Element => {
  const {
    as: Component = 'div',
    inline = false,
    direction = 'row',
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    className,
    children,
    ...rest
  } = props;

  const classes = classNames(
    inline ? 'inline-flex' : 'flex',
    directionClasses[direction],
    align && alignClasses[align],
    justify && justifyClasses[justify],
    wrap && wrapClasses[wrap],
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

export default Flex;
