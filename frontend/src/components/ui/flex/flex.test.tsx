import React from 'react';
import { render, screen } from '@testing-library/react';
import Flex from '@/components/ui/flex/flex';

describe('Flex Component - Unit Tests', () => {
  const testId = 'flex-test-id';

  it('renders a flex div by default with its children', () => {
    render(<Flex data-testid={testId}>content</Flex>);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('flex', 'flex-row');
    expect(element).toHaveTextContent('content');
  });

  it('maps direction, align, justify and wrap props to classes', () => {
    render(
      <Flex align="center" data-testid={testId} direction="col" justify="between" wrap="wrap" />
    );
    expect(screen.getByTestId(testId)).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-between',
      'flex-wrap'
    );
  });

  it('maps gap, gapX and gapY props to classes', () => {
    render(<Flex data-testid={testId} gap={4} gapX={2} gapY={1.5} />);
    expect(screen.getByTestId(testId)).toHaveClass('gap-4', 'gap-x-2', 'gap-y-1.5');
  });

  it('renders `inline-flex` when `inline` is set', () => {
    render(<Flex data-testid={testId} inline />);
    const element = screen.getByTestId(testId);
    expect(element).toHaveClass('inline-flex');
    expect(element).not.toHaveClass('flex');
  });

  it('renders the element passed via `as` and merges `className`', () => {
    render(<Flex as="ul" className="custom" data-testid={testId} />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('UL');
    expect(element).toHaveClass('flex', 'custom');
  });
});
