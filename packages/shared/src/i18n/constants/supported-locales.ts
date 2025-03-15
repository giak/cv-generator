/**
 * Supported locales configuration for the application.
 */

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'fr';

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  fr: 'Français',
  en: 'English'  
} as const; 