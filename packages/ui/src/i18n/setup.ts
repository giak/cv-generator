import { createI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '@cv-generator/shared/src/i18n/constants/supported-locales';

/**
 * Creates and configures the Vue I18n instance.
 * @returns Configured Vue I18n instance
 */
export function setupI18n() {
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    availableLocales: SUPPORTED_LOCALES,
    messages: {}, // Will be loaded dynamically
    missingWarn: import.meta.env.DEV, // Only warn about missing translations in dev
    fallbackWarn: import.meta.env.DEV, // Only warn about fallback in dev
  });

  return i18n;
}

/**
 * Loads messages for a specific locale.
 * @param locale - The locale to load messages for
 */
export async function loadLocaleMessages(locale: SupportedLocale) {
  // Dynamic import of locale messages
  const messages = await import(`./locales/${locale}.json`);
  
  // Get the i18n instance
  const i18n = setupI18n();
  
  // Set the messages for the locale
  i18n.global.setLocaleMessage(locale, messages.default);
  
  // Set the locale
  i18n.global.locale.value = locale;
} 