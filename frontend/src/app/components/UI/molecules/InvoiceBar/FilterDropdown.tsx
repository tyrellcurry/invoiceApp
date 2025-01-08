import Checkbox from '@/app/components/UI/atoms/Input/Checkbox/Checkbox';
import { JSX } from 'react';

interface FilterState {
  draft: boolean;
  pending: boolean;
  paid: boolean;
}

export interface IFilterDropdownProps {
  draftText: string;
  pendingText: string;
  paidText: string;
  elementRef: React.RefObject<HTMLDivElement | null>;
  filters: FilterState;
  setFilters: (updatedFilters: FilterState) => void;
}

const FilterDropDown = ({
  draftText,
  pendingText,
  paidText,
  setFilters,
  filters,
  elementRef,
}: IFilterDropdownProps): JSX.Element => {
  return (
    <div
      ref={elementRef}
      className="absolute bg-white drop-shadow-xl p-6 w-[180px] lg:w-[220px] top-6 rounded-lg dark:bg-blue-04 z-10"
    >
      <div>
        <Checkbox
          label={draftText}
          labelId={'draft'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (setFilters) {
              setFilters({
                ...filters,
                draft: e.target.checked,
              });
            }
          }}
        />
      </div>
      <div>
        <Checkbox
          label={pendingText}
          labelId={'pending'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (setFilters) {
              setFilters({
                ...filters,
                pending: e.target.checked,
              });
            }
          }}
        />
      </div>
      <div>
        <Checkbox
          label={paidText}
          labelId={'paid'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (setFilters) {
              setFilters({
                ...filters,
                paid: e.target.checked,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default FilterDropDown;
