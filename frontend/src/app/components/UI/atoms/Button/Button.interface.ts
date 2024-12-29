import React, { JSX } from 'react';
import { IIconProps } from '@/app/components/UI/atoms/Icon/Icon.interface';

export interface IButtonProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  iconLeft?: IIconProps['name'] | JSX.Element;
  iconRight?: IIconProps['name'] | JSX.Element;
}
