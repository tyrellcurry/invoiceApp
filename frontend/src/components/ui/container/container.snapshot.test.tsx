import React from 'react';
import { render } from '@testing-library/react';
import Container from '@/components/ui/container/container';

describe('Container Component', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Container as="section" className="p-4">
        content
      </Container>
    );
    expect(container).toMatchSnapshot();
  });
});
