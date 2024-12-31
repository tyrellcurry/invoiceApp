import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/app/components/UI/atoms/Button/Button';

describe('Button Component - Unit Tests', () => {
  const testId = 'text-test-id';

  it('renders with the correct default `tag`, `variant`, `className`, and `children`', () => {
    render(<Button data-testid={testId}>Hello, World!</Button>);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('btn btn--primary');
    expect(element).toBeInTheDocument();
    const content = screen.getByText('Hello, World!');
    expect(content).toBeInTheDocument();
  });

  it('renders the text inside a span when `text` is provided', () => {
    render(<Button>{'Hello World'}</Button>);
    const buttonContent = screen.getByText('Hello World');
    expect(buttonContent.tagName).toBe('SPAN');
  });

  it('renders children as span when `children` is a string or number and `text` is not provided', () => {
    render(<Button>{42}</Button>);
    const buttonContent = screen.getByText('42');
    expect(buttonContent.tagName).toBe('SPAN');
  });

  it('renders children directly when `children` is not a string or number and `text` is not provided', () => {
    render(
      <Button>
        <div data-testid="custom-child">Custom Child</div>
      </Button>
    );
    const customChild = screen.getByTestId('custom-child');
    expect(customChild).toBeInTheDocument();
  });

  it('renders empty content when neither `text` nor `children` are provided', () => {
    render(<Button />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it('renders as <a> tag when `href` is passed', () => {
    render(
      <Button data-testid={testId} href="#">
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('A');
  });

  it('renders secondary `variant` with custom class when a custom `className` is passed', () => {
    render(
      <Button data-testid={testId} variant="secondary" className="test">
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('btn btn--secondary test');
    expect(element).toBeInTheDocument();
  });

  it('renders `type` submit when `type` prop passed as submit', () => {
    render(
      <Button data-testid={testId} type="submit">
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    expect(element.getAttribute('type')).toBe('submit');
  });

  it('`onClick` event triggers when button is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button data-testid={testId} onClick={handleClick}>
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon left when `iconLeft` is added as prop', () => {
    render(
      <Button data-testid={testId} iconLeft="dm-moon">
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders icon right when `iconRight` is added as prop', () => {
    render(
      <Button data-testid={testId} iconRight="dm-moon">
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders disbled button when `disabled` is passed and does not fire click event', () => {
    const handleClick = jest.fn();
    render(
      <Button data-testid={testId} onClick={handleClick} disabled>
        Hello, World!
      </Button>
    );
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalledTimes(0);
    expect(element).toBeDisabled();
  });
});
