import { clearToken, getToken, setToken } from '@/lib/session-token';

beforeEach(() => {
  localStorage.clear();
});

it('returns null when nothing is stored', () => {
  expect(getToken()).toBeNull();
});

it('round-trips a token that has not expired', () => {
  setToken('the-token', new Date(Date.now() + 60_000).toISOString());

  expect(getToken()).toBe('the-token');
});

it('returns null and clears storage for an expired token', () => {
  setToken('stale-token', new Date(Date.now() - 60_000).toISOString());

  expect(getToken()).toBeNull();
  expect(localStorage.getItem('invoiceapp.session')).toBeNull();
});

it('clearToken removes a stored token', () => {
  setToken('the-token', new Date(Date.now() + 60_000).toISOString());

  clearToken();

  expect(getToken()).toBeNull();
});

it('treats corrupt storage as no token', () => {
  localStorage.setItem('invoiceapp.session', 'not json');

  expect(getToken()).toBeNull();
});
