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
import MenuLogoBtn from '@/app/components/UI/atoms/Icon/assets/menu-logo-btn.svg';
import ChevronRight from '@/app/components/UI/atoms/Icon/assets/chevron-right.svg';
import ChevronDown from '@/app/components/UI/atoms/Icon/assets/chevron-down.svg';
import CirclePlus from '@/app/components/UI/atoms/Icon/assets/circle-plus.svg';

const Icon = ({ name, ...props }: IIconProps): JSX.Element => {
  let ComponentToRender: React.ElementType | null = null;

  switch (name) {
    case 'dm-moon':
      ComponentToRender = Moon;
      break;
    case 'dm-sun':
      ComponentToRender = Sun;
      break;
    case 'menu-logo-btn':
      ComponentToRender = MenuLogoBtn;
      break;
    case 'chevron-right':
      ComponentToRender = ChevronRight;
      break;
    case 'chevron-down':
      ComponentToRender = ChevronDown;
      break;
    case 'circle-plus':
      ComponentToRender = CirclePlus;
      break;
    default:
      break;
  }

  return <>{ComponentToRender && <ComponentToRender {...props} />}</>;
};

export default Icon;
