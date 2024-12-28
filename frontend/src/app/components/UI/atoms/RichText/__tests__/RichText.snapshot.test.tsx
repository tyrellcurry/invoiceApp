import React from 'react';
import { render } from '@testing-library/react';
import RichText from '../RichText';

describe('RichText Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<RichText />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with HTML passed as a value', () => {
    const { container } = render(<RichText value={<p>Hello World</p>} />);
    expect(container).toMatchSnapshot();
  });
});