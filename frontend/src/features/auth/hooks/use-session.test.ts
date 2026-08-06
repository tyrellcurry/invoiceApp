import { act, renderHook, waitFor } from '@testing-library/react';
import { continueAsGuest } from '@/features/auth/api/continue-as-guest';
import { getMe } from '@/features/auth/api/get-me';
import { logout } from '@/features/auth/api/logout';
import { useSession } from '@/features/auth/hooks/use-session';
import { getToken, setToken } from '@/lib/session-token';

vi.mock('@/features/auth/api/get-me', () => ({ getMe: vi.fn() }));
vi.mock('@/features/auth/api/continue-as-guest', () => ({ continueAsGuest: vi.fn() }));
vi.mock('@/features/auth/api/logout', () => ({ logout: vi.fn() }));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

it('is anonymous immediately when there is no stored token', async () => {
  const { result } = renderHook(() => useSession());

  await waitFor(() => expect(result.current.status).toBe('anonymous'));
  expect(getMe).not.toHaveBeenCalled();
});

it('resolves to guest for a valid token with no user', async () => {
  setToken('guest-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({ authenticated: true, user: null, expiresAt: null });

  const { result } = renderHook(() => useSession());

  await waitFor(() => expect(result.current.status).toBe('guest'));
  expect(result.current.user).toBeNull();
});

it('resolves to authenticated for a valid token with a user', async () => {
  setToken('user-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({
    authenticated: true,
    user: { email: 'jensenh@mail.com', name: 'Jensen Huang' },
    expiresAt: null,
  });

  const { result } = renderHook(() => useSession());

  await waitFor(() => expect(result.current.status).toBe('authenticated'));
  expect(result.current.user).toEqual({ email: 'jensenh@mail.com', name: 'Jensen Huang' });
});

it('clears the token and goes anonymous when the server says not authenticated', async () => {
  setToken('stale-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({ authenticated: false, user: null, expiresAt: null });

  const { result } = renderHook(() => useSession());

  await waitFor(() => expect(result.current.status).toBe('anonymous'));
  expect(getToken()).toBeNull();
});

it('clears the token and goes anonymous when the request fails', async () => {
  setToken('stale-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockRejectedValue(new Error('network down'));

  const { result } = renderHook(() => useSession());

  await waitFor(() => expect(result.current.status).toBe('anonymous'));
  expect(getToken()).toBeNull();
});

it('continueAsGuest stores the new token and becomes guest', async () => {
  vi.mocked(continueAsGuest).mockResolvedValue({
    token: 'new-guest-token',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  });

  const { result } = renderHook(() => useSession());
  await waitFor(() => expect(result.current.status).toBe('anonymous'));

  await act(() => result.current.continueAsGuest());

  expect(result.current.status).toBe('guest');
  expect(getToken()).toBe('new-guest-token');
});

it('logout clears the token and goes anonymous', async () => {
  setToken('guest-token', new Date(Date.now() + 60_000).toISOString());
  vi.mocked(getMe).mockResolvedValue({ authenticated: true, user: null, expiresAt: null });
  vi.mocked(logout).mockResolvedValue(undefined);

  const { result } = renderHook(() => useSession());
  await waitFor(() => expect(result.current.status).toBe('guest'));

  await act(() => result.current.logout());

  expect(result.current.status).toBe('anonymous');
  expect(result.current.user).toBeNull();
  expect(getToken()).toBeNull();
});
