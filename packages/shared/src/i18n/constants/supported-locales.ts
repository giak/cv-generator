/**
 * Supported locales configuration for the application.
 */

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'Français'
} as const; 