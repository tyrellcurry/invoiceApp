import React, { JSX } from 'react';
import { IIconProps } from '@/app/components/UI/atoms/Icon/Icon.interface';

export interface IButtonProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  iconLeft?: IIconProps['name'] | JSX.Element;
  iconLeftClassName?: string;
  iconRight?: IIconProps['name'] | JSX.Element;
  iconRightClassName?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger' | 'custom';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}
