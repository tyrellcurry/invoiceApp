import React, { JSX } from 'react';
import { IButtonProps } from '@/app/components/UI/atoms/Button/Button.interface';
import Icon from '@/app/components/UI/atoms/Icon/Icon';
import classNames from 'classnames';

const Button = (props: IButtonProps): JSX.Element => {
  const {
    iconLeft,
    iconLeftClassName,
    iconRight,
    iconRightClassName,
    children,
    href,
    variant = 'primary',
    className: classNameProp,
    ...rest
  } = props;

  const buttonVariantClasses = {
    primary: 'base btn--primary',
    secondary: 'base btn--secondary',
    dark: 'base btn--dark',
    danger: 'base btn--danger',
    custom: 'btn--custom',
  };

  const className = classNames('btn', buttonVariantClasses[variant], classNameProp);

  const renderButtonContent = (text?: string) => (
    <>
      {!!iconLeft && typeof iconLeft === 'string' ? (
        <Icon name={iconLeft} className={classNames('icon', iconLeftClassName)} />
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

      {!!iconRight && typeof iconRight === 'string' ? (
        <Icon name={iconRight} className={classNames('icon', iconRightClassName)} />
      ) : (
        iconRight
      )}
    </>
  );
  const TagName = !!href ? 'a' : 'button';
  return (
    <TagName {...rest} {...{ className }}>
      {renderButtonContent()}
    </TagName>
  );
};

export default Button;
