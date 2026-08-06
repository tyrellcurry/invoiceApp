import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { IntlProvider } from 'use-intl';
import SessionGate from '@/app/session-gate';
import { continueAsGuest } from '@/features/auth/api/continue-as-guest';
import { getMe } from '@/features/auth/api/get-me';
import { logout } from '@/features/auth/api/logout';
import { getToken, setToken } from '@/lib/session-token';
import en from '../../messages/en.json';

vi.mock('@/features/auth/api/get-me', () => ({ getMe: vi.fn() }));
vi.mock('@/features/auth/api/continue-as-guest', () => ({ continueAsGuest: vi.fn() }));
vi.mock('@/features/auth/api/logout', () => ({ logout: vi.fn() }));

const renderGate = () => {
  const router = createMemoryRouter([
    { element: <SessionGate />, children: [{ index: true, element: <p>App content</p> }] },
  ]);
  render(
    <IntlProvider locale="en" messages={en}>
      <RouterProvider router={router} />
    </IntlProvider>
  );
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

it('shows the splash screen when there is no session', async () => {
  renderGate();

  await waitFor(() => expect(screen.getByText('Welcome to Invoice App')).toBeInTheDocument());
  expect(screen.queryByText('App content')).not.toBeInTheDocument();
});

it('continuing as a guest reveals the app', async () => {
  vi.mocked(continueAsGuest).mockResolvedValue({
    token: 'guest-token',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  });

  renderGate();
  await waitFor(() => expect(screen.getByText('Welcome to Invoice App')).toBeInTheDocument());

  fireEvent.click(screen.getByRole('button', { name: 'Continue without logging in' }));

  await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
  expect(getToken()).toBe('guest-token');
});

it('renders the app directly for an already-valid session', async () => {
  setToken('guest-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({ authenticated: true, user: null, expiresAt: null });

  renderGate();

  await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());
});

it('logging out returns to the splash screen', async () => {
  setToken('user-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({
    authenticated: true,
    user: { email: 'jensenh@mail.com', name: 'Jensen Huang' },
    expiresAt: null,
  });
  vi.mocked(logout).mockResolvedValue(undefined);

  renderGate();
  await waitFor(() => expect(screen.getByText('App content')).toBeInTheDocument());

  fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

  await waitFor(() => expect(screen.getByText('Welcome to Invoice App')).toBeInTheDocument());
  expect(getToken()).toBeNull();
});
