import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import AuthCallbackRoute from '@/app/routes/auth-callback';
import { getToken } from '@/lib/session-token';
import { shouldShowWelcomeModal } from '@/lib/welcome-modal';

beforeEach(() => {
  localStorage.clear();
});

const renderCallback = () => {
  const router = createMemoryRouter(
    [
      { path: '/auth/callback', element: <AuthCallbackRoute /> },
      { path: '/', element: <p>Home route</p> },
    ],
    { initialEntries: ['/auth/callback'] }
  );
  render(<RouterProvider router={router} />);
};

it('stores the token from the URL fragment and redirects home', async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hash: `#token=abc123&expiresAt=${expiresAt}` },
    writable: true,
  });

  renderCallback();

  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
  expect(getToken()).toBe('abc123');
});

it('marks the welcome modal flag when the fragment says this is a new user', async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hash: `#token=abc123&expiresAt=${expiresAt}&preloaded=true` },
    writable: true,
  });

  renderCallback();

  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
  expect(shouldShowWelcomeModal()).toBe(true);
});

it('does not mark the welcome modal flag for a returning user', async () => {
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hash: `#token=abc123&expiresAt=${expiresAt}&preloaded=false` },
    writable: true,
  });

  renderCallback();

  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
  expect(shouldShowWelcomeModal()).toBe(false);
});

it('redirects home without storing anything when the fragment is empty', async () => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hash: '' },
    writable: true,
  });

  renderCallback();

  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
  expect(getToken()).toBeNull();
});
