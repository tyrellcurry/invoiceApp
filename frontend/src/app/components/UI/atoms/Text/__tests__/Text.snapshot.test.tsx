import React from 'react';
import { render } from '@testing-library/react';
import Text from '@/app/components/UI/atoms/Text/Text';

describe('Text Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Text>Default Text</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with a custom tag and variant', () => {
    const { container } = render(
      <Text tag="h1" variant="h1" className="custom-class">
        Heading Text
      </Text>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with kicker variant', () => {
    const { container } = render(<Text variant="kicker">Kicker Text</Text>);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with custom children', () => {
    const { container } = render(<Text>Custom Children Content</Text>);
    expect(container).toMatchSnapshot();
  });
});
