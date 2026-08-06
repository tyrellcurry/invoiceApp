import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MainMenu from '@/components/layouts/main-menu/main-menu';

describe('Main Menu Component - Unit Tests', () => {
  const testId = 'text-test-id';
  const RenderMainMenu = (darkMode?: string) =>
    render(
      <MemoryRouter>
        <MainMenu
          darkmode={darkMode || 'dark'}
          darkmodeToggle={() => {}}
          data-testid={testId}
          darkmodeBtn={{
            darkAria: 'lorem-dark',
            lightAria: 'lorem-light',
          }}
          profile={{
            profileImage: '/assets/profile-default.png',
            profileImageAlt: 'lorem ipsum',
            link: '/profile',
          }}
        />
      </MemoryRouter>
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
    RenderMainMenu('light');
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

  it('renders with the correct profile link url', () => {
    RenderMainMenu();
    const element = screen.getByTestId(testId);
    expect(element.tagName).toBe('NAV');
    expect(element).toBeInTheDocument();

    // Find the link
    const profileLink = screen.getByTestId('profile-link');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});

describe('Main Menu Component - Account Menu', () => {
  const renderWithLogout = (onLogout = () => {}, profileImage?: string) =>
    render(
      <MemoryRouter>
        <MainMenu
          accountMenuLabel="Account menu"
          darkmode="dark"
          darkmodeBtn={{ darkAria: 'lorem-dark', lightAria: 'lorem-light' }}
          darkmodeToggle={() => {}}
          logoutLabel="Log out"
          profile={{ profileImage, profileImageAlt: 'lorem ipsum' }}
          userEmail="jensenh@mail.com"
          onLogout={onLogout}
        />
      </MemoryRouter>
    );

  it('keeps logout hidden until the profile button is clicked', () => {
    renderWithLogout();

    expect(screen.queryByRole('menuitem', { name: 'Log out' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));

    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeInTheDocument();
    expect(screen.getByText('jensenh@mail.com')).toBeInTheDocument();
  });

  it('calls onLogout and closes the menu', () => {
    const onLogout = vi.fn();
    renderWithLogout(onLogout);

    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Log out' }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menuitem', { name: 'Log out' })).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside it', () => {
    renderWithLogout();

    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('menuitem', { name: 'Log out' })).not.toBeInTheDocument();
  });

  it('uses the supplied avatar, falling back to the default when it fails to load', () => {
    renderWithLogout(() => {}, 'https://lh3.googleusercontent.com/a/avatar');

    const avatar = screen.getByAltText('lorem ipsum');
    expect(avatar).toHaveAttribute('src', 'https://lh3.googleusercontent.com/a/avatar');

    fireEvent.error(avatar);

    expect(avatar).toHaveAttribute('src', '/assets/profile-default.png');
  });

  it('falls back to the default avatar when no image is supplied', () => {
    renderWithLogout();

    expect(screen.getByAltText('lorem ipsum')).toHaveAttribute(
      'src',
      '/assets/profile-default.png'
    );
  });
});
