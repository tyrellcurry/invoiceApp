import { Locale } from '@/lib/i18n/routing';
import en from '../../../messages/en.json';

export type Messages = typeof en;

// @TODO: add fr.json and load per-locale when a second language ships.
const MESSAGES: Record<string, Messages> = { en };

export const getMessages = (locale: Locale): Messages => MESSAGES[locale] ?? en;
