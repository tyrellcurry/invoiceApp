/**
 * @name Checkbox
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Used for rendering checkbox
 *
 * @param labelId
 * @param label
 *
 * @returns {JSX.Element}
 */

import { ICheckboxProps } from '@/components/ui/checkbox/checkbox.types';
import Text from '@/components/ui/text/text';
import { JSX } from 'react';

const Checkbox = (props: ICheckboxProps): JSX.Element => {
  const { labelId, label, ...rest } = props;
  return (
    <div className="flex items-center gap-x-[13px]">
      <input
        className="relative peer shrink-0 appearance-none w-5 h-5 bg-gray-05 dark:bg-blue-03 border-2 border-blue-01 rounded-sm checked:bg-blue-01 dark:checked:bg-blue-01 checked:border-0 cursor-pointer"
        id={labelId}
        type="checkbox"
        {...rest}
      />
      <Text
        className="cursor-pointer font-bold select-none dark:text-white"
        htmlFor={labelId}
        tag={'label'}
      >
        {label}
      </Text>
      <svg
        fill="none"
        height="9"
        viewBox="0 0 10 9"
        width="10"
        xmlns="http://www.w3.org/2000/svg"
        className="
      absolute
      w-3.5 h-3.5 ml-0.5
      hidden peer-checked:block pointer-events-none"
      >
        <path d="M1.5 4.49976L3.62425 6.62402L8.96995 1.27832" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default Checkbox;
