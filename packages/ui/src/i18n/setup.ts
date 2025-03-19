import { createI18n } from 'vue-i18n';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '@cv-generator/shared';
import { detectBrowserLanguage } from './language-detection';

// Constante pour la clé localStorage
export const LOCALE_STORAGE_KEY = 'cv-generator-locale';

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

/**
 * Obtient la locale à utiliser, en suivant cet ordre de priorité:
 * 1. Locale stockée dans localStorage (si elle est supportée)
 * 2. Locale détectée du navigateur
 * 3. Locale par défaut
 * 
 * @returns La locale à utiliser
 */
export function getInitialLocale(): SupportedLocale {
  // 1. Essayer de récupérer depuis le localStorage
  try {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale as SupportedLocale)) {
      return storedLocale as SupportedLocale;
    }
  } catch (error) {
    if (isDev) {
      console.warn('Error accessing localStorage:', error);
    }
  }
  
  // 2. Détecter la langue du navigateur
  const detectedLocale = detectBrowserLanguage();
  
  // Persister la locale détectée
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, detectedLocale);
  } catch (error) {
    if (isDev) {
      console.warn('Error saving locale to localStorage:', error);
    }
  }
  
  return detectedLocale;
}

// Créer une seule instance partagée de i18n pour toute l'application
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: DEFAULT_LOCALE, // Commencer avec la locale par défaut et la modifier après chargement
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
 * Préchargement des messages de traduction pour la locale par défaut
 * pour assurer un fonctionnement minimal de l'application
 */
let defaultMessagesLoaded = false;

export async function preloadDefaultMessages() {
  if (defaultMessagesLoaded) return;
  
  try {
    console.log(`Preloading default messages for ${DEFAULT_LOCALE}`);
    const defaultMessages = await import(`./locales/${DEFAULT_LOCALE}.json`);
    i18n.global.setLocaleMessage(DEFAULT_LOCALE, defaultMessages.default);
    defaultMessagesLoaded = true;
    console.log('Default messages preloaded successfully');
  } catch (error) {
    console.error(`Failed to preload default messages for ${DEFAULT_LOCALE}:`, error);
    // Définir un objet de messages minimal pour éviter les erreurs
    i18n.global.setLocaleMessage(DEFAULT_LOCALE, {
      common: {
        errors: {
          generic: "Une erreur s'est produite"
        },
        actions: {
          save: "Enregistrer",
          cancel: "Annuler"
        }
      }
    });
  }
}

/**
 * Loads messages for a specific locale.
 * @param locale - The locale to load messages for
 */
export async function loadLocaleMessages(locale: SupportedLocale) {
  try {
    console.log(`Attempting to load messages for ${locale}`);
    
    // S'assurer que les messages par défaut sont chargés d'abord
    if (!defaultMessagesLoaded && locale !== DEFAULT_LOCALE) {
      await preloadDefaultMessages();
    }
    
    // Dynamic import of locale messages
    const messages = await import(`./locales/${locale}.json`);
    
    // Debug translations in development mode
    if (isDev) {
      console.debug(`Messages for ${locale} loaded successfully`);
      debugTranslations(messages.default);
    }
    
    // Set the messages for the locale using the shared instance
    i18n.global.setLocaleMessage(locale, messages.default);
    
    // Set the locale
    i18n.global.locale.value = locale;
    
    // Persister la locale sélectionnée
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
      if (isDev) {
        console.warn('Error saving locale to localStorage:', error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to load messages for ${locale}:`, error);
    throw error;
  }
} 