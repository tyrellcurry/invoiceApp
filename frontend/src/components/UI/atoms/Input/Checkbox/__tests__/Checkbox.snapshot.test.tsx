import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from '@/components/UI/atoms/Input/Checkbox/Checkbox';

describe('Checkbox Component', () => {
  it('renders correctly with a label', () => {
    const { container } = render(<Checkbox label="Test Label" labelId="checkbox-1" />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without a label', () => {
    const { container } = render(<Checkbox label="" labelId="checkbox-2" />);
    expect(container).toMatchSnapshot();
  });

  it('renders with custom class names', () => {
    const { container } = render(<Checkbox label="Custom Class" labelId="checkbox-3" />);
    expect(container).toMatchSnapshot();
  });
});
