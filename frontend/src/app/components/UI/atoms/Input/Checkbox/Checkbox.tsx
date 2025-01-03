import { ICheckboxProps } from '@/app/components/UI/atoms/Input/Checkbox/Checkbox.interface';
import Text from '@/app/components/UI/atoms/Text/Text';
import { JSX } from 'react';

const Checkbox = (props: ICheckboxProps): JSX.Element => {
  const { labelId, label } = props;
  return (
    <div className="flex items-center gap-x-[13px]">
      <input
        type="checkbox"
        id={labelId}
        className="relative peer shrink-0 appearance-none w-5 h-5 bg-gray-05 border-2 border-blue-01 rounded-sm checked:bg-blue-01 checked:border-0"
      />
      <Text className="cursor-pointer font-bold select-none" tag={'label'} for={labelId}>
        {label}
      </Text>
      <svg
        className="
      absolute 
      w-3.5 h-3.5 ml-0.5 
      hidden peer-checked:block"
        width="10"
        height="9"
        viewBox="0 0 10 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1.5 4.49976L3.62425 6.62402L8.96995 1.27832" stroke="white" stroke-width="2" />
      </svg>
    </div>
  );
};

export default Checkbox;
