import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '@cv-generator/shared';

/**
 * Détecte la langue préférée du navigateur parmi les locales supportées par l'application.
 * Retourne la locale supportée correspondant à la langue du navigateur,
 * ou la locale par défaut si aucune correspondance n'est trouvée.
 *
 * @returns Une locale supportée par l'application
 */
export function detectBrowserLanguage(): SupportedLocale {
  // Récupérer les langues préférées du navigateur
  const browserLanguages = 
    typeof navigator !== 'undefined' 
      ? (navigator.languages as readonly string[] || [navigator.language || '']).filter(Boolean)
      : [];
  
  if (browserLanguages.length === 0) {
    return DEFAULT_LOCALE;
  }
  
  // Chercher une correspondance exacte
  for (const lang of browserLanguages) {
    if (SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
      return lang as SupportedLocale;
    }
  }
  
  // Chercher une correspondance par langue de base (fr-FR -> fr)
  for (const lang of browserLanguages) {
    const baseLang = lang.split('-')[0];
    if (SUPPORTED_LOCALES.includes(baseLang as SupportedLocale)) {
      return baseLang as SupportedLocale;
    }
  }
  
  // Fallback sur la locale par défaut
  return DEFAULT_LOCALE;
} 