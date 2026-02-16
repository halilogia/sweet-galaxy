/**
 * @unit localeStorage.ts -> Module
 * @purpose [AUTO] Module logic for localeStorage.ts.
 * @dependencies None
 * @complexity 4 (Low)
 * @scope [AUTO] Module-Local
 */
import type { Locale } from './translations';
import { DEFAULT_LOCALE } from './translations';

const STORAGE_KEY = 'sweet_galaxy_locale';

export function getStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'tr') return raw;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
