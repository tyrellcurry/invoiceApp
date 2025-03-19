import React from 'react';
import { render, screen } from '@testing-library/react';
import Checkbox from '@/components/UI/atoms/Input/Checkbox/Checkbox';

describe('Checkbox Component - Unit Tests', () => {
  it('renders the checkbox input with the correct id', () => {
    render(<Checkbox labelId="checkbox-1" label="Test Label" />);
    const checkbox = screen.getByRole('checkbox', { name: /test label/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'checkbox-1');
  });

  it('renders the label with the correct text', () => {
    render(<Checkbox labelId="checkbox-2" label="Test Label 2" />);
    const label = screen.getByText(/test label 2/i);
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies the correct styles to the checkbox when checked', () => {
    render(<Checkbox labelId="checkbox-3" label="Test Label 3" />);
    const checkbox = screen.getByRole('checkbox', { name: /test label 3/i });
    checkbox.click();
    expect(checkbox).toHaveClass('checked:bg-blue-01');
  });
});
