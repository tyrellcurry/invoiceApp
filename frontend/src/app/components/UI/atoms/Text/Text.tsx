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

import React from 'react';
import { JSX } from 'react';
import { ITextProps } from '@/app/components/UI/atoms/Text/Text.interface';
import classNames from 'classnames';

const textVariants = {
  h1: 'text--h1',
  h2: 'text--h2',
  h3: 'text--h3',
  h4: 'text--h4',
  h5: 'text--h5',
  body: 'text--body',
  'body-alt': 'text--body-alt',
  kicker: 'text--kicker',
  custom: 'text--custom',
};

const Text = (props: ITextProps): JSX.Element => {
  const { tag, variant = 'body', className: propsClassName, children, ...rest } = props;
  const TagName = tag || 'div';
  const className = classNames('text', textVariants[variant], propsClassName);
  return (
    <TagName {...rest} {...{ className }}>
      {children}
    </TagName>
  );
};

export default Text;
