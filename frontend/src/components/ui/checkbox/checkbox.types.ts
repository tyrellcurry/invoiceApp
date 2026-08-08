import { ComponentPropsWithoutRef } from 'react';

export interface ICheckboxProps extends ComponentPropsWithoutRef<'input'> {
  labelId: string;
  label: string;
}
