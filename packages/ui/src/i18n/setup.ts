import { createI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '@cv-generator/shared/i18n/constants/supported-locales';

// Déterminer si nous sommes en mode développement
const isDev = process.env.NODE_ENV === 'development';

// Fonction pour vérifier les clés de traduction
const debugTranslations = (messages: any, pathPrefix = '') => {
  if (!isDev) return;
  
  for (const [key, value] of Object.entries(messages)) {
    const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      debugTranslations(value, currentPath);
    } else if (typeof value === 'string') {
      console.debug(`Translation key loaded: ${currentPath} = ${value}`);
    }
  }
};

// Créer une seule instance partagée de i18n pour toute l'application
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  availableLocales: SUPPORTED_LOCALES,
  messages: {}, // Will be loaded dynamically
  missingWarn: isDev, // Only warn about missing translations in dev
  fallbackWarn: isDev, // Only warn about fallback in dev
});

/**
 * Returns the i18n instance for the application.
 * @returns Configured Vue I18n instance
 */
export function setupI18n() {
  return i18n;
}

/**
 * Loads messages for a specific locale.
 * @param locale - The locale to load messages for
 */
export async function loadLocaleMessages(locale: SupportedLocale) {
  // Dynamic import of locale messages
  const messages = await import(`./locales/${locale}.json`);
  
  // Debug translations in development mode
  if (isDev) {
    console.debug(`Loading translations for ${locale}`);
    debugTranslations(messages.default);
  }
  
  // Set the messages for the locale using the shared instance
  i18n.global.setLocaleMessage(locale, messages.default);
  
  // Set the locale
  i18n.global.locale.value = locale;
} 