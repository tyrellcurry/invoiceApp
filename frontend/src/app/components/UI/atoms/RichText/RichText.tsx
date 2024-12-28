/**
 * @name RichText
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for rendering HTML as Rich Text
 *
 * @param className - element's custom classes
 * @param(required) value - HTML or string to render
 *
 * @returns {JSX.Element}
 */

import { JSX } from 'react';
import { IRichTextProps } from './RichText.interface';
import classNames from 'classnames';

const RichText = (props: IRichTextProps): JSX.Element => {
  const { className: propsClassName, value, ...rest } = props;
  const className = classNames('text text--rich', propsClassName);
  return (
    <div {...rest} {...{ className }}>
      {value}
    </div>
  );
};

export default RichText;
