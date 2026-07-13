import React from 'react';
import { render } from '@testing-library/react';
import Icon from '@/components/ui/icon/icon';

describe('Icon Component', () => {
  it('renders correctly with an icon name passed', () => {
    const { container } = render(<Icon name="dm-moon" />);
    expect(container).toMatchSnapshot();
  });
});
