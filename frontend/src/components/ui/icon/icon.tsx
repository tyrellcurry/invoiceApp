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
import { IIconProps } from '@/components/ui/icon/icon.types';
import Moon from '@/components/ui/icon/assets/dm-moon.svg';
import Sun from '@/components/ui/icon/assets/dm-sun.svg';
import MenuLogoBtn from '@/components/ui/icon/assets/menu-logo-btn.svg';
import ChevronRight from '@/components/ui/icon/assets/chevron-right.svg';
import ChevronDown from '@/components/ui/icon/assets/chevron-down.svg';
import CirclePlus from '@/components/ui/icon/assets/circle-plus.svg';

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
