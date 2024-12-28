/**
 * @name Text
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for headings and basic text elements
 *
 * @param tag - element's HTML tag
 * @param variant - element's styling
 * @param className - element's custom classes
 * @param children - nested ReactNodes
 *
 * @returns {JSX.Element}
 */

import { JSX } from 'react';
import { ITextProps } from './Text.interface';
import classNames from 'classnames';

const textVariants = {
  h1: 'text--h1',
  h2: 'text--h2',
  h3: 'text--h3',
  h4: 'text--h4',
  h5: 'text--h5',
  body: 'text--body',
  kicker: 'text--kicker',
  custom: 'text--custom',
};

const Text = (props: ITextProps): JSX.Element => {
  const { tag = 'div', variant = 'body', className: propsClassName, children } = props;
  const TagName = tag || 'div';
  const className = classNames(textVariants[variant], propsClassName);
  return <TagName {...{ className }}>{children}</TagName>;
};

export default Text;
