const STORAGE_KEY = 'invoiceapp.welcomeModal';

/**
 * Marks that the current owner's account was just pre-populated with the
 * example invoices, so `WelcomeModal` shows itself until dismissed. Set by
 * `features/auth` right after a guest session or a first-ever Google
 * sign-in reports `preloaded: true`. Lives outside `features/auth` since
 * `WelcomeModal` (rendered from `SessionGate`, app-wide chrome) reads it
 * too, and bulletproof-react's boundary rules forbid a feature importing
 * another feature's internals.
 */
export const markPreloaded = (): void => {
  localStorage.setItem(STORAGE_KEY, '1');
};

export const shouldShowWelcomeModal = (): boolean => localStorage.getItem(STORAGE_KEY) === '1';

export const dismissWelcomeModal = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
