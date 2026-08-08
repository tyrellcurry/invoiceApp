import { JSX } from 'react';
import { Link } from 'react-router';
import Container from '@/components/ui/container/container';
import Flex from '@/components/ui/flex/flex';
import Text from '@/components/ui/text/text';

const NotFound = (): JSX.Element => (
  <Container className="mx-auto max-w-182.5">
    <Flex align="center" className="py-20" direction="col" gapY={4}>
      <Text className="text-gray-08 dark:text-white" tag={'h1'} variant="h1">
        404
      </Text>
      <Text className="text-gray-06 dark:text-gray-05" tag={'p'}>
        This page could not be found.
      </Text>
      <Link className="text-blue-01 font-bold" to="/">
        Go back home
      </Link>
    </Flex>
  </Container>
);

export default NotFound;
