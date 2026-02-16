/**
 * @unit index.ts -> Module
 * @purpose [AUTO] Module logic for index.ts.
 * @dependencies None
 * @complexity 1 (Low)
 * @scope [AUTO] Module-Local
 */
export { I18nProvider, useI18n } from './I18nContext';
export { getStoredLocale, setStoredLocale } from './localeStorage';
export {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  translations,
  type Locale,
  type TranslationKeys,
} from './translations';
