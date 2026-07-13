/**
 * @name Button
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for rendering buttons
 *
 * @param iconLeft
 * @param iconLeftClassName
 * @param iconRight
 * @param iconRightClassName
 * @param href
 * @param label
 * @param variant - default: 'primary'
 * @param className
 *
 * @returns {JSX.Element}
 */

import React, { JSX } from 'react';
import { IButtonProps } from '@/components/ui/button/button.types';
import Icon from '@/components/ui/icon/icon';
import classNames from 'classnames';

const Button = (props: IButtonProps): JSX.Element => {
  const {
    iconLeft,
    iconLeftClassName,
    iconRight,
    iconRightClassName,
    href,
    label,
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

  const renderButtonContent = () => (
    <>
      {!!iconLeft && typeof iconLeft === 'string' ? (
        <Icon className={classNames('icon', iconLeftClassName)} name={iconLeft} />
      ) : (
        iconLeft
      )}

      {!!label && <span>{label}</span>}

      {!!iconRight && typeof iconRight === 'string' ? (
        <Icon className={classNames('icon', iconRightClassName)} name={iconRight} />
      ) : (
        iconRight
      )}
    </>
  );

  if (href) {
    return (
      <a {...(rest as React.ComponentPropsWithoutRef<'a'>)} className={className} href={href}>
        {renderButtonContent()}
      </a>
    );
  }

  return (
    <button {...(rest as React.ComponentPropsWithoutRef<'button'>)} className={className}>
      {renderButtonContent()}
    </button>
  );
};

export default Button;
