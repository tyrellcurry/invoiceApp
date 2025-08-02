import { ComponentPropsWithoutRef, JSX } from 'react';
import { IIconProps } from '@/components/UI/atoms/Icon/Icon.interface';

interface BaseButtonProps {
  className?: string;
  iconLeft?: IIconProps['name'] | JSX.Element;
  iconLeftClassName?: string;
  iconRight?: IIconProps['name'] | JSX.Element;
  iconRightClassName?: string;
  label?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger' | 'custom';
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<ComponentPropsWithoutRef<'button'>, keyof BaseButtonProps> {
  href?: never;
}

interface ButtonAsAnchor
  extends BaseButtonProps,
    Omit<ComponentPropsWithoutRef<'a'>, keyof BaseButtonProps> {
  href: string;
}

export type IButtonProps = ButtonAsButton | ButtonAsAnchor;
