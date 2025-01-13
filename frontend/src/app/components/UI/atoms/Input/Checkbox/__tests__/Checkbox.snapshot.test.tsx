import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from '@/app/components/UI/atoms/Input/Checkbox/Checkbox';

describe('Checkbox Component', () => {
  it('renders correctly with a label', () => {
    const { container } = render(<Checkbox labelId="checkbox-1" label="Test Label" />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly without a label', () => {
    const { container } = render(<Checkbox labelId="checkbox-2" label="" />);
    expect(container).toMatchSnapshot();
  });

  it('renders with custom class names', () => {
    const { container } = render(<Checkbox labelId="checkbox-3" label="Custom Class" />);
    expect(container).toMatchSnapshot();
  });
});
