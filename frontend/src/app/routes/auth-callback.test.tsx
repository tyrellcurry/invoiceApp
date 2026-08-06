import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import AuthCallbackRoute from '@/app/routes/auth-callback';
import { getToken } from '@/lib/session-token';

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

it('redirects home without storing anything when the fragment is empty', async () => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hash: '' },
    writable: true,
  });

  renderCallback();

  await waitFor(() => expect(screen.getByText('Home route')).toBeInTheDocument());
  expect(getToken()).toBeNull();
});
