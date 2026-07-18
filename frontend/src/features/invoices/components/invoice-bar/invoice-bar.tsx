import { JSX } from 'react';
import {
  FilterState,
  IInvoiceBarProps,
} from '@/features/invoices/components/invoice-bar/invoice-bar.types';
import classNames from 'classnames';
import Button from '@/components/ui/button/button';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Grid from '@/components/ui/grid/grid';
import Text from '@/components/ui/text/text';
import useVisibilityToggle from '@/hooks/use-visibility-toggle';
import Checkbox from '@/components/ui/checkbox/checkbox';

const InvoiceBar = (props: IInvoiceBarProps): JSX.Element => {
  const {
    invoiceBarTitle,
    newInvoiceBtn,
    totalInvoicesText,
    filterStatusBtn,
    newInvoiceHandler,
    filterStatusText,
    setFilters,
    filters,
    ...rest
  } = props;

  const { isVisible, setIsVisible, elementRef } = useVisibilityToggle();

  const handleFilterChange =
    (key: keyof FilterState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (setFilters) {
        setFilters({ ...filters, [key]: event.target.checked });
      }
    };

  const filterKeys: (keyof FilterState)[] = ['draft', 'pending', 'paid'];

  return (
    <Flex
      align="center"
      as="menu"
      className="flex-wrap gap-y-6 md:flex-nowrap md:gap-y-0"
      justify="between"
      {...rest}
    >
      <Container>
        <Text className="text-gray-08 dark:text-white" tag={'h2'} variant="h2">
          {invoiceBarTitle}
        </Text>
        <Text className="text-gray-06 dark:text-white" tag={'p'}>
          <span className="block md:hidden">{totalInvoicesText?.mobile}</span>
          <span className="hidden md:block">{totalInvoicesText?.desktop}</span>
        </Text>
      </Container>
      <Container className="contents md:flex md:items-center md:gap-x-10">
        <Grid
          align="center"
          className="relative order-3 w-full justify-items-start md:order-0 md:w-auto md:justify-items-center"
        >
          <Button
            className="flex items-center gap-x-3 font-bold text-xl dark:text-gray-05"
            iconRight={'chevron-down'}
            variant="custom"
            iconRightClassName={classNames('w-4 md:w-5 h-auto', {
              'rotate-180': !!isVisible,
            })}
            label={
              <>
                <span className="block md:hidden">{filterStatusBtn?.mobile}</span>
                <span className="hidden md:block">{filterStatusBtn?.desktop}</span>
              </>
            }
            onClick={() => setIsVisible((prev) => !prev)}
          />

          {/* Children */}
          {isVisible && (
            <Flex
              className="absolute bg-white drop-shadow-xl p-6 w-45 lg:w-55 top-8 rounded-lg dark:bg-blue-04 z-10"
              direction="col"
              gap={2}
              ref={elementRef}
            >
              {filterKeys.map((key) => (
                <Container key={key}>
                  <Checkbox
                    label={filterStatusText[key]}
                    labelId={key}
                    onChange={handleFilterChange(key)}
                  />
                </Container>
              ))}
            </Flex>
          )}
        </Grid>
        <Button
          className="order-2 p-1.5 md:order-0 md:p-2 gap-x-2 items-center pr-3.75 text-xl md:text-lg"
          iconLeft={'circle-plus'}
          iconLeftClassName="min-w-8 min-h-8 max-h-8 max-h-8"
          variant="primary"
          label={
            <>
              <span className="block md:hidden">{newInvoiceBtn?.mobile}</span>
              <span className="hidden md:block">{newInvoiceBtn?.desktop}</span>
            </>
          }
          onClick={newInvoiceHandler}
        />
      </Container>
    </Flex>
  );
};

export default InvoiceBar;
