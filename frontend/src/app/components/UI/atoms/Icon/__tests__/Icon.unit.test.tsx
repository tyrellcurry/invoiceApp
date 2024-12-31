import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from '@/app/components/UI/atoms/Icon/Icon';

describe('Icon Component - Unit Tests', () => {
  const testId = 'text-test-id';

  it('renders with the correct default tag and class', () => {
    render(<Icon data-testid={testId} name="dm-moon" />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('svg');
    expect(element).toBeInTheDocument();
  });

  it('applies the correct className', () => {
    render(<Icon data-testid={testId} name="dm-sun" className="test" />);
    const element = screen.getByTestId(testId);
    expect(element).toHaveClass('test');
  });
});
