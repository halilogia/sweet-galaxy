/**
 * @unit I18nContext.tsx -> Module
 * @purpose [AUTO] Module logic for I18nContext.tsx.
 * @dependencies [react]
 * @complexity 2 (Low)
 * @scope [AUTO] Module-Local
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getStoredLocale, setStoredLocale } from './localeStorage';
import type { Locale, TranslationKeys } from './translations';
import { translations } from './translations';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
