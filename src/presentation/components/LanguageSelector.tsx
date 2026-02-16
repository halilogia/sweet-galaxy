/**
 * @unit LanguageSelector.tsx -> Module
 * @purpose [AUTO] Module logic for LanguageSelector.tsx.
 * @dependencies [react, @]
 * @complexity 3 (Low)
 * @scope [AUTO] Module-Local
 */
import React from 'react';
import { useI18n } from '@/infrastructure/i18n';
import type { Locale } from '@/infrastructure/i18n';

const LOCALES: Locale[] = ['en', 'tr'];

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
      <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">🌐</span>
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-bold transition-all touch-manipulation
            ${locale === l
              ? 'bg-indigo-500 text-white'
              : 'text-indigo-300 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          {l === 'en' ? 'EN' : 'TR'}
        </button>
      ))}
    </div>
  );
}
