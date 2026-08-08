export const DARK_MODE: string = 'dark';

/** Base URL of the invoice API. Defaults to the local Go server's port. */
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

/** Author's GitHub profile, linked from the splash screen's credit line. */
export const AUTHOR_URL: string = 'https://github.com/tyrellcurry';
