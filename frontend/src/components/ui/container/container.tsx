/**
 * @name Container
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Generic block-level layout wrapper. Renders a `div` by default and accepts an
 * `as` prop to render any semantic element (section, article, etc.). All layout
 * styling is supplied through `className`.
 *
 * @param as - element/component to render (default: 'div')
 * @param className
 * @param children
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import { IContainerProps } from '@/components/ui/container/container.types';

const Container = (props: IContainerProps): JSX.Element => {
  const { as: Component = 'div', className, children, ...rest } = props;

  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
};

export default Container;
