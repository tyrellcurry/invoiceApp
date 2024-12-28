import React from 'react';
import { render, screen } from '@testing-library/react';
import Text from '../Text';

describe('Text Component - Unit Tests', () => {
  it('renders with the correct default tag and class', () => {
    render(<Text>Default Text</Text>);
    const element = screen.getByText('Default Text');

    expect(element.tagName).toBe('DIV'); // Default tag is 'div'
    expect(element).toHaveClass('text--body'); // Default variant is 'body'
  });

  it('applies the correct tag from the `tag` prop', () => {
    render(<Text tag="h1">Heading</Text>);
    const element = screen.getByText('Heading');

    expect(element.tagName).toBe('H1'); // Ensures 'h1' is rendered
  });

  it('applies the correct className based on `variant`', () => {
    render(<Text variant="h2">Subheading</Text>);
    const element = screen.getByText('Subheading');

    expect(element).toHaveClass('text--h2'); // Ensures class for variant 'h2' is applied
  });

  it('merges additional classNames with the variant className', () => {
    render(
      <Text variant="custom" className="extra-class">
        Custom Text
      </Text>
    );
    const element = screen.getByText('Custom Text');

    expect(element).toHaveClass('text--custom'); // Ensures the variant class is applied
    expect(element).toHaveClass('extra-class'); // Ensures additional class is merged
  });

  it('renders the correct children', () => {
    render(<Text>Hello, World!</Text>);
    const element = screen.getByText('Hello, World!');

    expect(element).toBeInTheDocument(); // Ensures the children are rendered
  });
});
