/**
 * @name Icon
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for rendering icons
 *
 * @param name - name of icon set in IIconProps type
 * @param props - className
 *
 * @returns {JSX.Element}
 */

import React, { JSX } from 'react';
import { IIconProps } from '@/app/components/UI/atoms/Icon/Icon.interface';
import Moon from '@/app/components/UI/atoms/Icon/assets/dm-moon.svg';
import Sun from '@/app/components/UI/atoms/Icon/assets/dm-sun.svg';

const Icon = ({ name, ...props }: IIconProps): JSX.Element => {
  let ComponentToRender: React.ElementType | null = null;

  switch (name) {
    case 'dm-moon':
      ComponentToRender = Moon;
      break;
    case 'dm-sun':
      ComponentToRender = Sun;
      break;
    default:
      break;
  }

  return <>{ComponentToRender && <ComponentToRender {...props} />}</>;
};

export default Icon;
