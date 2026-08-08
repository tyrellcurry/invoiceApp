import { ComponentPropsWithoutRef, JSX, ReactNode } from 'react';
import { IIconProps } from '@/components/ui/icon/icon.types';

interface BaseButtonProps {
  className?: string;
  iconLeft?: IIconProps['name'] | JSX.Element;
  iconLeftClassName?: string;
  iconRight?: IIconProps['name'] | JSX.Element;
  iconRightClassName?: string;
  label?: ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger' | 'custom';
}

interface ButtonAsButton
  extends BaseButtonProps, Omit<ComponentPropsWithoutRef<'button'>, keyof BaseButtonProps> {
  href?: never;
}

interface ButtonAsAnchor
  extends BaseButtonProps, Omit<ComponentPropsWithoutRef<'a'>, keyof BaseButtonProps> {
  href: string;
}

export type IButtonProps = ButtonAsButton | ButtonAsAnchor;
