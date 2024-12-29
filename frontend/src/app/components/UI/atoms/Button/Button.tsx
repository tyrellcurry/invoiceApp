import React, { JSX } from 'react';
import { IButtonProps } from '@/app/components/UI/atoms/Button/Button.interface';
import Icon from '@/app/components/UI/atoms/Icon/Icon';
import classNames from 'classnames';

const Button = (props: IButtonProps): JSX.Element => {
  const { iconLeft, iconRight, children } = props;
  const renderButtonContent = (text?: string) => (
    <>
      {!!iconLeft && typeof iconLeft === 'string' ? (
        <Icon name={iconLeft} className={classNames()} />
      ) : (
        iconLeft
      )}

      {!!text ? (
        <span>{text}</span>
      ) : ['string', 'number'].includes(typeof children) ? (
        <span>{children}</span>
      ) : (
        children
      )}

      {!!iconRight && typeof iconRight === 'string' ? <Icon name={iconRight} /> : iconRight}
    </>
  );
  const { href } = props;
  const TagName = !!href ? 'a' : 'button';
  return <TagName>{renderButtonContent}</TagName>;
};

export default Button;
