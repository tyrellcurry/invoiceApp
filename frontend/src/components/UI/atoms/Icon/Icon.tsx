/**
 * @name Icon
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for rendering icons
 *
 * @param name
 *
 * @returns {JSX.Element}
 */

import React, { JSX } from 'react';
import { IIconProps } from '@/components/UI/atoms/Icon/Icon.interface';
import Moon from '@/components/UI/atoms/Icon/assets/dm-moon.svg';
import Sun from '@/components/UI/atoms/Icon/assets/dm-sun.svg';
import MenuLogoBtn from '@/components/UI/atoms/Icon/assets/menu-logo-btn.svg';
import ChevronRight from '@/components/UI/atoms/Icon/assets/chevron-right.svg';
import ChevronDown from '@/components/UI/atoms/Icon/assets/chevron-down.svg';
import CirclePlus from '@/components/UI/atoms/Icon/assets/circle-plus.svg';

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
