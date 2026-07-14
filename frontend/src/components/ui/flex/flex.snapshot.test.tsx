import React from 'react';
import { render } from '@testing-library/react';
import Flex from '@/components/ui/flex/flex';

describe('Flex Component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Flex align="center" direction="col" gap={4} justify="between">
        content
      </Flex>
    );
    expect(container).toMatchSnapshot();
  });
});
