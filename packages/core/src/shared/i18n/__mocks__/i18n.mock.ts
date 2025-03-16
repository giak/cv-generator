import { DomainI18nPortInterface } from '../domain-i18n.port';

/**
 * Mock implementation of DomainI18nPortInterface for testing
 */
export class MockDomainI18nAdapter implements DomainI18nPortInterface {
  private translations: Record<string, string> = {};

  /**
   * Create a new MockDomainI18nAdapter with optional predefined translations
   * @param translations Optional record of key-value translation pairs
   */
  constructor(translations: Record<string, string> = {}) {
    this.translations = {
      // Default translations for testing
      'resume.basics.validation.missingEmail': "L'email est requis",
      'resume.basics.validation.invalidEmail': "Format email invalide",
      'resume.basics.validation.personalEmail': "Email personnel détecté",
      // Allow overriding with custom translations
      ...translations
    };
  }

  /**
   * Translates a key with optional parameters
   * @param key Translation key
   * @param params Optional parameters for interpolation
   * @returns The translated string
   */
  translate(key: string, params?: Record<string, unknown>): string {
    const translation = this.translations[key] || key;
    
    // Simple parameter interpolation
    if (params) {
      return Object.entries(params).reduce((str, [key, value]) => {
        return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  }

  /**
   * Checks if a translation key exists
   * @param key Translation key to check
   * @returns true if the key exists, false otherwise
   */
  exists(key: string): boolean {
    return key in this.translations;
  }
} 