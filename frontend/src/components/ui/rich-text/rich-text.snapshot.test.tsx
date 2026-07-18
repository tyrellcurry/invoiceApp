import { render } from '@testing-library/react';
import RichText from '@/components/ui/rich-text/rich-text';

describe('RichText Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<RichText value="Hello, World!" />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with HTML passed as a value', () => {
    const { container } = render(<RichText value={<p>Hello World</p>} />);
    expect(container).toMatchSnapshot();
  });
});
