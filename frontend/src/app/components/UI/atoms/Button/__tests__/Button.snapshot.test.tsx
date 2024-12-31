import React from 'react';
import { render } from '@testing-library/react';
import Icon from '@/app/components/UI/atoms/Icon/Icon';

describe('Icon Component', () => {
  it('renders correctly with an icon name passed', () => {
    const { container } = render(<Icon name="dm-moon" />);
    expect(container).toMatchSnapshot();
  });
});
