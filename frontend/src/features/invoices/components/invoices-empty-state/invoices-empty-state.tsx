/**
 * @name InvoicesEmptyState
 * @author Tyrell Curry <tyrellcurryio@gmail.com>
 *
 * Empty state shown when there are no invoices to list: an illustration, a
 * heading and supporting copy. Presentation only; the copy arrives via props.
 *
 * @param props - see {@link IInvoicesEmptyStateProps}
 *
 * @returns {JSX.Element}
 */
import { JSX } from 'react';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';
import EmptyStateIllustration from '@/features/invoices/components/invoices-empty-state/assets/empty-state-illustration.svg';
import { IInvoicesEmptyStateProps } from '@/features/invoices/components/invoices-empty-state/invoices-empty-state.types';

const InvoicesEmptyState = (props: IInvoicesEmptyStateProps): JSX.Element => {
  const { title, description } = props;

  return (
    <Flex align="center" as="section" className="text-center" direction="col">
      <EmptyStateIllustration className="h-auto w-[194px] max-w-full" aria-hidden />
      <Text
        className="mt-10 text-2xl font-bold tracking-[-0.75px] text-gray-08 dark:text-white"
        tag={'h2'}
        variant="custom"
      >
        {title}
      </Text>
      <Text
        className="mt-6 max-w-[240px] text-center text-[13px] font-medium leading-[15px] text-gray-06 dark:text-gray-05"
        tag={'p'}
        variant="custom"
      >
        {description}
      </Text>
    </Flex>
  );
};

export default InvoicesEmptyState;
