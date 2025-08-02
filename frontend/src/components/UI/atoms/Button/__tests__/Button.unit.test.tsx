import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '@/components/UI/atoms/Button/Button';

describe('Button Component - Unit Tests', () => {
  const testId = 'text-test-id';

  it('renders with the correct default `tag`, `variant`, `className`, and `label`', () => {
    render(<Button data-testid={testId} label="Hello, World!" />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('btn btn--primary');
    expect(element).toBeInTheDocument();
    const content = screen.getByText('Hello, World!');
    expect(content).toBeInTheDocument();
  });

  it('renders empty content when `label` is not provided', () => {
    render(<Button />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it('renders as <a> tag when `href` is passed', () => {
    render(<Button data-testid={testId} href="#" label="Link" />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('A');
  });

  it('renders secondary `variant` with custom class when a custom `className` is passed', () => {
    render(<Button className="test" data-testid={testId} variant="secondary" />);
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('btn btn--secondary test');
    expect(element).toBeInTheDocument();
  });

  it('renders `type` submit when `type` prop passed as submit', () => {
    render(<Button data-testid={testId} type="submit" />);
    const element = screen.getByTestId(testId);
    expect(element.getAttribute('type')).toBe('submit');
  });

  it('`onClick` event triggers when button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button data-testid={testId} onClick={handleClick} />);
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon left when `iconLeft` is added as prop', () => {
    render(<Button data-testid={testId} iconLeft="dm-moon" />);
    const element = screen.getByTestId(testId);
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders icon right when `iconRight` is added as prop', () => {
    render(<Button data-testid={testId} iconRight="dm-moon" />);
    const element = screen.getByTestId(testId);
    const svg = element.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders disbled button when `disabled` is passed and does not fire click event', () => {
    const handleClick = jest.fn();
    render(<Button data-testid={testId} disabled onClick={handleClick} />);
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalledTimes(0);
    expect(element).toBeDisabled();
  });
});
