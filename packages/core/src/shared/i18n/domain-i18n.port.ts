/**
 * Port interface for domain-level internationalization.
 * This interface follows Clean Architecture principles by defining
 * the contract that any i18n implementation must fulfill.
 */
export interface DomainI18nPortInterface {
  /**
   * Translates a key with optional parameters
   * @param key - Translation key
   * @param params - Optional parameters for interpolation
   * @returns The translated string
   */
  translate(key: string, params?: Record<string, unknown>): string;

  /**
   * Checks if a translation key exists
   * @param key - Translation key to check
   * @returns true if the key exists, false otherwise
   */
  exists(key: string): boolean;
} 