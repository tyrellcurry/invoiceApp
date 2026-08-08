import { render, screen } from '@testing-library/react';
import RichText from '@/components/ui/rich-text/rich-text';

describe('Text Component - Unit Tests', () => {
  const testId = 'richtext-test-id';

  it('renders correctly with default class applied', () => {
    render(<RichText data-testid={testId} value={'Hello, World!'} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('text text--rich');
  });

  it('applies valid attributes when passed', () => {
    render(<RichText aria-describedby="aria test" data-testid={testId} value={'Hello, World!'} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('text--rich');
    expect(element).toHaveAttribute('aria-describedby', 'aria test');
  });

  it('merges additional classNames with the variant className', () => {
    render(<RichText className="extra-class" value="Hello, World!" />);
    const element = screen.getByText('Hello, World!');
    expect(element).toHaveClass('text--rich');
    expect(element).toHaveClass('extra-class');
  });

  it('renders the correct value passed as string', () => {
    render(<RichText value={'Hello, World!'} />);
    const element = screen.getByText('Hello, World!');
    expect(element).toBeInTheDocument();
  });

  it('renders the correct value passed as HTML', () => {
    render(<RichText value={<p>Hello, World!</p>} />);
    const element = screen.getByText('Hello, World!');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });
});
