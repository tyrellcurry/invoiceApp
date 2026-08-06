export const DARK_MODE: string = 'dark';

/** Base URL of the invoice API. Defaults to the local Go server's port. */
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
