import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from '@/components/ui/container/container';

describe('Container Component - Unit Tests', () => {
  const testId = 'container-test-id';

  it('renders a div by default with its children', () => {
    render(<Container data-testid={testId}>content</Container>);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveTextContent('content');
  });

  it('renders the element passed via `as`', () => {
    render(
      <Container as="section" data-testid={testId}>
        content
      </Container>
    );
    expect(screen.getByTestId(testId).tagName).toBe('SECTION');
  });

  it('applies the provided `className`', () => {
    render(<Container className="test-class" data-testid={testId} />);
    expect(screen.getByTestId(testId)).toHaveClass('test-class');
  });

  it('forwards arbitrary props', () => {
    render(<Container aria-label="label" data-testid={testId} />);
    expect(screen.getByTestId(testId)).toHaveAttribute('aria-label', 'label');
  });
});
