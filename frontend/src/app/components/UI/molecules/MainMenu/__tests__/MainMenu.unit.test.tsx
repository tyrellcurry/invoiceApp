import React from 'react';
import { render, screen } from '@testing-library/react';
import MainMenu from '@/app/components/UI/molecules/MainMenu/MainMenu';

describe('Main Menu Component - Unit Tests', () => {
  const testId = 'text-test-id';
  const RenderMainMenu = () =>
    render(
      <MainMenu
        darkmode={'dark'}
        darkmodeToggle={() => {}}
        profileImage={'/assets/profile-default.png'}
        profileImageAlt="lorem ipsum"
        data-testid={testId}
        darkmodeBtnAria="lorem-dark"
        lightmodeBtnAria="lorem-light"
      />
    );

  it('renders with the correct tag', () => {
    RenderMainMenu();
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('NAV');
    expect(element).toBeInTheDocument();
  });

  it('renders with the correct profile image and alt text', () => {
    RenderMainMenu();
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('NAV');
    expect(element).toBeInTheDocument();
    const profileImage = screen.getByAltText('lorem ipsum');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage.tagName).toBe('IMG');
  });

  it('renders with the correct button and icon in lightmode with aria', () => {
    render(
      <MainMenu
        darkmode={'light'}
        darkmodeToggle={() => {}}
        profileImage={'/assets/profile-default.png'}
        profileImageAlt="lorem ipsum"
        data-testid={testId}
        darkmodeBtnAria="lorem-dark"
        lightmodeBtnAria="lorem-light"
      />
    );
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('NAV');
    expect(element).toBeInTheDocument();

    // Find the dark mode toggle button using its accessible name
    const darkmodeButton = screen.getByRole('button', { name: /lorem-dark/i });
    expect(darkmodeButton).toBeInTheDocument();

    // Verify the button contains the correct icon
    const icon = darkmodeButton.querySelector('.icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with the correct button and icon in darkmode with aria', () => {
    RenderMainMenu();
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('NAV');
    expect(element).toBeInTheDocument();

    // Find the dark mode toggle button using its accessible name
    const darkmodeButton = screen.getByRole('button', { name: /lorem-light/i });
    expect(darkmodeButton).toBeInTheDocument();

    // Verify the button contains the correct icon
    const icon = darkmodeButton.querySelector('.icon');
    expect(icon).toBeInTheDocument();
  });
});
