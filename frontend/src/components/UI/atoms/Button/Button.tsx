import React, { JSX } from 'react';
import { IButtonProps } from '@/components/UI/atoms/Button/Button.interface';
import Icon from '@/components/UI/atoms/Icon/Icon';
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
        <Icon className={classNames('icon', iconLeftClassName)} name={iconLeft} />
      ) : (
        iconLeft
      )}

      {!!text ? (
        <span className="select-none">{text}</span>
      ) : ['string', 'number'].includes(typeof children) ? (
        <span className="select-none">{children}</span>
      ) : (
        children
      )}

      {!!iconRight && typeof iconRight === 'string' ? (
        <Icon className={classNames('icon', iconRightClassName)} name={iconRight} />
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
