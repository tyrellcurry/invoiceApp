import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '@/components/ui/grid/grid';

describe('Grid Component - Unit Tests', () => {
  const testId = 'grid-test-id';

  it('renders a grid div by default with its children', () => {
    render(<Grid data-testid={testId}>content</Grid>);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('grid');
    expect(element).toHaveTextContent('content');
  });

  it('maps cols, align and gap props to classes', () => {
    render(<Grid align="center" cols={3} data-testid={testId} gap={4} />);
    expect(screen.getByTestId(testId)).toHaveClass('grid', 'grid-cols-3', 'items-center', 'gap-4');
  });

  it('maps gapX and gapY props to classes', () => {
    render(<Grid data-testid={testId} gapX={2} gapY={8} />);
    expect(screen.getByTestId(testId)).toHaveClass('gap-x-2', 'gap-y-8');
  });

  it('renders the element passed via `as` and merges `className`', () => {
    render(<Grid as="ul" className="custom" data-testid={testId} />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('UL');
    expect(element).toHaveClass('grid', 'custom');
  });
});
